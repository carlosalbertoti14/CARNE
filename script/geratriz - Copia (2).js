/* script/geratriz.js */

document.addEventListener('DOMContentLoaded', () => {
    // Referência aos elementos do DOM
    const valorTotalInput = document.getElementById('valorTotal');
    const numParcelasInput = document.getElementById('numParcelas');
    const valorMESInput = document.getElementById('valorMES'); // NOVO
    const dataVencimentoInput = document.getElementById('dataVencimento');
    const nomeClienteInput = document.getElementById('nomeCliente');
    const nomeRecebedorInput = document.getElementById('nomeRecebedor');
    const assuntoCarneInput = document.getElementById('assuntoCarne');
    const infoPixInput = document.getElementById('infoPix');
    const btnGerar = document.getElementById('btnGerar');
    const carnesArea = document.getElementById('carnesArea');

    // --- LÓGICA DE EXCLUSIVIDADE DOS CAMPOS ---
    // Se digitar em um, limpa o outro para não confundir o cálculo
    numParcelasInput.addEventListener('input', () => {
        if (numParcelasInput.value > 0) valorMESInput.value = '';
    });
    valorMESInput.addEventListener('input', () => {
        if (valorMESInput.value > 0) numParcelasInput.value = '';
    });

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    dataVencimentoInput.value = `${year}-${month}-${day}`;
    dataVencimentoInput.min = `${year}-${month}-${day}`;

    btnGerar.addEventListener('click', gerarCarnes);

    function gerarCarnes() {
        const valorTotalStr = valorTotalInput.value;
        const numParcelasStr = numParcelasInput.value;
        const valorMESStr = valorMESInput.value; // NOVO
        const dataVencimentoOriginalStr = dataVencimentoInput.value;
        const nomeCliente = nomeClienteInput.value;
        const nomeRecebedor = nomeRecebedorInput.value;
        const assuntoCarne = assuntoCarneInput.value;
        const infoPix = infoPixInput.value.trim();

        // Validação: precisa do valor total e de UM dos métodos de parcelamento
        if (!valorTotalStr || (!numParcelasStr && !valorMESStr) || !dataVencimentoOriginalStr || !nomeCliente || !nomeRecebedor || !assuntoCarne) {
            alert('Por favor, preencha todos os campos obrigatórios e escolha um método de parcelamento!');
            return;
        }

        const valorTotal = parseFloat(valorTotalStr);
        let numParcelas = 0;
        let valorFixoMensal = 0;
        let listaValoresParcelas = []; // Array para lidar com valores diferentes na última parcela

        const formatter = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        // --- LÓGICA DE CÁLCULO DAS PARCELAS ---
        if (numParcelasStr) {
            // Método Tradicional: Divisão Simples
            numParcelas = parseInt(numParcelasStr);
            const valorParcela = valorTotal / numParcelas;
            for (let i = 0; i < numParcelas; i++) {
                listaValoresParcelas.push(valorParcela);
            }
        } else {
            // Novo Método: Quanto por Mês
            valorFixoMensal = parseFloat(valorMESStr);
            let saldoDevedor = valorTotal;

            while (saldoDevedor > 0) {
                if (saldoDevedor >= valorFixoMensal) {
                    listaValoresParcelas.push(valorFixoMensal);
                    saldoDevedor = parseFloat((saldoDevedor - valorFixoMensal).toFixed(2));
                } else {
                    // Se o que sobrou for menor que o valor mensal, cria a última parcela com o resto
                    listaValoresParcelas.push(saldoDevedor);
                    saldoDevedor = 0;
                }
            }
            numParcelas = listaValoresParcelas.length;
        }

        if (isNaN(valorTotal) || numParcelas <= 0) {
            alert('Por favor, insira valores válidos.');
            return;
        }

        carnesArea.innerHTML = ''; 

        // Montagem da Capa (Usando o valor da primeira parcela como referência visual)
        const valorTotalFormatado = formatter.format(valorTotal);
        const valorReferenciaFormatado = formatter.format(listaValoresParcelas[0]);
        
        const capaHtmlContent = `
            <h2>COMPROVANTE DE PAGAMENTO</h2>
            <p><span class="info-destaque"></span> ${assuntoCarne}</p>
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

        let allCarnesHtml = ''; 
        const dataInicialVencimento = new Date(dataVencimentoOriginalStr + 'T12:00:00');
        const diaOriginal = dataInicialVencimento.getDate();

        // Loop de geração baseado na lista de valores calculada
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
            const anoFormatado = dataAtualParcela.getFullYear();
            const dataVencimentoFormatada = `${diaFormatado}/${String(dataAtualParcela.getMonth() + 1).padStart(2, '0')}/${anoFormatado}`;

            const valorParcelaFormatado = formatter.format(listaValoresParcelas[i-1]);
            const referenciaDetalhada = `Parcela ${i}/${numParcelas}`;
            const pixHtml = infoPix ? `<p class="info-pix">Pagamento via PIX: ${infoPix}</p>` : '';

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
            const carneParHtml = `
                <div class="carne-par">
                    ${carneAbaGrampoHtml}
                    ${carneIndividualHtml}
                    ${carneIndividualHtml} 
                </div>
            `;
            allCarnesHtml += carneParHtml;
        }

        carnesArea.innerHTML += allCarnesHtml; 
        window.print();
    }
});