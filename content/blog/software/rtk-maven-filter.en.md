---
date: '2026-07-28T11:00:00-03:00'
draft: false
title: 'Fixing Maven Output in RTK, the Token Killer for AI Agents'
summary: 'RTK compresses shell output before your AI agent reads it, but Maven builds were slipping through unfiltered. What was broken, how a stateful Rust filter fixed it, and the release that ships it.'
categories:
- Software Development
- Technology
tags:
- maven
- java
- rust
---

When an AI agent reads your terminal, the entire output of every command goes straight into the context window, and most of what lands there is noise the model never needed to see. [RTK](https://github.com/rtk-ai/rtk) — Rust Token Killer — sits in the middle of that: it hooks into harnesses like Claude Code, runs the command itself, and hands back a compressed version of the output. A `git status` becomes a compact stat block; a `cargo test` becomes the failures plus a count of what passed. Single Rust binary, over 100 supported commands, under 10 ms of overhead, and up to 90% of the bytes your agent would have read simply never reach it.

I use it across a lot of projects, but on Java with Maven it wasn't helping. `mvn test` came back whole — every `[INFO]` line, every Surefire header, every stack trace. I went to the GitHub tracker to see whether it was already known, and it was: an open issue, still without a fix. So I wrote one and opened [PR #1956](https://github.com/rtk-ai/rtk/pull/1956).

Two things were broken. The hook's rewrite pattern listed only four goals and required the goal to be the first token after `mvn`, so `mvn install` was routed but `mvn test`, `mvn -B install`, `./mvnw test` and `mvn -q -Dtest=Foo test` — the way everyone actually types them — went straight through unfiltered. Beyond that, the filter itself was a stateless TOML line matcher, and Maven's worst noise can't be judged line by line. A passing `assertThrows` test prints the full stack trace of the expected exception, and you only find out that the block wasn't an error once you reach its closing `Tests run: 12, Failures: 0, Errors: 0` line. The TOML DSL has no way to hold a block and decide its fate later.

My fix replaced the TOML file with a stateful Rust module that buffers each test block until its close line, discards it silently when nothing failed, and, on a real failure, prints the block with the JUnit and JDK reflection frames removed and yours kept. It also returns the output untouched when it can't find the English `BUILD SUCCESS` / `BUILD FAILURE` footer, so builds in other languages are never mangled, and it gets out of the way completely with `-X` and `-e`. On a real `apache/commons-cli` build, `mvn test` dropped from 1896 tokens to 38.

The fix officially landed on 8 June 2026 and shipped in **v0.42.4** on 12 June, so every release from that one onward already has it — v0.44.0 is current. If you write Java and work with an AI agent, install it and let `mvn` route through it. Maven is verbose in a way that costs you context on every build, and there is no reason to keep paying for output that adds nothing to it.
