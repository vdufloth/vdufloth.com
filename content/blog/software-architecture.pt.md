---
date: '2025-08-31T18:00:00-00:00'
draft: true
title: 'Arquitetura de Software'
summary: 'Quais existem e como escolher'
categories:
- Desenvolvimento de Software
- Tecnologia
tags:
- best
---

A escolha do estilo arquitetural de um sistema é talvez a decisão mais importante de um projeto de software, podendo facilitar ou dificultar muito adição de novas funções, performance ou mesmo o tempo de *onboarding* de desenvolvedores para se acostumarem com a base de código e se tornarem produtivos.


Um estilo arquitetural deve servir ao propósito do sistema, não existindo melhor ou pior, mas sim a **mais adequada para o contexto do projeto**. Primeiro deve-se sempre entender o problema e depois escolher o estilo que melhor se adeque aquele problema.

Para mim, uma boa arquitetura deve parecer intuitiva para desenvolvedores atuais e novos e que permita inclusão de novas funcionalidades ao projeto e performance para o projeto idealizado com o menor atrito possível.

Me vem a mente uma correlação de uma frase do investidor *Warren Buffet*:

> Eu tento investir em negócios que são tão magníficos que até um idiota pode tocar eles. Porque cedo ou tarde, um vai.<br>
> — Warren Buffet

Que pensemos nisso quando arquitetarmos nossos sistemas.

## Alta coesão e baixo acoplamento

Todo estilo de arquitetura de software vai invariavelmente tentar resolver este problema: Ter alta coesão e um baixo acoplamento.

Vamos entender o que significa dizer isso e porque são importantes.

Alta coesão significa que cada módulo, classe, função, microserviço... o que quer que seja tenha uma responsabilidade clara, única, bem definida e com um nome adequado. E porque queremos isso? Porque chegará ao desenvolvedor uma demanda como:

> Quero que quando um usuário logado no site adicionar um item no carrinho, mas saia do sistema sem efetuar a compra, mande um email para ele, 1 hora depois.

A primeira pergunta do desenvolvedor talvez seja: Não tem nada mais importante pra fazer nesse sistema, não?

Mas certamente a segunda será: O que é que eu altero no meio dessas centas de arquivos e milhares de linhas pra fazer isso? Algumas perguntas que seguirão...

* Já tem alguma função implementada de agendamento de tarefas?
* Já existe um código para envio de email?
* Tem um padrão definido para corpo de email?
* Já registramos hoje o horário que o usuário saiu do sistema?
* Se não, onde eu vou alterar pra passarmos a registrar?
* Onde eu registro que o email já foi enviado pra não enviarmos de novo?
* Onde ficam registrados os itens do carrinho do usuário?

Algumas desses perguntas ele pode perguntar ao gerente do projeto que responderá: *não sei* e outras delas ele pode perguntar ao desenvolvedor sênior que treina ele, que responderá *depois vejo contigo*. Ai chegamos na importância deste princípio e numa grande máxima que gosto:

{{< callout type="warning" >}}
  Nomes são importantes!
{{< /callout >}}

Neste caso em uma má arquitetura de software o desenvolvedor estaria totalmente perdido e teria que ficar parado sem produzir nada para a empresa esperando alguém decifrar para ele o caminho mágico do sistema.

Em uma boa arquitetura de software, o desenvolvedor talvez numa pesquisa rápida encontre uma classe chamada `gerenciadorDeTarefasAgendadas`, outra chamada `enviarEmail`, outra classe `realizaLogout` um método `obterItensDoCarrinho`... e então ele consegue ao menos começar a se localizar e entender o que precisa fazer, otimizando o tempo e recursos da empresa.

Parece óbvio, mas é surpreendente a quantidade de sistemas que evoluem sem refatoração, ou seja, repensar e reescrever o problema, e acabam tendo este envio de email dentro da classe `metodosUteis` com o nome de funcao `notificarCliente` e mesmo que o desenvolvedor tenha a sorte de achar isso, ele vai ficar muito receoso (e com razão), de mexer em qualquer coisa e impactar em outra funcionalidade obscura.

Imagine a surpresa desse desenvolvedor, e mais ainda do furioso gerente de projetos, quando ele entregou a demanda acima porém acontecia o seguinte: o cliente recebia o email, pensava que realmente queria voltar ao site e comprar o produto, mas ao acessar novamente apenas encontrava seu carrinho vazio.

Muitos gritos, estresse e café depois, descobre-se que o que aconteceu é que o desenvolvedor passou a usar o método `obterItensDoCarrinho` para listar no email quais produtos estavam no carrinho, porém dentro neste método, além de retornar uma lista dos itens, era removido todos itens do carrinho! Isso foi feito assim pois no único lugar em que este método era chamado isso fazia sentido. Eram listados todos itens em uma tela ao final da compra, já realizada, e então limpo o carrinho.

Qual foi o problema?

Baixa coesão. Nome ruim. Se o método é `obterItensDoCarrinho` ele deve *obter os itens do carrinho*, se ele obtém e remove os itens do carrinho, deveria se chamar `obterERemoverItensDoCarrinho` ou melhor ainda... ter 2 métodos: `obterItensDoCarrinho` e `removerItensDoCarrinho` cada um fazendo sua função.

Parece óbvio? Pois é... mas é supreendente o quanto isto acontece. No dia a dia as demandas são pressionadas, dar nomes que façam sentido requer esforço mental e muitas vezes o caminho mais rápido é tomado, e não o certo. Por isso a importância de uma boa arquitetura desde o princípio.

Um sistema deve ser tão bem arquitetado que até um desenvolvedor júnior sem muito treinamento consiga atender uma demanda sem causar colaterias. Pois um dia, isso acontecerá.

Mas apenas alta coesão não é suficiente, também queremos o baixo acoplamento. Este significa que um módulo ou classe deve depender o mínimo possível de outros módulos e classes.

Baixo acoplamento evita precisar alterar o que não seja apenas absolutamente necessário para uma nova modificação, evitando colaterais não previstos e facilitando grandes mudanças. Isso torna mudanças que parecem grandes em mudanças simples.

Seguindo no exemplo, poderíamos arquitetar uma função de envio de email de duas formas:

``` java
// Ruim, alto acoplamento

public class ServicosPedido {

    public void criarPedido(Pedido pedido) {

        // salvar pedido...

        // enviar email
        SmtpEmailSender sender = new SmtpEmailSender("smtp.servidor.com", 587);
        sender.enviar(pedido.getCliente().getEmail(), "Pedido criado", "Seu pedido foi criado com sucesso!");
    }
}

public class SmtpEmailSender {
    private String servidor;
    private int porta;

    public SmtpEmailSender(String servidor, int porta) {
        this.servidor = servidor;
        this.porta = porta;
    }

    public void enviar(String destinatario, String assunto, String corpo) {
        // lógica de envio SMTP aqui
        System.out.println("Enviando e-mail SMTP para: " + destinatario);
    }
}

```
Ou

``` java
// Boa, baixo acoplamento

public interface EmailInterface {
    void enviar(String destinatario, String assunto, String corpo);
}

// Implementacao com SMTP
public class SmtpEmailInterface implements EmailInterface {
    @Override
    public void enviar(String destinatario, String assunto, String corpo) {
        System.out.println("Enviando via SMTP para: " + destinatario);
        // codigo
    }
}

// Implementação com SendGrid
public class SendGridEmailInterface implements EmailInterface {
    @Override
    public void enviar(String destinatario, String assunto, String corpo) {
        System.out.println("Enviando via SendGrid para: " + destinatario);
        // codigo
    }
}

// PedidoService só conhece o contrato abstrato EmailInterface
public class ServicosPedido {

    private final EmailInterface emailInterface;

    public ServicosPedido(EmailGateway emailGateway) {
        this.emailGateway = emailGateway;
    }

    public void criarPedido(Pedido pedido) {
        System.out.println("Pedido salvo: " + pedido.getId());
        emailGateway.enviar("cliente@email.com", "Pedido criado", "Seu pedido foi criado com sucesso!");
    }
}
```

Sem pensar muito, pode parecer que fazem a mesma coisa do mesmo jeito.

Porém da forma ruim, conforme formos chamando esta função em mais classes, estamos colocando em mais e mais lugares a necessidade de escrever explicitamente dados técnicos do provedor de email atual, e não apenas o necessário para qualquer provedor de envio de email.

Baixo acoplamento facilita testes unitários pois pode-se *mockar* ou seja simular a função de outras classes testando apenas a regra de negócio e faz com que neste caso por exemplo, uma alteração no provedor de envio de email necessite de alteração apenas na classe de envio de email. No cenário ruim, imagine que teremos de alterar todos locais que o chamam se mudar URL, usuário ou senha, e caso algum lugar não seja encontrado só se descobrirá ao parar de enviar email quando chamado de um local específico.


Uma boa arquitetura é importante e vale o investimento

## Estilos arquiteturais

Buscando baixo acoplamento e alta coesão em diferentes cenários e contextos, surgem vários estilos arquiteturas. A seguir listarei alguns e os cenários em que fazem sentido.

## Estilo baseado em pipelines

Muito usado para processos de Business Intelligence, muito comum com a sigla ETL:
* **E**xtract
* **T**ransform
* **L**oad

Possui a vantagem de paralelismo, possibilitando mais facilmente executar a mesma operação em dados diferentes em paralelo. Ex:
* AWS Lambda
* Kafka
* Gerenciadores de CI/CD

Composto por um PIPE e FILTERS que agem sobre.

## Estilo baseado em Micro-Kernel

Cria-se uma parte nuclear e 'pontos de extensibilidade' em que pode-se incluir funcionalidades sem afetar o programa principal. Estilo fundamental para ter-se extensibilidade, muito usado em ERPs

No código principal, ainda são usados outros estilos como de camadas ou domínio, mas tendo a possibilidade de pontos de extensão externos.

Ex: 
* Navegadores que permitem extensões
* ERPs como SAP Protheus

## Estilo baseado em serviços

Mantém uma mesma camada de interface para o usuário porém por trás possui nós com uma camada **física** própria para cada componente lógico. Difere de micro-serviços pois os micro-serviços cada um precisa necessariamente ter seu banco de dados e neste caso apenas a aplicação pode ser separada para ser considerada um estilo de serviços.

## Estilo baseado em microserviços

Surgiu para buscar resolver problemas de velocidade de entrega para responder a mudanças rápidas de negócio, e também necessidade de escala em grandes empresas de tecnologia. Segue a ideia de ter um serviço para cada componente de negócio, e que é contido nele mesmo.

Comum que tenha um 'side car' que é o chassi compartilhado entre vários microserviços, contendo bibliotecas comuns como log por exemplo. Só é possível de existir em um processo com DevOps pleno e maduro.

O site da [Cloud Native Landscape](https://www.cncf.io/projects/) tem uma lista de várias tecnologias para solução de problemas que vem desta complexidade.

Com microserviços também surge o problema de integridade de dados entre serviços. Chama-se isso de SAGA e geralmente é usado um Orquestrador central que garante o fluxo de uma chamada de API para outra através de filas de mensagens e eventos. Neste sentido, começa a tornar-se semelhante ao estilo baseado em eventos.

Costuma-se usar também o padrão CQRS (Command Query Responsability Segregation), um padrão que separa a responsabilidade de leitura e escrita dos dados.

Existem mais vários outros padrões de microserviços no site [microservices.io](https://microservices.io/patterns/) . Interessante é que neste site são trazidos padrões e soluções para diferentes problemas seguindo o modelo de Contexto, Problema e Solução.

## Estilo baseado em eventos

Popular para sincronização de dados entre organizações. É teoricamente o mais escalável das arquiteturas. É a arquitetura usada pelo Pix por exemplo.

Coloca-se um evento em um canal até até que seja processada um processador de evento. Sendo assim, estes processadores podem ser escalados em paralelo e com auxílio de nuvem, sob demanda. Também provê disponibilidade alta por poder ter redundância dos executores dos eventos.

Pode ter ainda um mediador de eventos que controle as etapas, colocando o item a ser processado, um pedido, por exemplo, nas filas adequadas.
Ex de uso:
* Bancos / fintechs
* E-commerces

## Estilo baseado em *Espaços*

Distribui a computação em múltiplos nós. É a arquitetura usada pelo ChatGPT.
Torna a memória compartilhada entre os nós em um 'pool' gerando uma "barragem" de dados compartilhados utilizando para isso, por exemplo, docker, kubernetes, cassandra, kafka etc...

## Estilo baseado em Orquestração de Serviços

Não é mais usado, mas ainda existem muitos sistemas legados dos anos 2000. Usava os **Business Services** que eram providos por grandes techs da época como IBM, Oracle, Microsoft. Não é mais usado por falhar em escala e também porque centralizava tudo no barramento dos serviços ficando 'na mão' de um fornecedor.

## Estilo baseado em camadas
Camadas de Neal Ford:
* Presentation
* Business
* Persistence
* Database

Este estilo tende a facilitar a manutenção e testabilidade dividindo em conceitos técnicos a aplicação, convencionando uma camada ter acesso apenas para a sua camada superior ou inferior.

Surgiu da necessidade de organizar o surgimento de interfaces gráficas mais complexas. Separa em:
* Modelo - Regras de negócio e entidades, domínios
* Controlador - Criador de endpoints e regras de mediação
* Visão - Desenho e apresentação

Geralmente é complementado a outros modelos principalmente para organização da arquitetura das regras de negócio.

### MVC - Model View Controller

Um exemplo clássico de MVC é aplicações web em que o modelo e o controlador ficam no backend e apresentação toda no front end.

Exemplo de estrutura MVC:

controle
	contaController - Regras de mediação, 'coisas do framework'
modelo
	conta - entidade e também operações - realizarDebito, realizarCredito
view
	 contaView - Apenas código para visualização

Coisas de controllers:
* Status HTTP a retornar
* Renderização
* APIs
* Fluxo de chamadas

Deixando as regras de negócio 'puras'

Ex:

``` plaintext
MVC/
├── app.ts
├── controllers
│   └── ContaController.ts
├── models
│   └── Conta.ts
└── views
    └── ContaView.ts
```

### MVVM - Model View ViewModel

Trazida pelo Angular e usada hoje também pelo react e Vue

1. View - Receb interação do usuário
2. ViewModel - Age buscando dados
3. Model - Atualiza os modelos de dados que refletem na View, reiniciando o ciclo na próxima ação do usuário

O ViewModel trabalha no cliente (navegador, mobile) e pode manter o cache dos dados

Ex:

``` plaintext
MVVM/
├── app.ts
├── models
│   ├── ContaModel.ts
│   └── TransacaoModel.ts
├── viewmodels
│   └── ContaViewModel.ts
└── views
    └── ContaView.ts
```
### DDD - Domain Driven Design

Dirigido pelo domínio, surge para juntar analistas de negócio e desenvolvedores sobre uma mesma linguagem em comum, organizando a arquitetura nos mesmos termos e domínios do negócio.

![[DDD-esquema.excalidraw | 1000]]

Ex: 

```plaintext
DDD/
├── application
│   └── services -> Contém uma fachada de grandes funcionalidades
│       └── ContaService.ts
├── domain -> "Ignorância da persisttência" só se importa com as regras de negócio
│   ├── entities -> conceitos do sistema
│   │   └── Conta.ts
│   ├── repositories -> contratos do que é preciso fazer para buscar os dados da  │   │   │               entidade
│   │   └── ContaRepository.ts
│   └── value-objects -> Atributos úteis ao domínio
│       ├── Dinheiro.ts
│       └── Transacao.ts
├── infrastructure -> Auth, auditoria, conexão ao banco, SQLs
│   └── repositories -> Implementa o repositório do domínio
│       └── ContaRepositoryImpl.ts
└── interfaces
    └── controllers
        └── ContaController.ts		
```

Como DDD foca em descrever melhor o negócio é totalmente possível usar seus conceitos em conjunto com qualquer outro estilo arquitetural, principalmente nos modelos.

Mais detalhes em [[Domain Driven Design]]

Itens de um melhor desenho:
#### Objetos de Valor

Um Objeto de Valor surge quando queremos expressar um tipo de dado do negócio. Um exemplo clássico é um objeto de valor para Email, em que poderia ser representado como uma simples `String` mas que usando esse método pode-se expressar muito melhor.

Por exemplo:

``` java
import java.util.regex.Pattern;

public class Email {
    private String endereco;

    public Email(String endereco) {
        if (!validarEmail(endereco)) {
            throw new EmailInvalidoException("Endereço de e-mail inválido.");
        }
        this.endereco = endereco;
    }

    private boolean validarEmail(String endereco) {
        // Regular expression to match a valid email address
        String regex = "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$";
        return Pattern.matches(regex, endereco);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Email other = (Email) obj;
        return endereco.equals(other.endereco);
    }

    @Override
    public int hashCode() {
        return endereco.hashCode();
    }

    // Getter for the email address
    public String getEndereco() {
        return endereco;
    }

    public static class EmailInvalidoException extends RuntimeException {
        public EmailInvalidoException(String message) {
            super(message);
        }
    }
}
```

Com esta declaração, conseguimos criar regras de validação do email, e ele pode ser usado em um cadastro de `Pessoa`, `Empresa`, `Pedido` etc... mantendo esta mesma regra sem duplicidade de código em todos estes locais.

#### Entidades

Identidades do negócio únicas, com continuidade e integridade ao longo do tempo. Representam elementos que são rastreados e preservados em bancos de dados. Nem sempre de forma igual as classes, importante lembrar. Muitas vezes dados serão normalizados ou quebrados em diferentes tabelas para performance do BD, mas logicamente em código podem estar em uma entidade.

Exemplo:

``` java
import java.util.UUID;

public class Cliente {
    private UUID id;
    private String nome;
    private Email email;

    public Cliente(String nome, Email email) {
        if (nome == null) {
            throw new IllegalArgumentException("Nome não pode ser nulo.");
        }
        if (email == null) {
            throw new IllegalArgumentException("Email não pode ser nulo.");
        }
        
        this.id = UUID.randomUUID();
        this.nome = nome;
        this.email = email;
    }

    public void alterarEmail(Email novoEmail) {
        if (novoEmail == null) {
            throw new IllegalArgumentException("Novo e-mail não pode ser nulo.");
        }
        this.email = novoEmail;
    }

    public UUID getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public Email getEmail() {
        return email;
    }
}
```

#### Raízes Agregadas

Atuam como um ponto de controle e para um conjunto de entidades que formam um entidade maior. Ex: Pedido formado por Cliente, Itens do Pedido, Endereço etc...
As regras de negócio dentro dela devem permitir criar deletar ou modificar as entidades que compõe esse agregado de forma a garantir que todas operações respeitem as regras de negócio.

Ex não completo:

``` java
// Imports

public class Pedido {
    private UUID id;
    private List<ItemPedido> itens = new List<ItemPedido>();
    private Cliente cliente;
    private double valorTotal;

    public Pedido(Cliente cliente) {
        id = UUID.randomUUID(); 

        if (cliente == null) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }
        this.cliente = cliente;
    }

    public void adicionarItem(Produto produto, int quantidade) {
        if (produto == null) {
            throw new IllegalArgumentException("Produto não pode ser nulo.");
        }
        
        if (quantidade <= 0) {
            throw new IllegalArgumentException("Quantidade deve ser maior que zero.");
        }

        ItemPedido item = itens.stream()
                               .filter(i ->  i.getProduto().getId().equals(produto.getId()))
                               .findFirst()
                               .orElse(null);

        if (item != null) {
            item.atualizarQuantidade(item.getQuantidade() + quantidade);
        } else {
            itens.add(new ItemPedido(produto, quantidade));
        }

        // Recalculate the total value of the Pedido
        recalcularValorTotal();
    }
    
    //... demais métodos
}
```

#### Repositório

O repositório de cada entidade ou domínio é responsável por abstrair a lógica de obtenção dos dados. Ex:

``` java
public interface IPedidoRepositorio {
    Pedido obterPorId(UUID pedidoId);
    void salvar(Pedido pedido);
    void atualizar(Pedido pedido);
    void remover(Pedido pedido);
}

public class PedidoRepositorio implements IPedidoRepositorio {
    private final EntityManager context;

    public PedidoRepositorio(EntityManager context) {
        this.context = context;
    }

    public Pedido obterPorId(UUID pedidoId) {
        return context.createQuery("SELECT p FROM Pedido p JOIN FETCH p.itens WHERE p.id = :pedidoId", Pedido.class)
                      .setParameter("pedidoId", pedidoId)
                      .getSingleResult();
    }

    public void salvar(Pedido pedido) {
        context.getTransaction().begin();
        context.persist(pedido);
        context.getTransaction().commit();
    }

    public void atualizar(Pedido pedido) {
        context.getTransaction().begin();
        context.merge(pedido);
        context.getTransaction().commit();
    }

    public void remover(Pedido pedido) {
        context.getTransaction().begin();
        context.remove(pedido);
        context.getTransaction().commit();
    }
}
```

#### Serviço de domínio

Encapsula lógicas de negócio que não se encaixam exatamente de forma natural em entidades, mesmo agregadas. É utilizado para operações complexas que envolvem vários objetos de domínio, oferecendo uma interface clara para estes processos.

``` java
public class PedidoServico {
    private final IPedidoRepositorio pedidoRepositorio;

    public PedidoServico(IPedidoRepositorio pedidoRepositorio) {
        this.pedidoRepositorio = pedidoRepositorio;
    }

    public Pedido criarPedido(Cliente cliente) {
        Pedido novoPedido = new Pedido(cliente);
        pedidoRepositorio.salvar(novoPedido);
        return novoPedido;
    }

    public Pedido obterPedido(UUID pedidoId) {
        return pedidoRepositorio.obterPorId(pedidoId);
    }

    public void atualizarPedido(Pedido pedido) {
        pedidoRepositorio.atualizar(pedido);
    }

    public void removerPedido(UUID pedidoId) {
        Pedido pedido = pedidoRepositorio.obterPorId(pedidoId);
        if (pedido == null)
            throw new IllegalStateException("Pedido não encontrado.");
        pedidoRepositorio.remover(pedido);
    }
}
```

#### Controladores

Controladores facilitam a comunicação entre a camada de aplicação, ou outros clientes, e o modelo de domínio. Foca em receber e entregar em um determinado formato, por exemplo em formato HTTP e Json. Ex:

``` java
@Stateless
public class ClienteController {
    @Inject
    private ServicoCliente servicoCliente;

    @POST
    @Path("/atualizarEmail")
    public Response atualizarEmail(@FormParam("clienteId") UUID clienteId, @FormParam("novoEmail") String novoEmail) {
        try {
            Email email = new Email(novoEmail);
            servicoCliente.atualizarEmailCliente(clienteId, email);
            return Response.seeOther(URI.create("/success")).build();
        } catch (Exception ex) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                           .entity(new ErrorViewModel(ex.getMessage()))
                           .build();
        }
    }
}
```

### Clean Architecture

Busca entregar alta coesão e baixo acoplamento, o que seria o santo graal da manutenção de software. Divide em círculos concêntricos com dependências de "fora para dentro"

A arquitetura limpa foca principalmente em separação de preocupações (princípios [[S.O.L.I.D]])

Ex: 

```plaintext
Clean Architecture/
├── app
│   └── usecases
│       ├── consultar
│       │   ├── ConsultarConta.ts
│       │   ├── ConsultarContaInput.ts
│       │   └── ConsultarContaOutput.ts
│       ├── creditar
│       │   ├── CreditarConta.ts
│       │   ├── CreditarContaInput.ts
│       │   └── CreditarContaOutput.ts
│       ├── debitar
│       │   ├── DebitarConta.ts
│       │   ├── DebitarContaInput.ts
│       │   └── DebitarContaOutput.ts
│       └── definirLimiteCredito
│           ├── DefinirLimiteCreditoConta.ts
│           ├── DefinirLimiteCreditoContaInput.ts
│           └── DefinirLimiteCreditoContaOutput.ts
├── domain
│   ├── entities
│   │   └── Conta.ts
│   ├── repositories
│   │   └── ContaRepository.ts
│   └── value-objects
│       ├── Dinheiro.ts
│       └── Transacao.ts
├── estrutura.md
├── infrastructure
│   ├── controllers
│   │   └── ContaController.ts
│   ├── repositories
│   │   └── ContaRepositoryMemory.ts
│   └── server
│       └── Server.ts
└── main.ts
```

## Estilo baseado em APIs

Veio para reduzir o custo de desenvolvimento ao buscar reaproveitar o código por trás de alguma funcionalidade já existente encapsulando-a em um formato mais moderno.
Importante definir quem vai usar e qual vai ser o uso desta API para entender o formato mais adequado de [[APIs e Web Services]]. 

É comum ser usado em produção uma plataforma de execução de APIs que são oferecidas por todos grandes provedores de nuvens, e não é recomendável construir a própria por não agregar muito valor ao negócio e requerir uma infraestrutura complexa que acabará precisando da nuvem de toda forma para implementar.
## Classes Anêmicas

Existe um Anti-Padrão ou seja, algo que apesar de feito não traz benefícios, algo que portanto deve ser evitado, que é o Anemic Domain Model (ADM) que faz uma crítica acertada a alguns projetos que na tentativa de implementar a separação das entidades e objetos de valor das regras de negócio, criam modelos de domínio em que as entidades são apenas esqueletos de dados sem lógica de negócio significativa, virando só boilerplate.

Este termo foi popularizado por [Martin Fowler](https://martinfowler.com/).  Em um modelo anêmico desses, as operações sobre os dados são tipicamente implementadas em classes de serviço separadas deixando as entidades como simples Data Transfer Objects (DTO) e isso traz alguns problemas.

* Violação do encapsulamento: Ao separar a lógica de negócio das entidades, podemos acabar precisando modificar múltiplos lugares para incluir uma funcionalidade a uma entidade, estando mais sujeitos a complexidade de código e erro humano;
* Pelo mesmo motivo, o sistema torna-se mais difícil de entender e manter. Mudanças em uma classe podem exigir revisões em múltiplas outras;
* Comprometimento da reusabilidade já que ao alterar uma entidade, você acaba afetando uma série de classes que dependem e a usam, fazendo com que deixe-se de reaproveitar para criar uma nova e não correr o risco de quebrar códigos;
* Dificuldade de testabilidade: ao invés de um simples teste unitário, acaba-se sempre caindo em testes integrados pra testar simples funcionalidades devido ao alto acoplamento que foi gerado;

Para evitar o ADM, devemos:

- Encapsular as regras de negócio nas entidades, garantindo que cada classe no modelo de domínio seja auto suficiente e viável de ser testada unitariamente;
- Utilizar o Domain-Driven Design de forma efetiva, enfatizando modelos de domínio ricos e bem encapsulados;
- As entidades e objetos de valor devem ser projetados com comportamentos que refletem a realidade do negócio;
- Refatorar o modelo regularmente. A arquitetura de software deve ser continuamente revisada e refatorada para garantir que o modelo de domínio permaneça alinhado com as necessidades do negócio e com as melhores práticas de design.

Uma possibilidade que já adotei de refatoração, é alocar um percentual de Story Points ou de Horas Úteis a cada iteração para refatoração, perguntando à equipe qual o ponto mais esquisito do sistema que poderia ser refatorado. Isso pode ser vendido aos stakeholders como um P&D. Mais em [[Justificando as Horas Refatorando Código]].