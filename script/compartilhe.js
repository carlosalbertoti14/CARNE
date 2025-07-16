document.addEventListener('DOMContentLoaded', function() {
    const shareFacebookButton = document.getElementById('shareFacebook');
    const shareWhatsappButton = document.getElementById('shareWhatsapp');
    const copyLinkButton = document.getElementById('copyLinkButton'); // Novo botão

    // **** INFORMAÇÕES DO SEU SITE DE GERADOR DE CARNÊS ****
    const siteUrl = "https://carneonline.netlify.app/"; // URL do seu site Gerador de Carnês
    const siteTitle = "Gerador de Carnês Online Grátis | Crie Carnês de Pagamento Facilmente"; // Título para o compartilhamento
    const shareDescription = "Gere carnês de pagamento de forma rápida e fácil. Crie carnês para mensalidades, doações ou vendas, com parcelas e vencimentos automáticos."; // Descrição para o compartilhamento
    // ******************************************************

    // Função para compartilhar no Facebook
    if (shareFacebookButton) {
        shareFacebookButton.addEventListener('click', function(event) {
            event.preventDefault();
            // A API do Facebook usa 'u' para a URL e ele pega o resto das meta tags (og:title, og:description, og:image) do seu HTML
            const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}`;
            window.open(facebookShareUrl, '_blank', 'width=600,height=400');
        });
    }

    // Função para compartilhar no WhatsApp
    if (shareWhatsappButton) {
        shareWhatsappButton.addEventListener('click', function(event) {
            event.preventDefault();
            const message = `Crie carnês de pagamento de forma rápida e fácil com o Gerador de Carnês Online Grátis! Acesse agora: ${siteUrl}`;
            const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
            window.open(whatsappShareUrl, '_blank');
        });
    }

    // Função para copiar o link
    if (copyLinkButton) {
        copyLinkButton.addEventListener('click', function() {
            // Usa o Clipboard API para copiar o texto
            navigator.clipboard.writeText(siteUrl)
                .then(() => {
                    // Feedback visual para o usuário
                    copyLinkButton.textContent = 'LINK COPIADO!';
                    copyLinkButton.style.backgroundColor = '#4CAF50'; // Verde de sucesso
                    setTimeout(() => {
                        copyLinkButton.textContent = 'COPIAR LINK';
                        // Supondo que a cor original seja a definida em seu CSS para #copyLinkButton
                        // Você pode precisar pegar a cor original do CSS se ela não for sempre a mesma.
                        // Por simplicidade, estou usando um valor fixo aqui.
                        copyLinkButton.style.backgroundColor = '#4681b6'; // Volta à cor original, ajuste se for diferente no seu CSS
                    }, 2000); // Volta ao normal após 2 segundos
                })
                .catch(err => {
                    console.error('Falha ao copiar o link: ', err);
                    alert('Erro ao copiar o link. Por favor, copie manualmente: ' + siteUrl);
                });
        });
    }
});