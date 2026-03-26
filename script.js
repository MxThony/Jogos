console.log("🔥 COPA SAMININA COM ONLINE");

// CONFIG FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyDbvleD3CCVEOybvc7B-sKmzL1ugnHiMyk",
    authDomain: "copa-saminina.firebaseapp.com",
    databaseURL: "https://copa-saminina-default-rtdb.firebaseio.com",
    projectId: "copa-saminina"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// =========================
// VARIÁVEIS GERAIS
// =========================
let modoDeJogo = "";
let salaId = null;
let jogadorTipo = null; // host ou convidado

let j1Nome = "";
let j2Nome = "";
let j1Avatar = "";
let j2Avatar = "";

let jogadorAtual = 1;
let perguntaAtual = 0;

let j1Pontos = 0;
let j2Pontos = 0;

// =========================
// MODO SELEÇÃO
// =========================
function selecionarModo(modo) {
    modoDeJogo = modo;

    document.getElementById("tela-modo").classList.add("escondido");
    document.getElementById("tela-inicial").classList.remove("escondido");

    if (modo === "online") {
        iniciarSalaOnline();
    }
}

// =========================
// ONLINE
// =========================

function gerarCodigoSala() {
    return Math.random().toString(36).substring(2, 7);
}

function iniciarSalaOnline() {
    salaId = gerarCodigoSala();
    jogadorTipo = "host";

    db.ref("salas/" + salaId).set({
        status: "esperando",
        host: { nome: "", avatar: "", pronto: false },
        convidado: { nome: "", avatar: "", pronto: false },
        jogo: {
            turno: "host",
            perguntaAtual: 0,
            j1Pontos: 0,
            j2Pontos: 0
        }
    });

    const link = window.location.origin + "?sala=" + salaId;

    linkSalaAtual = window.location.origin + window.location.pathname + "?sala=" + salaId;

document.getElementById("input-link-sala").value = linkSalaAtual;
document.getElementById("modal-compartilhar").classList.remove("escondido");
}

// entrar via link
const params = new URLSearchParams(window.location.search);
if (params.get("sala")) {
    salaId = params.get("sala");
    jogadorTipo = "convidado";

    document.getElementById("tela-modo").classList.add("escondido");
    document.getElementById("tela-inicial").classList.remove("escondido");
}

// =========================
// AVATAR
// =========================
function selecionarAvatar(j, i, el) {
    const lista = ['img/1.jpg','img/2.jpg','img/3.jpg','img/4.jpg'];

    if (j === 1) j1Avatar = lista[i];
    if (j === 2) j2Avatar = lista[i];

    el.parentElement.querySelectorAll("img").forEach(img => img.classList.remove("selecionado"));
    el.classList.add("selecionado");
}

// =========================
// COMEÇAR
// =========================
function validarComeco() {

    j1Nome = document.getElementById("input-nome1").value;

    if (modoDeJogo === "online") {

        const ref = db.ref("salas/" + salaId + "/" + jogadorTipo);

        ref.update({
            nome: j1Nome,
            avatar: j1Avatar,
            pronto: true
        });

        esperarJogador();

        return;
    }

    iniciarJogoLocal();
}

function esperarJogador() {
    alert("Aguardando o outro jogador...");

    db.ref("salas/" + salaId).on("value", snap => {
        const data = snap.val();

        if (data.host.pronto && data.convidado.pronto) {
            iniciarJogoOnline(data);
        }
    });
}

// =========================
// INICIAR ONLINE
// =========================
function iniciarJogoOnline(data) {

    j1Nome = data.host.nome;
    j2Nome = data.convidado.nome;
    j1Avatar = data.host.avatar;
    j2Avatar = data.convidado.avatar;

    document.getElementById("tela-inicial").classList.add("escondido");
    document.getElementById("tela-quiz").classList.remove("escondido");

    sincronizarJogo();
}

function sincronizarJogo() {

    db.ref("salas/" + salaId + "/jogo").on("value", snap => {

        const jogo = snap.val();

        perguntaAtual = jogo.perguntaAtual;
        jogadorAtual = jogo.turno === "host" ? 1 : 2;

        j1Pontos = jogo.j1Pontos;
        j2Pontos = jogo.j2Pontos;

        atualizarTela();
    });
}

// =========================
// BLOQUEIO DE TURNO
// =========================
function podeResponder() {
    if (modoDeJogo !== "online") return true;

    if (jogadorTipo === "host" && jogadorAtual === 1) return true;
    if (jogadorTipo === "convidado" && jogadorAtual === 2) return true;

    return false;
}

// =========================
// RESPOSTA
// =========================
function responder() {

    if (!podeResponder()) return;

    if (jogadorAtual === 1) j1Pontos++;
    else j2Pontos++;

    trocarTurno();
}

function trocarTurno() {

    if (modoDeJogo === "online") {

        db.ref("salas/" + salaId + "/jogo").update({
            turno: jogadorAtual === 1 ? "convidado" : "host",
            perguntaAtual: perguntaAtual + 1,
            j1Pontos,
            j2Pontos
        });

    } else {
        jogadorAtual = jogadorAtual === 1 ? 2 : 1;
        perguntaAtual++;
        atualizarTela();
    }
}

// =========================
// UI
// =========================
function atualizarTela() {
    document.getElementById("aviso-turno-nome").innerText =
        "VEZ DE: " + (jogadorAtual === 1 ? j1Nome : j2Nome);
}

// =========================
// INICIO LOCAL
// =========================
function iniciarJogoLocal() {
    document.getElementById("tela-inicial").classList.add("escondido");
    document.getElementById("tela-quiz").classList.remove("escondido");
}

// ===== COMPARTILHAMENTO =====

let linkSalaAtual = "";

function copiarLinkSala() {
    navigator.clipboard.writeText(linkSalaAtual).then(() => {
        alert("Link copiado!");
    });
}

function compartilharWhatsapp() {
    const mensagem = `Entre na minha partida da Copa Saminina: ${linkSalaAtual}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(mensagem)}`, "_blank");
}

function fecharModalCompartilhar() {
    document.getElementById("modal-compartilhar").classList.add("escondido");
}