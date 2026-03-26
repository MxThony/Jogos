console.log("🚀 SCRIPT.JS DEFINITIVO COM PLACAR TV, ÁUDIO E FULLSCREEN");

const firebaseConfig = {
    apiKey: "AIzaSyDbvleD3CCVEOybvc7B-sKmzL1ugnHiMyk",
    authDomain: "copa-saminina.firebaseapp.com",
    databaseURL: "https://copa-saminina-default-rtdb.firebaseio.com",
    projectId: "copa-saminina",
    storageBucket: "copa-saminina.firebasestorage.app",
    messagingSenderId: "961413845237",
    appId: "1:961413845237:web:4c2b36f903a3f3c0f9f5bc"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

const somAcerto = new Audio('audio/acerto.mp3');
const somErro = new Audio('audio/erro.mp3');
const musicaFundo = new Audio('audio/fundo.mp3');

somAcerto.volume = 0.5;
somErro.volume = 0.4;
musicaFundo.volume = 0.15;
musicaFundo.loop = true;

const listaAvatares = ['img/1.jpg', 'img/2.jpg', 'img/3.jpg', 'img/4.jpg'];

let j1Nome = "";
let j2Nome = "";
let j1Pontos = 0;
let j2Pontos = 0;
let j1Avatar = "";
let j2Avatar = "";
let j1Streak = 0;
let j2Streak = 0;
let errosSeguidosJ1 = 0;
let errosSeguidosJ2 = 0;
let ePerguntaOuro = false;

let perguntaAtual = 0;
let jogadorAtual = 1;
let perguntasDaRodada = [];
let tempoRestante = 30;
let controleCronometro;
let controleTimeout;
let modoDeJogo = "";
let audioMutado = false;

const bancoDePerguntas = [
    { pergunta: "Quantas Copas o Brasil ganhou?", respostas: ["3", "4", "5"], respostaCerta: 2 },
    { pergunta: "Quem é o maior artilheiro das Copas?", respostas: ["Pelé", "Ronaldo", "Miroslav Klose"], respostaCerta: 2 },
    { pergunta: "Onde foi a primeira Copa em 1930?", respostas: ["Argentina", "Brasil", "Uruguai"], respostaCerta: 2 },
    { pergunta: "Qual jogador é o 'Rei do Futebol'?", respostas: ["Garrincha", "Zico", "Pelé"], respostaCerta: 2 },
    { pergunta: "Em qual Copa o Brasil sofreu o 7x1?", respostas: ["2010", "2014", "2018"], respostaCerta: 1 },
    { pergunta: "Qual o mascote da Copa de 2014?", respostas: ["Fuleco", "Zakumi", "La'eeb"], respostaCerta: 0 },
    { pergunta: "Qual país venceu a Copa de 2022?", respostas: ["França", "Brasil", "Argentina"], respostaCerta: 2 },
    { pergunta: "Qual é a cor da camisa principal do Brasil?", respostas: ["Azul", "Branca", "Amarela"], respostaCerta: 2 },
    { pergunta: "Quantos minutos dura um tempo normal?", respostas: ["45", "90", "100"], respostaCerta: 1 },
    { pergunta: "Quem foi o capitão do Penta em 2002?", respostas: ["Dunga", "Cafu", "Lúcio"], respostaCerta: 1 },
    { pergunta: "Qual cantor(a) gravou 'Waka Waka'?", respostas: ["Anitta", "Shakira", "Ivete"], respostaCerta: 1 },
    { pergunta: "Qual animal 'previa' resultados em 2010?", respostas: ["Gato", "Polvo Paul", "Cachorro"], respostaCerta: 1 },
    { pergunta: "O que o juiz usa para marcar a barreira?", respostas: ["Giz", "Tinta", "Spray de espuma"], respostaCerta: 2 },
    { pergunta: "Qual narrador diz 'Haja coração!'?", respostas: ["Galvão Bueno", "Cléber Machado", "Tiago Leifert"], respostaCerta: 0 },
    { pergunta: "Qual o estádio da final de 2014?", respostas: ["Mineirão", "Arena Cora", "Maracanã"], respostaCerta: 2 },
    { pergunta: "Quantas estrelas tem o escudo do Brasil?", respostas: ["4", "5", "6"], respostaCerta: 1 },
    { pergunta: "Em qual ano o Brasil ganhou o Tetra?", respostas: ["1990", "1994", "1998"], respostaCerta: 1 },
    { pergunta: "Qual jogador francês deu uma cabeçada em 2006?", respostas: ["Henry", "Ribéry", "Zidane"], respostaCerta: 2 },
    { pergunta: "Qual seleção é chamada de 'Azzurra'?", respostas: ["França", "Itália", "Grécia"], respostaCerta: 1 },
    { pergunta: "De quantos em quantos anos tem Copa?", respostas: ["2", "4", "5"], respostaCerta: 1 },
    { pergunta: "Quem é o 'Fenômeno' do Brasil?", respostas: ["Ronaldinho", "Neymar", "Ronaldo"], respostaCerta: 2 },
    { pergunta: "Qual país sediou a Copa de 2018?", respostas: ["Rússia", "Catar", "Brasil"], respostaCerta: 0 },
    { pergunta: "Quantas substituições podem ser feitas hoje?", respostas: ["3", "4", "5"], respostaCerta: 2 },
    { pergunta: "Qual prêmio recebe o melhor goleiro?", respostas: ["Luva de Ouro", "Bola", "Chuteira"], respostaCerta: 0 },
    { pergunta: "Onde fica a sede da FIFA?", respostas: ["Suíça", "França", "EUA"], respostaCerta: 0 },
    { pergunta: "Qual país ganhou a Copa de 2010?", respostas: ["Holanda", "Alemanha", "Espanha"], respostaCerta: 2 },
    { pergunta: "Em 1950, o Brasil usava que cor de camisa?", respostas: ["Azul", "Verde", "Branca"], respostaCerta: 2 },
    { pergunta: "Qual jogador é o 'CR7'?", respostas: ["Cristiano", "Ronaldinho", "Casemiro"], respostaCerta: 0 },
    { pergunta: "Quantos jogadores cada time tem em campo?", respostas: ["10", "11", "12"], respostaCerta: 1 },
    { pergunta: "O que significa VAR?", respostas: ["Juiz", "Árbitro de Vídeo", "Câmera"], respostaCerta: 1 },
    { pergunta: "Qual jogador brasileiro é o 'Bruxo'?", respostas: ["Neymar", "Ronaldinho", "Rivaldo"], respostaCerta: 1 },
    { pergunta: "Qual foi a sede da Copa de 2022?", respostas: ["Dubai", "Catar", "Arábia Saudita"], respostaCerta: 1 },
    { pergunta: "Como se chama a bola da Copa de 1970?", respostas: ["Jabulani", "Brazuca", "Telstar"], respostaCerta: 2 },
    { pergunta: "Qual seleção usa a cor Laranja?", respostas: ["Alemanha", "Holanda", "Bélgica"], respostaCerta: 1 },
    { pergunta: "Quem era o técnico do Penta?", respostas: ["Tite", "Felipão", "Dunga"], respostaCerta: 1 },
    { pergunta: "Qual país tem 4 títulos mundiais?", respostas: ["Itália", "Argentina", "Uruguai"], respostaCerta: 0 },
    { pergunta: "Quem fez gol de mão (La Mano de Dios)?", respostas: ["Pelé", "Maradona", "Messi"], respostaCerta: 1 },
    { pergunta: "Qual a maior goleada sofrida pelo Brasil?", respostas: ["3x0", "7x1", "5x2"], respostaCerta: 1 },
    { pergunta: "Qual cidade NÃO sediou a Copa 2014?", respostas: ["Cuiabá", "Manaus", "Arcoverde"], respostaCerta: 2 },
    { pergunta: "Qual a forma da taça da Copa?", respostas: ["Globo", "Dois atletas", "Chuteira"], respostaCerta: 1 },
    { pergunta: "Onde será a final da Copa de 2026?", respostas: ["Nova York/New Jersey", "Dallas", "Cidade do México"], respostaCerta: 0 },
    { pergunta: "Quantas seleções participarão da Copa de 2026?", respostas: ["32", "48", "64"], respostaCerta: 1 },
    { pergunta: "Quem marcou um golaço de bicicleta na Copa 2022?", respostas: ["Neymar", "Richarlison", "Vinícius Jr"], respostaCerta: 1 },
    { pergunta: "Qual o único jogador a vencer 3 Copas do Mundo?", respostas: ["Maradona", "Zidane", "Pelé"], respostaCerta: 2 },
    { pergunta: "Qual país sediará a Copa de 2026 junto com EUA e México?", respostas: ["Canadá", "Brasil", "Panamá"], respostaCerta: 0 },
    { pergunta: "Qual a maior artilheira de todas as Copas?", respostas: ["Marta", "Cristiane", "Mia Hamm"], respostaCerta: 0 },
    { pergunta: "Quem superou o recorde de gols de Pelé pela Seleção?", respostas: ["Ronaldo", "Neymar", "Romário"], respostaCerta: 1 },
    { pergunta: "Em 2022, qual seleção africana chegou à semifinal?", respostas: ["Egito", "Nigéria", "Marrocos"], respostaCerta: 2 },
    { pergunta: "Qual goleiro brilhou nos pênaltis na final de 2022?", respostas: ["Emiliano Martínez", "Lloris", "Alisson"], respostaCerta: 0 },
    { pergunta: "Qual o apelido da bola da Copa de 2014?", respostas: ["Brazuca", "Jabulani", "Al Rihla"], respostaCerta: 0 },
    { pergunta: "Quem é o jogador com mais partidas em Copas?", respostas: ["Messi", "Matthäus", "Klose"], respostaCerta: 0 },
    { pergunta: "Quantos anos Pelé tinha quando ganhou sua 1ª Copa?", respostas: ["17", "18", "19"], respostaCerta: 0 },
    { pergunta: "Qual seleção detém o título de 2022?", respostas: ["França", "Argentina", "Croácia"], respostaCerta: 1 },
    { pergunta: "Quem marcou 3 gols na final da Copa de 2022?", respostas: ["Messi", "Mbappé", "Julián Álvarez"], respostaCerta: 1 },
    { pergunta: "Onde aconteceu a Copa do Mundo de 2002?", respostas: ["Japão e Coreia do Sul", "China", "Alemanha"], respostaCerta: 0 },
    { pergunta: "Qual o nome do troféu da Copa antes de 1974?", respostas: ["Taça FIFA", "Jules Rimet", "Copa Ouro"], respostaCerta: 1 },
    { pergunta: "Qual foi a primeira Copa a usar o VAR?", respostas: ["2014", "2018", "2022"], respostaCerta: 1 },
    { pergunta: "Em qual cidade o Brasil perdeu de 7x1?", respostas: ["Rio de Janeiro", "Belo Horizonte", "São Paulo"], respostaCerta: 1 },
    { pergunta: "Quem é o técnico com mais jogos pelo Brasil?", respostas: ["Zagallo", "Tite", "Parreira"], respostaCerta: 0 },
    { pergunta: "Qual jogador é conhecido como 'O Baixinho'?", respostas: ["Zico", "Romário", "Bebeto"], respostaCerta: 1 },
    { pergunta: "Em que ano o Brasil sediou sua primeira Copa?", respostas: ["1930", "1950", "1962"], respostaCerta: 1 },
    { pergunta: "Qual seleção jogou todas as Copas do Mundo?", respostas: ["Alemanha", "Itália", "Brasil"], respostaCerta: 2 },
    { pergunta: "Quem fez o gol do título do Tetra em 1994?", respostas: ["Baggio", "Romário", "Dunga"], respostaCerta: 0 },
    { pergunta: "Qual era a cor da camisa do Brasil antes da amarela?", respostas: ["Branca", "Verde", "Azul"], respostaCerta: 0 },
    { pergunta: "Quem marcou o gol do título da Alemanha em 2014?", respostas: ["Müller", "Klose", "Götze"], respostaCerta: 2 },
    { pergunta: "Qual o estádio com maior capacidade da Copa 2026?", respostas: ["Azteca", "MetLife", "AT&T Stadium"], respostaCerta: 0 },
    { pergunta: "Qual jogador brasileiro jogou 3 finais seguidas?", respostas: ["Pelé", "Cafu", "Ronaldo"], respostaCerta: 1 },
    { pergunta: "Qual país venceu a Copa de 1998?", respostas: ["Brasil", "França", "Alemanha"], respostaCerta: 1 },
    { pergunta: "Quem é o maior artilheiro em uma única edição?", respostas: ["Just Fontaine", "Pelé", "Ronaldo"], respostaCerta: 0 },
    { pergunta: "Qual seleção tem o apelido de 'La Roja'?", respostas: ["Espanha", "Portugal", "Bélgica"], respostaCerta: 0 }
];

function getStreakData(streak) {
    const msgs = {
        3: "Hat-trick! 🎩",
        4: "Chocolate! 🍫",
        5: "Pentaaaa! 🖐️",
        6: "Calma lá, paizão! 🛑",
        7: "Alemanha de 2014? 🇩🇪",
        8: "Bayern de Munique 🏰",
        9: "Fora de Controle! 🚨",
        10: "Aí virou bagunça! 🤪"
    };
    return { msg: msgs[streak] || "", bonus: streak >= 3 ? 1 : 0 };
}

function calcularTitulo(pts) {
    if (pts <= 2) return "Perna de Pau 🦵";
    if (pts <= 5) return "Reserva de Luxo 🪑";
    if (pts <= 8) return "Titular Absoluto 🏃‍♂️";
    if (pts <= 11) return "Craque da Rodada 🌟";
    if (pts <= 14) return "Lenda do Penta 🏆";
    if (pts <= 17) return "Fenômeno das Copas 🇧🇷";
    return "O Inevitável 🤖";
}

function salvarEstadoResultado() {
    const dadosResultado = {
        titulo: document.getElementById("titulo-vencedor")?.innerText || "Fim de Jogo!",
        mensagem: document.getElementById("mensagem-final")?.innerText || "",
        avatar: document.getElementById("img-avatar-vencedor")?.src || "",
        mostrarAvatar: document.getElementById("img-avatar-vencedor")?.style.display !== "none",
        modoDeJogo,
        j1Nome,
        j2Nome,
        j1Pontos,
        j2Pontos
    };

    sessionStorage.setItem("resultadoCopaSaminina", JSON.stringify(dadosResultado));
}

function restaurarResultadoSeExistir() {
    const salvo = sessionStorage.getItem("resultadoCopaSaminina");
    if (!salvo) return;

    try {
        const dados = JSON.parse(salvo);

        document.getElementById("tela-modo").classList.add("escondido");
        document.getElementById("tela-inicial").classList.add("escondido");
        document.getElementById("tela-quiz").classList.add("escondido");
        document.getElementById("timer-container").classList.add("escondido");
        document.getElementById("tela-resultado").classList.remove("escondido");

        document.getElementById("titulo-vencedor").innerText = dados.titulo || "Fim de Jogo!";
        document.getElementById("mensagem-final").innerText = dados.mensagem || "";

        const img = document.getElementById("img-avatar-vencedor");
        if (dados.mostrarAvatar && dados.avatar) {
            img.src = dados.avatar;
            img.style.display = "block";
        } else {
            img.style.display = "none";
        }
    } catch (e) {
        console.log("Erro ao restaurar resultado:", e);
    }
}

function limparResultadoSalvo() {
    sessionStorage.removeItem("resultadoCopaSaminina");
}

function aplicarEstadoAudio() {
    somAcerto.muted = audioMutado;
    somErro.muted = audioMutado;
    musicaFundo.muted = audioMutado;

    const icone = document.getElementById("musica-icone");
    if (icone) {
        icone.innerText = audioMutado ? "🔇" : "🔊";
    }

    mostrarBotaoMuteSePreciso();
}

function mostrarBotaoMuteSePreciso() {
    const botaoMute = document.getElementById("btn-musica-toggle");
    if (!botaoMute) return;

    const deveMostrar = !musicaFundo.paused;
    botaoMute.classList.toggle("visivel", deveMostrar);
}

function toggleMusica() {
    audioMutado = !audioMutado;
    aplicarEstadoAudio();
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log("Erro ao entrar em tela cheia:", err);
        });
    } else {
        document.exitFullscreen().catch(err => {
            console.log("Erro ao sair da tela cheia:", err);
        });
    }
}

function abrirRankingMestreInicio() {
    window.location.href = "ranking-mestre.html?fs=1";
}

function abrirRankingMestreResultado() {
    salvarEstadoResultado();
    window.location.href = "ranking-mestre.html?fs=1&origem=resultado";
}

function selecionarModo(m) {
    limparResultadoSalvo();

    modoDeJogo = m;

    document.getElementById("tela-modo").classList.add("escondido");
    document.getElementById("tela-inicial").classList.remove("escondido");
    document.getElementById("container-avatar2").classList.toggle("escondido", m === "solo");

    j1Pontos = 0;
    j2Pontos = 0;
    j1Streak = 0;
    j2Streak = 0;
    errosSeguidosJ1 = 0;
    errosSeguidosJ2 = 0;
    perguntaAtual = 0;
    jogadorAtual = 1;
    j1Nome = "";
    j2Nome = "";
    j1Avatar = "";
    j2Avatar = "";
    ePerguntaOuro = false;

    document.getElementById("placar-pts-j1").innerText = "0";
    document.getElementById("placar-pts-j2").innerText = "0";

    document.querySelectorAll(".img-avatar-opcao").forEach(img => img.classList.remove("selecionado"));
    document.getElementById("input-nome1").value = "";
    document.getElementById("input-nome2").value = "";

    document.querySelector(".emoji-container")?.classList.remove("escondido");
    document.getElementById("feedback-agradecimento")?.classList.add("escondido");
    document.getElementById("secao-pesquisa")?.classList.remove("escondido");
}

function voltarParaModos() {
    limparResultadoSalvo();
    document.getElementById("tela-inicial").classList.add("escondido");
    document.getElementById("tela-modo").classList.remove("escondido");
}

function selecionarAvatar(j, i, el) {
    const av = listaAvatares[i];
    if (j === 1) {
        j1Avatar = av;
    } else {
        j2Avatar = av;
    }

    el.parentElement.querySelectorAll("img").forEach(img => img.classList.remove("selecionado"));
    el.classList.add("selecionado");
}

function validarComeco() {
    limparResultadoSalvo();

    j1Nome = document.getElementById("input-nome1").value.trim().toUpperCase();

    if (modoDeJogo === "solo") {
        j2Nome = "REI DAS COPAS";
        j2Avatar = "img/1.jpg";
    } else {
        j2Nome = document.getElementById("input-nome2").value.trim().toUpperCase();
    }

    if (!j1Nome || !j1Avatar || (modoDeJogo === "batalha" && (!j2Nome || !j2Avatar))) {
        alert("Preencha os craques e escolha os avatares!");
        return;
    }

    document.getElementById("placar-nome-j1").innerText = j1Nome;
    document.getElementById("img-avatar-placar1").src = j1Avatar;
    document.getElementById("placar-nome-j2").innerText = j2Nome;
    document.getElementById("img-avatar-placar2").src = j2Avatar;

    perguntasDaRodada = [...bancoDePerguntas].sort(() => 0.5 - Math.random()).slice(0, 10);

    document.getElementById("tela-inicial").classList.add("escondido");
    document.getElementById("tela-quiz").classList.remove("escondido");
    document.getElementById("timer-container").classList.remove("escondido");

    musicaFundo.currentTime = 0;
    musicaFundo.play()
        .then(() => {
            aplicarEstadoAudio();
        })
        .catch(err => {
            console.log("Não foi possível iniciar o áudio automaticamente:", err);
            aplicarEstadoAudio();
        });

    mostrarPergunta();
    iniciarCronometro();
}

function mostrarPergunta() {
    const d = perguntasDaRodada[perguntaAtual];
    const quizContainer = document.querySelector(".quiz-container");

    const avisoTurno = document.getElementById("aviso-turno-nome");
    if (avisoTurno) {
        avisoTurno.innerText = `Vez de: ${(jogadorAtual === 1 ? j1Nome : j2Nome).toUpperCase()}`;
    }

    if (modoDeJogo === "batalha") {
        const lado1 = document.querySelector(".placar-item-j1");
        const lado2 = document.querySelector(".placar-item-j2");

        if (lado1 && lado2) {
            lado1.style.opacity = jogadorAtual === 1 ? "1" : "0.4";
            lado2.style.opacity = jogadorAtual === 2 ? "1" : "0.4";
        }
    } else {
        const lado1 = document.querySelector(".placar-item-j1");
        const lado2 = document.querySelector(".placar-item-j2");
        if (lado1) lado1.style.opacity = "1";
        if (lado2) lado2.style.opacity = "1";
    }

    const errosAtuais = jogadorAtual === 1 ? errosSeguidosJ1 : errosSeguidosJ2;
    ePerguntaOuro = errosAtuais >= 2;

    if (ePerguntaOuro) {
        quizContainer.classList.add("ouro-active");
        document.getElementById("texto-pergunta").innerHTML =
            `<span style="color: #DAA520; font-weight: 900; display: block; margin-bottom: 10px;">⭐ PERGUNTA DE OURO ⭐</span>${d.pergunta}`;
    } else {
        quizContainer.classList.remove("ouro-active");
        document.getElementById("texto-pergunta").innerText = d.pergunta;
    }

    document.getElementById("barra-progresso").innerText = `Pergunta ${perguntaAtual + 1} de 10`;
    document.getElementById("feedback-acerto").classList.add("escondido");
    document.getElementById("feedback-erro").classList.add("escondido");
    document.getElementById("streak-popup").innerText = "";

    const area = document.getElementById("area-botoes");
    area.innerHTML = "";

    d.respostas.forEach((r, i) => {
        const b = document.createElement("button");
        b.className = "btn-resposta";
        b.innerText = r;
        b.onclick = () => verificarResposta(i, b);
        area.appendChild(b);
    });
}

function iniciarCronometro() {
    tempoRestante = 30;
    clearInterval(controleCronometro);

    document.getElementById("timer-display").innerText = `Tempo: ${tempoRestante}s`;

    controleCronometro = setInterval(() => {
        tempoRestante--;
        document.getElementById("timer-display").innerText = `Tempo: ${tempoRestante}s`;

        if (tempoRestante <= 0) {
            clearInterval(controleCronometro);
            somErro.currentTime = 0;
            somErro.play().catch(() => {});
            verificarResposta(-1, null);
        }
    }, 1000);
}

function verificarResposta(idxSelecionado, botaoClicado) {
    clearInterval(controleCronometro);

    const correta = perguntasDaRodada[perguntaAtual].respostaCerta;
    const botoes = document.querySelectorAll(".btn-resposta");

    botoes.forEach(btn => btn.disabled = true);

    if (idxSelecionado === correta) {
        somAcerto.currentTime = 0;
        somAcerto.play().catch(() => {});

        if (botaoClicado) {
            botaoClicado.classList.add("correta");
        }

        document.getElementById("feedback-acerto").classList.remove("escondido");

        let streak = jogadorAtual === 1 ? ++j1Streak : ++j2Streak;
        let ptsQuestao = ePerguntaOuro ? 2 : 1;
        let bonus = getStreakData(streak).bonus;

        if (jogadorAtual === 1) {
            j1Pontos += ptsQuestao + bonus;
            errosSeguidosJ1 = 0;
            document.getElementById("placar-pts-j1").innerText = j1Pontos;
        } else {
            j2Pontos += ptsQuestao + bonus;
            errosSeguidosJ2 = 0;
            document.getElementById("placar-pts-j2").innerText = j2Pontos;
        }

        if (bonus > 0) {
            document.getElementById("streak-popup").innerText = getStreakData(streak).msg;
        }
    } else {
        somErro.currentTime = 0;
        somErro.play().catch(() => {});

        if (botaoClicado) {
            botaoClicado.classList.add("errada");
        }

        if (botoes[correta]) {
            botoes[correta].classList.add("correta");
        }

        document.getElementById("feedback-erro").classList.remove("escondido");

        if (jogadorAtual === 1) {
            j1Streak = 0;
            errosSeguidosJ1++;

            if (modoDeJogo === "solo") {
                j2Pontos++;
                document.getElementById("placar-pts-j2").innerText = j2Pontos;
            }
        } else {
            j2Streak = 0;
            errosSeguidosJ2++;
        }
    }

    controleTimeout = setTimeout(() => {
        perguntaAtual++;

        if (perguntaAtual >= 10) {
            finalizarJogo();
        } else {
            if (modoDeJogo === "batalha") {
                jogadorAtual = jogadorAtual === 1 ? 2 : 1;
            }
            mostrarPergunta();
            iniciarCronometro();
        }
    }, 2500);
}

function finalizarJogo() {
    musicaFundo.pause();
    mostrarBotaoMuteSePreciso();

    document.getElementById("tela-quiz").classList.add("escondido");
    document.getElementById("timer-container").classList.add("escondido");
    document.getElementById("tela-resultado").classList.remove("escondido");

    let vencedor;
    let vAvatar;
    let vPontos;

    if (modoDeJogo === "solo") {
        vencedor = j1Nome;
        vAvatar = j1Avatar;
        vPontos = j1Pontos;
        salvarNoRanking(j1Nome, j1Avatar, j1Pontos, j1Pontos >= 10);
    } else {
        vencedor = j1Pontos >= j2Pontos ? j1Nome : j2Nome;
        vAvatar = j1Pontos >= j2Pontos ? j1Avatar : j2Avatar;
        vPontos = Math.max(j1Pontos, j2Pontos);

        if (j1Pontos !== j2Pontos) {
            salvarNoRanking(vencedor, vAvatar, vPontos, true);
        } else {
            salvarNoRanking(vencedor, vAvatar, vPontos, false);
        }
    }

    document.getElementById("img-avatar-vencedor").style.display = "block";
    document.getElementById("img-avatar-vencedor").src = vAvatar;
    document.getElementById("titulo-vencedor").innerText =
        modoDeJogo === "batalha" && j1Pontos === j2Pontos ? "Empate!" : `${vencedor} Venceu!`;
    document.getElementById("mensagem-final").innerText = `${vPontos} Pontos\n${calcularTitulo(vPontos)}`;

    salvarEstadoResultado();

    if (vPontos >= 10) {
        confetti({ particleCount: 300, spread: 100 });
    }
}

function confirmarDesistencia() {
    const nome = (modoDeJogo === "solo" ? j1Nome : (jogadorAtual === 1 ? j1Nome : j2Nome)).toUpperCase();

    if (confirm(`${nome}, deseja abandonar a partida?`)) {
        clearInterval(controleCronometro);
        clearTimeout(controleTimeout);

        musicaFundo.pause();
        mostrarBotaoMuteSePreciso();

        somErro.currentTime = 0;
        somErro.play().catch(() => {});

        let tit = "ABANDONOU! 🏳️";
        let msg = "";
        let winAv = "";

        if (modoDeJogo === "solo") {
            msg = `${j1Nome} desistiu.\nTítulo: Perna de Pau 🪵`;
            salvarNoRanking(j1Nome, j1Avatar, 0, false, "Arregou 🏳️");
        } else {
            const vNome = jogadorAtual === 1 ? j2Nome : j1Nome;
            const vAv = jogadorAtual === 1 ? j2Avatar : j1Avatar;

            tit = `${vNome.toUpperCase()} VENCEU POR W.O.! 🏆`;
            msg = `${nome} desistiu!\n${vNome} ganha uma Copa automática.`;
            winAv = vAv;

            salvarNoRanking(vNome, vAv, 10, true, "Venceu por W.O. 🏆");
        }

        document.getElementById("titulo-vencedor").innerText = tit;
        document.getElementById("mensagem-final").innerText = msg;

        const imgV = document.getElementById("img-avatar-vencedor");
        if (winAv) {
            imgV.src = winAv;
            imgV.style.display = "block";
        } else {
            imgV.style.display = "none";
        }

        document.querySelector(".quiz-container").classList.remove("ouro-active");
        document.getElementById("tela-quiz").classList.add("escondido");
        document.getElementById("timer-container").classList.add("escondido");
        document.getElementById("secao-pesquisa").classList.add("escondido");
        document.getElementById("tela-resultado").classList.remove("escondido");

        salvarEstadoResultado();
    } else {
        iniciarCronometro();
    }
}

function salvarNoRanking(nome, avatar, pontos, ganhouCopa, tituloEspecial = null) {
    const nomeLimpo = nome.trim().toUpperCase();
    const ref = database.ref("samininaRanking/" + nomeLimpo);

    ref.once("value").then(s => {
        let data = s.exists() ? s.val() : {};
        data.nome = nomeLimpo;
        data.avatar = avatar;
        data.pontosTotais = (Number(data.pontosTotais) || 0) + Number(pontos);
        data.copas = (Number(data.copas) || 0) + (ganhouCopa ? 1 : 0);
        ref.set(data);
    });

    database.ref("historicoPartidas").push({
        nome: nomeLimpo,
        avatar: avatar,
        pontos: pontos,
        titulo: tituloEspecial || calcularTitulo(pontos),
        timestamp: firebase.database.ServerValue.TIMESTAMP
    });
}

function enviarPesquisa(reacao) {
    database.ref("pesquisaSatisfacao").push({
        voto: reacao,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    }).then(() => {
        document.querySelector(".emoji-container").classList.add("escondido");
        const feedback = document.getElementById("feedback-agradecimento");
        if (feedback) {
            feedback.classList.remove("escondido");
        }
    });
}

function gerarDesafio() {
    document.getElementById("modal-desafio").classList.remove("escondido");
    document.getElementById("qrcode-desafio").innerHTML = "";

    const nomeDesafiante = modoDeJogo === "solo" ? j1Nome : (j1Pontos >= j2Pontos ? j1Nome : j2Nome);
    const pontosDesafiante = modoDeJogo === "solo" ? j1Pontos : Math.max(j1Pontos, j2Pontos);

    const linkJogo = window.location.origin + window.location.pathname;
    const mensagem = `Fiz ${pontosDesafiante} pontos na Copa Saminina! Meu título é ${calcularTitulo(pontosDesafiante)}. 🏆⚽ Duvido você bater meu recorde! Jogue agora: ${linkJogo}`;
    const linkWhatsApp = `https://api.whatsapp.com/send?text=${encodeURIComponent(mensagem)}`;

    new QRCode(document.getElementById("qrcode-desafio"), {
        text: linkWhatsApp,
        width: 180,
        height: 180
    });
}

function fecharModalDesafio() {
    document.getElementById("modal-desafio").classList.add("escondido");
}

function gerarQRCodeInicial() {
    const container = document.getElementById("qrcode-container");
    if (!container) return;

    container.innerHTML = "";

    new QRCode(container, {
        text: "https://mxthony.github.io/Jogos/ranking.html",
        width: 120,
        height: 120,
        colorDark: "#003399",
        colorLight: "#ffffff"
    });
}

function verificarSenhaReset() {
    let senha = prompt("🔐 ACESSO RESTRITO\nDigite a senha para ver o relatório ou zerar o banco:");

    if (senha === "321") {
        if (confirm("Deseja limpar todo o banco de dados?")) {
            database.ref().remove().then(() => {
                alert("Limpo!");
                location.reload();
            });
        }
    } else if (senha !== null) {
        alert("Senha incorreta!");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    gerarQRCodeInicial();
    aplicarEstadoAudio();
    mostrarBotaoMuteSePreciso();

    const params = new URLSearchParams(window.location.search);
    if (params.get("voltarResultado") === "1") {
        restaurarResultadoSeExistir();
    }
});