---
date: '2026-07-28T11:00:00-03:00'
draft: false
title: 'Corrigindo a Saída do Maven no RTK, o Token Killer para Agentes de IA'
summary: 'O RTK comprime a saída do terminal antes do seu agente de IA ler, mas builds Maven passavam sem filtro nenhum. O que estava quebrado, como um filtro stateful em Rust resolveu e a versão que já entrega isso.'
categories:
- Desenvolvimento de Software
- Tecnologia
tags:
- maven
- java
- rust
---

Quando um agente de IA lê o seu terminal, o resultado completo de todo comando vai inteiro para a janela de contexto, e a maior parte do que cai lá é ruído que o modelo nunca precisaria ver. O [RTK](https://github.com/rtk-ai/rtk) — Rust Token Killer — entra no meio disso: ele se pluga no hook de harnesses como o Claude Code, executa o comando ele mesmo e devolve uma versão comprimida da saída. Um `git status` vira um bloco compacto de estatísticas; um `cargo test` vira as falhas mais uma contagem do que passou. É um binário Rust único, mais de 100 comandos suportados, menos de 10 ms de overhead, e até 90% dos bytes que o seu agente leria simplesmente não chegam nele.

Eu uso em diversos projetos, mas para Java com Maven não estava ajudando. O `mvn test` voltava inteiro — cada linha de `[INFO]`, cada cabeçalho do Surefire, cada stack trace. Fui olhar no tracker do GitHub se já era conhecido, e era: uma issue aberta, ainda sem correção. Então escrevi uma e abri o [PR #1956](https://github.com/rtk-ai/rtk/pull/1956).

Duas coisas estavam quebradas. O padrão de rewrite do hook listava só quatro goals e exigia que o goal fosse o primeiro token depois do `mvn`, então `mvn install` era roteado, mas `mvn test`, `mvn -B install`, `./mvnw test` e `mvn -q -Dtest=Foo test` — o jeito que todo mundo realmente digita — passavam direto, sem filtro. Após isso, o filtro em si era um matcher de linha stateless em TOML, e o pior ruído do Maven não dá para julgar linha por linha. Um teste com `assertThrows` que passa imprime o stack trace inteiro da exceção esperada, e você só descobre que aquele bloco não era um erro quando chega na linha de fechamento `Tests run: 12, Failures: 0, Errors: 0`. A DSL do TOML não tem como segurar um bloco e decidir o destino dele depois.

Minha correção trocou o arquivo TOML por um módulo stateful em Rust que faz buffer de cada bloco de teste até a linha de fechamento, descarta em silêncio quando nada falhou e, numa falha real, imprime o bloco removendo os frames do JUnit e da reflection da JDK e mantendo os seus. Ele também devolve a saída intacta quando não encontra o rodapé em inglês `BUILD SUCCESS` / `BUILD FAILURE`, então builds em outros idiomas nunca são mutilados, e sai completamente de cena com `-X` e `-e`. Num build real do `apache/commons-cli`, o `mvn test` caiu de 1896 tokens para 38.

A melhoria entrou oficialmente no dia 8 de junho de 2026 e foi liberada na **v0.42.4** em 12 de junho, então toda versão a partir dela já tem isso — a atual é a v0.44.0. Se você escreve Java e trabalha com um agente de IA, instale e deixe o `mvn` passar por ele. O Maven é verboso de um jeito que te custa contexto em cada build, e não há motivo para continuar pagando por saída que não agrega ao contexto.
