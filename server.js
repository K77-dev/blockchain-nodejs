const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { Blockchain } = require('./blockchain');

const app = express();
const PORT = 3000;

// Inicializa a blockchain
const minhaCriptomoeda = new Blockchain();

// Configuração do Express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Rota para a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API para obter toda a blockchain
app.get('/api/blockchain', (req, res) => {
    res.json(minhaCriptomoeda.chain);
});

// API para obter transações pendentes
app.get('/api/pending-transactions', (req, res) => {
    res.json(minhaCriptomoeda.pendingTransactions);
});

// API para criar uma nova transação
app.post('/api/transaction', (req, res) => {
    const { from, to, amount } = req.body;
    
    if (!from || !to || !amount) {
        return res.status(400).json({ message: 'Por favor, forneça remetente, destinatário e valor' });
    }
    
    const transaction = {
        from,
        to,
        amount: parseFloat(amount)
    };
    
    minhaCriptomoeda.createTransaction(transaction);
    res.json({ message: 'Transação adicionada com sucesso', transaction });
});

// API para minerar transações pendentes
app.post('/api/mine', (req, res) => {
    const { minerAddress } = req.body;
    
    if (!minerAddress) {
        return res.status(400).json({ message: 'Por favor, forneça um endereço de minerador' });
    }
    
    minhaCriptomoeda.minePendingTransactions(minerAddress);
    res.json({ 
        message: 'Bloco minerado com sucesso!',
        reward: `${minhaCriptomoeda.miningReward} moedas foram enviadas para ${minerAddress}`
    });
});

// API para verificar saldo
app.get('/api/balance/:address', (req, res) => {
    const address = req.params.address;
    const balance = minhaCriptomoeda.getBalanceOfAddress(address);
    res.json({ address, balance });
});

// API para verificar a validade da blockchain
app.get('/api/validate', (req, res) => {
    const isValid = minhaCriptomoeda.isChainValid();
    res.json({ valid: isValid });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
