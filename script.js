console.log("Copa Saminina carregada com modos solo, local e online");

// =========================
// FIREBASE
// =========================
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

// =========================
// ÁUDIO
// =========================
const somAcerto = new Audio("audio/acerto.mp3");
const somErro = new Audio("audio/erro.mp3");
const musicaFundo = new Audio("audio/fundo.mp3");

somAcerto.volume = 0.5;
somErro.volume = 0.4;
musicaFundo.volume = 0.15;
musicaFundo.loop = true;

let audioMutado = false;

// =========================
// ESTADO GERAL
// =========================
const listaAvatares = ["img/1.jpg", "img/2.jpg", "img/3.jpg", "img/4.jpg"];

let modoDeJogo = "";
let salaId = null;
let jogadorTipo = null; // host | convidado
let linkSalaAtual = "";
let salaListenerAtivo = false;
let jogoListenerAtivo = false;
let feedListenerAtivo = false;

let j1Nome = "";
let j2Nome = "";
let j1Avatar = "";
let j2Avatar = "";

let j1Pontos = 0;
let j2Pontos = 0;

let j1Streak = 0;
let j2Streak = 0;
let errosSeguidosJ1 = 0;
let errosSeguidosJ2 = 0;
let ePerguntaOuro = false;

let perguntaAtual = 0;
let jogadorAtual = 1;
let perguntasDaRodada = [];

let tempoRestante = 30;
let controleCronometro = null;
let controleTimeout = null;

let onlineDataAtual = null;
let resultadoSalvoNaSessao = false;

// =========================
// BANCO DE PERGUNTAS
// =========================
const bancoDePerguntas = [
    { pergunta: "Quantas Copas o Brasil ganhou?", respostas: ["3", "4", "5"], respostaCerta: 2 },
    { pergunta: "Quem é o maior artilheiro da história das Copas?", respostas: ["Pelé", "Ronaldo", "Miroslav Klose"], respostaCerta: 2 },
    { pergunta: "Onde foi a primeira Copa do Mundo, em 1930?", respostas: ["Argentina", "Brasil", "Uruguai"], respostaCerta: 2 },
    { pergunta: "Qual jogador é conhecido como o Rei do Futebol?", respostas: ["Garrincha", "Zico", "Pelé"], respostaCerta: 2 },
    { pergunta: "Em qual Copa o Brasil sofreu o 7 a 1?", respostas: ["2010", "2014", "2018"], respostaCerta: 1 },
    { pergunta: "Qual foi o mascote da Copa de 2014?", respostas: ["Fuleco", "Zakumi", "La'eeb"], respostaCerta: 0 },
    { pergunta: "Qual país venceu a Copa de 2022?", respostas: ["França", "Brasil", "Argentina"], respostaCerta: 2 },
    { pergunta: "Qual é a cor da camisa principal do Brasil?", respostas: ["Azul", "Branca", "Amarela"], respostaCerta: 2 },
    { pergunta: "Quantos minutos dura um tempo de jogo?", respostas: ["45", "90", "100"], respostaCerta: 0 },
    { pergunta: "Quem foi o capitão do penta em 2002?", respostas: ["Dunga", "Cafu", "Lúcio"], respostaCerta: 1 },
    { pergunta: "Qual cantora gravou Waka Waka, música da Copa de 2010?", respostas: ["Anitta", "Shakira", "Ivete"], respostaCerta: 1 },
    { pergunta: "Qual animal ficou famoso por prever resultados em 2010?", respostas: ["Gato", "Polvo Paul", "Cachorro"], respostaCerta: 1 },
    { pergunta: "O que o juiz usa para marcar a barreira?", respostas: ["Giz", "Tinta", "Spray de espuma"], respostaCerta: 2 },
    { pergunta: "Qual narrador ficou famoso pelo bordão Haja coração?", respostas: ["Galvão Bueno", "Cléber Machado", "Tiago Leifert"], respostaCerta: 0 },
    { pergunta: "Qual foi o estádio da final da Copa de 2014?", respostas: ["Mineirão", "Arena Corinthians", "Maracanã"], respostaCerta: 2 },
    { pergunta: "Quantas estrelas tem o escudo da Seleção Brasileira?", respostas: ["4", "5", "6"], respostaCerta: 1 },
    { pergunta: "Em qual ano o Brasil ganhou o tetra?", respostas: ["1990", "1994", "1998"], respostaCerta: 1 },
    { pergunta: "Qual jogador francês deu a cabeçada na final de 2006?", respostas: ["Henry", "Ribéry", "Zidane"], respostaCerta: 2 },
    { pergunta: "Qual seleção é chamada de Azzurra?", respostas: ["França", "Itália", "Grécia"], respostaCerta: 1 },
    { pergunta: "De quantos em quantos anos acontece a Copa do Mundo?", respostas: ["2", "4", "5"], respostaCerta: 1 },
    { pergunta: "Quem é conhecido como o Fenômeno?", respostas: ["Ronaldinho", "Neymar", "Ronaldo"], respostaCerta: 2 },
    { pergunta: "Qual país sediou a Copa de 2018?", respostas: ["Rússia", "Catar", "Brasil"], respostaCerta: 0 },
    { pergunta: "Quantas substituições podem ser feitas no futebol atual?", respostas: ["3", "4", "5"], respostaCerta: 2 },
    { pergunta: "Qual prêmio recebe o melhor goleiro da Copa?", respostas: ["Luva de Ouro", "Bola de Ouro", "Chuteira de Ouro"], respostaCerta: 0 },
    { pergunta: "Onde fica a sede da FIFA?", respostas: ["Suíça", "França", "Estados Unidos"], respostaCerta: 0 },
    { pergunta: "Qual país ganhou a Copa de 2010?", respostas: ["Holanda", "Alemanha", "Espanha"], respostaCerta: 2 },
    { pergunta: "Em 1950, o Brasil usava qual cor de camisa?", respostas: ["Azul", "Verde", "Branca"], respostaCerta: 2 },
    { pergunta: "Qual jogador é conhecido como CR7?", respostas: ["Cristiano Ronaldo", "Ronaldinho", "Casemiro"], respostaCerta: 0 },
    { pergunta: "Quantos jogadores cada time tem em campo?", respostas: ["10", "11", "12"], respostaCerta: 1 },
    { pergunta: "O que significa VAR?", respostas: ["Video Assistant Referee", "Visual Auto Replay", "Verified Action Review"], respostaCerta: 0 },
    { pergunta: "Qual jogador brasileiro é conhecido como Bruxo?", respostas: ["Neymar", "Ronaldinho Gaúcho", "Rivaldo"], respostaCerta: 1 },
    { pergunta: "Qual foi a sede da Copa de 2022?", respostas: ["Dubai", "Catar", "Arábia Saudita"], respostaCerta: 1 },
    { pergunta: "Como se chama a bola da Copa de 1970?", respostas: ["Jabulani", "Brazuca", "Telstar"], respostaCerta: 2 },
    { pergunta: "Qual seleção usa tradicionalmente a cor laranja?", respostas: ["Alemanha", "Holanda", "Bélgica"], respostaCerta: 1 },
    { pergunta: "Quem era o técnico do penta em 2002?", respostas: ["Tite", "Felipão", "Dunga"], respostaCerta: 1 },
    { pergunta: "Qual país foi tetracampeão antes da Alemanha?", respostas: ["Itália", "Argentina", "Uruguai"], respostaCerta: 0 },
    { pergunta: "Quem fez o gol de mão conhecido como La Mano de Dios?", respostas: ["Pelé", "Maradona", "Messi"], respostaCerta: 1 },
    { pergunta: "Qual foi a maior goleada sofrida pelo Brasil em Copas?", respostas: ["3 a 0", "7 a 1", "5 a 2"], respostaCerta: 1 },
    { pergunta: "Qual cidade não sediou a Copa de 2014?", respostas: ["Cuiabá", "Manaus", "Arcoverde"], respostaCerta: 2 },
    { pergunta: "A taça da Copa mostra o quê?", respostas: ["Um globo", "Dois atletas sustentando o mundo", "Uma chuteira"], respostaCerta: 1 },

    { pergunta: "Quem é o único jogador tricampeão mundial como atleta?", respostas: ["Ronaldo", "Pelé", "Zidane"], respostaCerta: 1 },
    { pergunta: "Qual brasileiro era chamado de Anjo das Pernas Tortas?", respostas: ["Garrincha", "Romário", "Sócrates"], respostaCerta: 0 },
    { pergunta: "Quem marcou os dois gols do Brasil na final de 2002?", respostas: ["Rivaldo", "Ronaldo", "Ronaldinho"], respostaCerta: 1 },
    { pergunta: "Em que país aconteceu a Copa de 1994?", respostas: ["México", "Estados Unidos", "França"], respostaCerta: 1 },
    { pergunta: "Qual ex-camisa 10 brasileiro era chamado de Galinho de Quintino?", respostas: ["Zico", "Kaká", "Rivelino"], respostaCerta: 0 },
    { pergunta: "Quem foi o capitão do Brasil no tetra de 1994?", respostas: ["Romário", "Dunga", "Bebeto"], respostaCerta: 1 },
    { pergunta: "Qual jogador brasileiro fez o famoso corta-luz na final de 2002?", respostas: ["Rivaldo", "Kaká", "Juninho"], respostaCerta: 0 },
    { pergunta: "Qual seleção eliminou o Brasil na Copa de 2006?", respostas: ["Itália", "França", "Portugal"], respostaCerta: 1 },
    { pergunta: "Qual lendário jogador usava a camisa 11 no Brasil de 1970?", respostas: ["Jairzinho", "Tostão", "Rivelino"], respostaCerta: 0 },
    { pergunta: "Quem é conhecido como Baixinho no futebol brasileiro?", respostas: ["Romário", "Bebeto", "Careca"], respostaCerta: 0 },
    { pergunta: "Qual seleção venceu a Copa de 1998?", respostas: ["Brasil", "França", "Alemanha"], respostaCerta: 1 },
    { pergunta: "Quem foi o técnico da seleção brasileira no tetra de 1994?", respostas: ["Parreira", "Zagallo", "Felipão"], respostaCerta: 0 },
    { pergunta: "Qual ídolo brasileiro era conhecido como Doutor?", respostas: ["Sócrates", "Raí", "Falcão"], respostaCerta: 0 },
    { pergunta: "Quem marcou o gol do título da Alemanha em 2014?", respostas: ["Müller", "Klose", "Götze"], respostaCerta: 2 },
    { pergunta: "Qual jogador brasileiro formou dupla de ataque com Bebeto em 1994?", respostas: ["Romário", "Adriano", "Neymar"], respostaCerta: 0 },
    { pergunta: "Quem foi o goleiro titular do Brasil no penta?", respostas: ["Taffarel", "Dida", "Marcos"], respostaCerta: 2 },
    { pergunta: "Qual seleção venceu a Copa de 1986?", respostas: ["Alemanha", "Argentina", "Brasil"], respostaCerta: 1 },
    { pergunta: "Qual brasileiro foi eleito melhor jogador da Copa de 1994?", respostas: ["Romário", "Bebeto", "Dunga"], respostaCerta: 0 },
    { pergunta: "Qual camisa Pelé usava na Seleção Brasileira?", respostas: ["7", "9", "10"], respostaCerta: 2 },
    { pergunta: "Qual país sediou a Copa de 1970?", respostas: ["México", "Chile", "Alemanha"], respostaCerta: 0 },
    { pergunta: "Quem marcou o gol de falta contra a Inglaterra em 2002?", respostas: ["Rivaldo", "Ronaldinho Gaúcho", "Cafu"], respostaCerta: 1 },
    { pergunta: "Qual técnico brasileiro ganhou a Copa como jogador e treinador?", respostas: ["Zagallo", "Parreira", "Felipão"], respostaCerta: 0 },
    { pergunta: "Quem levantou a taça do penta como capitão?", respostas: ["Cafu", "Ronaldo", "Roberto Carlos"], respostaCerta: 0 },
    { pergunta: "Qual seleção foi campeã da Copa de 1978?", respostas: ["Holanda", "Argentina", "Brasil"], respostaCerta: 1 },
    { pergunta: "Quem marcou dois gols na final da Copa de 1958 pelo Brasil?", respostas: ["Vavá", "Pelé", "Garrincha"], respostaCerta: 1 },
    { pergunta: "Quem foi o técnico do Brasil campeão em 1970?", respostas: ["Zagallo", "Telê Santana", "Parreira"], respostaCerta: 0 },
    { pergunta: "Qual jogador brasileiro ficou famoso pela comemoração embalando o bebê?", respostas: ["Romário", "Bebeto", "Careca"], respostaCerta: 1 },
    { pergunta: "Qual seleção eliminou o Brasil nos pênaltis em 1986?", respostas: ["França", "Itália", "Argentina"], respostaCerta: 0 },
    { pergunta: "Quem era conhecido como Canhotinha de Ouro?", respostas: ["Gérson", "Rivelino", "Zico"], respostaCerta: 0 },
    { pergunta: "Contra qual seleção o Brasil venceu a final da Copa de 1994?", respostas: ["Alemanha", "Itália", "Argentina"], respostaCerta: 1 },
    { pergunta: "Quem foi o goleiro titular do Brasil no tetra de 1994?", respostas: ["Taffarel", "Marcos", "Dida"], respostaCerta: 0 }
];

// =========================
// UTILITÁRIOS
// =========================
function getStreakData(streak) {
    const msgs = {
        3: "Hat-trick!",
        4: "Chocolate!",
        5: "Pentaaaa!",
        6: "Calma lá!",
        7: "Virou passeio!",
        8: "Domínio total!",
        9: "Sem freio!",
        10: "Aí virou bagunça!"
    };
    return { msg: msgs[streak] || "", bonus: streak >= 3 ? 1 : 0 };
}

function calcularTitulo(pts) {
    if (pts <= 2) return "Perna de Pau";
    if (pts <= 5) return "Reserva de Luxo";
    if (pts <= 8) return "Titular Absoluto";
    if (pts <= 11) return "Craque da Rodada";
    if (pts <= 14) return "Lenda do Penta";
    if (pts <= 17) return "Fenômeno das Copas";
    return "O Inevitável";
}

function shuffleArray(arr) {
    const copia = [...arr];
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

function gerarPerguntasAleatorias(qtd = 10) {
    return shuffleArray(bancoDePerguntas).slice(0, qtd);
}

function gerarCodigoSala() {
    return Math.random().toString(36).substring(2, 7);
}

// =========================
// ÁUDIO
// =========================
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
    botaoMute.classList.toggle("visivel", !musicaFundo.paused);
}

function toggleMusica() {
    audioMutado = !audioMutado;
    aplicarEstadoAudio();
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
    } else {
        document.exitFullscreen().catch(() => {});
    }
}

// =========================
// RESULTADO SALVO
// =========================
function salvarEstadoResultado() {
    const dadosResultado = {
        titulo: document.getElementById("titulo-vencedor")?.innerText || "Fim de Jogo!",
        mensagem: document.getElementById("mensagem-final")?.innerText || "",
        avatar: document.getElementById("img-avatar-vencedor")?.src || "",
        mostrarAvatar: document.getElementById("img-avatar-vencedor")?.style.display !== "none"
    };

    sessionStorage.setItem("resultadoCopaSaminina", JSON.stringify(dadosResultado));
    resultadoSalvoNaSessao = true;
}

function restaurarResultadoSeExistir() {
    const salvo = sessionStorage.getItem("resultadoCopaSaminina");
    if (!salvo) return;

    try {
        const dados = JSON.parse(salvo);

        esconderTodasAsTelas();
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
    resultadoSalvoNaSessao = false;
}

// =========================
// TELAS
// =========================
function esconderTodasAsTelas() {
    const ids = [
        "tela-modo",
        "tela-inicial",
        "tela-quiz",
        "tela-resultado",
        "timer-container",
        "tela-espera-online"
    ];

    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add("escondido");
    });
}

function mostrarTelaAguardandoOnline(texto = "Aguardando o outro jogador...") {
    let tela = document.getElementById("tela-espera-online");

    if (!tela) {
        tela = document.createElement("div");
        tela.id = "tela-espera-online";
        tela.className = "quiz-container";
        tela.innerHTML = `
            <h2 id="texto-espera-online">Aguardando o outro jogador...</h2>
            <p style="margin-top: 10px; color: var(--color-blue); font-weight: bold;">
                Assim que os dois estiverem prontos, a partida começa.
            </p>
            <div id="feed-espera" class="feed-ao-vivo" style="margin-top:16px;"></div>
        `;
        const wrapper = document.querySelector(".main-wrapper");
        if (wrapper) wrapper.appendChild(tela);
    }

    const textoEl = document.getElementById("texto-espera-online");
    if (textoEl) textoEl.innerText = texto;

    tela.classList.remove("escondido");
}

function esconderTelaAguardandoOnline() {
    const tela = document.getElementById("tela-espera-online");
    if (tela) tela.classList.add("escondido");
}

// =========================
// COMPARTILHAMENTO
// =========================
function copiarLinkSala() {
    if (!linkSalaAtual) return;
    navigator.clipboard.writeText(linkSalaAtual).then(() => {
        alert("Link copiado!");
    }).catch(() => {
        alert("Não foi possível copiar o link.");
    });
}

function compartilharWhatsapp() {
    if (!linkSalaAtual) return;
    const mensagem = `Entre na minha partida da Copa Saminina: ${linkSalaAtual}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(mensagem)}`, "_blank");
}

function fecharModalCompartilhar() {
    const modal = document.getElementById("modal-compartilhar");
    if (modal) modal.classList.add("escondido");
}

// =========================
// QRCODE E RESET
// =========================
function gerarQRCodeInicial() {
    const container = document.getElementById("qrcode-container");
    if (!container || typeof QRCode === "undefined") return;

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
    const senha = prompt("Digite a senha para limpar o banco:");
    if (senha === "321") {
        if (confirm("Deseja limpar todo o banco de dados?")) {
            database.ref().remove().then(() => {
                alert("Banco limpo!");
                location.reload();
            });
        }
    } else if (senha !== null) {
        alert("Senha incorreta!");
    }
}

// =========================
// FEED AO VIVO
// =========================
function iniciarFeedAoVivo() {
    if (feedListenerAtivo) return;
    feedListenerAtivo = true;

    const atualizarFeed = async () => {
        try {
            const rankingSnap = await database.ref("samininaRanking").once("value");
            const historicoSnap = await database.ref("historicoPartidas").orderByChild("timestamp").limitToLast(5).once("value");

            let ranking = [];
            rankingSnap.forEach(c => {
                if (c.val() && c.val().nome) ranking.push(c.val());
            });

            ranking.sort((a, b) =>
                (Number(b.copas) || 0) - (Number(a.copas) || 0) ||
                (Number(b.pontosTotais) || 0) - (Number(a.pontosTotais) || 0)
            );

            let historico = [];
            historicoSnap.forEach(c => {
                if (c.val() && c.val().nome) historico.push(c.val());
            });
            historico.reverse();

            const top3Html = ranking.slice(0, 3).map((j, i) => {
                const medalha = i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉";
                return `<div>${medalha} ${j.nome} — ${j.copas || 0} copas</div>`;
            }).join("");

            const ultimosHtml = historico.slice(0, 3).map(p => {
                return `<div>${p.nome} — ${p.titulo}</div>`;
            }).join("");

            const blocos = [
                document.getElementById("feed-inicio"),
                document.getElementById("feed-espera"),
                document.getElementById("feed-resultado")
            ];

            blocos.forEach(bloco => {
                if (!bloco) return;
                bloco.innerHTML = `
                    <div style="text-align:left;background:#f7f7f7;border-radius:12px;padding:12px;">
                        <div style="font-weight:900;color:var(--color-blue);margin-bottom:8px;">Top 3</div>
                        ${top3Html || "<div>Ainda sem ranking.</div>"}
                        <div style="font-weight:900;color:var(--color-blue);margin:12px 0 8px;">Últimos jogadores</div>
                        ${ultimosHtml || "<div>Aguardando novas partidas.</div>"}
                    </div>
                `;
            });
        } catch (e) {
            console.log("Erro no feed ao vivo:", e);
        }
    };

    atualizarFeed();
    setInterval(atualizarFeed, 10000);
}

// =========================
// RANKING
// =========================
function abrirRankingMestreInicio() {
    window.location.href = "ranking-mestre.html?fs=1";
}

function abrirRankingMestreResultado() {
    salvarEstadoResultado();
    window.location.href = "ranking-mestre.html?fs=1&origem=resultado";
}

// =========================
// SELEÇÃO DE MODO
// =========================
function resetarEstadoPartida() {
    j1Nome = "";
    j2Nome = "";
    j1Avatar = "";
    j2Avatar = "";

    j1Pontos = 0;
    j2Pontos = 0;

    j1Streak = 0;
    j2Streak = 0;
    errosSeguidosJ1 = 0;
    errosSeguidosJ2 = 0;
    ePerguntaOuro = false;

    perguntaAtual = 0;
    jogadorAtual = 1;
    perguntasDaRodada = [];

    clearInterval(controleCronometro);
    clearTimeout(controleTimeout);

    const p1 = document.getElementById("placar-pts-j1");
    const p2 = document.getElementById("placar-pts-j2");
    if (p1) p1.innerText = "0";
    if (p2) p2.innerText = "0";

    const input1 = document.getElementById("input-nome1");
    const input2 = document.getElementById("input-nome2");
    if (input1) input1.value = "";
    if (input2) input2.value = "";

    document.querySelectorAll(".img-avatar-opcao").forEach(img => {
        img.classList.remove("selecionado");
    });

    document.getElementById("container-avatar2")?.classList.add("escondido");
    document.getElementById("secao-pesquisa")?.classList.remove("escondido");
    document.querySelector(".emoji-container")?.classList.remove("escondido");
    document.getElementById("feedback-agradecimento")?.classList.add("escondido");
}

function selecionarModo(modo) {
    limparResultadoSalvo();
    resetarEstadoPartida();

    modoDeJogo = modo;

    document.getElementById("tela-modo").classList.add("escondido");
    document.getElementById("tela-inicial").classList.remove("escondido");

    if (modo === "batalha_local") {
        document.getElementById("container-avatar2")?.classList.remove("escondido");
    }

    if (modo === "batalha_online") {
        iniciarSalaOnline();
    }
}

function voltarParaModos() {
    limparResultadoSalvo();
    esconderTelaAguardandoOnline();
    fecharModalCompartilhar();

    document.getElementById("tela-inicial").classList.add("escondido");
    document.getElementById("tela-modo").classList.remove("escondido");
}

function selecionarAvatar(j, i, el) {
    const avatarEscolhido = listaAvatares[i];

    if (modoDeJogo === "batalha_online") {
        j1Avatar = avatarEscolhido;
    } else {
        if (j === 1) j1Avatar = avatarEscolhido;
        if (j === 2) j2Avatar = avatarEscolhido;
    }

    el.parentElement.querySelectorAll("img").forEach(img => img.classList.remove("selecionado"));
    el.classList.add("selecionado");
}

// =========================
// ONLINE
// =========================
function iniciarSalaOnline() {
    salaId = gerarCodigoSala();
    jogadorTipo = "host";
    salaListenerAtivo = false;
    jogoListenerAtivo = false;

    database.ref("salas/" + salaId).set({
        status: "esperando",
        host: {
            nome: "",
            avatar: "",
            pronto: false
        },
        convidado: {
            nome: "",
            avatar: "",
            pronto: false
        },
        jogo: {
            turno: "host",
            perguntaAtual: 0,
            j1Pontos: 0,
            j2Pontos: 0,
            perguntas: [],
            iniciada: false,
            countdown: 0
        }
    }).then(() => {
        linkSalaAtual = window.location.origin + window.location.pathname + "?sala=" + salaId;

        const inputLink = document.getElementById("input-link-sala");
        if (inputLink) inputLink.value = linkSalaAtual;

        const modal = document.getElementById("modal-compartilhar");
        if (modal) modal.classList.remove("escondido");

        ouvirSalaOnline();
    });
}

function verificarSePodeIniciarSala() {
    database.ref("salas/" + salaId).once("value").then(snap => {
        const data = snap.val();
        if (!data) return;

        const hostPronto = !!data.host?.pronto;
        const convidadoPronto = !!data.convidado?.pronto;

        if (hostPronto && convidadoPronto && data.status !== "contagem" && data.status !== "pronta") {
            const perguntasSorteadas = gerarPerguntasAleatorias(10);

            database.ref("salas/" + salaId).update({
                status: "contagem",
                "jogo/perguntas": perguntasSorteadas,
                "jogo/perguntaAtual": 0,
                "jogo/turno": "host",
                "jogo/j1Pontos": 0,
                "jogo/j2Pontos": 0,
                "jogo/iniciada": false,
                "jogo/countdown": 3
            });

            iniciarContagemSala();
        }
    });
}

function iniciarContagemSala() {
    let valor = 3;

    const intervalo = setInterval(() => {
        valor--;

        if (valor <= 0) {
            clearInterval(intervalo);
            database.ref("salas/" + salaId).update({
                status: "pronta",
                "jogo/iniciada": true,
                "jogo/countdown": 0
            });
        } else {
            database.ref("salas/" + salaId).update({
                "jogo/countdown": valor
            });
        }
    }, 1000);
}

function ouvirSalaOnline() {
    if (!salaId || salaListenerAtivo) return;
    salaListenerAtivo = true;

    database.ref("salas/" + salaId).on("value", snap => {
        const data = snap.val();
        if (!data) return;

        onlineDataAtual = data;

        const hostNome = data.host?.nome || "";
        const hostAvatar = data.host?.avatar || "";
        const convidadoNome = data.convidado?.nome || "";
        const convidadoAvatar = data.convidado?.avatar || "";

        j1Nome = hostNome;
        j1Avatar = hostAvatar || "img/1.jpg";
        j2Nome = convidadoNome;
        j2Avatar = convidadoAvatar || "img/2.jpg";

        if (data.status === "esperando") {
            const euPronto = jogadorTipo === "host" ? data.host?.pronto : data.convidado?.pronto;
            if (euPronto) {
                const texto = data.convidado?.nome
                    ? `${data.convidado.nome} entrou. Aguardando ficar pronto...`
                    : "Aguardando o outro jogador...";
                mostrarTelaAguardandoOnline(texto);
            }
            return;
        }

        if (data.status === "contagem") {
            mostrarTelaAguardandoOnline(`Partida começa em ${data.jogo?.countdown || 3}...`);
            return;
        }

        if (data.status === "pronta") {
            iniciarJogoOnline(data);
        }
    });
}

function iniciarJogoOnline(data) {
    esconderTelaAguardandoOnline();
    fecharModalCompartilhar();

    document.getElementById("tela-inicial").classList.add("escondido");
    document.getElementById("tela-quiz").classList.remove("escondido");
    document.getElementById("timer-container").classList.remove("escondido");

    j1Nome = data.host?.nome || "JOGADOR 1";
    j1Avatar = data.host?.avatar || "img/1.jpg";
    j2Nome = data.convidado?.nome || "JOGADOR 2";
    j2Avatar = data.convidado?.avatar || "img/2.jpg";

    document.getElementById("placar-nome-j1").innerText = j1Nome;
    document.getElementById("placar-nome-j2").innerText = j2Nome;
    document.getElementById("img-avatar-placar1").src = j1Avatar;
    document.getElementById("img-avatar-placar2").src = j2Avatar;

    sincronizarJogoOnline();

    musicaFundo.currentTime = 0;
    musicaFundo.play().then(() => {
        aplicarEstadoAudio();
    }).catch(() => {
        aplicarEstadoAudio();
    });
}

function sincronizarJogoOnline() {
    if (!salaId || jogoListenerAtivo) return;
    jogoListenerAtivo = true;

    database.ref("salas/" + salaId + "/jogo").on("value", snap => {
        const jogo = snap.val();
        if (!jogo) return;

        perguntaAtual = jogo.perguntaAtual || 0;
        jogadorAtual = jogo.turno === "host" ? 1 : 2;
        j1Pontos = jogo.j1Pontos || 0;
        j2Pontos = jogo.j2Pontos || 0;
        perguntasDaRodada = Array.isArray(jogo.perguntas) ? jogo.perguntas : [];

        document.getElementById("placar-pts-j1").innerText = j1Pontos;
        document.getElementById("placar-pts-j2").innerText = j2Pontos;

        if (perguntaAtual >= 10) {
            finalizarJogo();
            return;
        }

        mostrarPergunta();
    });
}

function podeResponder() {
    if (modoDeJogo !== "batalha_online") return true;
    if (jogadorTipo === "host" && jogadorAtual === 1) return true;
    if (jogadorTipo === "convidado" && jogadorAtual === 2) return true;
    return false;
}

// =========================
// INICIAR PARTIDA
// =========================
function validarComeco() {
    const nomeDigitado = document.getElementById("input-nome1").value.trim().toUpperCase();

    if (!nomeDigitado || !j1Avatar) {
        alert("Preencha o nome e escolha um avatar.");
        return;
    }

    if (modoDeJogo === "batalha_online") {
        const caminhoJogador = jogadorTipo === "host" ? "host" : "convidado";

        database.ref("salas/" + salaId + "/" + caminhoJogador).update({
            nome: nomeDigitado,
            avatar: j1Avatar,
            pronto: true
        }).then(() => {
            const telaInicial = document.getElementById("tela-inicial");
            if (telaInicial) telaInicial.classList.add("escondido");

            mostrarTelaAguardandoOnline("Aguardando o outro jogador...");
            verificarSePodeIniciarSala();
        });

        return;
    }

    j1Nome = nomeDigitado;

    if (modoDeJogo === "solo") {
        j2Nome = "REI DAS COPAS";
        j2Avatar = "img/1.jpg";
    }

    if (modoDeJogo === "batalha_local") {
        const nome2 = document.getElementById("input-nome2").value.trim().toUpperCase();

        if (!nome2 || !j2Avatar) {
            alert("Preencha o nome do jogador 2 e escolha um avatar.");
            return;
        }

        j2Nome = nome2;
    }

    iniciarJogoLocal();
}

function iniciarJogoLocal() {
    perguntasDaRodada = gerarPerguntasAleatorias(10);

    document.getElementById("placar-nome-j1").innerText = j1Nome;
    document.getElementById("placar-nome-j2").innerText = j2Nome;
    document.getElementById("img-avatar-placar1").src = j1Avatar;
    document.getElementById("img-avatar-placar2").src = j2Avatar;

    document.getElementById("tela-inicial").classList.add("escondido");
    document.getElementById("tela-quiz").classList.remove("escondido");
    document.getElementById("timer-container").classList.remove("escondido");

    musicaFundo.currentTime = 0;
    musicaFundo.play().then(() => {
        aplicarEstadoAudio();
    }).catch(() => {
        aplicarEstadoAudio();
    });

    mostrarPergunta();
    iniciarCronometro();
}

// =========================
// PERGUNTA / UI
// =========================
function mostrarPergunta() {
    if (!perguntasDaRodada || !perguntasDaRodada[perguntaAtual]) return;

    const d = perguntasDaRodada[perguntaAtual];
    const quizContainer = document.querySelector(".quiz-container");

    const avisoTurno = document.getElementById("aviso-turno-nome");
    if (avisoTurno) {
        avisoTurno.innerText = `VEZ DE: ${jogadorAtual === 1 ? j1Nome : j2Nome}`;
    }

    if (modoDeJogo === "batalha_local") {
        const lado1 = document.querySelector(".placar-item-j1");
        const lado2 = document.querySelector(".placar-item-j2");
        if (lado1 && lado2) {
            lado1.style.opacity = jogadorAtual === 1 ? "1" : "0.4";
            lado2.style.opacity = jogadorAtual === 2 ? "1" : "0.4";
        }
    }

    const errosAtuais = jogadorAtual === 1 ? errosSeguidosJ1 : errosSeguidosJ2;
    ePerguntaOuro = errosAtuais >= 2;

    if (ePerguntaOuro) {
        quizContainer.classList.add("ouro-active");
        document.getElementById("texto-pergunta").innerHTML =
            `<span style="color:#DAA520;font-weight:900;display:block;margin-bottom:10px;">PERGUNTA DE OURO</span>${d.pergunta}`;
    } else {
        quizContainer.classList.remove("ouro-active");
        document.getElementById("texto-pergunta").innerText = d.pergunta;
    }

    document.getElementById("barra-progresso").innerText = `PERGUNTA ${perguntaAtual + 1} DE 10`;
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

    atualizarBloqueioBotoes();
    iniciarCronometro();
}

function atualizarBloqueioBotoes() {
    const botoes = document.querySelectorAll(".btn-resposta");
    const liberar = podeResponder();

    botoes.forEach(btn => {
        btn.disabled = !liberar;
        btn.style.opacity = liberar ? "1" : "0.5";
        btn.style.pointerEvents = liberar ? "auto" : "none";
    });
}

function atualizarTela() {
    const nomeDaVez = jogadorAtual === 1 ? j1Nome : j2Nome;
    document.getElementById("aviso-turno-nome").innerText = "VEZ DE: " + nomeDaVez;
    atualizarBloqueioBotoes();
}

// =========================
// TIMER
// =========================
function iniciarCronometro() {
    if (modoDeJogo === "batalha_online" && !podeResponder()) {
        document.getElementById("timer-display").innerText = `Aguardando ${jogadorAtual === 1 ? j1Nome : j2Nome}...`;
        clearInterval(controleCronometro);
        return;
    }

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

// =========================
// RESPOSTA
// =========================
function verificarResposta(idxSelecionado, botaoClicado) {
    if (modoDeJogo === "batalha_online" && !podeResponder()) return;

    clearInterval(controleCronometro);

    const pergunta = perguntasDaRodada[perguntaAtual];
    if (!pergunta) return;

    const correta = pergunta.respostaCerta;
    const botoes = document.querySelectorAll(".btn-resposta");
    botoes.forEach(btn => btn.disabled = true);

    if (idxSelecionado === correta) {
        somAcerto.currentTime = 0;
        somAcerto.play().catch(() => {});

        if (botaoClicado) botaoClicado.classList.add("correta");
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

        if (botaoClicado) botaoClicado.classList.add("errada");
        if (botoes[correta]) botoes[correta].classList.add("correta");

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
        avancarRodada();
    }, 1800);
}

function avancarRodada() {
    perguntaAtual++;

    if (perguntaAtual >= 10) {
        if (modoDeJogo === "batalha_online") {
            database.ref("salas/" + salaId + "/jogo").update({
                perguntaAtual: 10,
                j1Pontos,
                j2Pontos
            });
        }
        finalizarJogo();
        return;
    }

    if (modoDeJogo === "solo") {
        mostrarPergunta();
        return;
    }

    if (modoDeJogo === "batalha_local") {
        jogadorAtual = jogadorAtual === 1 ? 2 : 1;
        mostrarPergunta();
        return;
    }

    if (modoDeJogo === "batalha_online") {
        const proximoTurno = jogadorAtual === 1 ? "convidado" : "host";

        database.ref("salas/" + salaId + "/jogo").update({
            turno: proximoTurno,
            perguntaAtual,
            j1Pontos,
            j2Pontos
        });
    }
}

// =========================
// FIM DE JOGO
// =========================
function finalizarJogo() {
    musicaFundo.pause();
    mostrarBotaoMuteSePreciso();

    clearInterval(controleCronometro);
    clearTimeout(controleTimeout);

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
        salvarNoRanking(j1Nome, j1Avatar, j1Pontos, j1Pontos >= 6);
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

    const imgV = document.getElementById("img-avatar-vencedor");
    imgV.style.display = "block";
    imgV.src = vAvatar;

    document.getElementById("titulo-vencedor").innerText =
        (modoDeJogo !== "solo" && j1Pontos === j2Pontos) ? "Empate!" : `${vencedor} Venceu!`;

    document.getElementById("mensagem-final").innerText = `${vPontos} Pontos\n${calcularTitulo(vPontos)}`;

    salvarEstadoResultado();

    const feedResultado = document.getElementById("feed-resultado");
    if (feedResultado && !feedResultado.innerHTML.trim()) {
        feedResultado.innerHTML = `<div style="padding:12px;background:#f7f7f7;border-radius:12px;">Atualizando feed...</div>`;
    }

    if ((modoDeJogo === "solo" && vPontos >= 6) || (modoDeJogo !== "solo" && vPontos >= 10)) {
        if (typeof confetti !== "undefined") {
            confetti({ particleCount: 300, spread: 100 });
        }
    }
}

// =========================
// DESISTÊNCIA
// =========================
function confirmarDesistencia() {
    const nome = (modoDeJogo === "solo") ? j1Nome : (jogadorAtual === 1 ? j1Nome : j2Nome);

    if (!confirm(`${nome}, deseja abandonar a partida?`)) {
        if (modoDeJogo !== "batalha_online") iniciarCronometro();
        return;
    }

    clearInterval(controleCronometro);
    clearTimeout(controleTimeout);

    musicaFundo.pause();
    mostrarBotaoMuteSePreciso();

    somErro.currentTime = 0;
    somErro.play().catch(() => {});

    let tit = "ABANDONOU!";
    let msg = "";
    let winAv = "";

    if (modoDeJogo === "solo") {
        msg = `${j1Nome} desistiu.\nTítulo: Perna de Pau`;
        salvarNoRanking(j1Nome, j1Avatar, 0, false, "Arregou");
    } else {
        const vNome = jogadorAtual === 1 ? j2Nome : j1Nome;
        const vAv = jogadorAtual === 1 ? j2Avatar : j1Avatar;

        tit = `${vNome} VENCEU POR W.O.!`;
        msg = `${nome} desistiu!\n${vNome} ganha uma copa automática.`;
        winAv = vAv;

        salvarNoRanking(vNome, vAv, 6, true, "Venceu por W.O.");
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

    document.getElementById("tela-quiz").classList.add("escondido");
    document.getElementById("timer-container").classList.add("escondido");
    document.getElementById("tela-resultado").classList.remove("escondido");
    document.getElementById("secao-pesquisa")?.classList.add("escondido");

    salvarEstadoResultado();
}

// =========================
// BANCO
// =========================
function salvarNoRanking(nome, avatar, pontos, ganhouCopa, tituloEspecial = null) {
    const nomeLimpo = (nome || "").trim().toUpperCase();
    if (!nomeLimpo) return;

    const ref = database.ref("samininaRanking/" + nomeLimpo);

    ref.once("value").then(s => {
        const data = s.exists() ? s.val() : {};
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
        document.querySelector(".emoji-container")?.classList.add("escondido");
        const feedback = document.getElementById("feedback-agradecimento");
        if (feedback) feedback.classList.remove("escondido");
    });
}

// =========================
// DESAFIO
// =========================
function gerarDesafio() {
    const modal = document.getElementById("modal-desafio");
    const qr = document.getElementById("qrcode-desafio");
    if (!modal || !qr || typeof QRCode === "undefined") return;

    modal.classList.remove("escondido");
    qr.innerHTML = "";

    const nomeDesafiante = modoDeJogo === "solo"
        ? j1Nome
        : (j1Pontos >= j2Pontos ? j1Nome : j2Nome);

    const pontosDesafiante = modoDeJogo === "solo"
        ? j1Pontos
        : Math.max(j1Pontos, j2Pontos);

    const linkJogo = window.location.origin + window.location.pathname;
    const mensagem = `Fiz ${pontosDesafiante} pontos na Copa Saminina! Meu título é ${calcularTitulo(pontosDesafiante)}. Duvido você bater meu recorde! Jogue agora: ${linkJogo}`;
    const linkWhatsApp = `https://api.whatsapp.com/send?text=${encodeURIComponent(mensagem)}`;

    new QRCode(qr, {
        text: linkWhatsApp,
        width: 180,
        height: 180
    });
}

function fecharModalDesafio() {
    document.getElementById("modal-desafio")?.classList.add("escondido");
}

// =========================
// INICIALIZAÇÃO
// =========================
document.addEventListener("DOMContentLoaded", () => {
    gerarQRCodeInicial();
    aplicarEstadoAudio();
    mostrarBotaoMuteSePreciso();
    iniciarFeedAoVivo();

    const params = new URLSearchParams(window.location.search);

    if (params.get("voltarResultado") === "1") {
        restaurarResultadoSeExistir();
        return;
    }

    if (params.get("sala")) {
        salaId = params.get("sala");
        jogadorTipo = "convidado";
        modoDeJogo = "batalha_online";

        limparResultadoSalvo();
        resetarEstadoPartida();

        document.getElementById("tela-modo").classList.add("escondido");
        document.getElementById("tela-inicial").classList.remove("escondido");

        ouvirSalaOnline();
    }
});