---
date: '2025-12-02T20:10:00-03:00'
draft: true
title: 'Usando Keycloak para autenticação'
summary: 'Como usar Keycloak para autenticação e gestão de usuários em uma aplicação SaaS'
categories:
- Desenvolvimento de Software
- Tecnologia
---
[keycloak](https://www.keycloak.org/) é um software para gestão de acesso e identidade, o famoso login, com o diferencial de ser Open Source e suportado pela [Cloud Native Foundation](https://www.cncf.io/projects/keycloak/) desde 2023, o que traz confiabilidade em usá-lo como solução para este processo tão crítico em todo software.

Pode ser usado como um Single-Sign On (SSO) para diversas aplicações diferentes usando Jason Web Tokens (JWT), tendo como vantagem várias funcionalidades complexas de implementar nativamente, como:
* Social Login (logar com conta do Google, GitHub, Facebook...);
* Gestão de usuários em grupos e acessos;
* Painel administrativo para configuração e CRUD de usuários;
* Integração com Active Directory e LDAP;
* Integração com OpenID Connect, OAuth 2.0, SAML.

Para saber mais sobre como funcionam JWTs confira este artigo: [Como Jason Web Tokens funcionam](/blog/jwt/how-jwt-works.pt.md)

## Subindo uma instância com docker para testes

A forma recomendada de usar o Keycloak é com um banco de dados PostgreSQL externo em que ele recebe um database próprio para criar as tabelas e armazenar as informações de usuários.

No docker-compose abaixo será criado um banco Postgres e uma instância Keycloak


Para produção é recomendado não usar bancos de dados em Docker, e usar dados seguros, obviamente.

## Configurando e usando a instância

``` yaml
    services:
    keycloak:
        build:
        context: .
        dockerfile: KeycloakDockerfile
        container_name: keycloak
        ports:
        - "8080:8080"
        - "9000:9000"
        environment:
        KC_DB: ${KC_DB}
        KC_DB_URL: ${KC_DB_URL}
        KC_DB_USERNAME: ${KC_DB_USERNAME}
        KC_DB_PASSWORD: ${KC_DB_PASSWORD}
        KEYCLOAK_ADMIN: ${KEYCLOAK_ADMIN}
        KEYCLOAK_ADMIN_PASSWORD: ${KEYCLOAK_ADMIN_PASSWORD}
        KC_HOSTNAME: ${KC_HOSTNAME}
        command:
        - start-dev
```

``` Dockerfile
FROM quay.io/keycloak/keycloak:latest AS builder

# Enable health and metrics support
ENV KC_HEALTH_ENABLED=true
ENV KC_METRICS_ENABLED=true

WORKDIR /opt/keycloak
# for demonstration purposes only, please make sure to use proper certificates in production instead
RUN keytool -genkeypair -storepass password -storetype PKCS12 -keyalg RSA -keysize 2048 -dname "CN=server" -alias server -ext "SAN:c=DNS:localhost,IP:127.0.0.1" -keystore conf/server.keystore
RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:latest
COPY --from=builder /opt/keycloak/ /opt/keycloak/

ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
```

## Meu readme antigo
https://www.keycloak.org/server/containers

# setting the admin username
-e KC_BOOTSTRAP_ADMIN_USERNAME=<admin-user-name>

# setting the initial password
-e KC_BOOTSTRAP_ADMIN_PASSWORD=change_me


docker build . -t mykeycloak

docker run --name mykeycloak -p 8443:8443 -p 9000:9000 \
        -e KC_BOOTSTRAP_ADMIN_USERNAME=admin -e KC_BOOTSTRAP_ADMIN_PASSWORD=change_me \
        mykeycloak \
        start --optimized --hostname=localhost


Keycloak starts in production mode, using only secured HTTPS communication, and is available on https://localhost:8443.

Health check endpoints are available at https://localhost:9000/health, https://localhost:9000/health/ready and https://localhost:9000/health/live.

Opening up https://localhost:9000/metrics leads to a page containing operational metrics that could be used by your monitoring solution.

## Olhar o que faz esse admin server do PostgREST. Seria uma interface administrativa?
Sample Databases

https://wiki.postgresql.org/wiki/Sample_Databases

https://docs.postgrest.org/en/stable/references/configuration.html#admin-server-port
PGRST_ADMIN_SERVER_PORT