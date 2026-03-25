// =========================================
// CONFIGURAÇÃO DO FIREBASE (COLE SUAS CHAVES AQUI)
// =========================================
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "copa-saminina.firebaseapp.com",
    databaseURL: "https://copa-saminina-default-rtdb.firebaseio.com",
    projectId: "copa-saminina",
    storageBucket: "copa-saminina.appspot.com",
    messagingSenderId: "961413845237",
    appId: "SUA_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// =========================================
// ÁUDIOS (APENAS OS QUE VOCÊ JÁ TEM)
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

// =========================================
// LÓGICA DE TÍTULOS E HISTÓRICO
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
// QR CODE E INTERFACE
// =========================================
function gerarQRCode() {
    const container = document.getElementById("qrcode-container");
    if (!container) return;
    container.innerHTML = "";
    new QRCode(container, {
        text: window.location.href,
        width: 120, height: 120,
        colorDark : "#003399", colorLight : "#FFFFFF"
    });
}
document.addEventListener("DOMContentLoaded", gerarQRCode);

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
    let senha = prompt("Acesso Restrito:\nDigite a senha (321) para ver o relatório ou zerar o banco:");
    if (senha === "321") {
        database.ref().once('value').then((snapshot) => {
            const d = snapshot.val() || {};
            const r = d.samininaRanking || {};
            const p = d.pesquisaSatisfacao || {};
            let v = { amei: 0, curti: 0, "mais-ou-menos": 0, "nao-curti": 0 };
            Object.values(p).forEach(i => { if(v[i.voto] !== undefined) v[i.voto]++; });

            let rel = `📊 RELATÓRIO LIVE\n🏆 Campeões: ${Object.keys(r).length}\n😍 Amei: ${v.amei} | 🙂 Curti: ${v.curti}\n\nZerar tudo? Digite SIM:`;
            if (prompt(rel)?.toUpperCase() === "SIM") {
                database.ref().remove().then(() => location.reload());
            }
        });
    }
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

    // Top 10 Copas
    database.ref('samininaRanking').orderByChild('copas').limitToLast(10).once('value', (s) => {
        let html = "";
        let arr = []; s.forEach(c => { arr.push(c.val()); });
        arr.reverse().forEach((j, i) => {
            html += `<div class="ranking-item"><div>${i+1}º</div><img src="${j.avatar}" class="ranking-avatar"><div><b>${j.nome}</b><br><small>${j.copas} Copas</small></div></div>`;
        });
        document.getElementById("lista-ranking").innerHTML = html || "Sem dados";
    });

    // Últimos 10 Títulos
    database.ref('historicoPartidas').orderByChild('timestamp').limitToLast(10).once('value', (s) => {
        let html = "";
        let arr = []; s.forEach(c => { arr.push(c.val()); });
        arr.reverse().forEach(p => {
            html += `<div class="ranking-item p-recent"><img src="${p.avatar}" class="ranking-avatar size-p"><div><b>${p.nome}</b><br><small>${p.titulo}</small></div></div>`;
        });
        document.getElementById("lista-titulos-recentes").innerHTML = html || "Sem dados";
    });
}

// =========================================
// FUNÇÕES DE JOGO (SIMPLIFICADAS)
// =========================================
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
    if (modoDeJogo === 'solo') { mostrarPergunta(); iniciarCronometro(); document.getElementById("tela-quiz").classList.remove("escondido"); document.getElementById("timer-container").classList.remove("escondido"); }
    else prepararTurno();
}

function prepararTurno() {
    clearInterval(controleCronometro);
    const n = (jogadorAtual === 1) ? j1Nome : j2Nome;
    document.getElementById("nome-destaque").innerText = n;
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
    document.getElementById("barra-progresso").innerText = `Pergunta ${perguntaAtual + 1} de 10`;
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
    if (i === correta) { somAcerto.currentTime = 0; somAcerto.play(); b.classList.add('correta'); document.getElementById("feedback-acerto").classList.remove("escondido"); if(jogadorAtual === 1) j1Pontos++; else j2Pontos++; }
    else { somErro.currentTime = 0; somErro.play(); if(b) b.classList.add('errada'); document.getElementById("feedback-erro").classList.remove("escondido"); }
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
        document.getElementById("mensagem-final").innerText = `${j1Nome}: ${j1Pontos} pontos\nTítulo: ${calcularTitulo(j1Pontos)}`;
        document.getElementById("img-avatar-vencedor").src = j1Avatar;
    } else {
        salvarHistoricoPartida(j1Nome, j1Avatar, j1Pontos); salvarHistoricoPartida(j2Nome, j2Avatar, j2Pontos);
        let win = j1Pontos > j2Pontos ? j1Nome : j2Nome;
        if (j1Pontos !== j2Pontos) salvarNoRankingCopa(win, j1Pontos > j2Pontos ? j1Avatar : j2Avatar);
        document.getElementById("titulo-vencedor").innerText = j1Pontos === j2Pontos ? "EMPATE!" : win + " VENCEU!";
        document.getElementById("mensagem-final").innerText = `${j1Nome}: ${j1Pontos} pts (${calcularTitulo(j1Pontos)})\n${j2Nome}: ${j2Pontos} pts (${calcularTitulo(j2Pontos)})`;
        document.getElementById("img-avatar-vencedor").src = j1Pontos >= j2Pontos ? j1Avatar : j2Avatar;
    }
}

function fecharRanking() { document.getElementById("tela-ranking").classList.add("escondido"); document.getElementById(telaAnteriorAoRanking).classList.remove("escondido"); }
function toggleMusica() { musicaFundo.muted = !musicaFundo.muted; document.getElementById("musica-icone").innerText = musicaFundo.muted ? "🔇" : "🔊"; }
function toggleFullscreen() { if (!document.fullscreenElement) document.documentElement.requestFullscreen(); else document.exitFullscreen(); }