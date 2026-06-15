---
date: '2026-06-10T20:30:00-03:00'
draft: false
title: 'How to Manage Linux Servers Securely'
summary: 'Most server compromises come from unpatched services, open firewalls, and leaked keys — not from the SSH settings people argue about. A defense-in-depth walkthrough ordered by real impact, with copy-pasteable config for both Debian/Ubuntu and RHEL/Fedora and an honest take on every convenience-versus-security tradeoff.'
categories:
- Security
- Technology
- Software Development
tags:
- linux
- ssh
- sysadmin
---

Linux became the default of the modern web. Of every website whose operating system can be identified, Linux runs [about 61%](https://w3techs.com/technologies/details/os-linux), and the broader Unix family it leads accounts for [over 91%](https://w3techs.com/technologies/details/os-unix) — Windows trails in single digits.

Now look at the most demanding computing on the planet and it isn't even a contest: [all 500](https://www.top500.org/statistics/details/osfam/1/) of the world's fastest supercomputers have run Linux every year since 2017. It's the industry's standard for stability, and the substrate almost everything you touch runs on top of.

Which means every sysadmin, developer, and technology C-level should know how to protect one. A compromised server isn't an abstract risk — it's leaked data, hijacked infrastructure, and a foothold into everything that box can reach. So what actually makes a Linux server secure, and how do you manage one so it doesn't get owned? The short list is in the [TL;DR](#tldr).

The answer is less exciting than the guides make it look. Search "secure your Linux server" and you'll get a hundred articles about SSH settings, half of them obsessing over moving the port to 2222 and disabling something you've never enabled. That's not where servers actually get owned.

Real compromises overwhelmingly come from three places: a service you forgot to patch, a port you left open to the internet, and a key (or password) that leaked. The SSH tweaks matter — we'll do them, carefully — but they sit *below* patching, firewalling, and key hygiene on the list of things that prevent actual incidents. The point of this article is to put the controls in order of real-world impact and be honest, at every step, about what each one buys you and what it costs you in convenience.

There's no silver bullet here. Security is layered on purpose: any single control will eventually fail, and the job is to make sure the next layer is still standing when it does. That's what "defense in depth" means.

The priority order should be:

1. Patching (updates)
1. Firewall
1. Key hygiene
1. Strong passwords
1. SSH hardening
1. fail2ban
1. Port swapping

Spend your effort top-down. A perfectly hardened `sshd_config` on a box running a three-year-old web app with a public database port is still a box that's going to get owned.

## Threat model first

Before changing a single setting, it's worth naming what we're actually defending against. Every control below maps to one of these, and "is this worth doing?" almost always reduces to "which of these does it stop, and is that a threat I face?"

- **Remote brute-forcing.** Automated bots that hammer your public services — overwhelmingly SSH — trying password after password, or username after username. This is constant, dumb, and high-volume. It's also the *easiest* threat to shut down completely.
- **Stolen keys / credentials.** An attacker who already has a valid secret: a copied SSH private key, a leaked password, a token from another breach. No amount of login-rate limiting helps here, because to the server they look exactly like you.
- **Local privilege escalation.** A process on the box is already compromised — say, a vulnerable web app running as `www-data` — and the attacker tries to climb from that low-privilege foothold to `root`. The damage of any breach is bounded by how far an attacker can escalate.
- **Pivot / lateral movement.** Once on one box, the attacker uses it as a stepping stone to reach others — internal hosts, the database, another server that trusts this one. The goal here is to make a single compromised machine a dead end rather than a doorway.

Keep these four in mind. The sections below connect back to one or more of them.

## Patching: the most boring control that matters most

**What it does:** keeps the software on the box up to date so known, already-fixed vulnerabilities don't stay exploitable on your machine.

**What it protects against:** remote exploitation of your *services* — the web server, the database, the mail daemon, the library with a new CVE. This is, in practice, a more common entry point than any SSH misconfiguration. Bots scan the whole internet for vulnerable versions within hours of a disclosure; an unpatched service is a far bigger and more reliable target than a well-configured SSH daemon.

Unattended updates can, rarely, break something or force a restart at an awkward time. For the overwhelming majority of servers, the risk of running vulnerable code for days or weeks is much larger than the risk of a small, reversible hiccup in an update. So automate at least the *security* updates.

On **Debian / Ubuntu**, we configure `unattended-upgrades`:

```bash
sudo apt update
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades   # enables the daily timer
```

By default it applies the security pocket only. Confirm and tune in `/etc/apt/apt.conf.d/50unattended-upgrades`:

```text
Unattended-Upgrade::Allowed-Origins {
        "${distro_id}:${distro_codename}-security";
        "${distro_id}ESMApps:${distro_codename}-apps-security";
        "${distro_id}ESM:${distro_codename}-infra-security";
};

// Reboot automatically if a package requires it — pick a window.
Unattended-Upgrade::Automatic-Reboot "true";
Unattended-Upgrade::Automatic-Reboot-Time "04:00";

// Email a report if something goes wrong.
Unattended-Upgrade::Mail "you@example.com";
Unattended-Upgrade::MailReport "on-change";
```

Dry-run it without waiting for the timer:

```bash
sudo unattended-upgrade --dry-run --debug
```

On **RHEL / Fedora**, we configure `dnf-automatic`:

```bash
sudo dnf install dnf-automatic
```

Edit `/etc/dnf/automatic.conf` to actually *apply* (not just download) and restrict to security:

```ini
[commands]
upgrade_type = security
apply_updates = yes

[emitters]
emit_via = email

[email]
email_to = you@example.com
```

Then enable the timer:

```bash
sudo systemctl enable --now dnf-automatic.timer
```

## Firewall: close everything you're not deliberately serving

**What it does:** enforces a default-deny policy on inbound connections, so the only ports reachable from outside are the ones you explicitly open.

**What it protects against:** everything you didn't mean to expose. A database that bound to `0.0.0.0` instead of `127.0.0.1`, a debug port, a service that came up on boot before you'd configured it, a metrics endpoint. The firewall is the backstop for "I forgot that was listening." It directly shrinks the attack surface.

The model is simple: deny all inbound, allow SSH, allow whatever you're actually serving (say 80/443), leave outbound alone.

On **Debian / Ubuntu**, we can use `ufw`:

```bash
sudo apt install ufw
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp comment 'SSH'
# Add the other services you serve
sudo ufw enable
sudo ufw status verbose
```

On **RHEL / Fedora**, we can use `firewalld`:

```bash
sudo firewall-cmd --permanent --add-service=ssh
# Add the other services you serve
sudo firewall-cmd --reload
sudo firewall-cmd --list-all
```

One thing to be clear about: a firewall and `fail2ban` (later) are *not* the same job. The firewall decides which ports exist to the outside world; `fail2ban` watches the services on those open ports for abuse. One does not replace the other.

## Key hygiene: the key is now the only thing standing between an attacker and your server

Once you turn off password login (next section), an SSH key *is* the credential. There's no second factor by default — whoever holds the private key is you, as far as the server is concerned. That changes how you have to treat the file.

**What it does:** keeps the private key from being usable even if the file itself is copied.

**What it protects against:** stolen keys. A laptop gets stolen, a backup leaks, a dotfiles repo accidentally goes public, malware reads `~/.ssh/`. If the key is unprotected, any of those hands over your server.

So:

**Passphrase-protect every private key.** An encrypted key is useless on its own — the thief also needs the passphrase to decrypt it.

For example, creating a new key:

```bash
ssh-keygen -t ed25519 -C "you@example.com"
# add or change a passphrase on an existing key:
ssh-keygen -p -f ~/.ssh/id_ed25519
```

So the passphrase isn't a nuisance to type every time, set up `ssh-agent`. You unlock the key once per session; the agent holds it decrypted in memory and hands it to connections.

```bash
eval "$(ssh-agent)"
ssh-add ~/.ssh/id_ed25519        # prompts once
ssh-add -t 8h ~/.ssh/id_ed25519  # or expire it from the agent after 8 hours
```

If your server is extremely sensitive and critical, you can use a FIDO2 hardware key. With an `sk-` key type, the private key material lives inside a hardware token (a YubiKey or similar) and *cannot be exported* — not by you, not by malware, not by anyone with read access to your disk. A copied file is worthless without the physical device, and most tokens also require a touch per use, so a remote attacker can't silently authenticate even while you're logged in.

**And keep one key per *device*, not per server.** It's tempting to mint a separate key for every host, but the private key lives on your client — if that's compromised, every key on it leaks at once, so splitting them by destination does little against the threat that actually steals keys. A passphrase or hardware token protects a key far more than spreading it thin. Keep one key per device so a lost laptop means revoking *that* device everywhere, and at scale reach for short-lived SSH certificates (an SSH CA) instead of juggling static keys. The one case where a dedicated per-host key does pay off is **automation** — a deploy key scoped to a single server so a leaked CI secret can't pivot to the rest.

## Strong passwords

Key-only SSH removes the password from one door, but every other secret on the box is still a password — and a weak one undoes the work everywhere else. Your user account's password — the one `sudo` asks for — the passphrase on your encrypted key, the database login, and the credentials of anything you expose all sit on the same logic: there's no point encrypting a key file behind `1234`, and no point religiously patching a service that answers to a database password of `123`. Each of those is a credential an attacker will guess or brute-force long before bothering with anything sophisticated.

So treat every one of them by the same rules — long, unique, and kept in a password manager — that I covered in [Why You Need a Password Manager](/en/blog/security/use-passwd-manager/). It's the base the other layers rest on: the encryption, the patching, and the hardening are only worth as much as the password behind them, and a password that falls in seconds is worth nothing.

## SSH access hardening

Now the part everyone writes about. It's worth doing — just keep it in perspective: this mostly hardens you against **remote brute-forcing** and shrinks the ways a stolen credential can be used. It does little for an already-compromised service or an unpatched daemon, which is why it sits below patching and the firewall.

We'll explain each setting, and at the end there's a complete file to drop in.

### Turn off the things that let attackers guess their way in

```text
PasswordAuthentication no
KbdInteractiveAuthentication no
AuthenticationMethods publickey
```

- **`PasswordAuthentication no`** — refuse password logins entirely. *Protects against remote brute-forcing:* if there's no password to guess, the endless bot traffic guessing passwords simply can't succeed. This is the single highest-value SSH setting.
- **`KbdInteractiveAuthentication no`** — this is the gap people forget. Disabling `PasswordAuthentication` does *not* always close the keyboard-interactive / PAM path, which on some distros can still prompt for a password through a different mechanism. Leaving it open means you think you've disabled passwords but haven't. Turn it off too. (On older configs the directive was called `ChallengeResponseAuthentication`; same idea.)
- **`AuthenticationMethods publickey`** — state positively what *is* allowed, rather than disabling things one at a time and hoping you got them all. This says "public key, and nothing else," which closes the door on any auth path you forgot existed.

### Don't let anyone log in straight to root

```text
PermitRootLogin no
```

**`PermitRootLogin no`** forces everyone to log in as a normal user and then escalate with `sudo`. *Protects against remote brute-forcing and improves auditing:* `root` is the one username every bot already knows to try, so removing it as a login target kills a whole class of attempts. It also means every privileged action is tied to a specific human's account rather than an anonymous shared `root` session.

If you need automated root for a tool, `prohibit-password` allows key-only root and blocks password root — but a named user with scoped `sudo` is almost always better. Another option is to use `visudo` to allow a specific command to be run without a password (`NOPASSWD`) by a given user.

### Restrict *who* can log in at all

```text
AllowUsers deploy admin
# or, by group:
AllowGroups sshusers
```

**`AllowUsers` / `AllowGroups`** is a whitelist: only the listed users (or members of the listed groups) may authenticate over SSH at all, regardless of whether they have a valid key. *Protects against stolen keys and brute-forcing:* a service account or a stray system user with a weak setup can't be used as an SSH entry point if it's not on the list.

### Slow down and bound each connection attempt

```text
MaxAuthTries 3
LoginGraceTime 20
MaxStartups 10:30:60
```

- **`MaxAuthTries 3`** — drop the connection after 3 failed auth attempts. *Protects against brute-forcing:* it caps how many guesses an attacker gets per connection, forcing them to reconnect constantly (which is noisy and slow).
- **`LoginGraceTime 20`** — if authentication isn't completed within 20 seconds, disconnect. *Protects against brute-forcing and resource exhaustion:* half-open auth sessions can't pile up and tie the daemon down.
- **`MaxStartups 10:30:60`** — limit unauthenticated connections in flight: start randomly dropping at 10 concurrent (with a 30% chance), and hard-cap at 60. *Protects against brute-forcing and connection floods:* a bot opening hundreds of parallel sessions gets throttled instead of monopolizing the daemon.

### Disconnect idle sessions

```text
ClientAliveInterval 300
ClientAliveCountMax 2
```

Together these drop a session that's gone unresponsive for ~10 minutes (300s × 2). **What it protects against:** an abandoned, still-authenticated terminal — an unlocked laptop, a closed-but-not-logged-out SSH session — left sitting open for someone else to walk up to or hijack.

### Forwarding: turn off what you don't use

```text
AllowAgentForwarding no
AllowTcpForwarding no
X11Forwarding no
```

These are off-by-default-worthy because each is a way to use your server as a *conduit*, which matters most on a box that could become a pivot.

- **`X11Forwarding no`** — you almost certainly aren't running graphical apps over SSH on a server. It's attack surface for no benefit; off.
- **`AllowTcpForwarding no`** — port forwarding/tunneling. Handy for admins, but it also lets a compromised account tunnel into your internal network through the server. Turn it off unless you specifically rely on it.
- **`AllowAgentForwarding no`** — this is the dangerous one, and worth understanding. Agent forwarding lets your local `ssh-agent` be used by the *remote* server to authenticate onward to a third host. The convenience: you can hop from your laptop, through a bastion, to an internal host without copying keys around. The danger: while you're connected, anyone with root on that middle box can talk to your forwarded agent socket and authenticate *as you* to anything your key opens. On a server that could itself be compromised — exactly the "pivot" threat — agent forwarding hands an attacker your keys for the duration of your session.

  The safer way to get the same hop, if you need it, is **`ProxyJump`**, which tunnels your connection *through* the intermediate host without ever exposing your agent to it. The middle box only ever sees encrypted traffic it can't use:

  ```bash
  ssh -J bastion.example.com internal-host
  ```

  Or persist it in `~/.ssh/config`:

  ```text
  Host internal-host
      ProxyJump bastion.example.com
  ```

  Prefer `ProxyJump` and leave agent forwarding off.

### Add a second factor (TOTP)

Key-only auth is already "something you have" — and a FIDO2 token (above) is hardware 2FA done right. A TOTP code (Google Authenticator via PAM) earns its place mainly where hardware keys aren't an option, and it comes with a tradeoff worth stating plainly: it means *reopening* the keyboard-interactive path you closed earlier. The trick is to require the key **and** the code, not one or the other:

```bash
# Debian/Ubuntu: sudo apt install libpam-google-authenticator
# RHEL/Fedora:   sudo dnf install google-authenticator
google-authenticator          # run per user to generate the seed/QR
```

```text
# /etc/pam.d/sshd — add:
auth required pam_google_authenticator.so
```

```text
# in your sshd drop-in:
KbdInteractiveAuthentication yes
AuthenticationMethods publickey,keyboard-interactive:pam
```

`AuthenticationMethods publickey,keyboard-interactive:pam` makes SSH demand a valid key *and then* the TOTP code — a stolen key alone still can't log in. **What it protects against:** stolen keys. Be honest about scope, though: a second factor — whether a FIDO2 `sk-` key or TOTP — is something you reach for on a high-security server, not a default for every box. Of the two, the hardware `sk-` key is the cleaner factor; TOTP is the fallback for when you can't hand out hardware.

### The consolidated drop-in

Modern `sshd` reads `/etc/ssh/sshd_config.d/*.conf`, so you don't have to edit the main file — drop your overrides in their own file, which survives package upgrades cleanly. Create `/etc/ssh/sshd_config.d/99-hardening.conf`:

```text
# --- Authentication ---
PasswordAuthentication no
KbdInteractiveAuthentication no
AuthenticationMethods publickey
PermitRootLogin no
PubkeyAuthentication yes

# --- Who may log in ---
AllowGroups sshusers

# --- Brute-force bounds ---
MaxAuthTries 3
LoginGraceTime 20
MaxStartups 10:30:60

# --- Idle session timeout (~10 min) ---
ClientAliveInterval 300
ClientAliveCountMax 2

# --- Forwarding (conduit surface) ---
AllowAgentForwarding no
AllowTcpForwarding no
X11Forwarding no
```

> ⚠️ **Test before you trust it.** A bad SSH config can lock you out of a remote box permanently. Two habits make that essentially impossible:
>
> 1. Validate the syntax *before* reloading:
>    ```bash
>    sudo sshd -t
>    ```
>    No output means it parsed cleanly. It will refuse to start on a typo, so catch it here, not after the reload.
> 2. **Keep your current SSH session open** while you test. Reload the service, then open a *second* session from another terminal:
>    ```bash
>    sudo systemctl reload ssh    # Debian/Ubuntu (the unit is 'sshd' on RHEL/Fedora)
>    ```
>    If the new session works, you're safe to close the first. If it doesn't, you still have the original session to fix it. Never reload-and-disconnect in one move.

## Privilege escalation and sudo

This is where you defend against the **local privilege escalation** threat: a process already running on the box (often something exposed, like a web app) trying to become `root`. The shape of your `sudo` config decides how short that climb is — and how well you can reconstruct what happened afterward.

There's a genuine convenience-versus-security spectrum here, and it's worth being honest about each point on it:

- **A root shell (`sudo -i`, `sudo su`)** — maximum convenience, worst auditing. Once you're in a root shell, every command you run is logged as `root`, not as "this person ran *this specific command*." The audit trail collapses into "someone became root at 14:02." Avoid making this the default way you work.
- **`sudo` with a password each time** — most secure, least convenient. Every privileged command is individually logged *and* gated behind re-authentication, so a process that compromised your account still can't escalate without your password. The friction is real: you'll retype your password a lot.
- **Passwordless `sudo` (`NOPASSWD`)** — convenient, and fine *if scoped*. The risk isn't `NOPASSWD` itself; it's `NOPASSWD: ALL`, which means anything that can run as your user can become root with no further check. That's a direct line from a compromised process to root.

The sweet spot for most people is **scoped `NOPASSWD` for the specific commands you run constantly, with a password required for everything else** — or a tuned credential cache (below) if you'd rather keep a password on everything without retyping it every minute.

### Always edit with `visudo`, always use a drop-in

Never edit `/etc/sudoers` directly. `visudo` syntax-checks before saving, so a typo can't lock you out of `sudo` entirely. And put your rules in a drop-in under `/etc/sudoers.d/` rather than the main file:

```bash
sudo visudo -f /etc/sudoers.d/deploy
```

Those files **must be mode `0440`** (root-readable, no write, no group/other access) or `sudo` refuses to load them:

```bash
sudo chmod 0440 /etc/sudoers.d/deploy
```

### Scope NOPASSWD to full paths — and beware shell escapes

A scoped rule looks like this:

```text
# /etc/sudoers.d/deploy
deploy ALL=(root) NOPASSWD: /usr/bin/systemctl restart myapp, /usr/bin/journalctl -u myapp *
```

Two rules for writing these safely:

1. **Always use full paths.** `NOPASSWD: systemctl` (no path) can be satisfied by *any* `systemctl` earlier on `$PATH`, including one the attacker dropped. `/usr/bin/systemctl` can't.
2. **Watch for commands that can spawn a shell.** This is the subtle trap. Granting `NOPASSWD` on an editor, a pager, or anything with a shell-escape effectively grants `NOPASSWD: ALL`, because the user can break out to a root shell from inside it:
   - `sudo vim` → `:!sh` → root shell.
   - `sudo less file` → `!sh` → root shell.
   - `sudo find . -exec sh \;` → root shell.
   - `sudo awk 'BEGIN{system("sh")}'`, `sudo tar` with `--checkpoint-action`, and many more.

   The project [GTFOBins](https://gtfobins.github.io/) catalogs these. Before you `NOPASSWD` any command, check whether it can be coerced into running arbitrary code.

### Tuning the credential cache: keep the password, lose the retyping

If you want a password on `sudo` (good for the escalation threat) without typing it every single command, tune the timestamp cache instead of reaching for a root shell:

```text
# /etc/sudoers.d/timeout
Defaults timestamp_type=global
Defaults timestamp_timeout=15
```

- **`timestamp_timeout=15`** — after a successful `sudo`, don't ask again for 15 minutes. (Set to `0` to *always* ask, or `-1` to never expire — don't do that.)
- **`timestamp_type=global`** — share that cached authentication across all your terminals/sessions instead of per-tty, so authenticating in one shell doesn't make you re-authenticate in the next.

Here's why this beats reaching for `sudo -i`: **every command is still run through `sudo` individually, so every command is still logged individually.** You get the convenience of not retyping the password constantly and keep the per-command audit trail. A root shell (`sudo -i`, `sudo su`) gives you the first but throws away the second — once you're inside it, your commands run *as the shell*, not through `sudo`, so the log just shows "became root at 14:02" and nothing after.

## Confine the services themselves: MAC and containers

`sudo` hygiene limits how *you* escalate, but the threat model's nastier case is a service escalating — a compromised `www-data` or database process trying to reach the rest of the box. That's what Mandatory Access Control (MAC) is for: it boxes each service into a profile that says exactly which files, ports, and capabilities it may touch, so a process that gets popped can't wander outside its lane even when it's running code the attacker chose.

**What it does:** constrains each confined process to a policy, independent of normal Unix user permissions.

**What it protects against:** local privilege escalation and blast radius — a compromised service is held to what its profile allows, not to everything its UID could otherwise reach.

**RHEL / Fedora** ship **SELinux** enforcing by default. The single most important rule: don't reach for `setenforce 0` the moment something breaks. Check what was denied and fix the policy instead:

```bash
sestatus                          # confirm it's 'enforcing'
sudo ausearch -m avc -ts recent   # what got denied, and why
sudo setsebool -P <bool> on       # flip the documented boolean the service needs
```

**Debian / Ubuntu** ship **AppArmor**, which confines per-program profiles:

```bash
sudo aa-status                    # which profiles are loaded and enforcing
sudo aa-complain /path/to/bin     # log-only, to debug a profile without blocking
sudo aa-enforce /path/to/bin      # back to enforcing once the profile is right
```

Leave it on. The temptation under pressure is to disable MAC to make an error go away — but that trades the one control that contains a breached service for a few minutes saved. Tune the policy, don't turn it off.

### Containers as another confinement layer

Running a service in a container is another way to box it in: the process gets its own filesystem, its own network namespace, and a restricted view of the host, so a compromise is contained to the container rather than the whole machine. Docker even builds on the MAC you just set up — it ships a default seccomp profile and applies the host's AppArmor/SELinux policy to each container.

Be honest about the boundary, though: a container shares the host kernel, so it's **blast-radius reduction, not a hard security sandbox**. `root` inside a default container is `root` on the host if it ever escapes, and a kernel bug is a way out. Narrow that gap by not running as root and dropping what the service doesn't need:

```bash
docker run --user 1000:1000 \
  --cap-drop ALL \
  --security-opt no-new-privileges \
  --read-only \
  myimage
```

For a stronger boundary, run rootless Docker or Podman (which maps container root to an unprivileged host user), or a VM-isolated runtime like Kata or gVisor. A plain container alongside MAC is a solid default — just don't mistake it for a VM.

## Intrusion mitigation and monitoring

You've shrunk the attack surface and locked the doors. This layer is about noticing and slowing down what still gets thrown at you.

### fail2ban

**What it does:** watches service logs for repeated failures (failed SSH auth, etc.) and temporarily firewall-bans the offending IP.

**What it protects against:** sustained remote brute-forcing. With key-only SSH already in place, brute-forcing *can't succeed* anyway. It only reduces log noise and rate-limits, banning the bots so your logs stay readable and your daemon isn't constantly busy. It's a useful complement, not a replacement for any of the above. (It earns its keep more on services that *do* accept passwords — a web login, a mail server.)

```bash
# Debian/Ubuntu
sudo apt install fail2ban
# RHEL/Fedora
sudo dnf install fail2ban
```

Configure in `/etc/fail2ban/jail.local` (never edit `jail.conf` — it's overwritten on upgrade):

```ini
[DEFAULT]
bantime  = 1h
findtime = 10m
maxretry = 5
# ban at the firewall level
banaction = nftables-multiport

[sshd]
enabled = true
```

```bash
sudo systemctl enable --now fail2ban
sudo fail2ban-client status sshd
```

On RHEL/Fedora, where `sshd` logs to the systemd journal rather than a flat file, add `backend = systemd` to the `[sshd]` jail so fail2ban reads the right source.

### Ship your logs off the box

This one is more important than it looks. **What it protects against:** an attacker who *does* get root and then erases their tracks. Local logs are worthless against a root-level intruder, because the first thing a competent attacker does is clear `/var/log`. If the logs only exist on the box, your record of the break-in disappears with it.

So forward logs to somewhere the compromised machine can't reach back into and edit: a central log host, or a managed service. Even a basic `rsyslog` forward to another server you control means the evidence survives the box:

```text
# /etc/rsyslog.d/90-forward.conf — send everything to a central collector over TCP
*.*    @@logserver.example.com:514
```

```bash
sudo systemctl restart rsyslog
```

That example ships in plaintext over TCP; for anything sensitive, forward it over TLS (rsyslog's RELP-over-TLS, or `omfwd` with the GTLS driver) so the logs can't be read or tampered with in transit.

The box that might be compromised should not be the only place its own security records live. It's how you find out what happened.

### Audit what happens on the box (auditd)

The `sudo` log tells you which privileged commands ran *through sudo* — but not what happened inside a root shell, or file tampering that never touched sudo. `auditd` is the kernel-level audit framework that fills that gap: it logs syscalls, file access, and process execution by rule.

```text
# /etc/audit/rules.d/hardening.rules
-w /etc/passwd -p wa -k identity                # writes/attr-changes to the user database
-a always,exit -F arch=b64 -S execve -k exec    # every program execution
```

```bash
sudo augenrules --load     # compile and load the rules
sudo ausearch -k identity  # query what matched a tag
sudo aureport --auth       # summarize auth events
```

**What it protects against:** detection and forensics — it's how you reconstruct what an intruder did, even one who dropped to a root shell. Pair it with the off-box forwarding above so the record survives the machine.

One prerequisite for any of this to be usable after the fact: **keep the clock synced.** Correlating events across the box, the firewall, and your central log host only works if their timestamps agree. `chronyd` ships and runs by default on modern Debian/Ubuntu and RHEL/Fedora — just confirm it's actually tracking:

```bash
chronyc tracking
```

### A note on non-standard ports

Moving SSH off port 22 comes up in every hardening guide, so let's be honest about it: **it is not a security control.** An attacker who scans your host (which takes seconds) finds SSH on whatever port it's on. What moving the port *does* do is cut the volume of dumb, drive-by bot traffic that only ever pokes at port 22 — which means quieter logs and slightly less daemon noise. That's a real, if minor, benefit. Just file it under "log hygiene," not "security," and never let it substitute for key-only auth.

## Backups: the control you only value once

Every layer above is about keeping attackers out. Backups are what you have left when something gets through anyway. Ransomware, a destructive intruder, or even a careless command.

**What it does:** keeps a recoverable copy of your data somewhere separate from the live system.

**What it protects against:** total loss — from compromise, hardware failure, or human error. It's the last layer of defense in depth, and the only one that helps *after* prevention has failed.

A few principles that matter more than the specific tool:

- **Keep at least one copy off the box and offline-ish.** A backup on the same server an attacker just rooted is a backup the attacker can also delete. Push backups to storage the server can write to but not freely overwrite — ideally append-only or with immutability/versioning enabled.
- **The 3-2-1 rule** is the classic baseline: three copies, on two different media, one off-site.
- **Encrypt backups at rest.** They contain everything; treat the backup like the crown jewels it is.

And the part everyone skips:

> **A backup you have never restored is not a backup — it's a hope.**

Test the *restore*, not just the backup job. Untested backups fail in all the ways you find out about only during a real incident: a missing file, a wrong path, an encryption key nobody saved, a corrupt archive, a tool version that no longer reads the format. Put a restore drill on the calendar — actually pull a backup and bring it back on a scratch host — and you turn "I think we have backups" into "I know we can recover."

## Putting it in order

Start at the top. Automate security patches and close every port you're not deliberately serving — that's most of your real-world risk handled, and it's the part the SSH-focused guides tend to rush past. Then make your keys un-stealable (passphrase, agent, ideally a hardware token), tighten `sshd` carefully (with a second session open), scope your `sudo` so a compromised process can't trivially become root, and let `fail2ban` mop up the noise. Back it all with tested, off-box backups for the day prevention isn't enough.

No single one of these makes you secure. Skipping the boring top of the list to perfect the interesting bottom of it is exactly the mistake this article exists to talk you out of. Layer them, in order, and a failure in any one of them is just a failure — not a breach.

## TL;DR

For every Linux server, in order of real-world impact:

- **Automate security updates** — unpatched services are the most common way in.
- **Firewall everything shut** except the ports you deliberately serve.
- **Protect your keys** (passphrase + `ssh-agent`) and use **long, unique passwords** for every other secret — keep them in a password manager.
- **Harden SSH**: disable root login and disable password login (key-only).
- **Add `fail2ban`** to quiet the brute-force noise.

For highly critical servers, add a **second factor — a FIDO2 hardware key (best) or TOTP** — and keep **tested, off-box backups** for the day prevention fails.
