# Integração da API do Trello

Este projeto demonstra como configurar e utilizar a API do Trello usando o Insomnia para realizar chamadas de API, como listar quadros e criar cartões.

## Sumário

1. [Configuração Inicial](#configuração-inicial)
2. [Instale o Insomnia](#instale-o-insomnia-recomendado)
3. [Importe o Workspace no Insomnia](#importe-o-workspace-no-insomnia)
4. [Configuração das Variáveis de Ambiente](#configuração-das-variáveis-de-ambiente)
5. [Uso da API do Trello no Insomnia](#uso-da-api-do-trello-no-insomnia)
6. [Uso da Documentação da API do Trello](#uso-da-documentação-da-api-do-trello)

## Configuração Inicial

Antes de começar, certifique-se que você tenha suas credenciais da API do Trello prontas:

- **Checar Integrações Existentes**: Consulte [neste link](https://trello.com/power-ups/admin) para verificar as integrações disponíveis.  
  ![Integrações do Trello](IntegracoesTrello.png)
- **Chave da API do Trello**: Consulte e obtenha sua chave API [neste link](https://trello.com/power-ups/65fa2a27ff2bb114d5d3138e/edit/api-key).  
  ![Consultar Chave de API](ChaveAPI.png)
- **Gerar um Token**: Gere um novo token clicando na opção de token (destacada em amarelo).  
  ![Gerar Novo Token](GerarToken.png)

## Instale o Insomnia

Se ainda não tem o Insomnia instalado, faça o download e a instalação a partir do site oficial do [Insomnia](https://insomnia.rest/download).

## Importe o Workspace no Insomnia

### Baixe o Arquivo

Baixe o arquivo `Collection_Requests_Trello` disponível neste repositório.

### Importe o Arquivo

1. No Insomnia, vá para **Create > Import > Choose a file**.
2. Selecione o arquivo `Collection_Requests_Trello` que você baixou.

## Configuração das Variáveis de Ambiente

O arquivo já inclui variáveis de ambiente configuradas para o e-mail `appverdecard@gmail.com`. Para modificar ou adicionar novas variáveis, siga os passos abaixo:

1. No Insomnia, acesse **Base Environment** e clique no ícone de engrenagem no canto superior direito.
2. Atualize a Chave API e/ou Token conforme necessário. Veja a sintaxe abaixo:
   ![Credenciais API](credenciaisAPI.png)

## Uso da API do Trello no Insomnia

Após importar o workspace e configurar as variáveis de ambiente, você poderá utilizar as chamadas de API pré-configuradas no arquivo importado:

1. **Boards**
   - **Get lists on a board**: Obtém todas as listas em um quadro específico.

2. **Lists**
   - **Get cards in a list**: Obtém todos os cartões em uma lista específica.

3. **Cards**
   - **Get Actions on a Card**: Obtém todas as ações realizadas em um cartão específico.
   - **Get Members of a Card**: Obtém todos os membros atribuídos a um cartão específico.
   - **Get CheckLists on a Card**: Obtém todas as listas de verificação associadas a um cartão específico.
   - **Create a new Card**: Cria um novo cartão em uma lista especificada em um quadro do Trello.
   - **Create a checklist**: Cria uma lista de verificação em um cartão existente.
   - **Create checkitem on checklist**: Adiciona um novo item de verificação a uma lista de verificação existente em um cartão.

## Uso da Documentação da API do Trello

Todos os requests possíveis estão descritos na documentação da [API do Trello](https://developer.atlassian.com/cloud/trello/rest/api-group-actions/#api-group-actions).

### Criar Novos Requests

1. Acesse [a documentação](https://developer.atlassian.com/cloud/trello/rest/api-group-actions/#api-group-actions).
2. Navegue pelo menu lateral para encontrar os requests disponíveis.
3. Copie o Curl (indicada pela seta amarela na imagem abaixo):
   ![URL Curl](docAPITrello.png)
4. No Insomnia, crie um novo HTTP Request (**Create > HTTP Request** ou **CTRL + N** no Windows) e cole o Curl copiado no campo do Insomnia indicado pela seta amarela.
   ![Curl no Insomnia](URL.png)
5. Preencha os parâmetros, incluindo a chave API (`key`) e o Token (`token`). Para esses, digite `_.` e uma caixa de seleção com as variáveis de ambiente configuradas aparecerá.

