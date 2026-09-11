/* script/geratriz.js */

document.addEventListener('DOMContentLoaded', () => {
    const valorTotalInput = document.getElementById('valorTotal');
    const numParcelasInput = document.getElementById('numParcelas');
    const valorMESInput = document.getElementById('valorMES');
    const dataVencimentoInput = document.getElementById('dataVencimento');
    const nomeClienteInput = document.getElementById('nomeCliente');
    const nomeRecebedorInput = document.getElementById('nomeRecebedor');
    const assuntoCarneInput = document.getElementById('assuntoCarne');
    const infoPixInput = document.getElementById('infoPix');
    const btnGerar = document.getElementById('btnGerar');
    const carnesArea = document.getElementById('carnesArea');

    // Lógica de exclusividade dos campos
    numParcelasInput.addEventListener('input', () => {
        if (numParcelasInput.value > 0) valorMESInput.value = '';
    });
    valorMESInput.addEventListener('input', () => {
        if (valorMESInput.value > 0) numParcelasInput.value = '';
    });

// Define a data atual como padrão no campo de vencimento
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    dataVencimentoInput.value = `${year}-${month}-${day}`;

    btnGerar.addEventListener('click', gerarCarnes);

    function gerarCarnes() {
        const valorTotalStr = valorTotalInput.value;
        const numParcelasStr = numParcelasInput.value;
        const valorMESStr = valorMESInput.value;
        const dataVencimentoOriginalStr = dataVencimentoInput.value;
        const nomeCliente = nomeClienteInput.value;
        const nomeRecebedor = nomeRecebedorInput.value;
        const assuntoCarne = assuntoCarneInput.value;
        const infoPix = infoPixInput.value.trim();

        if (!valorTotalStr || (!numParcelasStr && !valorMESStr) || !dataVencimentoOriginalStr || !nomeCliente || !nomeRecebedor || !assuntoCarne) {
            alert('Por favor, preencha todos os campos obrigatórios!');
            return;
        }

        const valorTotal = parseFloat(valorTotalStr);
        let numParcelas = 0;
        let listaValoresParcelas = [];

        const formatter = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        if (numParcelasStr) {
            numParcelas = parseInt(numParcelasStr);
            const valorParcela = valorTotal / numParcelas;
            for (let i = 0; i < numParcelas; i++) {
                listaValoresParcelas.push(valorParcela);
            }
        } else {
            const valorFixoMensal = parseFloat(valorMESStr);
            let saldoDevedor = valorTotal;
            while (saldoDevedor > 0) {
                if (saldoDevedor >= valorFixoMensal) {
                    listaValoresParcelas.push(valorFixoMensal);
                    saldoDevedor = parseFloat((saldoDevedor - valorFixoMensal).toFixed(2));
                } else {
                    listaValoresParcelas.push(saldoDevedor);
                    saldoDevedor = 0;
                }
            }
            numParcelas = listaValoresParcelas.length;
        }

        carnesArea.innerHTML = ''; 

        // 1. CAPA
        const valorTotalFormatado = formatter.format(valorTotal);
        const capaHtmlContent = `
            <h2>COMPROVANTE DE PAGAMENTO</h2>
            <p>${assuntoCarne}</p>
            <p><span class="info-destaque">Pagador:</span> ${nomeCliente}</p>
            <p><span class="info-destaque">Recebedor:</span> ${nomeRecebedor}</p>
            <p>Carnê em <span class="info-destaque">${numParcelas}</span> parcelas.</p>
            <p><span class="info-destaque">Valor Total:</span> ${valorTotalFormatado}</p>
            <p><span class="info-destaque">Primeiro Vencimento:</span> ${new Date(dataVencimentoOriginalStr + 'T12:00:00').toLocaleDateString('pt-BR')}</p>
        `;
        const capaPrintDiv = document.createElement('div');
        capaPrintDiv.className = 'capa-carne-print'; 
        capaPrintDiv.innerHTML = capaHtmlContent;
        carnesArea.appendChild(capaPrintDiv);

        // 2. ASSINATURAS (Imprime na mesma folha que a capa)
        const assinaturasHtmlContent = `
            <div class="campo-assinatura">
                <span class="linha-assinatura"></span>
                <span class="legenda-assinatura">Assinatura do Comprador: ${nomeCliente}</span>
            </div>
            <div class="campo-assinatura">
                <span class="linha-assinatura"></span>
                <span class="legenda-assinatura">Assinatura do Vendedor: ${nomeRecebedor}</span>
            </div>
            <p style="font-size: 0.7em;">(Espaço reservado para reconhecimento de firma em cartório)</p>
        `;
        const assinaturasDiv = document.createElement('div');
        assinaturasDiv.className = 'pagina-assinaturas'; 
        assinaturasDiv.innerHTML = assinaturasHtmlContent;
        carnesArea.appendChild(assinaturasDiv);

        // 3. CARNÊS (Começarão em uma nova folha devido ao page-break da div de assinaturas)
        let allCarnesHtml = ''; 
        const dataInicialVencimento = new Date(dataVencimentoOriginalStr + 'T12:00:00');
        const diaOriginal = dataInicialVencimento.getDate();

        for (let i = 1; i <= numParcelas; i++) {
            let dataAtualParcela = new Date(dataInicialVencimento);
            dataAtualParcela.setMonth(dataInicialVencimento.getMonth() + (i - 1));

            const ultimoDiaDoMes = new Date(dataAtualParcela.getFullYear(), dataAtualParcela.getMonth() + 1, 0).getDate();
            if (diaOriginal > ultimoDiaDoMes) {
                dataAtualParcela.setDate(ultimoDiaDoMes);
            } else {
                dataAtualParcela.setDate(diaOriginal);
            }
            
            const diaFormatado = String(dataAtualParcela.getDate()).padStart(2, '0');
            const dataVencimentoFormatada = `${diaFormatado}/${String(dataAtualParcela.getMonth() + 1).padStart(2, '0')}/${dataAtualParcela.getFullYear()}`;
            const valorParcelaFormatado = formatter.format(listaValoresParcelas[i-1]);

            const carneIndividualHtml = `
                <div class="carne-item">
                    <h3>COMPROVANTE DE PAGAMENTO</h3>
                    <div class="info-principal">
                        <p>Ref.: ${assuntoCarne}</p>
                        <p>Valor da parcela ${valorParcelaFormatado}</p>
                        <p>Parcela ${i}/${numParcelas}</p>
                        <p>Vencimento: ${dataVencimentoFormatada}</p>
                        ${infoPix ? `<p class="info-pix">Pagamento via PIX: ${infoPix}</p>` : ''}
                    </div>
                    <div class="campos-manual">
                        <p><span>VALOR:</span> R$ <span class="linha"></span></p>
                        <p><span>DATA:</span> <span class="linha-data"></span> / <span class="linha-data"></span> / <span class="linha-data"></span></p>
                        <p><span>ASS.:</span> <span class="linha"></span></p>
                    </div>
                </div>
            `;
            
            allCarnesHtml += `
                <div class="carne-par">
                    <div class="carne-aba-grampo"></div>
                    ${carneIndividualHtml}
                    ${carneIndividualHtml} 
                </div>
            `;
        }

        carnesArea.innerHTML += allCarnesHtml; 
        window.print();
    }
});

// Controle de Abertura/Fechamento do Modal de Instruções
const btnInstrucao = document.getElementById('btnInstrucao');
const modalInstrucao = document.getElementById('modalInstrucao');
const fecharModal = document.getElementById('fecharModal');

if (btnInstrucao && modalInstrucao && fecharModal) {
    // Abrir o modal ao clicar no botão INSTRUÇÃO
    btnInstrucao.addEventListener('click', () => {
        modalInstrucao.style.display = 'block';
    });

    // Fechar ao clicar no botão "X"
    fecharModal.addEventListener('click', () => {
        modalInstrucao.style.display = 'none';
    });

    // Fechar se o usuário clicar fora do conteúdo do modal
    window.addEventListener('click', (event) => {
        if (event.target === modalInstrucao) {
            modalInstrucao.style.display = 'none';
        }
    });
}