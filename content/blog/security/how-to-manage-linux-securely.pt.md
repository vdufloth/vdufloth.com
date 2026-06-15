---
date: '2026-06-10T20:30:00-03:00'
draft: false
title: 'Como Gerenciar Servidores Linux com Segurança'
summary: 'A maioria das invasões de servidor vem de serviços desatualizados, firewalls abertos e chaves vazadas — não dos ajustes de SSH sobre os quais todo mundo discute. Um passo a passo de Defense in Depth ordenado pelo impacto real, com configuração pronta para copiar e colar no Debian/Ubuntu e no RHEL/Fedora e uma visão honesta de cada tradeoff entre conveniência e segurança.'
categories:
- Segurança
- Tecnologia
- Desenvolvimento de Software
tags:
- linux
- ssh
- sysadmin
---

O Linux se tornou o padrão da web moderna: roda em [cerca de 61%](https://w3techs.com/technologies/details/os-linux) de todos os sites cujo sistema operacional é identificável. Considerando a família Unix mais ampla, que o Linux lidera, ela responde por [mais de 91%](https://w3techs.com/technologies/details/os-unix). O Windows fica na casa de um dígito.

Agora, se analisarmos os supercomputadores mais rápidos do mundo, não há nem disputa: [todos os 500](https://www.top500.org/statistics/details/osfam/1/) rodam Linux todos os anos desde 2017. É o padrão de estabilidade da indústria, e a base sobre a qual quase tudo que você usa roda.

O que significa que todo sysadmin, desenvolvedor e C-level de tecnologia deveria saber como proteger um. Um servidor comprometido não é um risco abstrato — são dados vazados, infraestrutura sequestrada e um ponto de apoio para tudo que aquela máquina alcança. Então: o que de fato torna um servidor Linux seguro, e como gerenciá-lo para que não seja invadido? A lista resumida está no [TL;DR](#tldr).

A resposta é menos empolgante do que os guias fazem parecer. Pesquise "proteja seu servidor Linux" e você vai encontrar uma centena de artigos sobre configurações de SSH, metade deles obcecada em mover a porta para 2222 e desabilitar alguma coisa que você nunca habilitou. Não é por aí que servidores são realmente invadidos.

As invasões reais vêm, na esmagadora maioria, de três lugares: um serviço que você esqueceu de atualizar, uma porta que você deixou aberta para a internet, e uma chave (ou senha) que vazou. Os ajustes de SSH importam — vamos fazê-los, com cuidado —, mas ficam *abaixo* de patching, firewall e higiene de chaves na lista de coisas que de fato previnem incidentes. O objetivo deste artigo é colocar os controles em ordem de impacto no mundo real e ser honesto, em cada passo, sobre o que cada um te dá e o que te custa em conveniência.

Não existe bala de prata aqui. A segurança é feita em camadas de propósito: qualquer controle isolado uma hora vai falhar, e o trabalho é garantir que a próxima camada continue de pé quando isso acontecer. É isso que se chama *Defense in Depth*.

A ordem de prioridade deve ser:

1. Patching (Atualizar)
1. Firewall 
1. Higiene de chaves
1. Senhas fortes
1. Hardening de SSH
1. fail2ban
1. Troca de portas

Gaste seu esforço de cima para baixo. Um `sshd_config` perfeitamente fortalecido num servidor rodando uma aplicação web de três anos atrás com uma porta de banco de dados pública continua sendo um servidor que vai ser invadido.

## Comece pelo modelo de ameaças

Antes de mudar uma única configuração, vale nomear contra o que estamos de fato nos defendendo. Cada controle abaixo se conecta a um destes, e "isso vale a pena?" quase sempre se reduz a "qual destes ele barra, e essa é uma ameaça que eu enfrento?".

- **Força bruta remota.** Bots automatizados que martelam seus serviços públicos — quase sempre o SSH — testando senha após senha, ou usuário após usuário. É constante, burro e em alto volume. Também é a ameaça *mais fácil* de eliminar por completo.
- **Chaves / credenciais roubadas.** Um atacante que já tem um segredo válido: uma chave privada SSH copiada, uma senha vazada, um token de outro vazamento. Nenhum limite de tentativas de login ajuda aqui, porque, para o servidor, ele é idêntico a você.
- **Escalação local de privilégios.** Um processo no servidor já está comprometido — digamos, uma aplicação web vulnerável rodando como `www-data` — e o atacante tenta subir desse ponto de apoio de baixo privilégio até o `root`. O dano de qualquer invasão é limitado por até onde o atacante consegue escalar.
- **Pivô / movimento lateral.** Uma vez dentro de um servidor, o atacante o usa como trampolim para alcançar outros — hosts internos, o banco de dados, outro servidor que confia neste. O objetivo aqui é fazer de uma máquina comprometida um beco sem saída, e não uma porta de entrada.

Tenha esses quatro em mente. As seções abaixo se conectam de volta a uma ou mais dessas ameaças.

## Patching: o controle mais chato que mais importa

**O que faz:** mantém o software do servidor atualizado para que vulnerabilidades conhecidas e já corrigidas não continuem exploráveis na sua máquina.

**Contra o que protege:** exploração remota dos seus *serviços* — o servidor web, o banco de dados, o daemon de e-mail, a biblioteca que teve um CVE novo. Esta é, na prática, uma porta de entrada mais comum do que qualquer má configuração de SSH. Bots escaneiam a internet inteira atrás de versões vulneráveis em poucas horas após uma divulgação; um serviço desatualizado é um alvo muito maior e mais confiável do que um daemon SSH bem configurado.

Atualizações automáticas podem, raramente, quebrar algo ou forçar um reinício numa hora ruim. Para a esmagadora maioria dos servidores, o risco de rodar código vulnerável por dias ou semanas é muito maior que o risco de um travamento pequeno e reversível numa atualização. Então automatize ao menos as atualizações de *segurança*.

No ecossistema **Debian / Ubuntu** configuramos o `unattended-upgrades`:

```bash
sudo apt update
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades   # habilita o timer diário
```

Por padrão ele aplica apenas o pocket de segurança. Confirme e ajuste em `/etc/apt/apt.conf.d/50unattended-upgrades`:

```text
Unattended-Upgrade::Allowed-Origins {
        "${distro_id}:${distro_codename}-security";
        "${distro_id}ESMApps:${distro_codename}-apps-security";
        "${distro_id}ESM:${distro_codename}-infra-security";
};

// Reinicia automaticamente se um pacote exigir — escolha uma janela.
Unattended-Upgrade::Automatic-Reboot "true";
Unattended-Upgrade::Automatic-Reboot-Time "04:00";

// Envia um relatório por e-mail se algo der errado.
Unattended-Upgrade::Mail "voce@exemplo.com";
Unattended-Upgrade::MailReport "on-change";
```

Faça um dry-run sem esperar o timer:

```bash
sudo unattended-upgrade --dry-run --debug
```

No ecossistema **RHEL / Fedora** configuramos o `dnf-automatic`:

```bash
sudo dnf install dnf-automatic
```

Edite `/etc/dnf/automatic.conf` para de fato *aplicar* (não só baixar) e restringir à segurança:

```ini
[commands]
upgrade_type = security
apply_updates = yes

[emitters]
emit_via = email

[email]
email_to = voce@exemplo.com
```

Em seguida, habilite o timer:

```bash
sudo systemctl enable --now dnf-automatic.timer
```

## Firewall: feche tudo que você não está servindo de propósito

**O que faz:** impõe uma política de negar-por-padrão nas conexões de entrada, de modo que as únicas portas acessíveis de fora sejam as que você abriu explicitamente.

**Contra o que protege:** tudo que você não pretendia expor. Um banco de dados que subiu em `0.0.0.0` em vez de `127.0.0.1`, uma porta de debug, um serviço que subiu no boot antes de você ter configurado, um endpoint de métricas. O firewall é a rede de proteção para o "eu esqueci que aquilo estava escutando". Ele reduz diretamente a superfície de ataque.

O modelo é simples: negar toda entrada, liberar o SSH, liberar o que você de fato serve (digamos 80/443), deixar a saída em paz.

No ecossistema **Debian / Ubuntu** podemos usar o `ufw`:

```bash
sudo apt install ufw
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp comment 'SSH'
# Adicione os demais serviços
sudo ufw enable
sudo ufw status verbose
```

No ecossistema **RHEL / Fedora** podemos usar o `firewalld`:

```bash
sudo firewall-cmd --permanent --add-service=ssh
# Adicione os demais serviços
sudo firewall-cmd --reload
sudo firewall-cmd --list-all
```

Uma coisa precisa ficar clara: um firewall e o `fail2ban` (mais adiante) *não* fazem o mesmo trabalho. O firewall decide quais portas existem para o mundo externo; o `fail2ban` observa os serviços nessas portas abertas em busca de abuso. Um não substitui o outro.

## Higiene de chaves: a chave agora é a única coisa entre um atacante e o seu servidor

Quando você desliga o login por senha (próxima seção), uma chave SSH *é* a credencial. Por padrão não existe segundo fator — quem tem a chave privada é você, do ponto de vista do servidor. Isso muda como você tem que tratar o arquivo.

**O que faz:** impede que a chave privada seja utilizável mesmo que o arquivo em si seja copiado.

**Contra o que protege:** chaves roubadas. Um notebook é roubado, um backup vaza, um repositório de dotfiles vai a público por acidente, um malware lê o `~/.ssh/`. Se a chave estiver desprotegida, qualquer um desses entrega seu servidor.

Então:

**Proteja toda chave privada com senha.** Uma chave criptografada é inútil sozinha — o ladrão também precisa da senha para descriptografá-la.

Exemplo criando uma chave nova:

```bash
ssh-keygen -t ed25519 -C "voce@exemplo.com"
# adicionar ou trocar a senha de uma chave existente:
ssh-keygen -p -f ~/.ssh/id_ed25519
```

Para que a passphrase não vire um inconveniente de digitar toda vez, configure o `ssh-agent`. Você desbloqueia a chave uma vez por sessão; o agente a mantém descriptografada em memória e a entrega às conexões.

```bash
eval "$(ssh-agent)"
ssh-add ~/.ssh/id_ed25519        # pede a passphrase uma vez
ssh-add -t 8h ~/.ssh/id_ed25519  # ou expira do agente depois de 8 horas
```

Caso seu servidor seja extremamente sensível e crítico, pode-se usar uma chave de hardware FIDO2. Com um tipo de chave `sk-`, o material da chave privada mora dentro de um token de hardware (um YubiKey ou similar) e *não pode ser exportado* — nem por você, nem por um malware, nem por ninguém com acesso de leitura ao seu disco. Um arquivo copiado não vale nada sem o dispositivo físico, e a maioria dos tokens ainda exige um toque a cada uso, então um atacante remoto não consegue se autenticar silenciosamente nem mesmo enquanto você está logado.

**E mantenha uma chave por *dispositivo*, não por servidor.** É tentador gerar uma chave separada para cada host, mas a chave privada mora no seu cliente — se ele for comprometido, todas as chaves nele vazam de uma vez, então dividi-las por destino faz pouco contra a ameaça que de fato rouba chaves. Uma passphrase ou um token de hardware protege uma chave muito mais do que espalhá-la. Mantenha uma chave por dispositivo, para que um notebook perdido signifique revogar *aquele* dispositivo em todo lugar, e em escala use certificados SSH de curta duração (uma CA de SSH) em vez de fazer malabarismo com chaves estáticas. O único caso em que uma chave dedicada por host compensa é a **automação** — uma deploy key escopada a um único servidor para que um segredo de CI vazado não consiga pivotar para o resto.

## Senhas fortes

O SSH só por chave tira a senha de uma porta, mas todo outro segredo no servidor ainda é uma senha — e uma fraca desfaz o trabalho em todo o resto. A senha do seu usuário — a que o `sudo` pede —, a passphrase da sua chave criptografada, o login do banco de dados e as credenciais de qualquer coisa que você expõe seguem a mesma lógica: não adianta criptografar um arquivo de chave atrás de `1234`, nem atualizar religiosamente um serviço que responde a uma senha de banco `123`. Cada uma dessas é uma credencial que um atacante vai adivinhar ou quebrar por força bruta muito antes de partir para algo sofisticado.

Então trate todas elas pelas mesmas regras — longas, únicas e guardadas num gerenciador — que abordei em [Por Que Você Precisa de um Gerenciador de Senhas](/pt/blog/security/use-passwd-manager/). É a base sobre a qual as outras camadas se apoiam: a criptografia, o patching e o hardening só valem o que vale a senha por trás deles, e uma senha que cai em segundos não vale nada.

## Hardening de acesso SSH

Agora a parte sobre a qual todo mundo escreve. Vamos fazer, mas mantenha a perspectiva: isto fortalece você principalmente contra **força bruta remota** e reduz as formas de usar uma credencial roubada. Faz pouco por um serviço já comprometido ou desatualizado, e é por isso que fica abaixo de patching e firewall.

Explicaremos cada configuração e, no final, há um arquivo completo para usar.

### Desligue o que deixa atacantes adivinharem a senha

```text
PasswordAuthentication no
KbdInteractiveAuthentication no
AuthenticationMethods publickey
```

- **`PasswordAuthentication no`**: Recusa logins por senha por completo, protegendo contra força bruta remota. Se não há senha para adivinhar, o tráfego infinito de bots tentando senhas simplesmente não tem como ter sucesso. É a configuração de SSH de maior valor.
- **`KbdInteractiveAuthentication no`**: Desabilitar o `PasswordAuthentication` *nem sempre* fecha o caminho keyboard-interactive / PAM, que em algumas distros ainda pode pedir uma senha por um mecanismo diferente. Deixá-lo aberto significa achar que você desabilitou senhas quando não desabilitou. Desligue também. (Em configs mais antigas a diretiva se chamava `ChallengeResponseAuthentication`; mesma ideia.)
- **`AuthenticationMethods publickey`** — diga positivamente o que *é* permitido, em vez de desabilitar coisas uma a uma. Isto diz "chave pública, e nada mais", o que fecha a porta de qualquer caminho de autenticação que você tenha esquecido que existia.

### Não deixe ninguém logar direto como root

```text
PermitRootLogin no
```

**`PermitRootLogin no`** obriga todo mundo a logar como um usuário comum e então escalar com `sudo`. *Protege contra força bruta remota e melhora a auditoria:* `root` é o único usuário que todo bot já sabe que deve tentar, então removê-lo como alvo de login mata uma classe inteira de tentativas. Também faz com que toda ação privilegiada esteja atrelada à conta de um humano específico, em vez de uma sessão `root` compartilhada e anônima.

Se você precisa de root automatizado para alguma ferramenta, `prohibit-password` permite root só por chave e bloqueia root por senha — mas um usuário nomeado com `sudo` escopado quase sempre é melhor. Outra opção é habilitar com `visudo` o comando específico a ser rodado sem senha (`NOPASSWD`) por um usuário.

### Restrinja *quem* pode logar

```text
AllowUsers deploy admin
# ou, por grupo:
AllowGroups sshusers
```

**`AllowUsers` / `AllowGroups`** é uma lista de permissão: só os usuários listados (ou membros dos grupos listados) podem se autenticar via SSH, independentemente de terem uma chave válida. *Protege contra chaves roubadas e força bruta:* uma conta de serviço ou um usuário de sistema perdido, com configuração frágil, não pode virar ponto de entrada de SSH se não estiver na lista.

### Reduza o ritmo e limite cada tentativa de conexão

```text
MaxAuthTries 3
LoginGraceTime 20
MaxStartups 10:30:60
```

- **`MaxAuthTries 3`** — derruba a conexão após 3 tentativas de autenticação falhas. *Protege contra força bruta:* limita quantos palpites o atacante tem por conexão, forçando-o a reconectar o tempo todo (o que é barulhento e lento).
- **`LoginGraceTime 20`** — se a autenticação não for concluída em 20 segundos, desconecta. *Protege contra força bruta e exaustão de recursos:* sessões de autenticação semiabertas não podem se acumular e travar o daemon.
- **`MaxStartups 10:30:60`** — limita as conexões não autenticadas em andamento: começa a descartar aleatoriamente em 10 simultâneas (com 30% de chance), e impõe um teto rígido em 60. *Protege contra força bruta e enxurradas de conexões:* um bot abrindo centenas de sessões paralelas é estrangulado em vez de monopolizar o daemon.

### Desconecte sessões ociosas

```text
ClientAliveInterval 300
ClientAliveCountMax 2
```

Juntas, elas derrubam uma sessão que ficou sem resposta por ~10 minutos (300s × 2). **Contra o que protege:** um terminal abandonado e ainda autenticado — um notebook destravado, uma sessão SSH fechada-mas-não-deslogada — deixado aberto para alguém se aproximar ou sequestrar.

### Forwarding: desligue o que você não usa

```text
AllowAgentForwarding no
AllowTcpForwarding no
X11Forwarding no
```

Estes merecem ficar desligados por padrão porque cada um é uma forma de usar seu servidor como *conduíte*, o que pesa mais num servidor que pode virar um pivô.

- **`X11Forwarding no`** — você quase certamente não está rodando apps gráficos por SSH num servidor. É superfície de ataque sem benefício. Desligue.
- **`AllowTcpForwarding no`** — encaminhamento de portas / tunelamento. Útil para administradores, mas também permite que uma conta comprometida tunele para dentro da sua rede interna através do servidor. Desligue, a menos que você dependa especificamente disso.
- **`AllowAgentForwarding no`** — esse é o perigoso, e vale entender. O agent forwarding deixa o seu `ssh-agent` local ser usado pelo servidor *remoto* para se autenticar adiante num terceiro host. A conveniência: você pula do seu notebook, por um bastion, até um host interno sem ficar copiando chaves. O perigo: enquanto você está conectado, qualquer um com root naquele servidor do meio pode falar com o socket do seu agente encaminhado e se autenticar *como você* em qualquer coisa que sua chave abra. Num servidor que ele mesmo pode estar comprometido — exatamente a ameaça do "pivô" — o agent forwarding entrega ao atacante as suas chaves pelo tempo que durar a sua sessão.

  A forma mais segura de fazer o mesmo pulo caso precise é o **`ProxyJump`**, que tunela a sua conexão *através* do host intermediário sem nunca expor o seu agente a ele. O servidor do meio só vê tráfego criptografado que ele não consegue usar:

  ```bash
  ssh -J bastion.exemplo.com host-interno
  ```

  Ou persista no `~/.ssh/config`:

  ```text
  Host host-interno
      ProxyJump bastion.exemplo.com
  ```

  Prefira o `ProxyJump` e deixe o agent forwarding desligado.

### Adicione um segundo fator (TOTP)

A autenticação só por chave já é "algo que você tem" — e um token FIDO2 (acima) é 2FA de hardware bem-feito. Um código TOTP (Google Authenticator via PAM) ganha espaço principalmente onde não dá para usar chaves de hardware, e vem com um tradeoff que vale dizer com todas as letras: ele significa *reabrir* o caminho keyboard-interactive que você fechou antes. O truque é exigir a chave **e** o código, não um ou outro:

```bash
# Debian/Ubuntu: sudo apt install libpam-google-authenticator
# RHEL/Fedora:   sudo dnf install google-authenticator
google-authenticator          # rode por usuário para gerar o seed/QR
```

```text
# /etc/pam.d/sshd — adicione:
auth required pam_google_authenticator.so
```

```text
# no seu drop-in do sshd:
KbdInteractiveAuthentication yes
AuthenticationMethods publickey,keyboard-interactive:pam
```

`AuthenticationMethods publickey,keyboard-interactive:pam` faz o SSH exigir uma chave válida *e então* o código TOTP — uma chave roubada sozinha ainda não loga. **Contra o que protege:** chaves roubadas. Mas seja honesto quanto ao escopo: um segundo fator — seja uma chave FIDO2 `sk-` ou TOTP — é algo para servidor de alta segurança, não um padrão para toda máquina. Dos dois, a chave de hardware `sk-` é o fator mais limpo; o TOTP é o fallback para quando você não pode distribuir hardware.

### Arquivo consolidado

O `sshd` moderno lê `/etc/ssh/sshd_config.d/*.conf`, então você não precisa editar o arquivo principal — jogue suas sobrescritas no próprio arquivo, que sobrevive limpo às atualizações de pacote. Crie `/etc/ssh/sshd_config.d/99-hardening.conf`:

```text
# --- Autenticação ---
PasswordAuthentication no
KbdInteractiveAuthentication no
AuthenticationMethods publickey
PermitRootLogin no
PubkeyAuthentication yes

# --- Quem pode logar ---
AllowGroups sshusers

# --- Limites de força bruta ---
MaxAuthTries 3
LoginGraceTime 20
MaxStartups 10:30:60

# --- Timeout de sessão ociosa (~10 min) ---
ClientAliveInterval 300
ClientAliveCountMax 2

# --- Forwarding (superfície de conduíte) ---
AllowAgentForwarding no
AllowTcpForwarding no
X11Forwarding no
```

> ⚠️ **Teste antes de confiar.** Um `sshd_config` ruim pode te trancar para fora de um servidor remoto permanentemente. Dois hábitos tornam isso praticamente impossível:
>
> 1. Valide a sintaxe *antes* de recarregar:
>    ```bash
>    sudo sshd -t
>    ```
>    Sem saída significa que foi interpretado sem erro. Ele se recusa a iniciar com um typo, então pegue o erro aqui, não depois do reload.
> 2. **Mantenha sua sessão SSH atual aberta** enquanto testa. Recarregue o serviço e abra uma *segunda* sessão de outro terminal:
>    ```bash
>    sudo systemctl reload ssh    # Debian/Ubuntu (a unit é 'sshd' no RHEL/Fedora)
>    ```
>    Se a nova sessão funcionar, é seguro fechar a primeira. Se não funcionar, você ainda tem a sessão original para corrigir. Nunca recarregue-e-desconecte de uma vez só.

## Escalação de privilégios e sudo

É aqui que você se defende da ameaça de **escalação local de privilégios**: um processo já rodando no servidor (muitas vezes algo exposto, como uma aplicação web) tentando virar `root`. O formato do seu `sudo` decide o quão curta é essa escalada e o quão bem você consegue reconstruir o que aconteceu depois.

Existe um espectro real entre conveniência e segurança aqui, e vale ser honesto sobre cada ponto dele:

- **Um shell de root (`sudo -i`, `sudo su`)** — conveniência máxima, pior auditoria. Uma vez dentro de um shell de root, todo comando que você roda é registrado como `root`, não como "esta pessoa rodou *este comando específico*". A trilha de auditoria colapsa em "alguém virou root às 14:02". Evite tornar isso a forma padrão de trabalhar.
- **`sudo` com senha a cada vez** — mais seguro, menos conveniente. Todo comando privilegiado é registrado individualmente *e* protegido por uma reautenticação, então um processo que comprometeu sua conta ainda não consegue escalar sem a sua senha. O atrito é real: você vai redigitar a senha bastante.
- **`sudo` sem senha (`NOPASSWD`)** — conveniente, e tudo bem *se for escopado*. O risco não é o `NOPASSWD` em si; é o `NOPASSWD: ALL`, que significa que qualquer coisa rodando como o seu usuário pode virar root sem nenhuma checagem adicional. Essa é uma linha direta de um processo comprometido até o root.

O ponto ideal para a maioria das pessoas é **`NOPASSWD` escopado para os comandos específicos que você roda o tempo todo, com senha exigida para tudo o mais** — ou um cache de credenciais ajustado (abaixo) se você preferir manter senha em tudo sem redigitá-la a cada minuto.

### Sempre edite com `visudo`, sempre use um drop-in

Nunca edite `/etc/sudoers` diretamente. O `visudo` checa a sintaxe antes de salvar, então um typo não pode te trancar para fora do `sudo` inteiro. E ponha suas regras num drop-in sob `/etc/sudoers.d/` em vez do arquivo principal:

```bash
sudo visudo -f /etc/sudoers.d/deploy
```

Esses arquivos **precisam ter modo `0440`** (legível pelo root, sem escrita, sem acesso a grupo/outros) ou o `sudo` se recusa a carregá-los:

```bash
sudo chmod 0440 /etc/sudoers.d/deploy
```

### Escope o NOPASSWD para caminhos completos — e cuidado com shell escapes

Uma regra escopada é assim:

```text
# /etc/sudoers.d/deploy
deploy ALL=(root) NOPASSWD: /usr/bin/systemctl restart myapp, /usr/bin/journalctl -u myapp *
```

Duas regras para escrevê-las com segurança:

1. **Sempre use caminhos completos.** `NOPASSWD: systemctl` (sem caminho) pode ser satisfeito por *qualquer* `systemctl` que venha antes no `$PATH`, inclusive um que o atacante plantou. O `/usr/bin/systemctl` não pode.
2. **Cuidado com comandos que conseguem abrir um shell.** Essa é a armadilha sutil. Conceder `NOPASSWD` num editor, num pager, ou em qualquer coisa com shell escape é, na prática, conceder `NOPASSWD: ALL`, porque o usuário pode "escapar" para um shell de root de dentro dele:
   - `sudo vim` → `:!sh` → shell de root.
   - `sudo less file` → `!sh` → shell de root.
   - `sudo find . -exec sh \;` → shell de root.
   - `sudo awk 'BEGIN{system("sh")}'`, `sudo tar` com `--checkpoint-action`, e muitos outros.

   O projeto [GTFOBins](https://gtfobins.github.io/) cataloga esses casos. Antes de dar `NOPASSWD` em qualquer comando, verifique se ele pode ser coagido a rodar código arbitrário.

### Ajustando o cache de credenciais: mantenha a senha, perca a redigitação

Se você quer senha no `sudo` (bom para a ameaça de escalação) sem digitá-la a cada comando, ajuste o cache de timestamp em vez de recorrer a um shell de root:

```text
# /etc/sudoers.d/timeout
Defaults timestamp_type=global
Defaults timestamp_timeout=15
```

- **`timestamp_timeout=15`**: depois de um `sudo` bem-sucedido, não pergunta de novo por 15 minutos. (Coloque `0` para *sempre* perguntar, ou `-1` para nunca expirar — não faça isso.)
- **`timestamp_type=global`**: compartilha essa autenticação em cache entre todos os seus terminais/sessões em vez de por-tty, para que autenticar num shell não te faça reautenticar no próximo.

É por isso que isto é melhor do que apelar para o `sudo -i`: **todo comando ainda é rodado via `sudo` individualmente, então todo comando ainda é registrado individualmente.** Você ganha a conveniência de não redigitar a senha o tempo todo e mantém a trilha de auditoria por comando. Um shell de root (`sudo -i`, `sudo su`) te dá a primeira coisa mas joga a segunda fora — uma vez dentro dele, seus comandos rodam *como o shell*, não via `sudo`, então o log só mostra "virou root às 14:02" e nada depois.

## Confine os próprios serviços: MAC e containers

A higiene do `sudo` limita como *você* escala, mas o caso mais feio do modelo de ameaças é um serviço escalando — um `www-data` ou um processo de banco comprometido tentando alcançar o resto do servidor. É para isso que serve o Controle de Acesso Mandatório (MAC): ele prende cada serviço num perfil que diz exatamente quais arquivos, portas e capabilities ele pode tocar, então um processo invadido não consegue sair da própria raia mesmo rodando código escolhido pelo atacante.

**O que faz:** restringe cada processo confinado a uma política, independentemente das permissões de usuário comuns do Unix.

**Contra o que protege:** escalação local de privilégios e raio de explosão — um serviço comprometido fica preso ao que o perfil dele permite, não a tudo que o UID dele poderia alcançar.

O **RHEL / Fedora** já vem com o **SELinux** em modo enforcing por padrão. A regra mais importante: não apele para `setenforce 0` no primeiro problema. Veja o que foi negado e ajuste a política:

```bash
sestatus                          # confirma que está 'enforcing'
sudo ausearch -m avc -ts recent   # o que foi negado, e por quê
sudo setsebool -P <bool> on       # liga a boolean documentada que o serviço precisa
```

O **Debian / Ubuntu** vem com o **AppArmor**, que confina por perfis de programa:

```bash
sudo aa-status                    # quais perfis estão carregados e em enforcing
sudo aa-complain /caminho/do/bin  # só registra, para depurar um perfil sem bloquear
sudo aa-enforce /caminho/do/bin   # volta a enforcing quando o perfil estiver certo
```

Deixe ligado. A tentação sob pressão é desabilitar o MAC para o erro sumir — mas isso troca o único controle que contém um serviço invadido por alguns minutos economizados. Ajuste a política, não a desligue.

### Containers como outra camada de confinamento

Rodar um serviço num container é outra forma de prendê-lo: o processo ganha o próprio filesystem, o próprio namespace de rede e uma visão restrita do host, então um comprometimento fica contido no container em vez de na máquina inteira. O Docker ainda se apoia no MAC que você acabou de configurar — ele vem com um perfil seccomp padrão e aplica a política AppArmor/SELinux do host a cada container.

Mas seja honesto sobre o limite: um container compartilha o kernel do host, então é **redução de raio de explosão, não um sandbox de segurança forte**. O `root` dentro de um container padrão é `root` no host se ele escapar, e um bug de kernel é uma saída. Diminua essa brecha não rodando como root e descartando o que o serviço não precisa:

```bash
docker run --user 1000:1000 \
  --cap-drop ALL \
  --security-opt no-new-privileges \
  --read-only \
  myimage
```

Para um limite mais forte, rode Docker rootless ou Podman (que mapeia o root do container para um usuário sem privilégio no host), ou um runtime isolado por VM como Kata ou gVisor. Um container comum ao lado do MAC é um bom padrão — só não o confunda com uma VM.

## Mitigação de intrusão e monitoramento

Você reduziu a superfície de ataque e trancou as portas. Esta camada é sobre perceber e atrasar o que ainda for jogado contra você.

### fail2ban

**O que faz:** observa os logs de serviço em busca de falhas repetidas (autenticação SSH falha, etc.) e bane temporariamente, via firewall, o IP infrator.

**Contra o que protege:** força bruta remota sustentada. Com o SSH só por chave já no lugar, a força bruta *não tem como ter sucesso* de qualquer forma. Ele apenas reduz o ruído nos logs e aplica rate-limiting, banindo os bots para que seus logs continuem legíveis e seu daemon não fique ocupado o tempo todo. É um complemento útil, não um substituto para nada acima. (Ele vale mais a pena em serviços que *de fato* aceitam senhas — um login web, um servidor de e-mail.)

```bash
# Debian/Ubuntu
sudo apt install fail2ban
# RHEL/Fedora
sudo dnf install fail2ban
```

Configure em `/etc/fail2ban/jail.local` (nunca edite o `jail.conf` — ele é sobrescrito na atualização):

```ini
[DEFAULT]
bantime  = 1h
findtime = 10m
maxretry = 5
# bane no nível do firewall
banaction = nftables-multiport

[sshd]
enabled = true
```

```bash
sudo systemctl enable --now fail2ban
sudo fail2ban-client status sshd
```

No RHEL/Fedora, onde o `sshd` loga no journal do systemd em vez de um arquivo, adicione `backend = systemd` à jail `[sshd]` para o fail2ban ler a fonte certa.

### Mande seus logs para fora do servidor

Esta é mais importante do que parece. **Contra o que protege:** um atacante que *de fato* consegue root e então apaga os próprios rastros. Logs locais não valem nada contra um intruso de nível root, porque a primeira coisa que um atacante competente faz é limpar `/var/log`. Se os logs só existem no servidor, o seu registro da invasão desaparece junto com ele.

Então encaminhe os logs para algum lugar que a máquina comprometida não consiga alcançar de volta e editar: um host central de logs, ou um serviço gerenciado. Até um encaminhamento básico de `rsyslog` para outro servidor que você controla faz a evidência sobreviver ao servidor:

```text
# /etc/rsyslog.d/90-forward.conf — envia tudo para um coletor central via TCP
*.*    @@logserver.exemplo.com:514
```

```bash
sudo systemctl restart rsyslog
```

Esse exemplo envia em texto puro sobre TCP; para qualquer coisa sensível, encaminhe sobre TLS (RELP-over-TLS do rsyslog, ou `omfwd` com o driver GTLS) para que os logs não possam ser lidos ou adulterados em trânsito.

O servidor que pode estar comprometido não deveria ser o único lugar onde moram os seus próprios registros de segurança. É como você descobre o que aconteceu.

### Audite o que acontece no servidor (auditd)

O log do `sudo` te diz quais comandos privilegiados rodaram *via sudo* — mas não o que aconteceu dentro de um shell de root, nem adulteração de arquivo que nunca passou pelo sudo. O `auditd` é o framework de auditoria no nível do kernel que preenche essa lacuna: ele registra syscalls, acesso a arquivo e execução de processo por regra.

```text
# /etc/audit/rules.d/hardening.rules
-w /etc/passwd -p wa -k identity                # escritas/mudanças de atributo na base de usuários
-a always,exit -F arch=b64 -S execve -k exec    # toda execução de programa
```

```bash
sudo augenrules --load     # compila e carrega as regras
sudo ausearch -k identity  # consulta o que casou com uma tag
sudo aureport --auth       # resume eventos de autenticação
```

**Contra o que protege:** detecção e forense — é como você reconstrói o que um intruso fez, mesmo um que caiu num shell de root. Combine com o encaminhamento off-box acima para o registro sobreviver à máquina.

Um pré-requisito para qualquer disso ser útil depois do fato: **mantenha o relógio sincronizado.** Correlacionar eventos entre o servidor, o firewall e o seu host central de logs só funciona se os timestamps batem. O `chronyd` já vem e roda por padrão no Debian/Ubuntu e RHEL/Fedora modernos — só confirme que está sincronizando de fato:

```bash
chronyc tracking
```

### Complemento sobre portas não padrão

Mover o SSH da porta 22 aparece em todo guia de hardening, então sejamos honestos: **não é um controle de segurança.** Um atacante que escaneia seu host (o que leva segundos) acha o SSH em qualquer porta que ele esteja. O que mover a porta *de fato* faz é cortar o volume do tráfego burro e de passagem dos bots que só cutucam a porta 22 — o que significa logs mais silenciosos e um pouco menos de ruído no daemon. É um benefício real, ainda que menor. Só arquive isso sob "higiene de logs", não "segurança", e nunca o deixe substituir a autenticação só por chave.

## Backups: o controle que você só valoriza uma vez

Toda camada acima é sobre manter atacantes do lado de fora. Backups são o que sobra para você quando alguma coisa passa mesmo assim. Ransomware, um intruso destrutivo, ou mesmo um comando descuidado.

**O que faz:** mantém uma cópia recuperável dos seus dados em algum lugar separado do sistema vivo.

**Contra o que protege:** perda total — por invasão, falha de hardware ou erro humano. É a última camada da *Defense in Depth*, e a única que ajuda *depois* que a prevenção falhou.

Alguns princípios que importam mais que a ferramenta específica:

- **Mantenha ao menos uma cópia fora do servidor e meio offline.** Um backup no mesmo servidor que o atacante acabou de rootear é um backup que o atacante também pode deletar. Empurre os backups para um armazenamento em que o servidor possa escrever mas não sobrescrever livremente — idealmente append-only ou com imutabilidade/versionamento habilitados.
- **A regra 3-2-1** é a base clássica: três cópias, em duas mídias diferentes, uma fora do site.
- **Criptografe os backups em repouso.** Eles contêm tudo; trate o backup como as joias da coroa que ele é.

E a parte que todo mundo pula:

> **Um backup que você nunca restaurou não é um backup — é uma esperança.**

Teste a *restauração*, não só o job de backup. Backups não testados falham de todas as formas que você só descobre durante um incidente real: um arquivo faltando, um caminho errado, uma chave de criptografia que ninguém salvou, um arquivo corrompido, uma versão de ferramenta que não lê mais o formato. Ponha um simulado de restauração no calendário — puxe de verdade um backup e traga-o de volta num host descartável e você transforma o "acho que temos backups" em "sei que conseguimos recuperar".

## Colocando em ordem

Comece pelo topo. Automatize os patches de segurança e feche toda porta que você não está servindo de propósito — isso resolve a maior parte do seu risco no mundo real, e é justamente a parte que os guias focados em SSH tendem a atropelar. Depois torne suas chaves impossíveis de roubar (passphrase, agente, idealmente um token de hardware), aperte o `sshd` com cuidado (com uma segunda sessão aberta), escope o seu `sudo` para que um processo comprometido não vire root trivialmente, e deixe o `fail2ban` limpar o ruído. Sustente tudo com backups testados e fora do servidor para o dia em que a prevenção não for suficiente.

Nenhum desses, isolado, te torna seguro. Pular o topo chato da lista para aperfeiçoar o fundo interessante dela é exatamente o erro que este artigo existe para te dissuadir. Empilhe-os, em ordem, e uma falha em qualquer um deles é só uma falha — não uma invasão.

## TL;DR

Para todo servidor Linux, em ordem de impacto real:

- **Automatize as atualizações de segurança** — serviços desatualizados são a porta de entrada mais comum.
- **Feche tudo no firewall**, exceto as portas que você serve de propósito.
- **Proteja suas chaves** (passphrase + `ssh-agent`) e use **senhas longas e únicas** para todo outro segredo — guarde-as num gerenciador de senhas.
- **Faça hardening do SSH**: desative o login de root e o login por senha (só por chave).
- **Adicione o `fail2ban`** para silenciar o ruído de força bruta.

Para servidores altamente críticos, acrescente um **segundo fator — uma chave de hardware FIDO2 (melhor) ou TOTP** — e mantenha **backups testados e fora do servidor** para o dia em que a prevenção falhar.
