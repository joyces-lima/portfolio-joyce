/**
 * ==============================================================================
 * CARROSSEL DE CURSOS - LÓGICA EM JAVASCRIPT
 * ==============================================================================
 * Este arquivo controla a interatividade da seção "Cursos", permitindo:
 * 1. Navegar entre os cards através dos botões de setas (Anterior / Próximo).
 * 2. Navegar clicando nos pontos (indicadores) inferiores.
 * 3. Transição suave utilizando a propriedade CSS `transform: translateX()`.
 * 4. Avanço automático opcional a cada 5 segundos com pausa ao passar o mouse.
 * 5. Navegação acessível pelas setas do teclado (Esquerda / Direita).
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. SELEÇÃO DOS ELEMENTOS DO DOM (Document Object Model)
    // Obtemos as referências dos elementos HTML que serão manipulados pelo script
    const track = document.getElementById('carrossel-track');
    const slides = Array.from(track.children);
    const btnPrev = document.getElementById('btn-prev-curso');
    const btnNext = document.getElementById('btn-next-curso');
    const containerIndicadores = document.getElementById('carrossel-indicadores');

    // Se a estrutura do carrossel não for encontrada na página, encerra o script sem erros
    if (!track || slides.length === 0) return;

    // Variável para armazenar o índice do card atualmente visível (0 é o primeiro curso)
    let indiceAtual = 0;
    const totalSlides = slides.length;

    // 2. CRIAÇÃO DINÂMICA DOS INDICADORES (BOLINHAS)
    // Para cada card de curso existente, criamos uma bolinha correspondente
    slides.forEach((_, index) => {
        const indicador = document.createElement('button');
        indicador.classList.add('indicador');
        indicador.setAttribute('aria-label', `Ir para o curso ${index + 1}`);
        
        // O primeiro indicador é marcado como ativo inicialmente
        if (index === 0) {
            indicador.classList.add('ativo');
        }

        // Evento de clique na bolinha: vai diretamente para o curso correspondente
        indicador.addEventListener('click', () => {
            irParaSlide(index);
            reiniciarAutoPlay(); // Reinicia o temporizador do avanço automático
        });

        containerIndicadores.appendChild(indicador);
    });

    // Guardamos a lista das bolinhas criadas em um array
    const indicadores = Array.from(containerIndicadores.children);

    /**
     * 3. FUNÇÃO PRINCIPAL: ATUALIZAR A POSIÇÃO DO CARROSSEL
     * Move a trilha de slides na horizontal com base no índice atual.
     */
    function atualizarCarrossel() {
        // Desloca a trilha para a esquerda multiplicando o índice por -100%
        // Exemplo: 
        // - Índice 0: translateX(0%)    -> Exibe o 1º curso
        // - Índice 1: translateX(-100%) -> Exibe o 2º curso
        // - Índice 2: translateX(-200%) -> Exibe o 3º curso
        track.style.transform = `translateX(-${indiceAtual * 100}%)`;

        // Atualiza a cor dos indicadores (ativa a bolinha atual e desativa as outras)
        indicadores.forEach((indicador, index) => {
            if (index === indiceAtual) {
                indicador.classList.add('ativo');
            } else {
                indicador.classList.remove('ativo');
            }
        });
    }

    /**
     * Move o carrossel diretamente para um slide específico pelo seu número de índice
     * @param {number} index - O número do slide desejado (0, 1, 2, ...)
     */
    function irParaSlide(index) {
        indiceAtual = index;
        atualizarCarrossel();
    }

    /**
     * Avança para o próximo slide
     * Se estiver no último slide, retorna para o primeiro (efeito carrossel infinito)
     */
    function proximoSlide() {
        if (indiceAtual < totalSlides - 1) {
            indiceAtual++;
        } else {
            indiceAtual = 0; // Volta ao início
        }
        atualizarCarrossel();
    }

    /**
     * Volta para o slide anterior
     * Se estiver no primeiro slide, vai para o último
     */
    function slideAnterior() {
        if (indiceAtual > 0) {
            indiceAtual--;
        } else {
            indiceAtual = totalSlides - 1; // Vai para o final
        }
        atualizarCarrossel();
    }

    // 4. EVENTOS DE CLIQUE NOS BOTÕES DE NAVEGAÇÃO
    btnNext.addEventListener('click', () => {
        proximoSlide();
        reiniciarAutoPlay();
    });

    btnPrev.addEventListener('click', () => {
        slideAnterior();
        reiniciarAutoPlay();
    });

    // 5. NAVEGAÇÃO VIA TECLADO (Acessibilidade)
    // Permite controlar o carrossel usando as setas do teclado (Esquerda / Direita)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            proximoSlide();
            reiniciarAutoPlay();
        } else if (e.key === 'ArrowLeft') {
            slideAnterior();
            reiniciarAutoPlay();
        }
    });

    // 6. AVANÇO AUTOMÁTICO DE SLIDES (AUTOPLAY)
    // Muda de slide automaticamente a cada 100000 milissegundos ( segundos)
    const tempoAutoPlay = 100000;
    let autoPlayInterval = setInterval(proximoSlide, tempoAutoPlay);

    // Função para reiniciar a contagem de 5s sempre que o usuário interagir
    function reiniciarAutoPlay() {
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(proximoSlide, tempoAutoPlay);
    }

    // Pausa o carrossel quando o usuário coloca o ponteiro do mouse sobre ele
    const carrosselContainer = document.querySelector('.carrossel-container');
    if (carrosselContainer) {
        carrosselContainer.addEventListener('mouseenter', () => {
            clearInterval(autoPlayInterval);
        });

        // Retoma o avanço automático quando o mouse sai da área do carrossel
        carrosselContainer.addEventListener('mouseleave', () => {
            autoPlayInterval = setInterval(proximoSlide, tempoAutoPlay);
        });
    }
});
