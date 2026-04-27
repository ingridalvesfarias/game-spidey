// === CONFIGURAÇÃO DE ÁUDIO ===
const musicaSelect = new Audio('./assets/musica-select.mp3');
musicaSelect.loop = true;
musicaSelect.volume = 0.5;

function tentarTocarMusica() {
    musicaSelect.play().catch(() => {
        console.log("Áudio aguardando interação do usuário...");
    });
}

// === INICIALIZAÇÃO ===
window.onload = () => {
    tentarTocarMusica();

    if (sessionStorage.getItem('hub_loaded')) {
        goToMenuSelection();
    } else {
        startLoading();
    }
};

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
            if (status) status.innerText = "100%";
            if (fill) fill.style.width = "100%";
            if (completeMsg) completeMsg.classList.remove('hidden');

            sessionStorage.setItem('hub_loaded', 'true');
            setTimeout(goToTitleScreen, 1500);
        }
        if (fill) fill.style.width = `${progress}%`;
        if (status) status.innerText = `${progress}%`;
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
    
    // Remove eventos antigos antes de adicionar novos (evita disparos duplos)
    window.removeEventListener('keydown', handleStart);
    window.removeEventListener('click', handleStart);
    window.removeEventListener('touchstart', handleStart);

    window.addEventListener('keydown', handleStart);
    window.addEventListener('click', handleStart);
    window.addEventListener('touchstart', handleStart, { passive: false });
}

function handleStart(e) {
    // Se for touch, evita que o navegador simule um clique logo em seguida
    if (e.type === 'touchstart') e.preventDefault();

    window.removeEventListener('keydown', handleStart);
    window.removeEventListener('click', handleStart);
    window.removeEventListener('touchstart', handleStart);
    
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

    // === LÓGICA DO VOLTAR (BACK) ===
    if (btnBack) {
        const acaoVoltar = (e) => {
            e.preventDefault();
            e.stopPropagation();
            goToTitleScreen();
        };
        btnBack.onclick = acaoVoltar;
        btnBack.addEventListener('touchstart', acaoVoltar, { passive: false });
    }

    // === LÓGICA DO SELECIONAR (SELECT) ===
    if (btnSelect) {
        const acaoJogar = (e) => {
            e.preventDefault();
            e.stopPropagation();
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
        btnSelect.onclick = acaoJogar;
        btnSelect.addEventListener('touchstart', acaoJogar, { passive: false });
    }

    // === LÓGICA DO CARROSSEL ===
    if (prevBtn && nextBtn && carousel) {
        const mover = (direcao) => {
            const scrollAmount = carousel.offsetWidth * 0.8;
            carousel.scrollBy({ left: direcao * scrollAmount, behavior: 'smooth' });
        };
        prevBtn.onclick = () => mover(-1);
        nextBtn.onclick = () => mover(1);
    }

    // === SELEÇÃO DE CARDS ===
    cards.forEach(card => {
        const selecionar = (e) => {
            cards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            selectedGame = card.getAttribute('data-game');
        };
        card.onclick = selecionar;
        card.addEventListener('touchstart', selecionar, { passive: true });
    });
}