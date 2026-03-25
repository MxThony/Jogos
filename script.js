// =========================================
// 1. CONFIGURAÇÃO DO FIREBASE
// =========================================
const firebaseConfig = {
    apiKey: "AIzaSyDbvleD3CCVEOybvc7B-sKmzL1ugnHiMyk",
    authDomain: "copa-saminina.firebaseapp.com",
    databaseURL: "https://copa-saminina-default-rtdb.firebaseio.com",
    projectId: "copa-saminina",
    storageBucket: "copa-saminina.firebasestorage.app",
    messagingSenderId: "961413845237",
    appId: "1:961413845237:web:4c2b36f903a3f3c0f9f5bc"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// =========================================
// 2. VARIÁVEIS GLOBAIS E ÁUDIO
// =========================================
const somAcerto = new Audio('audio/acerto.mp3');
const somErro = new Audio('audio/erro.mp3');
const musicaFundo = new Audio('audio/fundo.mp3');

somAcerto.volume = 0.5;
somErro.volume = 0.4;
musicaFundo.volume = 0.15;
musicaFundo.loop = true;

const listaAvatares = ['img/1.jpg', 'img/2.jpg', 'img/3.jpg', 'img/4.jpg'];

let j1Nome = "", j2Nome = "", j1Pontos = 0, j2Pontos = 0, j1Avatar = "", j2Avatar = ""; 
let perguntaAtual = 0, jogadorAtual = 1, perguntasDaRodada = [];
let tempoRestante = 30, controleCronometro, modoDeJogo = "", telaAnteriorAoRanking = "tela-modo";

// BANCO DE PERGUNTAS (40 ANTIGAS + 30 NOVAS = 70)
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
    { pergunta: "Qual foi a sede da Copa de 2022?", respostas: ["Dubai", "Catar", "Arábia"], respostaCerta: 1 },
    { pergunta: "Como se chama a bola da Copa de 1970?", respostas: ["Jabulani", "Brazuca", "Telstar"], respostaCerta: 2 },
    { pergunta: "Qual seleção usa a cor Laranja?", respostas: ["Alemanha", "Holanda", "Bélgica"], respostaCerta: 1 },
    { pergunta: "Quem era o técnico do Penta?", respostas: ["Tite", "Felipão", "Dunga"], respostaCerta: 1 },
    { pergunta: "Qual país tem 4 títulos mundiais?", respostas: ["Itália", "Argentina", "Uruguai"], respostaCerta: 0 },
    { pergunta: "Quem fez gol de mão (La Mano de Dios)?", respostas: ["Pelé", "Maradona", "Messi"], respostaCerta: 1 },
    { pergunta: "Qual a maior goleada sofrida pelo Brasil?", respostas: ["3x0", "7x1", "5x2"], respostaCerta: 1 },
    { pergunta: "Qual cidade NÃO sediou a Copa 2014?", respostas: ["Cuiabá", "Manaus", "Arcoverde"], respostaCerta: 2 },
    { pergunta: "Qual a forma da taça da Copa?", respostas: ["Globo", "Dois atletas", "Chuteira"], respostaCerta: 1 },
    
    // --- NOVAS 30 PERGUNTAS (CURIOSIDADES E ATUAIS) ---
    { pergunta: "Onde será a final da Copa de 2026?", respostas: ["Nova York/New Jersey", "Dallas", "Cidade do México"], respostaCerta: 0 },
    { pergunta: "Quantas seleções participarão da Copa de 2026?", respostas: ["32", "48", "64"], respostaCerta: 1 },
    { pergunta: "Quem marcou um golaço de bicicleta na Copa 2022?", respostas: ["Neymar", "Richarlison", "Vinícius Jr"], respostaCerta: 1 },
    { pergunta: "Qual o único jogador a vencer 3 Copas do Mundo?", respostas: ["Maradona", "Zidane", "Pelé"], respostaCerta: 2 },
    { pergunta: "Qual país sediará a Copa de 2026 junto com EUA e México?", respostas: ["Canadá", "Brasil", "Panamá"], respostaCerta: 0 },
    { pergunta: "Qual a maior artilheira de todas as Copas (Masculina e Feminina)?", respostas: ["Marta", "Cristiane", "Mia Hamm"], respostaCerta: 0 },
    { pergunta: "Quem superou o recorde de gols de Pelé pela Seleção (FIFA)?", respostas: ["Ronaldo", "Neymar", "Romário"], respostaCerta: 1 },
    { pergunta: "Em 2022, qual seleção africana chegou à semifinal pela 1ª vez?", respostas: ["Egito", "Nigéria", "Marrocos"], respostaCerta: 2 },
    { pergunta: "Qual goleiro brilhou nos pênaltis na final de 2022?", respostas: ["Emiliano Martínez", "Lloris", "Alisson"], respostaCerta: 0 },
    { pergunta: "Qual o apelido da bola da Copa de 2014 no Brasil?", respostas: ["Brazuca", "Jabulani", "Al Rihla"], respostaCerta: 0 },
    { pergunta: "Quem é o jogador com mais partidas em Copas (26 jogos)?", respostas: ["Messi", "Matthäus", "Klose"], respostaCerta: 0 },
    { pergunta: "Quantos anos Pelé tinha quando ganhou sua 1ª Copa?", respostas: ["17", "18", "19"], respostaCerta: 0 },
    { pergunta: "Qual seleção detém o título de 2022?", respostas: ["França", "Argentina", "Croácia"], respostaCerta: 1 },
    { pergunta: "Quem marcou 3 gols na final da Copa de 2022?", respostas: ["Messi", "Mbappé", "Julián Álvarez"], respostaCerta: 1 },
    { pergunta: "Onde aconteceu a Copa do Mundo de 2002?", respostas: ["Japão e Coreia do Sul", "China", "Alemanha"], respostaCerta: 0 },
    { pergunta: "Qual o nome do troféu da Copa antes de 1974?", respostas: ["Taça FIFA", "Jules Rimet", "Copa Ouro"], respostaCerta: 1 },
    { pergunta: "Qual foi a primeira Copa a usar o VAR?", respostas: ["2014", "2018", "2022"], respostaCerta: 1 },
    { pergunta: "Em qual cidade brasileira o Brasil perdeu de 7x1?", respostas: ["Rio de Janeiro", "Belo Horizonte", "São Paulo"], respostaCerta: 1 },
    { pergunta: "Quem é o técnico que mais vezes comandou o Brasil (126 jogos)?", respostas: ["Zagallo", "Tite", "Parreira"], respostaCerta: 0 },
    { pergunta: "Qual jogador é conhecido como 'O Baixinho'?", respostas: ["Zico", "Romário", "Bebeto"], respostaCerta: 1 },
    { pergunta: "Em que ano o Brasil sediou sua primeira Copa?", respostas: ["1930", "1950", "1962"], respostaCerta: 1 },
    { pergunta: "Qual seleção jogou todas as Copas do Mundo até hoje?", respostas: ["Alemanha", "Itália", "Brasil"], respostaCerta: 2 },
    { pergunta: "Quem fez o gol do título do Tetra em 1994 nos pênaltis?", respostas: ["Baggio errou", "Romário", "Dunga"], respostaCerta: 0 },
    { pergunta: "Qual era a cor da camisa do Brasil antes da amarela?", respostas: ["Branca", "Verde", "Azul"], respostaCerta: 0 },
    { pergunta: "Quem marcou o gol do título da Alemanha em 2014?", respostas: ["Müller", "Klose", "Götze"], respostaCerta: 2 },
    { pergunta: "Qual o estádio com maior capacidade da Copa 2026?", respostas: ["Azteca", "MetLife", "AT&T Stadium"], respostaCerta: 0 },
    { pergunta: "Qual jogador brasileiro é o único a jogar 3 finais seguidas?", respostas: ["Pelé", "Cafu", "Ronaldo"], respostaCerta: 1 },
    { pergunta: "Qual país venceu a Copa de 1998 como anfitrião?", respostas: ["Brasil", "França", "Alemanha"], respostaCerta: 1 },
    { pergunta: "Quem é o maior artilheiro em UMA ÚNICA edição (13 gols)?", respostas: ["Just Fontaine", "Pelé", "Ronaldo"], respostaCerta: 0 },
    { pergunta: "Qual seleção tem o apelido de 'La Roja'?", respostas: ["Espanha", "Portugal", "Bélgica"], respostaCerta: 0 }
];

// =========================================
// 3. TÍTULOS E HISTÓRICO
// =========================================
function calcularTitulo(pontos) {
    if (pontos <= 2) return "Perna de Pau 🪵";
    if (pontos <= 5) return "Reserva de Luxo 🪑";
    if (pontos <= 8) return "Titular Absoluto 🏃‍♂️";
    return "Lenda do Penta 🏆";
}

function salvarHistoricoPartida(nome, avatar, pontos) {
    database.ref('historicoPartidas').push({
        nome: nome.trim().toUpperCase(),
        avatar: avatar,
        pontos: pontos,
        titulo: calcularTitulo(pontos),
        timestamp: firebase.database.ServerValue.TIMESTAMP
    });
}

// =========================================
// 4. QR CODE E INTERFACE
// =========================================
function gerarQRCode() {
    const container = document.getElementById("qrcode-container");
    if (!container) return;
    container.innerHTML = ""; 

    const urlComAtalho = window.location.origin + window.location.pathname + "?exibir=ranking";

    new QRCode(container, {
        text: urlComAtalho,
        width: 120, height: 120,
        colorDark : "#003399", colorLight : "#FFFFFF"
    });
}

function enviarPesquisa(reacao) {
    database.ref('pesquisaSatisfacao').push({
        voto: reacao,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    }).then(() => {
        document.querySelector('.emoji-container').classList.add('escondido');
        document.getElementById('feedback-agradecimento').classList.remove('escondido');
    });
}

function verificarSenhaReset() {
    let senha = prompt("🔐 ACESSO RESTRITO\nDigite a senha para ver o relatório ou zerar o banco:");
    if (senha === "321") {
        database.ref().once('value').then((snapshot) => {
            const d = snapshot.val() || {};
            const r = d.samininaRanking || {};
            const p = d.pesquisaSatisfacao || {};
            const h = d.historicoPartidas || {};
            
            let v = { amei: 0, curti: 0, "mais-ou-menos": 0, "nao-curti": 0 };
            Object.values(p).forEach(i => { if(v[i.voto] !== undefined) v[i.voto]++; });

            let rel = `📊 RELATÓRIO LIVE\n\n` +
                      `🏟️ Total de Partidas: ${Object.keys(h).length}\n` +
                      `🏆 Campeões Únicos: ${Object.keys(r).length}\n\n` +
                      `💬 PESQUISA:\n😍 Amei: ${v.amei}\n🙂 Curti: ${v.curti}\n😐 Médio: ${v['mais-ou-menos']}\n🙁 Não curti: ${v.nao-curti}\n\n` +
                      `Deseja ZERAR tudo? Digite SIM:`;
            
            if (prompt(rel)?.toUpperCase() === "SIM") {
                database.ref().remove().then(() => {
                    alert("Banco limpo!");
                    location.reload();
                });
            }
        });
    } else if (senha !== null) { alert("Senha incorreta!"); }
}

function salvarNoRankingCopa(nome, avatar) {
    const ref = database.ref('samininaRanking/' + nome.trim().toUpperCase());
    ref.once('value').then((s) => {
        if (s.exists()) ref.update({ copas: s.val().copas + 1, avatar: avatar });
        else ref.set({ nome: nome.trim().toUpperCase(), avatar: avatar, copas: 1 });
    });
}

function mostrarRanking(origem) {
    telaAnteriorAoRanking = origem;
    document.getElementById("tela-modo").classList.add("escondido");
    document.getElementById("tela-resultado").classList.add("escondido");
    document.getElementById("tela-ranking").classList.remove("escondido");

    database.ref('samininaRanking').orderByChild('copas').limitToLast(10).on('value', (s) => {
        let html = "";
        let arr = []; s.forEach(c => { arr.push(c.val()); });
        arr.reverse().forEach((j, i) => {
            html += `<div class="ranking-item"><div class="ranking-pos">${i+1}º</div><img src="${j.avatar}" class="ranking-avatar"><div class="ranking-info"><div class="ranking-nome">${j.nome}</div><div class="ranking-copas">${j.copas} Copas</div></div></div>`;
        });
        document.getElementById("lista-ranking").innerHTML = html || "<p style='text-align:center'>Sem campeões.</p>";
    });

    database.ref('historicoPartidas').orderByChild('timestamp').limitToLast(10).on('value', (s) => {
        let html = "";
        let arr = []; s.forEach(c => { arr.push(c.val()); });
        arr.reverse().forEach(p => {
            html += `<div class="ranking-item p-recent"><img src="${p.avatar}" class="ranking-avatar size-p"><div class="ranking-info"><div class="ranking-nome">${p.nome}</div><div class="ranking-titulo">${p.titulo}</div></div></div>`;
        });
        document.getElementById("lista-titulos-recentes").innerHTML = html || "<p style='text-align:center'>Sem histórico.</p>";
    });
}

// =========================================
// 5. LÓGICA DO QUIZ E DESISTÊNCIA
// =========================================
function confirmarDesistencia() {
    const desistenteNome = (modoDeJogo === 'solo' ? j1Nome : (jogadorAtual === 1 ? j1Nome : j2Nome)).toUpperCase();
    const querDesistir = confirm(`${desistenteNome}, tem certeza que deseja abandonar a partida?`);

    if (querDesistir) {
        clearInterval(controleCronometro);
        musicaFundo.pause();
        somErro.play();

        let tit = ""; let msg = ""; let winAv = "";

        if (modoDeJogo === 'solo') {
            tit = "ABANDONOU O CAMPO! 🏳️";
            msg = `${j1Nome.toUpperCase()} desistiu da partida.\nSeu título é: Perna de Pau 🪵`;
            salvarHistoricoPartida(j1Nome, j1Avatar, 0); 
        } else {
            const vencedorNome = (jogadorAtual === 1 ? j2Nome : j1Nome);
            const vencedorAvatar = (jogadorAtual === 1 ? j2Avatar : j1Avatar);
            const perdedorAvatar = (jogadorAtual === 1 ? j1Avatar : j2Avatar);

            tit = `${vencedorNome.toUpperCase()} VENCEU POR W.O.! 🏆`;
            msg = `${desistenteNome} desistiu!\n${vencedorNome} ganha uma Copa automática.`;
            winAv = vencedorAvatar;

            salvarNoRankingCopa(vencedorNome, vencedorAvatar);
            salvarHistoricoPartida(desistenteNome, perdedorAvatar, 0); 
            salvarHistoricoPartida(vencedorNome, vencedorAvatar, 10); 
        }

        document.getElementById("titulo-vencedor").innerText = tit;
        document.getElementById("mensagem-final").innerText = msg;
        const imgV = document.getElementById("img-avatar-vencedor");
        if (winAv) { imgV.src = winAv; imgV.style.display = "block"; } else { imgV.style.display = "none"; }

        document.getElementById("tela-quiz").classList.add("escondido");
        document.getElementById("timer-container").classList.add("escondido");
        document.getElementById("tela-resultado").classList.remove("escondido");
    }
}

function selecionarModo(m) { 
    modoDeJogo = m; 
    document.getElementById("tela-modo").classList.add("escondido");
    document.getElementById("tela-inicial").classList.remove("escondido");
    document.getElementById("container-avatar2").classList.toggle("escondido", m === 'solo');
    
    j1Pontos = 0; j2Pontos = 0; perguntaAtual = 0; jogadorAtual = 1;
    document.querySelector('.emoji-container')?.classList.remove('escondido');
    document.getElementById('feedback-agradecimento')?.classList.add('escondido');
}

function selecionarAvatar(p, i, el) {
    if (p === 1) j1Avatar = listaAvatares[i]; else j2Avatar = listaAvatares[i];
    el.parentElement.querySelectorAll('img').forEach(img => img.classList.remove('selecionado'));
    el.classList.add('selecionado');
}

function validarComeco() {
    j1Nome = document.getElementById("input-nome1").value;
    j2Nome = (modoDeJogo === 'solo') ? "Computador" : document.getElementById("input-nome2").value;
    if (!j1Nome || !j1Avatar || (modoDeJogo === 'batalha' && (!j2Nome || !j2Avatar))) return alert("Preencha tudo!");
    
    musicaFundo.play();
    perguntasDaRodada = bancoDePerguntas.sort(() => 0.5 - Math.random()).slice(0, 10);
    document.getElementById("tela-inicial").classList.add("escondido");
    
    if (modoDeJogo === 'solo') { 
        mostrarPergunta(); iniciarCronometro(); 
        document.getElementById("tela-quiz").classList.remove("escondido"); 
        document.getElementById("timer-container").classList.remove("escondido"); 
    } else prepararTurno();
}

function prepararTurno() {
    clearInterval(controleCronometro);
    document.getElementById("nome-destaque").innerText = (jogadorAtual === 1) ? j1Nome : j2Nome;
    document.getElementById("img-avatar-passagem").src = (jogadorAtual === 1) ? j1Avatar : j2Avatar;
    document.getElementById("tela-quiz").classList.add("escondido");
    document.getElementById("tela-passagem").classList.remove("escondido");
    document.getElementById("timer-container").classList.add("escondido");
}

function iniciarTurno() {
    document.getElementById("tela-passagem").classList.add("escondido");
    document.getElementById("tela-quiz").classList.remove("escondido");
    document.getElementById("timer-container").classList.remove("escondido");
    mostrarPergunta(); iniciarCronometro();
}

function mostrarPergunta() {
    const d = perguntasDaRodada[perguntaAtual];
    document.getElementById("img-avatar-quiz").src = (jogadorAtual === 1) ? j1Avatar : j2Avatar;
    document.getElementById("aviso-turno-nome").innerText = "Vez de: " + (jogadorAtual === 1 ? j1Nome : j2Nome);
    document.getElementById("texto-pergunta").innerText = d.pergunta;
    
    let totalP = (modoDeJogo === 'solo') ? 10 : 5;
    let atualP = (modoDeJogo === 'solo') ? perguntaAtual + 1 : Math.floor(perguntaAtual / 2) + 1;
    document.getElementById("barra-progresso").innerText = `Pergunta ${atualP} de ${totalP}`;
    
    const area = document.getElementById("area-botoes"); area.innerHTML = "";
    d.respostas.forEach((t, i) => {
        const b = document.createElement("button"); b.innerText = t; b.className = "btn-resposta";
        b.onclick = () => verificarResposta(i, b); area.appendChild(b);
    });
    document.getElementById("feedback-acerto").classList.add("escondido");
    document.getElementById("feedback-erro").classList.add("escondido");
    document.getElementById("texto-pergunta").classList.remove("escondido");
}

function iniciarCronometro() {
    tempoRestante = 30; clearInterval(controleCronometro);
    controleCronometro = setInterval(() => {
        tempoRestante--; document.getElementById("timer-display").innerText = `Tempo: ${tempoRestante}s`;
        if (tempoRestante <= 0) { somErro.play(); verificarResposta(-1, null); }
    }, 1000);
}

function verificarResposta(i, b) {
    clearInterval(controleCronometro);
    const correta = perguntasDaRodada[perguntaAtual].respostaCerta;
    document.querySelectorAll('.btn-resposta').forEach(btn => btn.disabled = true);

    if (i === correta) { 
        somAcerto.currentTime = 0; somAcerto.play(); 
        if(b) b.classList.add('correta'); 
        document.getElementById("feedback-acerto").classList.remove("escondido"); 
        if(jogadorAtual === 1) j1Pontos++; else j2Pontos++; 
    } else { 
        somErro.currentTime = 0; somErro.play(); 
        if(b) b.classList.add('errada'); 
        document.getElementById("feedback-erro").classList.remove("escondido"); 
    }
    document.getElementById("texto-pergunta").classList.add("escondido");
    
    setTimeout(() => {
        perguntaAtual++;
        if (perguntaAtual >= 10) finalizarJogo();
        else if (modoDeJogo === 'batalha') { jogadorAtual = (jogadorAtual === 1) ? 2 : 1; prepararTurno(); }
        else { mostrarPergunta(); iniciarCronometro(); }
    }, 2000);
}

function finalizarJogo() {
    document.getElementById("tela-quiz").classList.add("escondido");
    document.getElementById("timer-container").classList.add("escondido");
    document.getElementById("tela-resultado").classList.remove("escondido");
    
    if (modoDeJogo === 'solo') {
        salvarHistoricoPartida(j1Nome, j1Avatar, j1Pontos);
        if (j1Pontos >= 6) { salvarNoRankingCopa(j1Nome, j1Avatar); document.getElementById("titulo-vencedor").innerText = "CAMPEÃO! 🏆"; }
        else { document.getElementById("titulo-vencedor").innerText = "FIM DE JOGO!"; }
        document.getElementById("mensagem-final").innerText = `${j1Nome}: ${j1Pontos} acertos\nTítulo: ${calcularTitulo(j1Pontos)}`;
        document.getElementById("img-avatar-vencedor").src = j1Avatar;
    } else {
        salvarHistoricoPartida(j1Nome, j1Avatar, j1Pontos); salvarHistoricoPartida(j2Nome, j2Avatar, j2Pontos);
        let win = j1Pontos > j2Pontos ? j1Nome : j2Nome;
        let winAv = j1Pontos > j2Pontos ? j1Avatar : j2Avatar;
        if (j1Pontos !== j2Pontos) salvarNoRankingCopa(win, winAv);
        document.getElementById("titulo-vencedor").innerText = j1Pontos === j2Pontos ? "EMPATE!" : win + " VENCEU!";
        document.getElementById("mensagem-final").innerText = `${j1Nome}: ${j1Pontos} pts (${calcularTitulo(j1Pontos)})\n${j2Nome}: ${j2Pontos} pts (${calcularTitulo(j2Pontos)})`;
        document.getElementById("img-avatar-vencedor").src = j1Pontos >= j2Pontos ? j1Avatar : j2Avatar;
    }
}

// =========================================
// 6. INICIALIZAÇÃO E ATALHOS
// =========================================
function fecharRanking() { document.getElementById("tela-ranking").classList.add("escondido"); document.getElementById(telaAnteriorAoRanking).classList.remove("escondido"); }
function toggleMusica() { musicaFundo.muted = !musicaFundo.muted; document.getElementById("musica-icone").innerText = musicaFundo.muted ? "🔇" : "🔊"; }
function toggleFullscreen() { if (!document.fullscreenElement) document.documentElement.requestFullscreen(); else document.exitFullscreen(); }

document.addEventListener("DOMContentLoaded", () => {
    gerarQRCode();
    const parametros = new URLSearchParams(window.location.search);
    if (parametros.get('exibir') === 'ranking') {
        mostrarRanking('tela-modo');
    }
});
