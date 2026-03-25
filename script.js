// 1. ÁUDIOS
const somAcerto = new Audio('audio/acerto.mp3');
const somErro = new Audio('audio/erro.mp3');
const musicaFundo = new Audio('audio/fundo.mp3');

somAcerto.volume = 0.5;
somErro.volume = 0.4;
musicaFundo.volume = 0.15;
musicaFundo.loop = true;

// 2. VARIÁVEIS
let j1Nome = "", j2Nome = "";
let j1Pontos = 0, j2Pontos = 0;
let perguntaAtual = 0, jogadorAtual = 1;
let perguntasDaRodada = [];
let tempoRestante = 30, controleCronometro;
let modoDeJogo = ""; 

// 3. BANCO DE DADOS (40 PERGUNTAS)
const bancoDePerguntas = [
    { pergunta: "Quantas Copas o Brasil ganhou?", respostas: ["3", "4", "5"], respostaCerta: 2 },
    { pergunta: "Quem é o maior artilheiro das Copas?", respostas: ["Pelé", "Ronaldo", "Miroslav Klose"], respostaCerta: 2 },
    { pergunta: "Onde foi a primeira Copa em 1930?", respostas: ["Argentina", "Brasil", "Uruguai"], respostaCerta: 2 },
    { pergunta: "Qual jogador é o 'Rei do Futebol'?", respostas: ["Garrincha", "Zico", "Pelé"], respostaCerta: 2 },
    { pergunta: "Em qual Copa o Brasil sofreu o 7x1?", respostas: ["2010", "2014", "2018"], respostaCerta: 1 },
    { pergunta: "Qual o mascote da Copa de 2014?", respostas: ["Fuleco", "Zakumi", "La'eeb"], respostaCerta: 0 },
    { pergunta: "Qual país venceu a Copa de 2022?", respostas: ["França", "Brasil", "Argentina"], respostaCerta: 2 },
    { pergunta: "Qual é a cor da camisa principal do Brasil?", respostas: ["Azul", "Branca", "Amarela"], respostaCerta: 2 },
    { pergunta: "Quantos minutos dura um tempo normal de jogo?", respostas: ["45", "90", "100"], respostaCerta: 1 },
    { pergunta: "Quem foi o capitão do Penta em 2002?", respostas: ["Dunga", "Cafu", "Lúcio"], respostaCerta: 1 },
    { pergunta: "Qual cantor(a) gravou 'Waka Waka' em 2010?", respostas: ["Anitta", "Shakira", "Ivete Sangalo"], respostaCerta: 1 },
    { pergunta: "Qual animal 'previa' resultados em 2010?", respostas: ["Gato vidente", "Polvo Paul", "Loro José"], respostaCerta: 1 },
    { pergunta: "O que o juiz usa para marcar a barreira?", respostas: ["Giz", "Tinta", "Spray de espuma"], respostaCerta: 2 },
    { pergunta: "Qual narrador diz 'Haja coração!'?", respostas: ["Galvão Bueno", "Cléber Machado", "Tiago Leifert"], respostaCerta: 0 },
    { pergunta: "Qual o nome do estádio da final de 2014?", respostas: ["Mineirão", "Arena Cora", "Maracanã"], respostaCerta: 2 },
    { pergunta: "Quantas estrelas tem o escudo do Brasil?", respostas: ["4", "5", "6"], respostaCerta: 1 },
    { pergunta: "Em qual ano o Brasil ganhou o Tetra?", respostas: ["1990", "1994", "1998"], respostaCerta: 1 },
    { pergunta: "Qual jogador francês deu uma cabeçada em 2006?", respostas: ["Henry", "Ribéry", "Zidane"], respostaCerta: 2 },
    { pergunta: "Qual seleção é chamada de 'Azzurra'?", respostas: ["França", "Itália", "Grécia"], respostaCerta: 1 },
    { pergunta: "De quantos em quantos anos tem Copa?", respostas: ["2", "4", "5"], respostaCerta: 1 },
    { pergunta: "Quem é o 'Fenômeno' do futebol brasileiro?", respostas: ["Ronaldinho", "Neymar", "Ronaldo"], respostaCerta: 2 },
    { pergunta: "Qual país sediou a Copa de 2018?", respostas: ["Rússia", "Catar", "Brasil"], respostaCerta: 0 },
    { pergunta: "Quantas substituições podem ser feitas hoje?", respostas: ["3", "4", "5"], respostaCerta: 2 },
    { pergunta: "Qual prêmio recebe o melhor goleiro?", respostas: ["Luva de Ouro", "Bola de Ouro", "Chuteira de Ouro"], respostaCerta: 0 },
    { pergunta: "Onde fica a sede da FIFA?", respostas: ["Suíça", "França", "EUA"], respostaCerta: 0 },
    { pergunta: "Qual país ganhou a Copa de 2010?", respostas: ["Holanda", "Alemanha", "Espanha"], respostaCerta: 2 },
    { pergunta: "Em 1950, o Brasil usava que cor de camisa?", respostas: ["Azul", "Verde", "Branca"], respostaCerta: 2 },
    { pergunta: "Qual jogador é o 'CR7'?", respostas: ["Cristiano Ronaldo", "Ronaldinho", "Casemiro"], respostaCerta: 0 },
    { pergunta: "Quantos jogadores cada time tem em campo?", respostas: ["10", "11", "12"], respostaCerta: 1 },
    { pergunta: "O que significa VAR?", respostas: ["Juiz de Linha", "Árbitro de Vídeo", "Câmera do Gol"], respostaCerta: 1 },
    { pergunta: "Qual jogador brasileiro é o 'Bruxo'?", respostas: ["Neymar", "Ronaldinho Gaúcho", "Rivaldo"], respostaCerta: 1 },
    { pergunta: "Qual foi a sede da Copa de 2022?", respostas: ["Dubai", "Catar", "Arábia Saudita"], respostaCerta: 1 },
    { pergunta: "Como se chama a bola da Copa de 1970?", respostas: ["Jabulani", "Brazuca", "Telstar"], respostaCerta: 2 },
    { pergunta: "Qual seleção usa a cor Laranja?", respostas: ["Alemanha", "Holanda", "Bélgica"], respostaCerta: 1 },
    { pergunta: "Quem era o técnico do Penta?", respostas: ["Tite", "Felipão", "Dunga"], respostaCerta: 1 },
    { pergunta: "Qual país tem 4 títulos mundiais?", respostas: ["Itália", "Argentina", "Uruguai"], respostaCerta: 0 },
    { pergunta: "Qual jogador fez gol de mão (La Mano de Dios)?", respostas: ["Pelé", "Maradona", "Messi"], respostaCerta: 1 },
    { pergunta: "Qual a maior goleada sofrida pelo Brasil?", respostas: ["3x0", "7x1", "5x2"], respostaCerta: 1 },
    { pergunta: "Qual dessas cidades NÃO sediou a Copa 2014?", respostas: ["Cuiabá", "Manaus", "Arcoverde"], respostaCerta: 2 },
    { pergunta: "Qual a forma da taça da Copa?", respostas: ["Um globo", "Dois atletas segurando a Terra", "Uma chuteira"], respostaCerta: 1 }
];

// 4. INTERFACE
function selecionarModo(modo) {
    modoDeJogo = modo;
    document.getElementById("tela-modo").classList.add("escondido");
    document.getElementById("tela-inicial").classList.remove("escondido");

    const containerNome2 = document.getElementById("container-nome2");
    if (modo === 'solo') {
        containerNome2.classList.add("escondido");
        document.getElementById("titulo-cadastro").innerText = "Carreira Solo 🏃";
    } else {
        containerNome2.classList.remove("escondido");
        document.getElementById("titulo-cadastro").innerText = "Batalha Multiplayer ⚔️";
    }
}

function toggleMusica() {
    const icone = document.getElementById("musica-icone");
    if (musicaFundo.muted) {
        musicaFundo.muted = false;
        icone.innerText = "🔊";
    } else {
        musicaFundo.muted = true;
        icone.innerText = "🔇";
    }
}

// 5. FLUXO DO JOGO
function validarComeco() {
    j1Nome = document.getElementById("input-nome1").value;
    j2Nome = (modoDeJogo === 'solo') ? "Saminina Bot" : document.getElementById("input-nome2").value;

    if (j1Nome.trim() === "" || (modoDeJogo === 'batalha' && j2Nome.trim() === "")) {
        alert("Preencha os nomes!"); return;
    }

    musicaFundo.play();
    document.getElementById("btn-musica-toggle").style.display = "flex";

    perguntasDaRodada = embaralharPerguntas(bancoDePerguntas).slice(0, 10);
    document.getElementById("tela-inicial").classList.add("escondido");
    
    if (modoDeJogo === 'solo') {
        document.getElementById("tela-quiz").classList.remove("escondido");
        document.getElementById("timer-container").classList.remove("escondido");
        mostrarPergunta();
        iniciarCronometro();
    } else {
        prepararTurno();
    }
}

function prepararTurno() {
    clearInterval(controleCronometro);
    document.getElementById("timer-container").classList.add("escondido");
    const nomeNaTela = (jogadorAtual === 1) ? j1Nome : j2Nome;
    document.getElementById("nome-destaque").innerText = nomeNaTela;
    document.getElementById("tela-quiz").classList.add("escondido");
    document.getElementById("tela-passagem").classList.remove("escondido");
}

function iniciarTurno() {
    document.getElementById("tela-passagem").classList.add("escondido");
    document.getElementById("tela-quiz").classList.remove("escondido");
    document.getElementById("timer-container").classList.remove("escondido");
    mostrarPergunta();
    iniciarCronometro();
}

function mostrarPergunta() {
    const dados = perguntasDaRodada[perguntaAtual];
    document.getElementById("aviso-turno").innerText = "Vez de: " + (jogadorAtual === 1 ? j1Nome : j2Nome);
    document.getElementById("texto-pergunta").classList.remove("escondido");
    document.getElementById("feedback-acerto").classList.add("escondido");
    document.getElementById("feedback-erro").classList.add("escondido");
    
    let numQuestao = (modoDeJogo === 'solo') ? perguntaAtual + 1 : Math.floor(perguntaAtual / 2) + 1;
    document.getElementById("barra-progresso").innerText = `Pergunta ${numQuestao} de 10`;
    document.getElementById("texto-pergunta").innerText = dados.pergunta;
    
    const area = document.getElementById("area-botoes");
    area.innerHTML = "";
    dados.respostas.forEach((txt, idx) => {
        const btn = document.createElement("button");
        btn.innerText = txt; btn.className = "btn-resposta";
        btn.onclick = () => verificarResposta(idx, btn);
        area.appendChild(btn);
    });
}

function iniciarCronometro() {
    tempoRestante = 30;
    const el = document.getElementById("timer-display");
    el.innerText = `Tempo: ${tempoRestante}s`;
    clearInterval(controleCronometro);
    controleCronometro = setInterval(() => {
        tempoRestante--;
        el.innerText = `Tempo: ${tempoRestante}s`;
        if (tempoRestante <= 0) { clearInterval(controleCronometro); verificarResposta(-1, null); }
    }, 1000);
}

function verificarResposta(idx, btn) {
    clearInterval(controleCronometro);
    const correta = perguntasDaRodada[perguntaAtual].respostaCerta;
    const btns = document.querySelectorAll('.btn-resposta');
    btns.forEach(b => b.disabled = true);

    if (idx === correta) {
        somAcerto.currentTime = 0; somAcerto.play();
        if(btn) btn.classList.add('correta');
        document.getElementById("feedback-acerto").classList.remove("escondido");
        document.getElementById("texto-pergunta").classList.add("escondido");
        
        const box = document.querySelector(".quiz-container");
        box.classList.add("animacao-acerto");
        setTimeout(() => box.classList.remove("animacao-acerto"), 600);
        
        if (jogadorAtual === 1) j1Pontos++; else j2Pontos++;
    } else {
        somErro.currentTime = 0; somErro.play();
        if(btn) btn.classList.add('errada');
        btns[correta].classList.add('correta');
        document.getElementById("feedback-erro").classList.remove("escondido");
        document.getElementById("texto-pergunta").classList.add("escondido");
    }

    setTimeout(() => {
        perguntaAtual++;
        if (perguntaAtual >= 10) { mostrarResultadoFinal(); return; }
        if (modoDeJogo === 'batalha') {
            jogadorAtual = (jogadorAtual === 1) ? 2 : 1;
            prepararTurno();
        } else {
            mostrarPergunta();
            iniciarCronometro();
        }
    }, 2500);
}

function mostrarResultadoFinal() {
    document.getElementById("tela-quiz").classList.add("escondido");
    document.getElementById("timer-container").classList.add("escondido");
    document.getElementById("tela-resultado").classList.remove("escondido");
    
    let tit = (j1Pontos > j2Pontos) ? j1Nome + " Venceu! 🏆" : (j2Pontos > j1Pontos) ? j2Nome + " Venceu! 🏆" : "Empate! 🤝";
    document.getElementById("titulo-vencedor").innerText = tit;
    document.getElementById("mensagem-final").innerText = `PLACAR FINAL:\n${j1Nome}: ${j1Pontos} acertos\n${j2Nome}: ${j2Pontos} acertos`;
}

function embaralharPerguntas(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// FUNÇÃO DE TELA CHEIA
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        // Entra em tela cheia
        document.documentElement.requestFullscreen().catch(err => {
            alert(`Erro ao tentar ativar tela cheia: ${err.message}`);
        });
    } else {
        // Sai da tela cheia
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}