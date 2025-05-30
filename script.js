/* eslint-disable no-unused-vars */
// script.js
document.addEventListener('DOMContentLoaded', function () {
    // Seletores de Elementos Globais
    const menuItems = document.querySelectorAll('#menuContainer .menu-item');
    const mainContentTitle = document.getElementById('mainContentTitle');
    const contentGrid = document.getElementById('contentGrid');
    const mainActionButton = document.getElementById('mainActionButton');
    const toastContainer = document.getElementById('toastContainer'); // Container para toasts

    // Seletores de Elementos do Modal de Nova Venda
    const novaVendaModal = document.getElementById('novaVendaModal');
    const closeNovaVendaModal = document.getElementById('closeNovaVendaModal');
    const selectClienteMesa = document.getElementById('selectClienteMesa');
    const selectProdutoVenda = document.getElementById('selectProdutoVenda');
    const inputQuantidadeVenda = document.getElementById('inputQuantidadeVenda');
    const adicionarItemVendaButton = document.getElementById('adicionarItemVendaButton');
    const itensVendaContainer = document.getElementById('itensVendaContainer');
    const totalVendaSpan = document.getElementById('totalVenda');
    const cancelarVendaButton = document.getElementById('cancelarVendaButton');
    const finalizarVendaButton = document.getElementById('finalizarVendaButton');

    // Seletores de Elementos do Modal de Adicionar Produto
    const adicionarProdutoModal = document.getElementById('adicionarProdutoModal');
    const closeAdicionarProdutoModal = document.getElementById('closeAdicionarProdutoModal');
    const inputNomeProduto = document.getElementById('inputNomeProduto');
    const inputQuantidadeProduto = document.getElementById('inputQuantidadeProduto');
    const inputPrecoProduto = document.getElementById('inputPrecoProduto');
    const selectCategoriaProduto = document.getElementById('selectCategoriaProduto');
    const inputImgPlaceholderProduto = document.getElementById('inputImgPlaceholderProduto');
    const inputCorPlaceholderProduto = document.getElementById('inputCorPlaceholderProduto');
    const cancelarAdicionarProdutoButton = document.getElementById('cancelarAdicionarProdutoButton');
    const salvarNovoProdutoButton = document.getElementById('salvarNovoProdutoButton');

    // Estado da Aplicação
    let currentVendaItems = []; // Itens da venda atualmente em construção no modal
    let currentVendaTotal = 0;  // Total da venda atualmente em construção
    let activeSection = "Produtos"; // Seção ativa inicialmente

    // --- DADOS DE EXEMPLO (Mock Data) ---
    // Em uma aplicação real, estes dados viriam do Firebase ou outro backend.
    let stockData = {
        "Produtos": [
            { id: "p1", name: "Café Espresso Duplo", quantity: 98, price: 5.00, category: "Bebidas", imgPlaceholder: "Café", color: "654321" },
            { id: "p2", name: "Pão de Queijo Tradicional", quantity: 199, price: 3.50, category: "Salgados", imgPlaceholder: "PãoQueijo", color: "f0e68c" },
            { id: "p3", name: "Suco de Laranja Natural 300ml", quantity: 49, price: 7.00, category: "Bebidas", imgPlaceholder: "SucoLaranja", color: "ffa500" },
            { id: "p4", name: "Bolo de Chocolate (fatia generosa)", quantity: 30, price: 8.00, category: "Doces", imgPlaceholder: "BoloChoc", color: "8b4513" },
            { id: "p5", name: "Água Mineral sem Gás 500ml", quantity: 150, price: 3.00, category: "Bebidas", imgPlaceholder: "Água", color: "add8e6" }
        ],
        "Categorias": [
            { id: "c1", name: "Bebidas Quentes e Frias", description: "Cafés, chás, sucos, refrigerantes, água.", imgPlaceholder: "Bebidas", color: "7ca6c4" },
            { id: "c2", name: "Salgados Assados e Fritos", description: "Pães de queijo, coxinhas, empadas, croissants.", imgPlaceholder: "Salgados", color: "a288b7" },
            { id: "c3", name: "Doces e Sobremesas", description: "Bolos, tortas, brigadeiros, mousses.", imgPlaceholder: "Doces", color: "88b7a2" },
        ],
        "ClientesMesas": [
            { id: "cm1", name: "Mesa 01", status: "Livre", currentOrderValue: 0, imgPlaceholder: "Mesa 1", color: "90ee90" },
            { id: "cm2", name: "Mesa 02", status: "Ocupada", currentOrderValue: 0, imgPlaceholder: "Mesa 2", color: "lightcoral" }, // Zerado após venda v1
            { id: "cm3", name: "Cliente VIP Ana Clara", status: "Ativo", currentOrderValue: 0, imgPlaceholder: "Ana C.", color: "dda0dd" }, // Zerado após venda v2
            { id: "cm4", name: "Mesa 03", status: "Livre", currentOrderValue: 0, imgPlaceholder: "Mesa 3", color: "90ee90" },
            { id: "cm5", name: "Balcão 01", status: "Livre", currentOrderValue: 0, imgPlaceholder: "Balcão", color: "b0e0e6" },
        ],
        "Vendas": [
            { id: "v1", clienteMesaId: "cm2", clienteMesaName: "Mesa 02", items: [{ productId: "p1", productName: "Café Espresso", quantity: 2, unitPrice: 5.00, totalItemPrice: 10.00 }, { productId: "p2", productName: "Pão de Queijo", quantity: 1, unitPrice: 3.50, totalItemPrice: 3.50 }], grandTotal: 13.50, statusVenda: "Paga", timestamp: new Date(Date.now() - 3600000).toLocaleString('pt-BR') },
            { id: "v2", clienteMesaId: "cm3", clienteMesaName: "Cliente VIP Ana", items: [{ productId: "p3", productName: "Suco de Laranja", quantity: 1, unitPrice: 7.00, totalItemPrice: 7.00 }], grandTotal: 7.00, statusVenda: "Paga", timestamp: new Date(Date.now() - 7200000).toLocaleString('pt-BR') },
        ],
        "Configurações": [] // Pode conter objetos de configuração, ex: { id: 'cfg1', key: 'currency', value: 'BRL' }
    };
    // FIM DOS DADOS DE EXEMPLO

    // --- Funções Utilitárias ---

    /**
     * Exibe uma notificação toast.
     * @param {string} message - A mensagem a ser exibida.
     * @param {string} type - O tipo de toast (success, error, info, warning).
     * @param {number} duration - Duração em milissegundos para o toast desaparecer (0 para manual).
     */
    function showToast(message, type = 'info', duration = 3000) {
        if (!toastContainer) return; // Não faz nada se o container não existir

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const messageSpan = document.createElement('span');
        messageSpan.textContent = message;
        toast.appendChild(messageSpan);

        const closeButton = document.createElement('button');
        closeButton.innerHTML = '&times;';
        closeButton.className = 'toast-close-button';
        closeButton.onclick = () => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300); // Espera a animação de saída
        };
        toast.appendChild(closeButton);

        toastContainer.appendChild(toast);

        // Força reflow para garantir que a animação de entrada funcione
        // eslint-disable-next-line no-unused-expressions
        toast.offsetHeight;

        toast.classList.add('show');

        if (duration > 0) {
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300); // Espera a animação de saída
            }, duration);
        }
    }

    /**
     * Atualiza o conteúdo principal da página com base na seção selecionada.
     * @param {string} sectionTitle - O título da seção a ser exibida.
     */
    function updateContent(sectionTitle) {
        activeSection = sectionTitle;
        mainContentTitle.textContent = sectionTitle;
        contentGrid.innerHTML = ''; // Limpa a grade de conteúdo
        mainActionButton.style.display = 'block'; // Mostra o botão de ação principal por padrão

        // Lógica para definir o texto e a ação do botão principal com base na seção
        if (sectionTitle === "Produtos") {
            mainActionButton.innerHTML = '<span class="truncate">Adicionar Produto</span>';
            mainActionButton.onclick = openAdicionarProdutoModal;
            renderCards(stockData.Produtos, sectionTitle);
        } else if (sectionTitle === "Categorias") {
            mainActionButton.innerHTML = '<span class="truncate">Adicionar Categoria</span>';
            mainActionButton.onclick = () => {
                // TODO: Implementar modal/formulário para adicionar categoria
                showToast('Implementar formulário para adicionar nova categoria (nome, descrição). Salvar no Firebase e atualizar.', 'info');
            };
            renderCards(stockData.Categorias, sectionTitle);
        } else if (sectionTitle === "Clientes/Mesas") {
            mainActionButton.innerHTML = '<span class="truncate">Adicionar Cliente/Mesa</span>';
            mainActionButton.onclick = () => {
                // TODO: Implementar modal/formulário para adicionar cliente/mesa
                showToast('Implementar formulário para adicionar novo cliente ou mesa (nome/número, status inicial). Salvar no Firebase e atualizar.', 'info');
            };
            renderCards(stockData.ClientesMesas, sectionTitle);
        } else if (sectionTitle === "Caixa") {
            mainActionButton.innerHTML = '<span class="truncate">Nova Venda</span>';
            mainActionButton.onclick = openNovaVendaModal; // Abre o modal de nova venda
            renderVendas(); // Renderiza a lista de vendas existentes
        } else if (sectionTitle === "Configurações") {
            mainActionButton.style.display = 'none'; // Oculta o botão principal na seção de Configurações
            renderConfiguracoes();
        }
    }

    /**
     * Renderiza os cards para as seções de Produtos, Categorias e Clientes/Mesas.
     * @param {Array<Object>} items - Array de itens a serem renderizados.
     * @param {string} sectionTitle - O título da seção (usado para customizar detalhes do card).
     */
    function renderCards(items, sectionTitle) {
        if (!items || items.length === 0) {
            contentGrid.innerHTML = `<p class="col-span-full text-custom-text-secondary p-8 text-center">Nenhum item encontrado para "${sectionTitle}".</p>`;
            return;
        }
        items.forEach(item => {
            const imageUrl = `https://placehold.co/300x300/${item.color || 'CCCCCC'}/FFFFFF?text=${encodeURIComponent(item.imgPlaceholder || item.name)}&font=roboto`;
            let cardDetails = ''; // Detalhes específicos de cada tipo de card

            if (sectionTitle === "Produtos") {
                cardDetails = `
                    <p class="text-custom-text-secondary text-sm font-normal leading-normal">Qtde: ${item.quantity} | Preço: R$ ${item.price ? item.price.toFixed(2).replace('.', ',') : 'N/A'}</p>
                    <p class="text-custom-text-secondary text-xs font-normal leading-normal truncate" title="Categoria: ${item.category}">Cat: ${item.category}</p>`;
            } else if (sectionTitle === "Categorias") {
                cardDetails = `<p class="text-custom-text-secondary text-sm font-normal leading-normal truncate" title="${item.description}">${item.description}</p>`;
            } else if (sectionTitle === "Clientes/Mesas") {
                const statusColor = item.status === 'Livre' ? '#90ee90' : (item.status === 'Ocupada' ? 'lightcoral' : '#dda0dd');
                cardDetails = `
                    <p class="text-custom-text-secondary text-sm font-normal leading-normal">Status: <span style="color:${statusColor}; font-weight: 500;">${item.status}</span></p>
                    <p class="text-custom-text-secondary text-xs font-normal leading-normal">Consumo: R$ ${item.currentOrderValue ? item.currentOrderValue.toFixed(2).replace('.', ',') : '0,00'}</p>`;
            }

            const cardHTML = `
                <div class="flex flex-col gap-3 pb-3 bg-custom-nav-item-active p-3 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer" data-id="${item.id}">
                    <div class="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
                         style="background-image: url('${imageUrl}');"
                         onerror="this.style.backgroundImage='url(\'https://placehold.co/300x300/CCCCCC/FFFFFF?text=Erro&font=roboto\')'">
                    </div>
                    <div>
                        <p class="text-custom-text-primary text-base font-medium leading-normal truncate" title="${item.name}">${item.name}</p>
                        ${cardDetails}
                    </div>
                    </div>`;
            contentGrid.innerHTML += cardHTML;
        });
    }

    /**
     * Renderiza a lista de vendas na seção "Caixa".
     */
    function renderVendas() {
        contentGrid.innerHTML = ''; // Limpa a grade para a visualização do caixa
        if (stockData.Vendas.length === 0) {
            contentGrid.innerHTML = `<p class="col-span-full text-custom-text-secondary p-8 text-center">Nenhuma venda registrada.</p>`;
            return;
        }

        // Ordena as vendas da mais recente para a mais antiga antes de renderizar
        stockData.Vendas.slice().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).forEach(venda => {
            const itemsResumo = venda.items.map(it => `${it.quantity}x ${it.productName}`).join(', ');
            const statusColor = venda.statusVenda === 'Paga' ? 'text-custom-button-green' : (venda.statusVenda === 'Pendente' ? 'text-yellow-400' : 'text-custom-button-red');

            const vendaCard = `
                <div class="col-span-full bg-custom-nav-item-active p-4 rounded-lg shadow-md mb-3">
                    <div class="flex justify-between items-center mb-2">
                        <p class="text-custom-text-primary font-semibold">Venda #${venda.id} - ${venda.clienteMesaName}</p>
                        <p class="${statusColor} font-semibold">${venda.statusVenda}</p>
                    </div>
                    <p class="text-custom-text-secondary text-sm">Itens: <span class="font-light">${itemsResumo}</span></p>
                    <p class="text-custom-text-secondary text-sm">Total: <span class="font-semibold">R$ ${venda.grandTotal.toFixed(2).replace('.', ',')}</span></p>
                    <p class="text-custom-text-secondary text-xs mt-1">Data: ${venda.timestamp}</p>
                    ${venda.statusVenda === 'Pendente' ?
                    `<button class="mt-3 bg-custom-button-green hover:bg-green-700 text-white py-1.5 px-3 rounded text-sm transition-colors" onclick="registrarPagamento('${venda.id}')">Registrar Pagamento</button>` :
                    (venda.statusVenda === 'Paga' ? `<button class="mt-3 bg-blue-500 hover:bg-blue-600 text-white py-1.5 px-3 rounded text-sm transition-colors" onclick="alert('Implementar visualização de detalhes da venda ${venda.id} ou reimpressão de recibo.')">Detalhes/Recibo</button>` : '')
                }
                    </div>
            `;
            contentGrid.innerHTML += vendaCard;
        });
    }

    /**
     * Renderiza a seção de Configurações.
     */
    function renderConfiguracoes() {
        // MELHORIA: Carregar configurações do Firebase e permitir edição.
        contentGrid.innerHTML = `
            <div class="col-span-full text-custom-text-secondary p-4 sm:p-8 text-center">
                <p class="text-xl mb-4 text-custom-text-primary">Configurações do Sistema</p>
                <p class="mb-6">Ajustes da aplicação, preferências de moeda, alertas de estoque, etc.</p>
                <div class="mt-8 text-left max-w-md mx-auto bg-custom-nav-item-active p-6 rounded-lg shadow-lg">
                    <div class="mb-4">
                        <label for="currency-select" class="block text-sm font-medium text-custom-text-primary mb-1">Moeda Padrão:</label>
                        <select id="currency-select" class="bg-gray-700 border border-gray-600 text-custom-text-primary text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                            <option selected>Real (BRL)</option>
                            <option>Dólar (USD)</option>
                            <option>Euro (EUR)</option>
                        </select>
                    </div>
                    <div class="mb-6">
                        <label for="low-stock-alert" class="block text-sm font-medium text-custom-text-primary mb-1">Alerta de Estoque Baixo (Unidades):</label>
                        <input type="number" id="low-stock-alert" value="10" min="0" class="bg-gray-700 border border-gray-600 text-custom-text-primary text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                    </div>
                    <button class="w-full bg-custom-button-bg hover:bg-blue-600 text-white font-bold py-2.5 px-4 rounded-lg transition-colors" onclick="showToast(\'Configurações salvas (simulação). Implementar salvamento no Firebase/localStorage.\', \'info\')">
                        Salvar Configurações
                    </button>
                </div>
            </div>`;
    }

    // --- Lógica do Modal de Adicionar Produto ---

    /**
     * Abre o modal para adicionar um novo produto.
     * Popula o dropdown de categorias.
     */
    function openAdicionarProdutoModal() {
        // Limpar campos do formulário
        inputNomeProduto.value = '';
        inputQuantidadeProduto.value = '1';
        inputPrecoProduto.value = '';
        selectCategoriaProduto.value = '';
        inputImgPlaceholderProduto.value = '';
        inputCorPlaceholderProduto.value = '';

        // Popular select de Categorias
        selectCategoriaProduto.innerHTML = '<option value="">Selecione uma Categoria</option>';
        // Adiciona uma opção para criar nova categoria dinamicamente
        selectCategoriaProduto.innerHTML += '<option value="__nova__">+ Nova Categoria</option>';
        stockData.Categorias.forEach(cat => {
            selectCategoriaProduto.innerHTML += `<option value="${cat.name}">${cat.name}</option>`;
        });

        adicionarProdutoModal.style.display = "block";
    }

    // Event Listeners para fechar o modal de Adicionar Produto
    if (closeAdicionarProdutoModal) { // Verifica se o elemento existe
        closeAdicionarProdutoModal.onclick = function () {
            adicionarProdutoModal.style.display = "none";
        }
    }
    if (cancelarAdicionarProdutoButton) { // Verifica se o elemento existe
        cancelarAdicionarProdutoButton.onclick = function () {
            adicionarProdutoModal.style.display = "none";
        }
    }

    // Fecha o modal de Adicionar Produto se o usuário clicar fora do conteúdo
    window.addEventListener('click', function (event) {
        if (event.target == adicionarProdutoModal) {
            adicionarProdutoModal.style.display = "none";
        }
    });

    /**
     * Salva o novo produto.
     * Simula o salvamento no stockData e atualiza a exibição.
     */
    if (salvarNovoProdutoButton) { // Verifica se o elemento existe
        salvarNovoProdutoButton.onclick = function () {
            const nome = inputNomeProduto.value.trim();
            const quantidade = parseInt(inputQuantidadeProduto.value);
            const preco = parseFloat(inputPrecoProduto.value);
            let categoria = selectCategoriaProduto.value;
            const imgPlaceholder = inputImgPlaceholderProduto.value.trim() || nome.substring(0, 10); // Usa nome se placeholder vazio
            const corPlaceholder = inputCorPlaceholderProduto.value.trim() || 'CCCCCC';

            if (!nome || isNaN(quantidade) || quantidade < 0 || isNaN(preco) || preco < 0 || !categoria) {
                showToast("Preencha todos os campos obrigatórios (Nome, Quantidade, Preço, Categoria) com valores válidos.", "error");
                return;
            }

            // Lógica para lidar com "Nova Categoria"
            if (categoria === '__nova__') {
                const novaCategoriaNome = prompt('Digite o nome da nova categoria:');
                if (novaCategoriaNome && novaCategoriaNome.trim() !== '') {
                    categoria = novaCategoriaNome.trim();
                    // Adicionar nova categoria ao stockData (simulação)
                    const novaCatId = 'c' + (stockData.Categorias.length + Date.now().toString().slice(-3));
                    stockData.Categorias.push({
                        id: novaCatId,
                        name: categoria,
                        description: 'Nova categoria adicionada automaticamente.',
                        imgPlaceholder: categoria.substring(0, 10),
                        color: '808080'
                    });
                    showToast(`Categoria "${categoria}" adicionada.`, "success");
                    // Futuramente, atualizar o select de categorias em outros modais também
                } else {
                    showToast('Nome da nova categoria inválido. Produto não adicionado.', "error");
                    return;
                }
            }

            const novoProduto = {
                id: "p" + (stockData.Produtos.length + Date.now().toString().slice(-4)),
                name: nome,
                quantity: quantidade,
                price: preco,
                category: categoria,
                imgPlaceholder: imgPlaceholder,
                color: corPlaceholder
            };

            stockData.Produtos.push(novoProduto);
            showToast(`Produto "${novoProduto.name}" adicionado com sucesso!`, "success");
            adicionarProdutoModal.style.display = "none";
            updateContent("Produtos"); // Atualiza a visualização para mostrar o novo produto
        }
    }


    // --- Lógica do Modal de Nova Venda ---

    /**
     * Abre o modal para registrar uma nova venda.
     * Popula os dropdowns de clientes/mesas e produtos.
     */
    function openNovaVendaModal() {
        currentVendaItems = []; // Limpa itens da venda anterior
        currentVendaTotal = 0;  // Zera o total
        updateVendaModalDisplay(); // Atualiza a exibição do modal (limpa lista de itens, zera total)

        // Popular select de Clientes/Mesas
        selectClienteMesa.innerHTML = '<option value="">Selecione um Cliente/Mesa</option>';
        stockData.ClientesMesas.forEach(cm => {
            // MELHORIA: Filtrar mesas/clientes que podem receber novos pedidos (ex: não ocupadas pagando)
            if (cm.status !== 'Ocupada Pagando') {
                selectClienteMesa.innerHTML += `<option value="${cm.id}">${cm.name} (${cm.status})</option>`;
            }
        });

        // Popular select de Produtos
        selectProdutoVenda.innerHTML = '<option value="">Selecione um Produto</option>';
        stockData.Produtos.forEach(p => {
            if (p.quantity > 0) { // Só mostra produtos com estoque disponível
                selectProdutoVenda.innerHTML += `<option value="${p.id}" data-price="${p.price}" data-stock="${p.quantity}">${p.name} (R$ ${p.price.toFixed(2).replace('.', ',')}) - Estoque: ${p.quantity}</option>`;
            }
        });
        inputQuantidadeVenda.value = 1; // Reseta a quantidade para 1
        inputQuantidadeVenda.max = ''; // Limpa o maximo anterior
        selectProdutoVenda.value = ''; // Reseta a seleção do produto
        novaVendaModal.style.display = "block"; // Exibe o modal
    }

    // Atualiza o 'max' do input de quantidade quando um produto é selecionado
    selectProdutoVenda.addEventListener('change', function () {
        const selectedOption = this.options[this.selectedIndex];
        const stock = selectedOption.dataset.stock;
        if (stock) {
            inputQuantidadeVenda.max = stock;
            if (parseInt(inputQuantidadeVenda.value) > parseInt(stock)) {
                inputQuantidadeVenda.value = stock; // Ajusta se a quantidade atual for maior que o estoque
            }
        } else {
            inputQuantidadeVenda.max = '';
        }
    });


    // Event Listeners para fechar o modal
    closeNovaVendaModal.onclick = function () {
        novaVendaModal.style.display = "none";
    }
    cancelarVendaButton.onclick = function () {
        novaVendaModal.style.display = "none";
    }
    // Fecha o modal se o usuário clicar fora do conteúdo do modal
    window.onclick = function (event) {
        if (event.target == novaVendaModal) {
            novaVendaModal.style.display = "none";
        }
    }

    /**
     * Adiciona um item à venda atual no modal.
     * Verifica o estoque antes de adicionar.
     */
    adicionarItemVendaButton.onclick = function () {
        const produtoId = selectProdutoVenda.value;
        const quantidade = parseInt(inputQuantidadeVenda.value);

        if (!produtoId || quantidade <= 0) {
            showToast("Selecione um produto e informe uma quantidade válida.", "error");
            return;
        }

        const produto = stockData.Produtos.find(p => p.id === produtoId);
        if (!produto) {
            showToast("Produto não encontrado.", "error");
            return;
        }

        const itemExistente = currentVendaItems.find(item => item.productId === produtoId);
        const quantidadeTotalNoCarrinho = (itemExistente ? itemExistente.quantity : 0) + quantidade;

        if (produto.quantity < quantidadeTotalNoCarrinho) {
            showToast(`Estoque insuficiente para ${produto.name}. Disponível: ${produto.quantity}, No carrinho: ${itemExistente ? itemExistente.quantity : 0}, Tentando adicionar: ${quantidade}`, "warning");
            return;
        }

        if (itemExistente) {
            itemExistente.quantity += quantidade;
            itemExistente.totalItemPrice = itemExistente.quantity * itemExistente.unitPrice;
        } else {
            currentVendaItems.push({
                productId: produto.id,
                productName: produto.name,
                quantity: quantidade,
                unitPrice: produto.price,
                totalItemPrice: produto.price * quantidade
            });
        }
        updateVendaModalDisplay(); // Atualiza a lista de itens e o total no modal
    }

    /**
     * Atualiza a exibição dos itens e do total no modal de nova venda.
     */
    function updateVendaModalDisplay() {
        itensVendaContainer.innerHTML = ''; // Limpa a lista de itens
        currentVendaTotal = 0;
        if (currentVendaItems.length === 0) {
            itensVendaContainer.innerHTML = '<p class="text-custom-text-secondary text-sm">Nenhum item adicionado.</p>';
        } else {
            currentVendaItems.forEach((item, index) => {
                itensVendaContainer.innerHTML += `
                    <div class="flex justify-between items-center p-1.5 border-b border-gray-600 text-sm">
                        <div class="flex-grow">
                           <span class="font-medium">${item.quantity}x</span> ${item.productName} 
                           <span class="text-xs text-custom-text-secondary">(R$ ${item.unitPrice.toFixed(2).replace('.', ',')} un.)</span>
                        </div>
                        <span class="font-semibold mx-2">R$ ${item.totalItemPrice.toFixed(2).replace('.', ',')}</span>
                        <button class="text-red-400 hover:text-red-300 ml-2 px-2 py-0.5 rounded hover:bg-gray-600 transition-colors" onclick="removerItemVenda(${index})">&times;</button>
                    </div>`;
                currentVendaTotal += item.totalItemPrice;
            });
        }
        totalVendaSpan.textContent = currentVendaTotal.toFixed(2).replace('.', ',');
    }

    /**
     * Remove um item da venda atual no modal.
     * Exposta globalmente para ser acessível pelo onclick no HTML dinâmico.
     * @param {number} index - O índice do item a ser removido.
     */
    window.removerItemVenda = function (index) {
        currentVendaItems.splice(index, 1); // Remove o item do array
        updateVendaModalDisplay(); // Atualiza a exibição no modal
    }

    /**
     * Finaliza a venda atual.
     * Simula o registro da venda, abate do estoque e atualiza o status da mesa/cliente.
     */
    finalizarVendaButton.onclick = function () {
        const clienteMesaId = selectClienteMesa.value;
        if (!clienteMesaId) {
            showToast("Selecione um cliente/mesa.", "error");
            return;
        }
        if (currentVendaItems.length === 0) {
            showToast("Adicione itens à venda antes de finalizar.", "error");
            return;
        }

        const clienteMesa = stockData.ClientesMesas.find(cm => cm.id === clienteMesaId);
        const novaVenda = {
            id: "v" + (stockData.Vendas.length + Date.now().toString().slice(-4)), // ID mais único para exemplo
            clienteMesaId: clienteMesaId,
            clienteMesaName: clienteMesa ? clienteMesa.name : "Cliente Desconhecido",
            items: JSON.parse(JSON.stringify(currentVendaItems)), // Cópia profunda para evitar referência
            grandTotal: currentVendaTotal,
            statusVenda: "Paga", // Simula pagamento imediato. MELHORIA: Adicionar opções de pagamento e status "Pendente"
            timestamp: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
        };

        // Lógica de Abater do Estoque (Simulação)
        // MELHORIA: Em uma aplicação real, isso seria uma transação no Firebase.
        let possivelAbaterEstoque = true;
        for (const itemVendido of novaVenda.items) {
            const produtoEstoque = stockData.Produtos.find(p => p.id === itemVendido.productId);
            if (produtoEstoque && produtoEstoque.quantity >= itemVendido.quantity) {
                // Apenas simula, o abatimento real ocorre após confirmação
            } else {
                possivelAbaterEstoque = false;
                showToast(`Erro: Estoque insuficiente para ${itemVendido.productName} no momento de finalizar.`, "error");
                break;
            }
        }

        if (possivelAbaterEstoque) {
            novaVenda.items.forEach(itemVendido => {
                const produtoEstoque = stockData.Produtos.find(p => p.id === itemVendido.productId);
                if (produtoEstoque) {
                    produtoEstoque.quantity -= itemVendido.quantity;
                }
            });

            // Atualizar status da mesa/cliente (Simulação)
            if (clienteMesa) {
                clienteMesa.currentOrderValue = 0; // Zera o consumo da mesa/cliente
                // MELHORIA: Mudar status da mesa para "Livre" se aplicável.
                // if (clienteMesa.name.toLowerCase().includes("mesa")) {
                //    clienteMesa.status = "Livre";
                // }
            }

            stockData.Vendas.push(novaVenda);
            showToast(`Venda #${novaVenda.id} finalizada com sucesso! Total: R$ ${novaVenda.grandTotal.toFixed(2).replace('.', ',')}`, "success");
            novaVendaModal.style.display = "none"; // Fecha o modal
            updateContent(activeSection); // Atualiza a visualização (se for "Caixa", mostrará a nova venda)
        }
    }

    /**
     * Simula o registro de pagamento para uma venda pendente.
     * Exposta globalmente para ser acessível pelo onclick no HTML dinâmico.
     * @param {string} vendaId - O ID da venda a ter o pagamento registrado.
     */
    window.registrarPagamento = function (vendaId) {
        // MELHORIA: Implementar um modal para selecionar forma de pagamento, etc.
        const venda = stockData.Vendas.find(v => v.id === vendaId);
        if (venda && venda.statusVenda === "Pendente") {
            venda.statusVenda = "Paga";
            // Aqui você poderia adicionar lógica de confirmação, como data do pagamento.
            venda.timestampPagamento = new Date().toLocaleString('pt-BR');
            showToast(`Pagamento para a venda #${vendaId} registrado com sucesso!`, "success");
            updateContent("Caixa"); // Re-renderiza a seção Caixa para refletir a mudança de status
        } else if (venda) {
            showToast(`Venda #${vendaId} já está ${venda.statusVenda.toLowerCase()}.`, "info");
        } else {
            showToast(`Venda #${vendaId} não encontrada.`, "error");
        }
    }

    // --- Inicialização da Aplicação e Navegação do Menu ---
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            menuItems.forEach(i => i.classList.remove('bg-custom-nav-item-active')); // Remove a classe ativa de todos
            item.classList.add('bg-custom-nav-item-active'); // Adiciona ao item clicado
            const sectionName = item.querySelector('p').textContent;
            updateContent(sectionName); // Atualiza o conteúdo principal
        });
    });

    // Garante que a grade de conteúdo exista antes de tentar popular
    if (contentGrid) {
        updateContent(activeSection); // Inicia na seção Produtos (ou a última seção ativa, se implementado)
    }

    // TODO: Implementar funções para CRUD (Create, Read, Update, Delete) para Produtos, Categorias, Clientes/Mesas
    // Essas funções interagiriam com o Firebase. Ex:
    // async function fetchProductsFromFirebase() { /* ... */ }
    // async function addProductToFirebase(productData) { /* ... */ }
    // E assim por diante.

    // TODO: Implementar sistema de autenticação com Firebase para controle de acesso.

    // TODO: Adicionar validação mais robusta para todos os inputs.

    // TODO: Melhorar a interface de usuário com feedback visual mais claro (ex: toasts para notificações em vez de alert()).
});