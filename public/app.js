document.addEventListener('DOMContentLoaded', function() {
    // Carregar a blockchain ao iniciar
    fetchBlockchain();
    fetchPendingTransactions();

    // Formulário de transação
    document.getElementById('transaction-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const from = document.getElementById('from').value;
        const to = document.getElementById('to').value;
        const amount = document.getElementById('amount').value;
        
        createTransaction(from, to, amount);
    });

    // Formulário de mineração
    document.getElementById('mine-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const minerAddress = document.getElementById('minerAddress').value;
        mineTransactions(minerAddress);
    });

    // Formulário de verificação de saldo
    document.getElementById('balance-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const address = document.getElementById('balanceAddress').value;
        checkBalance(address);
    });

    // Botões de atualização
    document.getElementById('refresh-pending').addEventListener('click', fetchPendingTransactions);
    document.getElementById('refresh-blockchain').addEventListener('click', fetchBlockchain);
    document.getElementById('validate-chain').addEventListener('click', validateBlockchain);
});

// Função para criar uma nova transação
async function createTransaction(from, to, amount) {
    try {
        showLoading('Enviando transação...');
        
        const response = await fetch('/api/transaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ from, to, amount })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('Sucesso', 'Transação criada com sucesso!', 'success');
            fetchPendingTransactions();
            
            // Limpar o formulário
            document.getElementById('transaction-form').reset();
        } else {
            showToast('Erro', data.message, 'danger');
        }
        
        hideLoading();
    } catch (error) {
        console.error('Erro ao criar transação:', error);
        showToast('Erro', 'Erro ao criar transação. Verifique o console para mais detalhes.', 'danger');
        hideLoading();
    }
}

// Função para minerar transações pendentes
async function mineTransactions(minerAddress) {
    try {
        const miningResult = document.getElementById('mining-result');
        miningResult.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas fa-cog mining-animation me-2"></i>
                <span>Minerando... Por favor, aguarde.</span>
            </div>
        `;
        miningResult.classList.remove('d-none', 'alert-success', 'alert-danger');
        miningResult.classList.add('alert', 'alert-info');
        
        const response = await fetch('/api/mine', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ minerAddress })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            miningResult.innerHTML = `
                <i class="fas fa-check-circle me-2"></i>
                <div>
                    <strong>${data.message}</strong>
                    <p class="mb-0">${data.reward}</p>
                </div>
            `;
            miningResult.classList.remove('alert-info', 'alert-danger');
            miningResult.classList.add('alert-success');
            
            // Atualizar a blockchain e as transações pendentes
            fetchBlockchain();
            fetchPendingTransactions();
            
            showToast('Sucesso', 'Bloco minerado com sucesso!', 'success');
        } else {
            miningResult.innerHTML = `
                <i class="fas fa-exclamation-circle me-2"></i>
                <span>Erro: ${data.message}</span>
            `;
            miningResult.classList.remove('alert-info', 'alert-success');
            miningResult.classList.add('alert-danger');
            
            showToast('Erro', data.message, 'danger');
        }
    } catch (error) {
        console.error('Erro ao minerar transações:', error);
        const miningResult = document.getElementById('mining-result');
        miningResult.innerHTML = `
            <i class="fas fa-exclamation-circle me-2"></i>
            <span>Erro ao minerar transações. Verifique o console para mais detalhes.</span>
        `;
        miningResult.classList.remove('d-none', 'alert-info', 'alert-success');
        miningResult.classList.add('alert', 'alert-danger');
        
        showToast('Erro', 'Erro ao minerar transações', 'danger');
    }
}

// Função para verificar o saldo de um endereço
async function checkBalance(address) {
    try {
        // Mostrar indicador de carregamento
        const balanceResult = document.getElementById('balance-result');
        balanceResult.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas fa-spinner fa-spin me-2"></i>
                <span>Verificando saldo...</span>
            </div>
        `;
        // Garantir que o elemento esteja visível
        balanceResult.classList.remove('d-none');
        balanceResult.classList.add('alert', 'alert-info');
        
        const response = await fetch(`/api/balance/${address}`);
        const data = await response.json();
        
        if (response.ok) {
            balanceResult.innerHTML = `
                <i class="fas fa-wallet me-2"></i>
                <div>
                    <p class="mb-1"><strong>Endereço:</strong> ${data.address}</p>
                    <p class="mb-0"><strong>Saldo:</strong> ${data.balance} moedas</p>
                </div>
            `;
            balanceResult.classList.remove('alert-danger', 'd-none');
            balanceResult.classList.add('alert', 'alert-info');
            
            showToast('Sucesso', `Saldo de ${data.address}: ${data.balance} moedas`, 'success');
        } else {
            balanceResult.innerHTML = `
                <i class="fas fa-exclamation-circle me-2"></i>
                <span>Erro ao verificar saldo.</span>
            `;
            balanceResult.classList.remove('alert-info', 'd-none');
            balanceResult.classList.add('alert', 'alert-danger');
            
            showToast('Erro', 'Erro ao verificar saldo', 'danger');
        }
    } catch (error) {
        console.error('Erro ao verificar saldo:', error);
        const balanceResult = document.getElementById('balance-result');
        balanceResult.innerHTML = `
            <i class="fas fa-exclamation-circle me-2"></i>
            <span>Erro ao verificar saldo. Verifique o console para mais detalhes.</span>
        `;
        balanceResult.classList.remove('alert-info', 'd-none');
        balanceResult.classList.add('alert', 'alert-danger');
        
        showToast('Erro', 'Erro ao verificar saldo', 'danger');
    }
}

// Função para buscar e exibir a blockchain
async function fetchBlockchain() {
    try {
        showLoading('Carregando blockchain...');
        
        const response = await fetch('/api/blockchain');
        const blockchain = await response.json();
        
        const blockchainContainer = document.getElementById('blockchain');
        
        if (blockchain.length === 0) {
            blockchainContainer.innerHTML = '<p class="text-muted">Blockchain vazia.</p>';
            hideLoading();
            return;
        }
        
        let html = '';
        
        blockchain.forEach((block, index) => {
            html += `
                <div class="block">
                    <div class="block-header d-flex justify-content-between align-items-center">
                        <span><i class="fas fa-cube me-2"></i>Bloco #${block.index}</span>
                        <small class="text-muted">${new Date(block.timestamp).toLocaleString()}</small>
                    </div>
                    <div class="row g-3 mb-3">
                        <div class="col-md-6">
                            <p class="mb-1"><strong>Hash:</strong></p>
                            <div class="hash-text">${block.hash}</div>
                        </div>
                        <div class="col-md-6">
                            <p class="mb-1"><strong>Hash Anterior:</strong></p>
                            <div class="hash-text">${block.previousHash}</div>
                        </div>
                    </div>
                    <p><strong>Nonce:</strong> ${block.nonce}</p>
                    <p><strong>Transações:</strong></p>
                    <div class="transactions">
            `;
            
            if (Array.isArray(block.data)) {
                if (block.data.length === 0) {
                    html += `<p class="text-muted">Nenhuma transação neste bloco.</p>`;
                } else {
                    block.data.forEach(transaction => {
                        html += `
                            <div class="transaction">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <span><i class="fas fa-exchange-alt me-2"></i>Transação</span>
                                    <span class="badge bg-primary">${transaction.amount} moedas</span>
                                </div>
                                <p class="mb-1"><strong>De:</strong> ${transaction.from}</p>
                                <p class="mb-0"><strong>Para:</strong> ${transaction.to}</p>
                            </div>
                        `;
                    });
                }
            } else {
                html += `<p>${JSON.stringify(block.data)}</p>`;
            }
            
            html += `
                    </div>
                </div>
            `;
        });
        
        blockchainContainer.innerHTML = html;
        hideLoading();
    } catch (error) {
        console.error('Erro ao buscar blockchain:', error);
        document.getElementById('blockchain').innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-circle me-2"></i>
                Erro ao buscar blockchain. Verifique o console para mais detalhes.
            </div>
        `;
        hideLoading();
        showToast('Erro', 'Erro ao buscar blockchain', 'danger');
    }
}

// Função para buscar e exibir transações pendentes
async function fetchPendingTransactions() {
    try {
        showLoading('Carregando transações pendentes...');
        
        const response = await fetch('/api/pending-transactions');
        const transactions = await response.json();
        
        const pendingContainer = document.getElementById('pending-transactions');
        
        if (transactions.length === 0) {
            pendingContainer.innerHTML = '<p class="text-muted">Nenhuma transação pendente.</p>';
            hideLoading();
            return;
        }
        
        let html = '';
        
        transactions.forEach(transaction => {
            html += `
                <div class="transaction">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span><i class="fas fa-exchange-alt me-2"></i>Transação</span>
                        <span class="badge bg-primary">${transaction.amount} moedas</span>
                    </div>
                    <p class="mb-1"><strong>De:</strong> ${transaction.from}</p>
                    <p class="mb-0"><strong>Para:</strong> ${transaction.to}</p>
                </div>
            `;
        });
        
        pendingContainer.innerHTML = html;
        hideLoading();
    } catch (error) {
        console.error('Erro ao buscar transações pendentes:', error);
        document.getElementById('pending-transactions').innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-circle me-2"></i>
                Erro ao buscar transações pendentes. Verifique o console para mais detalhes.
            </div>
        `;
        hideLoading();
        showToast('Erro', 'Erro ao buscar transações pendentes', 'danger');
    }
}

// Função para validar a blockchain
async function validateBlockchain() {
    try {
        showLoading('Validando blockchain...');
        
        const response = await fetch('/api/validate');
        const data = await response.json();
        
        const validationResult = document.getElementById('validation-result');
        
        if (data.valid) {
            validationResult.innerHTML = `
                <i class="fas fa-check-circle me-2"></i>
                <span>A blockchain é válida!</span>
            `;
            validationResult.classList.remove('d-none', 'alert-danger');
            validationResult.classList.add('alert', 'alert-success');
            
            showToast('Validação', 'A blockchain é válida!', 'success');
        } else {
            validationResult.innerHTML = `
                <i class="fas fa-exclamation-triangle me-2"></i>
                <span>A blockchain NÃO é válida!</span>
            `;
            validationResult.classList.remove('d-none', 'alert-success');
            validationResult.classList.add('alert', 'alert-danger');
            
            showToast('Validação', 'A blockchain NÃO é válida!', 'danger');
        }
        
        hideLoading();
    } catch (error) {
        console.error('Erro ao validar blockchain:', error);
        const validationResult = document.getElementById('validation-result');
        validationResult.innerHTML = `
            <i class="fas fa-exclamation-circle me-2"></i>
            <span>Erro ao validar blockchain. Verifique o console para mais detalhes.</span>
        `;
        validationResult.classList.remove('d-none', 'alert-success');
        validationResult.classList.add('alert', 'alert-danger');
        
        hideLoading();
        showToast('Erro', 'Erro ao validar blockchain', 'danger');
    }
}

// Funções auxiliares para UI
function showLoading(message = 'Carregando...') {
    console.log(message);
    // Poderia implementar um spinner global aqui
}

function hideLoading() {
    // Implementação para esconder o spinner
}

// Função para exibir toast de notificação
function showToast(title, message, type = 'info') {
    // Criar elemento toast
    const toastId = 'toast-' + Date.now();
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.setAttribute('id', toastId);
    
    // Conteúdo do toast
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <strong>${title}:</strong> ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    // Verificar se o container de toasts existe, senão criar
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        toastContainer.setAttribute('id', 'toast-container');
        document.body.appendChild(toastContainer);
    }
    
    // Adicionar toast ao container
    toastContainer.appendChild(toast);
    
    // Inicializar e mostrar o toast usando Bootstrap
    try {
        const bsToast = new bootstrap.Toast(toast, {
            autohide: true,
            delay: 5000
        });
        bsToast.show();
        
        // Remover o toast do DOM após ser escondido
        toast.addEventListener('hidden.bs.toast', function() {
            toast.remove();
        });
    } catch (error) {
        console.error('Erro ao mostrar toast:', error);
        // Fallback se o Bootstrap não estiver disponível
        setTimeout(() => {
            toast.remove();
        }, 5000);
    }
}
