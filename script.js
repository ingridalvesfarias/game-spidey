// === INICIALIZAÇÃO ===
window.onload = () => {
    // Tenta iniciar a música em qualquer carregamento/volta
    tentarTocarMusica();

    if (sessionStorage.getItem('hub_loaded')) {
        goToMenuSelection();
    } else {
        startLoading();
    }
};

// Caminho do áudio
const musicaSelect = new Audio('./assets/musica-select.mp3');
musicaSelect.loop = true;
musicaSelect.volume = 0.5; // Volume moderado

// Função persistente para tocar a música
function tentarTocarMusica() {
    musicaSelect.play().catch(() => {
        // Se o navegador bloquear, ele tentará tocar no primeiro clique ou tecla
        const iniciarAoInteragir = () => {
            musicaSelect.play();
            window.removeEventListener('click', iniciarAoInteragir);
            window.removeEventListener('keydown', iniciarAoInteragir);
        };
        window.addEventListener('click', iniciarAoInteragir);
        window.addEventListener('keydown', iniciarAoInteragir);
    });
}

function startLoading() {
    let progress = 0;
    const fill = document.getElementById('progress-fill');
    const status = document.getElementById('status');
    const completeMsg = document.getElementById('complete-msg');

    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 12) + 1;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            status.innerText = "100%";
            fill.style.width = "100%";
            completeMsg.classList.remove('hidden');
            
            sessionStorage.setItem('hub_loaded', 'true');
            setTimeout(goToTitleScreen, 1500);
        }
        fill.style.width = `${progress}%`;
        status.innerText = `${progress}%`;
    }, 90);
}

// === SISTEMA DE NAVEGAÇÃO ===
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    const target = document.getElementById(screenId);
    if (target) {
        target.classList.remove('hidden');
        target.style.opacity = "0";
        setTimeout(() => target.style.opacity = "1", 10);
    }
}

function goToTitleScreen() {
    showScreen('start-screen');
    tentarTocarMusica();
    window.addEventListener('keydown', handleStart);
    window.addEventListener('click', handleStart);
}

function handleStart() {
    window.removeEventListener('keydown', handleStart);
    window.removeEventListener('click', handleStart);
    tentarTocarMusica();
    goToMenuSelection();
}

function goToMenuSelection() {
    showScreen('menu-screen');
    tentarTocarMusica();

    const cards = document.querySelectorAll('.game-card');
    const btnSelect = document.getElementById('btn-select');
    const btnBack = document.getElementById('btn-back');
    const carousel = document.getElementById('carousel');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    let selectedGame = "classic";

    // === LÓGICA DO CARROSSEL (MOBILE) ===
    if (prevBtn && nextBtn && carousel) {
        prevBtn.onclick = () => {
            const scrollAmount = carousel.offsetWidth * 0.7;
            carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        };

        nextBtn.onclick = () => {
            const scrollAmount = carousel.offsetWidth * 0.7;
            carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        };
    }

    // Seleção de cards
    cards.forEach(card => {
        card.onclick = () => {
            cards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            selectedGame = card.getAttribute('data-game');
        };
    });

    // Botão Voltar
    if (btnBack) {
        btnBack.replaceWith(btnBack.cloneNode(true));
        const newBtnBack = document.getElementById('btn-back');
        newBtnBack.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            goToTitleScreen();
        };
    }

    // Botão Selecionar
    if (btnSelect) {
        btnSelect.onclick = () => {
            const pages = {
                'classic': 'classic.html',
                'venom': 'venom.html',
                'air': 'air_battle.html',
                'boss': 'boss_fight.html'
            };
            
            if (pages[selectedGame]) {
                window.location.href = pages[selectedGame];
            }
        };
    }
}