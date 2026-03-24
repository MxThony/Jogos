// =========================================
// 1. CONFIGURAÇÃO DE ÁUDIO
// =========================================
const somAcerto = new Audio('audio/acerto.mp3');
const somErro = new Audio('audio/erro.mp3');
const musicaFundo = new Audio('audio/fundo.mp3');

somAcerto.volume = 0.5;
somErro.volume = 0.4;
musicaFundo.volume = 0.15;
musicaFundo.loop = true;

// =========================================
// 2. VARIÁVEIS GLOBAIS
// =========================================
let j1Nome = "", j2Nome = "";
let j1Pontos = 0, j2Pontos = 0;
let j1Avatar = "", j2Avatar = "";
let perguntaAtual = 0, jogadorAtual = 1;
let perguntasDaRodada = [];
let tempoRestante = 30, controleCronometro;
let etapaFoto = 1; 

// =========================================
// 3. BANCO DE DADOS (40 PERGUNTAS)
// =========================================
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

// =========================================
// 4. FUNÇÕES DE CÂMERA E FOTO
// =========================================
async function iniciarCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        document.getElementById("video-feed").srcObject = stream;
        document.getElementById("camera-box").classList.remove("escondido");
        document.getElementById("btn-comecar-jogo").disabled = true;
    } catch (err) {
        alert("Erro ao abrir câmera. Verifique o HTTPS e as permissões do seu navegador.");
    }
}

function capturarFoto() {
    const video = document.getElementById("video-feed");
    const canvas = document.getElementById("canvas-captura");
    const context = canvas.getContext("2d");
    
    canvas.width = 200; canvas.height = 200;
    context.drawImage(video, 0, 0, 200, 200);
    const data = canvas.toDataURL("image/png");

    if (etapaFoto === 1) {
        j1Avatar = data;
        etapaFoto = 2;
        document.getElementById("label-camera-turno").innerText = j2Nome;
        document.getElementById("btn-capturar-foto").innerText = "Tirar Foto de " + j2Nome;
    } else {
        j2Avatar = data;
        // Para a câmera após as duas fotos
        const tracks = video.srcObject.getTracks();
        tracks.forEach(t => t.stop());
        document.getElementById("camera-box").classList.add("escondido");
        document.getElementById("btn-comecar-jogo").disabled = false;
        document.getElementById("btn-comecar-jogo").innerText = "TUDO PRONTO! INICIAR";
    }
}

// =========================================
// 5. LÓGICA DO JOGO
// =========================================
function validarComeco() {
    j1Nome = document.getElementById("input-nome1").value;
    j2Nome = document.getElementById("input-nome2").value;

    if (j1Nome.trim() === "" || j2Nome.trim() === "") {
        alert("Por favor, preencham os nomes!"); return;
    }

    if (!j1Avatar || !j2Avatar) {
        document.getElementById("label-camera-turno").innerText = j1Nome;
        document.getElementById("btn-capturar-foto").innerText = "Tirar Foto de " + j1Nome;
        iniciarCamera();
        document.querySelector(".campos-cadastro").classList.add("escondido");
        return;
    }

    musicaFundo.play().catch(e => console.log("Áudio aguardando clique"));
    perguntasDaRodada = embaralharPerguntas(bancoDePerguntas).slice(0, 10);
    document.getElementById("tela-cadastro").classList.add("escondido");
    prepararTurno();
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

function iniciarCronometro() {
    tempoRestante = 30;
    const display = document.getElementById("timer-display");
    display.innerText = "Tempo: 30s";
    clearInterval(controleCronometro);
    controleCronometro = setInterval(() => {
        tempoRestante--;
        display.innerText = "Tempo: " + tempoRestante + "s";
        if (tempoRestante <= 0) { 
            clearInterval(controleCronometro); 
            verificarResposta(-1, null); 
        }
    }, 1000);
}

function mostrarPergunta() {
    const data = perguntasDaRodada[perguntaAtual];
    document.getElementById("aviso-turno").innerText = "Vez de: " + (jogadorAtual === 1 ? j1Nome : j2Nome);
    document.getElementById("texto-pergunta").classList.remove("escondido");
    document.getElementById("feedback-acerto").classList.add("escondido");
    document.getElementById("feedback-erro").classList.add("escondido");
    document.getElementById("barra-progresso").innerText = "Rodada " + (Math.floor(perguntaAtual/2)+1) + " de 5";
    document.getElementById("texto-pergunta").innerText = data.pergunta;
    
    const area = document.getElementById("area-botoes");
    area.innerHTML = "";
    data.respostas.forEach((txt, idx) => {
        const btn = document.createElement("button");
        btn.innerText = txt; btn.className = "btn-resposta";
        btn.onclick = () => verificarResposta(idx, btn);
        area.appendChild(btn);
    });
}

function verificarResposta(idx, btn) {
    clearInterval(controleCronometro);
    const data = perguntasDaRodada[perguntaAtual];
    const btns = document.querySelectorAll(".btn-resposta");
    btns.forEach(b => b.disabled = true);
    const box = document.querySelector(".quiz-container");

    if (idx === data.respostaCerta) {
        somAcerto.currentTime = 0; somAcerto.play();
        btn.classList.add("correta");
        document.getElementById("texto-pergunta").classList.add("escondido");
        document.getElementById("feedback-acerto").classList.remove("escondido");
        
        // Efeito de pulo na caixa
        box.classList.remove("animacao-acerto"); 
        void box.offsetWidth; 
        box.classList.add("animacao-acerto");
        
        if (jogadorAtual === 1) j1Pontos++; else j2Pontos++;
    } else {
        somErro.currentTime = 0; somErro.play();
        if (btn) btn.classList.add("errada");
        btns[data.respostaCerta].classList.add("correta");
        document.getElementById("texto-pergunta").classList.add("escondido");
        document.getElementById("feedback-erro").innerText = (idx === -1) ? "TEMPO ESGOTADO!" : "Para fooora!";
        document.getElementById("feedback-erro").classList.remove("escondido");
    }

    setTimeout(() => {
        perguntaAtual++;
        if (perguntaAtual >= 10) { mostrarResultadoFinal(); return; }
        jogadorAtual = (jogadorAtual === 1) ? 2 : 1;
        prepararTurno();
    }, 2500);
}

function mostrarResultadoFinal() {
    document.getElementById("tela-quiz").classList.add("escondido");
    document.getElementById("timer-container").classList.add("escondido");
    document.getElementById("tela-resultado").classList.remove("escondido");
    
    let winImg = document.getElementById("img-avatar-vencedor");
    let winLab = document.getElementById("label-campeao");
    
    if (j1Pontos > j2Pontos) {
        document.getElementById("titulo-vencedor").innerText = j1Nome + " VENCEU! 🎉";
        winImg.src = j1Avatar; winImg.style.display = "block";
        winLab.innerText = "Parabéns, Craque " + j1Nome + "!";
    } else if (j2Pontos > j1Pontos) {
        document.getElementById("titulo-vencedor").innerText = j2Nome + " VENCEU! 🎉";
        winImg.src = j2Avatar; winImg.style.display = "block";
        winLab.innerText = "Parabéns, Craque " + j2Nome + "!";
    } else {
        document.getElementById("titulo-vencedor").innerText = "DEU EMPATE! 🤝";
        winImg.style.display = "none"; winLab.innerText = "";
    }
    document.getElementById("mensagem-final").innerText = "Placar Final:\n" + j1Nome + ": " + j1Pontos + " pontos\n" + j2Nome + ": " + j2Pontos + " pontos";
}

function embaralharPerguntas(array) {
    let arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}