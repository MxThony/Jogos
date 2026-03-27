console.log("Copa Saminina carregada com modos solo, local e online");

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

const somAcerto = new Audio("audio/acerto.mp3");
const somErro = new Audio("audio/erro.mp3");
const musicaFundo = new Audio("audio/fundo.mp3");
somAcerto.volume = 0.5; somErro.volume = 0.4; musicaFundo.volume = 0.15; musicaFundo.loop = true;

let audioMutado = false;
const listaAvatares = ["img/1.jpg", "img/2.jpg", "img/3.jpg", "img/4.jpg"];

let modoDeJogo = "", salaId = null, jogadorTipo = null, linkSalaAtual = "";
let salaListenerAtivo = false, jogoListenerAtivo = false, chatListenerAtivo = false, feedIntervalId = null;
let j1Nome = "", j2Nome = "", j1Avatar = "", j2Avatar = "";
let j1Pontos = 0, j2Pontos = 0, j1Streak = 0, j2Streak = 0;
let errosSeguidosJ1 = 0, errosSeguidosJ2 = 0, ePerguntaOuro = false;
let perguntaAtual = 0, jogadorAtual = 1, perguntasDaRodada = [];
let tempoRestante = 30, controleCronometro = null, controleTimeout = null;

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

function getStreakData(streak) {
    const msgs = { 3: "Hat-trick!", 4: "Chocolate!", 5: "Pentaaaa!", 6: "Calma lá!", 7: "Virou passeio!", 8: "Domínio total!", 9: "Sem freio!", 10: "Aí virou bagunça!" };
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
    for (let i = copia.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [copia[i], copia[j]] = [copia[j], copia[i]]; }
    return copia;
}

function gerarPerguntasAleatorias(qtd = 10) { return shuffleArray(bancoDePerguntas).slice(0, qtd); }
function gerarCodigoSala() { return Math.random().toString(36).substring(2, 7); }

function aplicarEstadoAudio() {
    somAcerto.muted = audioMutado; somErro.muted = audioMutado; musicaFundo.muted = audioMutado;
    const icone = document.getElementById("musica-icone");
    if (icone) icone.innerText = audioMutado ? "🔇" : "🔊";
    mostrarBotaoMuteSePreciso();
}

function mostrarBotaoMuteSePreciso() {
    const botaoMute = document.getElementById("btn-musica-toggle");
    if (!botaoMute) return;
    
    // Garante que o botão apareça apenas quando a tela do quiz for ativada
    const telaQuiz = document.getElementById("tela-quiz");
    if (telaQuiz && !telaQuiz.classList.contains("escondido")) {
        botaoMute.style.display = "flex";
    } else {
        botaoMute.style.display = "none";
    }
}

function toggleMusica() { audioMutado = !audioMutado; aplicarEstadoAudio(); }
function toggleFullscreen() { !document.fullscreenElement ? document.documentElement.requestFullscreen().catch(() => {}) : document.exitFullscreen().catch(() => {}); }

function salvarEstadoResultado() {
    sessionStorage.setItem("resultadoCopaSaminina", JSON.stringify({
        titulo: document.getElementById("titulo-vencedor")?.innerText || "Fim de Jogo!",
        mensagem: document.getElementById("mensagem-final")?.innerText || "",
        avatar: document.getElementById("img-avatar-vencedor")?.src || "",
        mostrarAvatar: document.getElementById("img-avatar-vencedor")?.style.display !== "none"
    }));
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
        if (dados.mostrarAvatar && dados.avatar) { img.src = dados.avatar; img.style.display = "block"; } else { img.style.display = "none"; }
    } catch (e) { console.log(e); }
}

function limparResultadoSalvo() { sessionStorage.removeItem("resultadoCopaSaminina"); }

function esconderTodasAsTelas() {
    ["tela-modo", "tela-inicial", "tela-quiz", "tela-resultado", "timer-container", "tela-espera-online"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add("escondido");
    });
}

function mostrarTelaAguardandoOnline(texto = "Aguardando...", mostrarBotao = false) {
    let tela = document.getElementById("tela-espera-online");
    if (!tela) {
        tela = document.createElement("div"); tela.id = "tela-espera-online"; tela.className = "quiz-container";
        tela.innerHTML = `<h2 id="texto-espera-online"></h2><p style="margin-top:10px; color:var(--color-blue); font-weight:bold;">Prepare-se para o desafio.</p><div id="area-botao-iniciar-online"></div><div id="chat-container-espera" style="margin-top:20px; text-align:left;"></div><div id="feed-espera" class="feed-ao-vivo" style="margin-top:16px;"></div>`;
        document.querySelector(".main-wrapper")?.appendChild(tela);
        iniciarFeedAoVivo();
    }
    document.getElementById("texto-espera-online").innerText = texto;
    document.getElementById("area-botao-iniciar-online").innerHTML = mostrarBotao ? `<button onclick="iniciarContagemPeloHost()" class="btn-ranking" style="margin-top:20px;">COMEÇAR BATALHA!</button>` : "";
    const chatCard = document.getElementById("chat-card-online");
    const chatCont = document.getElementById("chat-container-espera");
    if (chatCard && chatCont && chatCard.parentElement !== chatCont) { chatCont.appendChild(chatCard); chatCard.classList.remove("escondido"); }
    tela.classList.remove("escondido");
}

function esconderTelaAguardandoOnline() { document.getElementById("tela-espera-online")?.classList.add("escondido"); }
function copiarLinkSala() { if (linkSalaAtual) { navigator.clipboard.writeText(linkSalaAtual); alert("Link copiado!"); } }
function compartilharWhatsapp() { if (linkSalaAtual) window.open(`https://wa.me/?text=${encodeURIComponent("Partida Copa Saminina: " + linkSalaAtual)}`, "_blank"); }
function compartilharSalaWhatsApp() { compartilharWhatsapp(); }
function fecharModalCompartilhar() { document.getElementById("modal-compartilhar")?.classList.add("escondido"); }

function gerarQRCodeInicial() {
    const container = document.getElementById("qrcode-container");
    if (!container || typeof QRCode === "undefined") {
        console.warn("QRCode indisponível no momento.");
        return;
    }
    container.innerHTML = "";
    new QRCode(container, { text: "https://mxthony.github.io/Jogos/ranking.html", width: 120, height: 120, colorDark: "#003399", colorLight: "#ffffff" });
}

function verificarSenhaReset() {
    if (prompt("Senha para limpar o banco:") === "321" && confirm("Zerar banco?")) { database.ref().remove().then(() => location.reload()); }
}

function gerarFeedHtml(ranking, historico) {
    const medalhas = ["🥇", "🥈", "🥉"];
    const legendasTop = ["Líder absoluto", "Na cola do topo", "Fechando o pódio"];

    // Monta a lista do TOP 3
    const top3Html = ranking.slice(0, 3).map((j, i) => `
        <div class="feed-item">
            <div class="feed-col-left">
                <div class="feed-nome">${medalhas[i]} ${j.nome}</div>
                <div class="feed-legenda">${legendasTop[i] || ""}</div>
            </div>
            <div class="feed-col-right">
                <div class="feed-score">${j.copas || 0} copas</div>
                <div class="feed-legenda">${j.pontosTotais || 0} pts</div>
            </div>
        </div>`).join("");

    // Monta a lista dos ÚLTIMOS JOGADORES (em linha reta)
    const ultimosHtml = historico.slice(0, 3).map((p, i) => {
        const destaque = i === 0 ? "Agora há pouco" : "Recente";
        return `
        <div class="feed-item-row">
            <div class="feed-nome feed-ellipsis" style="flex: 1;">${p.nome}</div>
            <div class="feed-legenda" style="flex: 1.2; text-align: center;">${p.titulo}</div>
            <div class="feed-time" style="flex: 0.8; text-align: right;">${destaque}</div>
        </div>`;
    }).join("");

    // Retorna a estrutura HTML completa
    return `
        <div class="feed-box">
            <div class="feed-header-top">
                <div class="feed-titulo">Ao vivo</div>
                <div class="feed-badge">Atualizando</div>
            </div>
            
            <div class="feed-card-interno">
                <div class="feed-subtitulo">Top 3 da arena</div>
                ${top3Html || '<div class="feed-vazio">Ainda sem ranking.</div>'}
            </div>
            
            <div class="feed-card-interno" style="margin-top: 15px;">
                <div class="feed-subtitulo">Últimos jogadores</div>
                ${ultimosHtml || '<div class="feed-vazio">Aguardando novas partidas.</div>'}
            </div>
        </div>`;
}

function iniciarFeedAoVivo() {
    const atualizarFeed = async () => {
        try {
            const [rankSnap, histSnap] = await Promise.all([
                database.ref("samininaRanking").once("value"),
                database.ref("historicoPartidas").orderByChild("timestamp").limitToLast(3).once("value")
            ]);
            let ranking = []; rankSnap.forEach(c => { if (c.val()?.nome) ranking.push(c.val()); });
            ranking.sort((a, b) => (Number(b.copas)||0) - (Number(a.copas)||0) || (Number(b.pontosTotais)||0) - (Number(a.pontosTotais)||0));
            let historico = []; histSnap.forEach(c => { if (c.val()?.nome) historico.push(c.val()); }); historico.reverse();
            const html = gerarFeedHtml(ranking, historico);
            ["feed-inicio", "feed-espera", "feed-resultado"].forEach(id => { const b = document.getElementById(id); if(b) b.innerHTML = html; });
        } catch (e) { console.error("Erro Feed:", e); }
    };
    atualizarFeed();
    database.ref("samininaRanking").on("value", atualizarFeed);
    database.ref("historicoPartidas").limitToLast(3).on("value", atualizarFeed);
    if (feedIntervalId) clearInterval(feedIntervalId);
    feedIntervalId = setInterval(atualizarFeed, 12000);
}

function abrirRankingMestreInicio() { window.location.href = "ranking-mestre.html?fs=1"; }
function abrirRankingMestreResultado() { salvarEstadoResultado(); window.location.href = "ranking-mestre.html?fs=1&origem=resultado"; }

function ouvirChatSala() {
    if (!salaId || chatListenerAtivo) return; chatListenerAtivo = true;
    database.ref(`salas/${salaId}/chat`).limitToLast(20).on("value", (snap) => {
        const lista = document.getElementById("chat-online-lista"); if (!lista) return;
        const itens = []; snap.forEach(c => { if(c.val()?.texto) itens.push(c.val()); });
        lista.innerHTML = itens.length ? itens.map(m => `<div class="chat-msg"><div class="chat-autor">${m.autor}</div><div>${m.texto}</div></div>`).join("") : "Sem mensagens.";
        lista.scrollTop = lista.scrollHeight;
    });
}

function enviarMensagemSala() {
    if (!salaId) return; 
    const input = document.getElementById("chat-online-input");
    if (!input || !input.value.trim()) return;
    
    // Pega o nome exato que este jogador digitou no seu próprio dispositivo
    const meuNome = document.getElementById("input-nome1").value.trim().toUpperCase();
    const autor = meuNome || (jogadorTipo === "host" ? "Host" : "Convidado");
    
    database.ref(`salas/${salaId}/chat`).push({ 
        autor: autor, 
        texto: input.value.trim(), 
        timestamp: firebase.database.ServerValue.TIMESTAMP 
    });
    
    input.value = "";
}

function enviarMensagemRapida(texto) {
    if (!salaId || !texto) return;
    
    // Mesma trava de segurança para as mensagens rápidas
    const meuNome = document.getElementById("input-nome1").value.trim().toUpperCase();
    const autor = meuNome || (jogadorTipo === "host" ? "Host" : "Convidado");
    
    database.ref(`salas/${salaId}/chat`).push({ 
        autor: autor, 
        texto: texto, 
        timestamp: firebase.database.ServerValue.TIMESTAMP 
    });
}

function resetarEstadoPartida() {
    j1Nome = j2Nome = j1Avatar = j2Avatar = ""; j1Pontos = j2Pontos = j1Streak = j2Streak = errosSeguidosJ1 = errosSeguidosJ2 = perguntaAtual = 0; jogadorAtual = 1; perguntasDaRodada = []; ePerguntaOuro = false;
    clearInterval(controleCronometro); clearTimeout(controleTimeout);
    document.getElementById("placar-pts-j1").innerText = "0"; document.getElementById("placar-pts-j2").innerText = "0";
    if(document.getElementById("input-nome1")) document.getElementById("input-nome1").value = "";
    if(document.getElementById("input-nome2")) document.getElementById("input-nome2").value = "";
    document.querySelectorAll(".img-avatar-opcao").forEach(img => img.classList.remove("selecionado"));
    esconderTodasAsTelas();
    salaId = jogadorTipo = null; linkSalaAtual = ""; salaListenerAtivo = jogoListenerAtivo = chatListenerAtivo = false;
    document.getElementById("qrcode-sala-online").innerHTML = "";
}

function selecionarModo(modo) {
    limparResultadoSalvo(); 
    resetarEstadoPartida(); 
    modoDeJogo = modo;

    document.getElementById("tela-modo").classList.add("escondido");
    document.getElementById("tela-inicial").classList.remove("escondido");

    // Trava de segurança: só mostra o Jogador 2 se for Batalha Local
    if (modo === "batalha_local") {
        document.getElementById("container-avatar2")?.classList.remove("escondido");
    } else {
        document.getElementById("container-avatar2")?.classList.add("escondido");
    }

    if (modo === "batalha_online") {
        document.getElementById("painel-online")?.classList.remove("escondido");
        document.getElementById("btn-iniciar-local")?.classList.add("escondido");
        document.getElementById("btn-confirmar-online")?.classList.remove("escondido");
        document.getElementById("titulo-registro").innerText = "Entrar na Sala Online";
        document.getElementById("chat-card-online")?.classList.add("escondido");
    }
}

function voltarParaModos() { limparResultadoSalvo(); fecharModalCompartilhar(); resetarEstadoPartida(); document.getElementById("tela-modo").classList.remove("escondido"); }
function selecionarAvatar(j, i, el) {
    const av = listaAvatares[i];
    if (modoDeJogo === "batalha_online") { if (jogadorTipo === "convidado") j2Avatar = av; else j1Avatar = av; }
    else { if (j === 1) j1Avatar = av; if (j === 2) j2Avatar = av; }
    el.parentElement.querySelectorAll("img").forEach(img => img.classList.remove("selecionado"));
    el.classList.add("selecionado");
    if (modoDeJogo === "batalha_online") {
        if(jogadorTipo === "convidado") { document.getElementById("room-avatar-convidado").src = j2Avatar; }
        else { document.getElementById("room-avatar-host").src = j1Avatar; }
    }
}

function criarSalaOnline() {
    if (modoDeJogo !== "batalha_online" || jogadorTipo === "convidado") return;
    salaId = gerarCodigoSala(); jogadorTipo = "host"; salaListenerAtivo = jogoListenerAtivo = chatListenerAtivo = false;
    database.ref(`salas/${salaId}`).set({
        status: "esperando", host: { nome: "", avatar: "", pronto: false }, convidado: { nome: "", avatar: "", pronto: false },
        jogo: { turno: "host", perguntaAtual: 0, j1Pontos: 0, j2Pontos: 0, perguntas: [], iniciada: false, countdown: 0 }
    }).then(() => {
        linkSalaAtual = new URL(window.location.href); linkSalaAtual.search = ""; linkSalaAtual.searchParams.set("sala", salaId); linkSalaAtual = linkSalaAtual.toString();
        document.getElementById("online-badge-status").innerText = "Sala criada";
        document.getElementById("bloco-link-sala").classList.remove("escondido"); document.getElementById("input-link-sala").value = linkSalaAtual;
        document.getElementById("bloco-qrcode-sala").classList.remove("escondido");
        const qrBox = document.getElementById("qrcode-sala-online"); qrBox.innerHTML = ""; new QRCode(qrBox, { text: linkSalaAtual, width: 120, height: 120 });
        document.getElementById("btn-compartilhar-whatsapp")?.classList.remove("escondido"); document.getElementById("btn-copiar-link")?.classList.remove("escondido");
        document.getElementById("modal-compartilhar").classList.remove("escondido");
        ouvirSalaOnline();
    });
}

function ouvirSalaOnline() {
    if (!salaId || salaListenerAtivo) return; 
    salaListenerAtivo = true;

    database.ref(`salas/${salaId}`).on("value", snap => {
        const data = snap.val(); 
        if (!data) return;
        
        j1Nome = data.host?.nome || ""; 
        j1Avatar = data.host?.avatar || "img/1.jpg"; 
        j2Nome = data.convidado?.nome || ""; 
        j2Avatar = data.convidado?.avatar || "img/2.jpg";
        
        document.getElementById("room-name-host").innerText = j1Nome || "Aguardando..."; 
        document.getElementById("room-name-convidado").innerText = j2Nome || "Aguardando...";
        document.getElementById("room-avatar-host").src = j1Avatar; 
        document.getElementById("room-avatar-convidado").src = j2Avatar;
        
        if (data.host?.nome && data.convidado?.nome) { 
            document.getElementById("chat-card-online")?.classList.remove("escondido"); 
            ouvirChatSala(); 
        }
        
        if (data.status === "esperando") {
            const euPronto = jogadorTipo === "host" ? data.host?.pronto : data.convidado?.pronto;
            if (euPronto) {
                let texto = "Aguardando..."; 
                let showBtn = false;
                
                if (data.host?.pronto && data.convidado?.pronto) { 
                    if (jogadorTipo === "host") { 
                        texto = "Pronto para iniciar!"; 
                        showBtn = true; 
                    } else { 
                        texto = "Aguardando Host iniciar..."; 
                    } 
                } else if (data.convidado?.nome) {
                    texto = `${data.convidado.nome} entrou.`;
                }
                mostrarTelaAguardandoOnline(texto, showBtn);
            }
        } else if (data.status === "contagem") { 
            mostrarTelaAguardandoOnline(`Iniciando em ${data.jogo?.countdown || 3}...`, false); 
        } else if (data.status === "pronta") { 
            // 👇 AQUI ESTÁ A CORREÇÃO DA MÚSICA 👇
            // O jogo e a música só iniciam se a tela do Quiz ainda estiver fechada
            if (document.getElementById("tela-quiz").classList.contains("escondido")) {
                iniciarJogoOnline(data); 
            }
        }
    });
}

function iniciarContagemPeloHost() {
    if (jogadorTipo !== "host" || !salaId) return;
    document.getElementById("area-botao-iniciar-online").innerHTML = "";
    database.ref(`salas/${salaId}`).update({ status: "contagem", "jogo/perguntas": gerarPerguntasAleatorias(10), "jogo/perguntaAtual": 0, "jogo/turno": "host", "jogo/j1Pontos": 0, "jogo/j2Pontos": 0, "jogo/countdown": 3 });
    let valor = 3; const ival = setInterval(() => { valor--; if(valor<=0){ clearInterval(ival); database.ref(`salas/${salaId}`).update({ status: "pronta", "jogo/iniciada": true, "jogo/countdown": 0 }); } else { database.ref(`salas/${salaId}/jogo`).update({ countdown: valor }); } }, 1000);
}

function confirmarEntradaOnline() {
    const nome = document.getElementById("input-nome1").value.trim().toUpperCase(); const av = jogadorTipo === "convidado" ? j2Avatar : j1Avatar;
    if (!nome || !av) return alert("Preencha nome e avatar."); if (!salaId) return alert("Sala não encontrada.");
    const path = jogadorTipo === "convidado" ? "convidado" : "host";
    if (jogadorTipo === "convidado") j2Nome = nome; else j1Nome = nome;
    database.ref(`salas/${salaId}/${path}`).update({ nome, avatar: av, pronto: true }).then(() => {
        document.getElementById("tela-inicial").classList.add("escondido"); mostrarTelaAguardandoOnline("Aguardando...", false); ouvirSalaOnline();
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
    
    // 👇 GARANTE O BOTÃO MUTE E O LOOP DA MÚSICA 👇
    mostrarBotaoMuteSePreciso();
    musicaFundo.currentTime = 0; 
    musicaFundo.play().catch(()=>{});
}

function sincronizarJogoOnline() {
    if (!salaId || jogoListenerAtivo) return; jogoListenerAtivo = true;
    database.ref(`salas/${salaId}/jogo`).on("value", snap => {
        const jogo = snap.val(); if (!jogo) return;
        perguntaAtual = jogo.perguntaAtual || 0; jogadorAtual = jogo.turno === "host" ? 1 : 2; j1Pontos = jogo.j1Pontos || 0; j2Pontos = jogo.j2Pontos || 0; perguntasDaRodada = jogo.perguntas || [];
        document.getElementById("placar-pts-j1").innerText = j1Pontos; document.getElementById("placar-pts-j2").innerText = j2Pontos;
        if (perguntaAtual >= 10) { finalizarJogo(); return; } mostrarPergunta();
    });
}
function podeResponder() { return modoDeJogo !== "batalha_online" || (jogadorTipo === "host" && jogadorAtual === 1) || (jogadorTipo === "convidado" && jogadorAtual === 2); }

function validarComeco() {
    if (modoDeJogo === "batalha_online") return confirmarEntradaOnline();
    
    j1Nome = document.getElementById("input-nome1").value.trim().toUpperCase();
    if (!j1Nome || !j1Avatar) return alert("Preencha nome e avatar.");
    
    if (modoDeJogo === "solo") { 
        j2Nome = "REI DAS COPAS"; 
        j2Avatar = "img/1.jpg"; 
    } else { 
        j2Nome = document.getElementById("input-nome2").value.trim().toUpperCase(); 
        if (!j2Nome || !j2Avatar) return alert("Preencha jogador 2."); 
    }
    
    perguntasDaRodada = gerarPerguntasAleatorias(10);
    
    document.getElementById("placar-nome-j1").innerText = j1Nome; 
    document.getElementById("placar-nome-j2").innerText = j2Nome;
    document.getElementById("img-avatar-placar1").src = j1Avatar; 
    document.getElementById("img-avatar-placar2").src = j2Avatar;
    
    document.getElementById("tela-inicial").classList.add("escondido"); 
    document.getElementById("tela-quiz").classList.remove("escondido"); 
    document.getElementById("timer-container").classList.remove("escondido");
    
    // 👇 AQUI ENTRA A CORREÇÃO DO MUTE E DA MÚSICA 👇
    mostrarBotaoMuteSePreciso();
    musicaFundo.currentTime = 0; 
    musicaFundo.play().catch(()=>{}); 
    
    mostrarPergunta(); 
    iniciarCronometro();
}

function mostrarPergunta() {
    const d = perguntasDaRodada[perguntaAtual]; if(!d) return;
    document.getElementById("aviso-turno-nome").innerText = `VEZ DE: ${jogadorAtual === 1 ? j1Nome : j2Nome}`;
    if(modoDeJogo==="batalha_online") { const msg = document.getElementById("online-espera-msg"); if(msg) { msg.innerText = `Aguardando ${jogadorAtual===1?j1Nome:j2Nome}...`; podeResponder() ? msg.classList.add("escondido") : msg.classList.remove("escondido"); } }
    if(modoDeJogo==="batalha_local") { document.querySelector(".placar-item-j1").style.opacity = jogadorAtual===1?"1":"0.4"; document.querySelector(".placar-item-j2").style.opacity = jogadorAtual===2?"1":"0.4"; }
    ePerguntaOuro = (jogadorAtual===1?errosSeguidosJ1:errosSeguidosJ2) >= 2;
    document.getElementById("texto-pergunta").innerHTML = ePerguntaOuro ? `<span style='color:#DAA520;'>PERGUNTA DE OURO</span><br>${d.pergunta}` : d.pergunta;
    document.querySelector(".quiz-container").classList.toggle("ouro-active", ePerguntaOuro);
    document.getElementById("barra-progresso").innerText = `PERGUNTA ${perguntaAtual + 1} DE 10`;
    document.getElementById("feedback-acerto").classList.add("escondido"); document.getElementById("feedback-erro").classList.add("escondido"); document.getElementById("streak-popup").innerText = "";
    const area = document.getElementById("area-botoes"); area.innerHTML = "";
    d.respostas.forEach((r, i) => { const b = document.createElement("button"); b.className = "btn-resposta"; b.innerText = r; b.onclick = () => verificarResposta(i, b); area.appendChild(b); });
    document.querySelectorAll(".btn-resposta").forEach(b => { b.disabled = !podeResponder(); b.style.opacity = podeResponder() ? "1" : "0.5"; });
    iniciarCronometro();
}

function iniciarCronometro() {
    if (modoDeJogo === "batalha_online" && !podeResponder()) { document.getElementById("timer-display").innerText = `Aguardando...`; clearInterval(controleCronometro); return; }
    tempoRestante = 30; clearInterval(controleCronometro); document.getElementById("timer-display").innerText = `Tempo: 30s`;
    controleCronometro = setInterval(() => { tempoRestante--; document.getElementById("timer-display").innerText = `Tempo: ${tempoRestante}s`; if(tempoRestante<=0) { clearInterval(controleCronometro); somErro.play().catch(()=>{}); verificarResposta(-1, null); } }, 1000);
}

function verificarResposta(idx, btn) {
    if (modoDeJogo === "batalha_online" && !podeResponder()) return; clearInterval(controleCronometro);
    const d = perguntasDaRodada[perguntaAtual]; document.querySelectorAll(".btn-resposta").forEach(b => b.disabled = true);
    if (idx === d.respostaCerta) {
        somAcerto.play().catch(()=>{}); if(btn) btn.classList.add("correta"); document.getElementById("feedback-acerto").classList.remove("escondido");
        let streak = jogadorAtual === 1 ? ++j1Streak : ++j2Streak; let pts = ePerguntaOuro ? 2 : 1; let bonus = getStreakData(streak).bonus;
        if(jogadorAtual===1) { j1Pontos += pts+bonus; errosSeguidosJ1=0; document.getElementById("placar-pts-j1").innerText = j1Pontos; } else { j2Pontos += pts+bonus; errosSeguidosJ2=0; document.getElementById("placar-pts-j2").innerText = j2Pontos; }
        if(bonus>0) { document.getElementById("streak-popup").innerText = getStreakData(streak).msg; if(typeof confetti!=="undefined") confetti({particleCount:120,spread:80,origin:{y:0.6}}); }
    } else {
        somErro.play().catch(()=>{}); if(btn) btn.classList.add("errada"); document.querySelectorAll(".btn-resposta")[d.respostaCerta]?.classList.add("correta"); document.getElementById("feedback-erro").classList.remove("escondido");
        if(jogadorAtual===1) { j1Streak=0; errosSeguidosJ1++; if(modoDeJogo==="solo"){ j2Pontos++; document.getElementById("placar-pts-j2").innerText=j2Pontos; } } else { j2Streak=0; errosSeguidosJ2++; }
    }
    controleTimeout = setTimeout(() => { perguntaAtual++; if(perguntaAtual>=10){ if(modoDeJogo==="batalha_online") database.ref(`salas/${salaId}/jogo`).update({perguntaAtual:10,j1Pontos,j2Pontos}); finalizarJogo(); } else { if(modoDeJogo!=="solo" && modoDeJogo!=="batalha_online") jogadorAtual = jogadorAtual===1?2:1; if(modoDeJogo==="batalha_online") database.ref(`salas/${salaId}/jogo`).update({turno:jogadorAtual===1?"convidado":"host",perguntaAtual,j1Pontos,j2Pontos}); if(modoDeJogo!=="batalha_online") mostrarPergunta(); } }, 1800);
}

function ajustarPontuacaoGlobal(nome, av, delta, tit="Ajuste") { const nm=nome.trim().toUpperCase(); if(!nm) return; database.ref(`samininaRanking/${nm}`).once("value").then(s => { const dt = s.exists()?s.val():{nome:nm,avatar:av||"img/1.jpg",pontosTotais:0,copas:0}; dt.pontosTotais=Math.max(0, (Number(dt.pontosTotais)||0)+delta); database.ref(`samininaRanking/${nm}`).set(dt); database.ref("historicoPartidas").push({nome:nm,avatar:dt.avatar,pontos:delta,titulo:tit,timestamp:firebase.database.ServerValue.TIMESTAMP}); }); }
function salvarNoRanking(n, av, pts, cup, tit) { const nm=n.trim().toUpperCase(); if(!nm)return; database.ref(`samininaRanking/${nm}`).once("value").then(s=>{ const dt=s.exists()?s.val():{nome:nm,avatar:av||"img/1.jpg",pontosTotais:0,copas:0}; dt.pontosTotais=(Number(dt.pontosTotais)||0)+Number(pts); dt.copas=(Number(dt.copas)||0)+(cup?1:0); database.ref(`samininaRanking/${nm}`).set(dt); database.ref("historicoPartidas").push({nome:nm,avatar:dt.avatar,pontos:pts,titulo:tit||calcularTitulo(pts),timestamp:firebase.database.ServerValue.TIMESTAMP}); }); }

function finalizarJogo() {
    // 1ª Trava: Se a tela de resultado já está visível, o jogo já acabou. Não faça nada.
    if (!document.getElementById("tela-resultado").classList.contains("escondido")) return;

    musicaFundo.pause(); 
    document.getElementById("tela-quiz").classList.add("escondido"); 
    document.getElementById("timer-container").classList.add("escondido"); 
    document.getElementById("tela-resultado").classList.remove("escondido");

    let v, vAv, vPts;
    
    // Define o vencedor
    if (modoDeJogo === "solo") { 
        v = j1Nome; vAv = j1Avatar; vPts = j1Pontos; 
    } else { 
        v = j1Pontos >= j2Pontos ? j1Nome : j2Nome; 
        vAv = j1Pontos >= j2Pontos ? j1Avatar : j2Avatar; 
        vPts = Math.max(j1Pontos, j2Pontos); 
    }

    // 👇 2ª Trava: A MÁGICA PARA NÃO DUPLICAR NO BANCO 👇
    // Só salva se for modo Solo/Local, ou se for Online E for o Host.
    const deveSalvarNoBanco = (modoDeJogo !== "batalha_online" || jogadorTipo === "host");

    if (deveSalvarNoBanco) {
        if (modoDeJogo === "solo") {
            if (j1Pontos >= 6) salvarNoRanking(j1Nome, j1Avatar, j1Pontos, true);
            else ajustarPontuacaoGlobal(j1Nome, j1Avatar, -6, "Perdeu 6 pontos");
        } else {
            if (j1Pontos !== j2Pontos) {
                salvarNoRanking(v, vAv, vPts, true);
                ajustarPontuacaoGlobal(j1Pontos < j2Pontos ? j1Nome : j2Nome, j1Pontos < j2Pontos ? j1Avatar : j2Avatar, -6, "Perdeu 6 pontos");
            } else {
                salvarNoRanking(v, vAv, vPts, false);
            }
        }
    }

    // Mostra na tela
    document.getElementById("img-avatar-vencedor").src = vAv; 
    document.getElementById("titulo-vencedor").innerText = (modoDeJogo !== "solo" && j1Pontos === j2Pontos) ? "Empate!" : `${v} Venceu!`; 
    document.getElementById("mensagem-final").innerText = `${vPts} Pontos\n${calcularTitulo(vPts)}`;

    salvarEstadoResultado(); 

    if (typeof confetti !== "undefined" && ((modoDeJogo === "solo" && vPts >= 6) || (modoDeJogo !== "solo" && j1Pontos !== j2Pontos))) {
        confetti({ particleCount: 300, spread: 100, origin: { y: 0.6 } });
    }
}

function confirmarDesistencia() {
    if(!confirm(`${modoDeJogo==="solo"?j1Nome:(jogadorAtual===1?j1Nome:j2Nome)}, deseja abandonar a partida?`)) { if(modoDeJogo!=="batalha_online") iniciarCronometro(); return; }
    clearInterval(controleCronometro); clearTimeout(controleTimeout); musicaFundo.pause(); somErro.play().catch(()=>{});
    if(modoDeJogo==="solo"){ ajustarPontuacaoGlobal(j1Nome,j1Avatar,-6,"Arregou"); document.getElementById("titulo-vencedor").innerText="ABANDONOU!"; document.getElementById("mensagem-final").innerText=`${j1Nome} desistiu.\nTítulo: Perna de Pau`; document.getElementById("img-avatar-vencedor").style.display="none"; }
    else { const vn = jogadorAtual===1?j2Nome:j1Nome; const va = jogadorAtual===1?j2Avatar:j1Avatar; salvarNoRanking(vn,va,6,true,"Venceu por W.O."); ajustarPontuacaoGlobal(jogadorAtual===1?j1Nome:j2Nome,jogadorAtual===1?j1Avatar:j2Avatar,-6,"Arregou"); document.getElementById("titulo-vencedor").innerText=`${vn} VENCEU POR W.O.!`; document.getElementById("mensagem-final").innerText=`Oponente desistiu!`; document.getElementById("img-avatar-vencedor").src=va; document.getElementById("img-avatar-vencedor").style.display="block"; }
    document.getElementById("tela-quiz").classList.add("escondido"); document.getElementById("timer-container").classList.add("escondido"); document.getElementById("tela-resultado").classList.remove("escondido"); salvarEstadoResultado();
}

function enviarPesquisa(v) { database.ref("pesquisaSatisfacao").push({voto:v,timestamp:firebase.database.ServerValue.TIMESTAMP}); document.querySelector(".emoji-container")?.classList.add("escondido"); document.getElementById("feedback-agradecimento")?.classList.remove("escondido"); }
function gerarDesafio() { document.getElementById("modal-desafio")?.classList.remove("escondido"); const qr=document.getElementById("qrcode-desafio"); if(qr){ qr.innerHTML=""; const p = modoDeJogo==="solo"?j1Pontos:Math.max(j1Pontos,j2Pontos); new QRCode(qr,{text:`https://wa.me/?text=${encodeURIComponent(`Fiz ${p} pts na Copa Saminina! Jogue agora: ${window.location.origin+window.location.pathname}`)}`,width:180,height:180}); } }
function fecharModalDesafio() { document.getElementById("modal-desafio")?.classList.add("escondido"); }
function abrirModalRepetir() { document.getElementById("modal-repetir")?.classList.remove("escondido"); }
function fecharModalRepetir() { document.getElementById("modal-repetir")?.classList.add("escondido"); }
function repetirMesmoJogador(sim) { if(sim) location.reload(); else { limparResultadoSalvo(); location.href="index.html"; } }

// =========================
// ON LOAD (BLINDADO - GARANTE EXECUÇÃO)
// =========================
function inicializarJogo() {
    try { gerarQRCodeInicial(); } catch(e) { console.error("Erro QR Inicial:", e); }
    try { aplicarEstadoAudio(); } catch(e) { console.error("Erro Áudio:", e); }
    try { iniciarFeedAoVivo(); } catch(e) { console.error("Erro Feed:", e); }

    try {
        const params = new URLSearchParams(window.location.search);
        if (params.get("voltarResultado") === "1") { restaurarResultadoSeExistir(); return; }

        if (params.get("sala")) {
            salaId = params.get("sala");
            limparResultadoSalvo(); resetarEstadoPartida();
            salaId = params.get("sala"); // Retorna pq resetarEstadoPartida zera
            jogadorTipo = "convidado"; modoDeJogo = "batalha_online";

            document.getElementById("tela-modo")?.classList.add("escondido");
            document.getElementById("tela-inicial")?.classList.remove("escondido");
            document.getElementById("painel-online")?.classList.remove("escondido");
            document.getElementById("titulo-registro").innerText = "Entrar na Sala Online";
            document.getElementById("online-badge-status").innerText = "Convidado";
            document.getElementById("online-status-text").innerText = "Escolha seu nome e avatar para entrar na partida.";

            const blocoL = document.getElementById("bloco-link-sala");
            if (blocoL) blocoL.classList.remove("escondido");
            const ipLink = document.getElementById("input-link-sala");
            if (ipLink) ipLink.value = window.location.href;

            document.getElementById("btn-criar-sala")?.classList.add("escondido");
            document.getElementById("btn-compartilhar-whatsapp")?.classList.add("escondido");
            document.getElementById("btn-copiar-link")?.classList.remove("escondido");
            document.getElementById("btn-iniciar-local")?.classList.add("escondido");
            document.getElementById("btn-confirmar-online")?.classList.remove("escondido");

            ouvirSalaOnline();
        }
    } catch(e) { console.error("Erro Params Sala:", e); }
}

if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", inicializarJogo); } else { inicializarJogo(); }