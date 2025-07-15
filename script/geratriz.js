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

    // Define a data atual como padrão no campo de data de vencimento
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    dataVencimentoInput.value = `${year}-${month}-${day}`;

    // Adiciona o evento de clique ao botão
    btnGerar.addEventListener('click', gerarCarnes);

    function gerarCarnes() {
        const valorTotalStr = valorTotalInput.value;
        const numParcelasStr = numParcelasInput.value;
        const dataVencimentoStr = dataVencimentoInput.value;
        const nomeCliente = nomeClienteInput.value;
        const nomeRecebedor = nomeRecebedorInput.value;
        const assuntoCarne = assuntoCarneInput.value;
        const infoPix = infoPixInput.value.trim();

        // Validação básica dos campos REQUERIDOS
        if (!valorTotalStr || !numParcelasStr || !dataVencimentoStr || !nomeCliente || !nomeRecebedor || !assuntoCarne) {
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
        carnesArea.innerHTML = ''; // Limpa a área de carnês antes de gerar novos

        let dataAtualParcela = new Date(dataVencimentoStr + 'T12:00:00');
        const diaInicial = dataAtualParcela.getDate();

        for (let i = 1; i <= numParcelas; i++) {
            const diaRef = String(dataAtualParcela.getDate()).padStart(2, '0');
            const mesRef = dataAtualParcela.toLocaleString('pt-BR', { month: 'long' });
            const anoRef = dataAtualParcela.getFullYear();
            
            const referenciaDetalhada = `Parcela Ref. a ${diaRef} de ${mesRef} de ${anoRef} Parcela ${i}/${numParcelas}`;

            const pixHtml = infoPix ? `<p class="info-pix">Pagamento via PIX: ${infoPix}</p>` : '';

            // HTML para um único carnê (será duplicado)
            const carneIndividualHtml = `
                <div class="carne-item">
                    <h3>COMPROVANTE DE PAGAMENTO</h3>
                    <div class="info-principal">
                        <p>${assuntoCarne}</p>
                        <p>Valor da parcela R$ ${valorParcela.toFixed(2).replace('.', ',')}</p>
                        <p>${referenciaDetalhada}</p>
                        ${pixHtml}
                    </div>

                    <div class="campos-manual">
                        <p><span>VALOR:</span> R$ <span class="linha"></span></p>
                        <p><span>DATA:</span> <span class="linha-data"></span> / <span class="linha-data"></span> / <span class="linha-data"></span></p>
                        <p><span>ASS.:</span> <span class="linha"></span></p>
                    </div>
                </div>
            `;
            
            // NOVO: Aba de grampo, agora APENAS UMA VEZ no início do par
            const carneAbaGrampoHtml = `<div class="carne-aba-grampo"></div>`;

            // A ordem agora é: ABA | CARNÊ (Pagador) | CARNÊ (Recebedor)
            const carneParHtml = `
                <div class="carne-par">
                    ${carneAbaGrampoHtml}
                    ${carneIndividualHtml}
                    ${carneIndividualHtml}
                </div>
            `;
            carnesArea.innerHTML += carneParHtml;

            // Prepara para a próxima data de vencimento
            dataAtualParcela.setMonth(dataAtualParcela.getMonth() + 1);

            // Ajusta o dia se o mês seguinte não tiver o mesmo dia
            if (dataAtualParcela.getDate() !== diaInicial && dataAtualParcela.getMonth() !== (new Date(dataAtualParcela.getFullYear(), dataAtualParcela.getMonth(), 0)).getMonth() +1) {
                 dataAtualParcela.setDate(0);
            }
        }

        window.print();
    }
});