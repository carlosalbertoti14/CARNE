/* script/geratriz.js */

document.addEventListener('DOMContentLoaded', () => {
    // Referência aos elementos do DOM
    const valorTotalInput = document.getElementById('valorTotal');
    const numParcelasInput = document.getElementById('numParcelas');
    const dataVencimentoInput = document.getElementById('dataVencimento');
    const nomeClienteInput = document.getElementById('nomeCliente');
    const nomeRecebedorInput = document.getElementById('nomeRecebedor');
    const assuntoCarneInput = document.getElementById('assuntoCarne');
    const infoPixInput = document.getElementById('infoPix');
    const btnGerar = document.getElementById('btnGerar');
    const carnesArea = document.getElementById('carnesArea');
    const capaCarneDiv = document.getElementById('capaCarne'); // NOVO: Referência à div da capa

    // Define a data atual como padrão no campo de data de vencimento
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    dataVencimentoInput.value = `${year}-${month}-${day}`;
    dataVencimentoInput.min = `${year}-${month}-${day}`;

    // Adiciona o evento de clique ao botão
    btnGerar.addEventListener('click', gerarCarnes);

    function gerarCarnes() {
        const valorTotalStr = valorTotalInput.value;
        const numParcelasStr = numParcelasInput.value;
        const dataVencimentoOriginalStr = dataVencimentoInput.value;
        const nomeCliente = nomeClienteInput.value;
        const nomeRecebedor = nomeRecebedorInput.value;
        const assuntoCarne = assuntoCarneInput.value;
        const infoPix = infoPixInput.value.trim();

        // Validação básica dos campos REQUERIDOS
        if (!valorTotalStr || !numParcelasStr || !dataVencimentoOriginalStr || !nomeCliente || !nomeRecebedor || !assuntoCarne) {
            alert('Por favor, preencha todos os campos obrigatórios!');
            return;
        }

        const valorTotal = parseFloat(valorTotalStr);
        const numParcelas = parseInt(numParcelasStr);

        if (isNaN(valorTotal) || isNaN(numParcelas) || valorTotal <= 0 || numParcelas <= 0) {
            alert('Por favor, insira valores válidos para o Valor Total e Número de Parcelas.');
            return;
        }

        const valorParcela = valorTotal / numParcelas;
        carnesArea.innerHTML = ''; // Limpa a área de carnês

        // --- INÍCIO DA CORREÇÃO PARA PONTO DE MILHAR (MANTIDA) ---
        // Cria um formatador para moeda brasileira (BRL)
        const formatter = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        // Formata o valor total e o valor da parcela usando o formatador
        const valorTotalFormatado = formatter.format(valorTotal);
        const valorParcelaFormatado = formatter.format(valorParcela);
        // --- FIM DA CORREÇÃO PARA PONTO DE MILHAR ---
        
        // Preenche o HTML da capa e adiciona a classe para impressão
        const capaHtmlContent = `
            <h2>COMPROVANTE DE PAGAMENTO</h2>
            <p><span class="info-destaque"></span> ${assuntoCarne}</p>
            <p><span class="info-destaque">Pagador:</span> ${nomeCliente}</p>
            <p><span class="info-destaque">Recebedor:</span> ${nomeRecebedor}</p>
            <p>Carnê dividido em <span class="info-destaque">${numParcelas}</span> parcelas de <span class="info-destaque">${valorParcelaFormatado}</span>.</p>
            <p><span class="info-destaque">Valor Total:</span> ${valorTotalFormatado}</p>
            <p><span class="info-destaque">Primeiro Vencimento:</span> ${new Date(dataVencimentoOriginalStr + 'T12:00:00').toLocaleDateString('pt-BR')}</p>
        `;
        
        // Cria um elemento 'div' para a capa que será impressa.
        const capaPrintDiv = document.createElement('div');
        capaPrintDiv.className = 'capa-carne-print'; // Aplica a nova classe CSS
        capaPrintDiv.innerHTML = capaHtmlContent;
        carnesArea.appendChild(capaPrintDiv); // Adiciona a capa na área de carnês

        let allCarnesHtml = ''; // String para acumular todo o HTML dos carnês

        const dataInicialVencimento = new Date(dataVencimentoOriginalStr + 'T12:00:00');
        const diaOriginal = dataInicialVencimento.getDate();

        // --- RESTAURAÇÃO DA LÓGICA ORIGINAL DE CRIAÇÃO DE CARNÊS ---
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
            // 'mesPorExtenso' não está sendo usado, mas mantido.
            const mesPorExtenso = dataAtualParcela.toLocaleString('pt-BR', { month: 'long' }); 
            const anoFormatado = dataAtualParcela.getFullYear();
            
            const dataVencimentoFormatada = `${diaFormatado}/${String(dataAtualParcela.getMonth() + 1).padStart(2, '0')}/${anoFormatado}`;

            const referenciaDetalhada = `Parcela ${i}/${numParcelas}`;
            const pixHtml = infoPix ? `<p class="info-pix">Pagamento via PIX: ${infoPix}</p>` : '';

            // O carneIndividualHtml agora usa o valorParcelaFormatado
            const carneIndividualHtml = `
                <div class="carne-item">
                    <h3>COMPROVANTE DE PAGAMENTO</h3>
                    <div class="info-principal">
                        <p>Ref.: ${assuntoCarne}</p>
                        <p>Valor da parcela ${valorParcelaFormatado}</p>
                        <p>${referenciaDetalhada}</p>
                        <p>Vencimento: ${dataVencimentoFormatada}</p>
                        ${pixHtml}
                    </div>

                    <div class="campos-manual">
                        <p><span>VALOR:</span> R$ <span class="linha"></span></p>
                        <p><span>DATA:</span> <span class="linha-data"></span> / <span class="linha-data"></span> / <span class="linha-data"></span></p>
                        <p><span>ASS.:</span> <span class="linha"></span></p>
                    </div>
                </div>
            `;
            
            const carneAbaGrampoHtml = `<div class="carne-aba-grampo"></div>`;

            // Esta é a estrutura original que você estava usando para criar um "par":
            // Um carne-par contendo uma aba e duas cópias do carneIndividualHtml.
            // Pelo seu feedback, essa era a lógica esperada pelo seu CSS.
            const carneParHtml = `
                <div class="carne-par">
                    ${carneAbaGrampoHtml}
                    ${carneIndividualHtml}
                    ${carneIndividualHtml} 
                </div>
            `;
            allCarnesHtml += carneParHtml;
        }
        // --- FIM DA RESTAURAÇÃO DA LÓGICA ORIGINAL ---

        carnesArea.innerHTML += allCarnesHtml; // Adiciona os carnês após a capa
        window.print();
    }
});