# Blockchain Simples em Node.js com Bootstrap

Este é um projeto educacional que implementa uma blockchain simples com interface de usuário moderna usando Node.js, Express, Bootstrap 5 e JavaScript. O objetivo é demonstrar os conceitos fundamentais de blockchain de forma prática e interativa.

## Estrutura do Projeto

O projeto está organizado da seguinte forma:

- `blockchain.js`: Contém as classes principais da blockchain
- `server.js`: Servidor Express que fornece a API para interagir com a blockchain
- `public/`: Pasta com os arquivos da interface de usuário
  - `index.html`: Estrutura da página web com Bootstrap
  - `styles.css`: Estilos personalizados complementares ao Bootstrap
  - `app.js`: Lógica de interação com a API e manipulação da interface

## Conceitos Implementados

Este projeto implementa os seguintes conceitos de blockchain:

1. **Blocos**: Unidades básicas da blockchain, contendo índice, timestamp, dados, hash anterior e hash próprio
2. **Mineração**: Processo de validação de blocos através de proof-of-work
3. **Transações**: Transferências de valores entre endereços
4. **Validação da Cadeia**: Verificação da integridade da blockchain
5. **Recompensas de Mineração**: Incentivo para mineradores validarem transações

## Como Executar

1. Certifique-se de ter o Node.js instalado
2. Clone ou baixe este repositório
3. Instale as dependências:
   ```
   npm install
   ```
4. Inicie o servidor:
   ```
   node server.js
   ```
5. Acesse a interface no navegador:
   ```
   http://localhost:3000
   ```

## Sequência Lógica de Uso

Para utilizar a aplicação de forma eficiente, siga esta sequência:

1. **Criar transações**:
   - Preencha o formulário "Criar Transação" com o endereço de origem (ex: "Alice"), endereço de destino (ex: "Bob") e o valor a ser transferido
   - Clique em "Enviar Transação"
   - A transação será adicionada à lista de "Transações Pendentes"

2. **Minerar as transações pendentes**:
   - Depois de criar uma ou mais transações, preencha o campo "Endereço do Minerador" com o endereço que receberá a recompensa (ex: "Minerador1")
   - Clique em "Minerar"
   - O processo de mineração criará um novo bloco contendo todas as transações pendentes
   - O minerador receberá automaticamente a recompensa de 100 moedas

3. **Verificar saldos**:
   - Para verificar o saldo de qualquer endereço, preencha o campo "Endereço" na seção "Verificar Saldo"
   - Clique em "Verificar"
   - O saldo atual do endereço será exibido

4. **Visualizar a blockchain**:
   - A seção "Blockchain" mostra todos os blocos da cadeia
   - Cada bloco exibe seu índice, timestamp, hash, hash anterior, nonce e todas as transações incluídas
   - Você pode clicar em "Atualizar" para ver as mudanças após minerar novos blocos

5. **Validar a blockchain**:
   - A qualquer momento, você pode clicar em "Validar" para verificar a integridade da blockchain
   - Se todos os blocos estiverem corretamente encadeados, a blockchain será considerada válida

## Recursos da Interface

A interface de usuário foi desenvolvida com Bootstrap 5 e inclui:

- **Design Responsivo**: Funciona bem em dispositivos móveis e desktop
- **Navegação Intuitiva**: Menu de navegação para acessar rapidamente as diferentes seções
- **Cards Organizados**: Cada funcionalidade está em um card separado para melhor organização
- **Notificações Toast**: Alertas informativos para ações realizadas
- **Ícones Intuitivos**: Uso de Font Awesome para melhorar a experiência visual
- **Animações**: Feedback visual durante operações como mineração
- **Visualização Aprimorada**: Formatação especial para hashes e dados técnicos

## Explicação do Código

### blockchain.js

Este arquivo contém duas classes principais:

#### Classe Block

Representa um bloco na blockchain com as seguintes propriedades:
- `index`: Posição do bloco na cadeia
- `timestamp`: Momento de criação do bloco
- `data`: Dados armazenados no bloco (transações)
- `previousHash`: Hash do bloco anterior
- `hash`: Hash do bloco atual
- `nonce`: Número usado uma única vez para mineração

Métodos principais:
- `calculateHash()`: Calcula o hash do bloco usando SHA256
- `mineBlock(difficulty)`: Realiza o processo de mineração (proof-of-work)

#### Classe Blockchain

Gerencia a cadeia de blocos com as seguintes propriedades:
- `chain`: Array de blocos
- `difficulty`: Dificuldade de mineração
- `pendingTransactions`: Transações aguardando para serem incluídas em um bloco
- `miningReward`: Recompensa por minerar um bloco

Métodos principais:
- `createGenesisBlock()`: Cria o bloco inicial da cadeia
- `getLatestBlock()`: Retorna o último bloco da cadeia
- `minePendingTransactions(miningRewardAddress)`: Minera as transações pendentes
- `createTransaction(transaction)`: Adiciona uma nova transação à lista de pendentes
- `getBalanceOfAddress(address)`: Calcula o saldo de um endereço
- `isChainValid()`: Verifica a integridade da blockchain

### server.js

Este arquivo configura o servidor Express e define as rotas da API:

- `GET /api/blockchain`: Retorna toda a blockchain
- `GET /api/pending-transactions`: Retorna as transações pendentes
- `POST /api/transaction`: Cria uma nova transação
- `POST /api/mine`: Minera as transações pendentes
- `GET /api/balance/:address`: Verifica o saldo de um endereço
- `GET /api/validate`: Verifica a validade da blockchain

### app.js

Este arquivo contém a lógica do frontend para interagir com a API:

- Funções para criar transações
- Funções para minerar blocos
- Funções para verificar saldos
- Funções para exibir a blockchain e transações pendentes
- Funções para validar a blockchain
- Sistema de notificações toast
- Manipulação de estados de carregamento

## Limitações e Considerações Educacionais

Este projeto é uma simplificação para fins educacionais e possui algumas limitações:

1. Não implementa criptografia de chave pública/privada para assinatura de transações
2. Não possui mecanismos de consenso distribuído
3. Não implementa uma rede P2P real
4. A dificuldade de mineração é fixa e baixa para facilitar a demonstração

## Próximos Passos para Aprendizado

Para continuar seu aprendizado sobre blockchain, considere explorar:

1. Implementação de assinaturas digitais para transações
2. Criação de uma rede P2P real
3. Implementação de diferentes algoritmos de consenso
4. Desenvolvimento de contratos inteligentes simples

## Recursos Adicionais

- [Bitcoin: A Peer-to-Peer Electronic Cash System](https://bitcoin.org/bitcoin.pdf) - O paper original de Satoshi Nakamoto
- [Ethereum Whitepaper](https://ethereum.org/en/whitepaper/) - Introdução ao Ethereum e contratos inteligentes
- [Hyperledger](https://www.hyperledger.org/) - Projetos de blockchain para uso empresarial
- [Bootstrap Documentation](https://getbootstrap.com/docs/) - Documentação oficial do Bootstrap
