const somAcerto = new Audio('audio/acerto.mp3');
const somErro = new Audio('audio/erro.mp3');
const musicaFundo = new Audio('audio/fundo.mp3');

somAcerto.volume = 0.5;
somErro.volume = 0.4;
musicaFundo.volume = 0.15;
musicaFundo.loop = true;

const listaAvatares = ['img/1.jpg', 'img/2.jpg', 'img/3.jpg', 'img/4.jpg'];

let j1Nome = "", j2Nome = "";
let j1Pontos = 0, j2Pontos = 0;
let j1Avatar = "", j2Avatar = ""; 
let perguntaAtual = 0, jogadorAtual = 1;
let perguntasDaRodada = [];
let tempoRestante = 30, controleCronometro, modoDeJogo = "";
let telaAnteriorAoRanking = "tela-modo"; // Controla o botão de voltar do ranking

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
    { pergunta: "Qual a forma da taça da Copa?", respostas: ["Globo", "Dois atletas", "Chuteira"], respostaCerta: 1 }
];

// =========================================
// RANKING E DESISTÊNCIA (W.O.)
// =========================================
function verificarSenhaReset() {
    let senha = prompt("Acesso Restrito Saminina:\nDigite a senha para ZERAR o ranking:");
    if (senha === "321") { localStorage.removeItem("samininaRanking"); alert("Ranking zerado com sucesso!"); } 
    else if (senha !== null) { alert("Senha incorreta!"); }
}

function salvarNoRanking(nomeVencedor, avatarVencedor) {
    let ranking = JSON.parse(localStorage.getItem("samininaRanking") || "[]");
    let nomeFormatado = nomeVencedor.trim().toUpperCase();
    let jogadorExistente = ranking.find(j => j.nome === nomeFormatado && j.avatar === avatarVencedor);
    if (jogadorExistente) { jogadorExistente.copas += 1; } else { ranking.push({ nome: nomeFormatado, avatar: avatarVencedor, copas: 1 }); }
    localStorage.setItem("samininaRanking", JSON.stringify(ranking));
}

function mostrarRanking(origem) {
    telaAnteriorAoRanking = origem; // Salva de onde a pessoa abriu (tela-modo ou tela-resultado)
    document.getElementById("tela-modo").classList.add("escondido");
    document.getElementById("tela-resultado").classList.add("escondido");
    document.getElementById("tela-ranking").classList.remove("escondido");

    let ranking = JSON.parse(localStorage.getItem("samininaRanking") || "[]");
    ranking.sort((a, b) => b.copas - a.copas);
    let top10 = ranking.slice(0, 10);
    let htmlLista = "";

    if (top10.length === 0) { htmlLista = "<p style='text-align: center;'>Nenhum campeão registrado ainda.</p>"; } 
    else {
        top10.forEach((jogador, index) => {
            let trofeu = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🎖️";
            htmlLista += `<div class="ranking-item"><div class="ranking-pos">${index + 1}º</div><img src="${jogador.avatar}" class="ranking-avatar"><div class="ranking-info"><div class="ranking-nome">${jogador.nome} ${trofeu}</div><div class="ranking-copas">${jogador.copas} ${jogador.copas > 1 ? 'Copas' : 'Copa'} Conquistada(s)</div></div></div>`;
        });
    }
    document.getElementById("lista-ranking").innerHTML = htmlLista;
}

function fecharRanking() {
    document.getElementById("tela-ranking").classList.add("escondido");
    document.getElementById(telaAnteriorAoRanking).classList.remove("escondido"); // Volta pra tela certa
}

function confirmarDesistencia() {
    clearInterval(controleCronometro); // Pausa o tempo
    const nomeVez = (jogadorAtual === 1 ? j1Nome : j2Nome).toUpperCase();
    const querDesistir = confirm(`${nomeVez}, tem certeza que deseja desistir da partida?`);

    if (querDesistir) {
        finalizarPorWO();
    } else {
        iniciarCronometro(); // Retoma o tempo
    }
}

function finalizarPorWO() {
    document.getElementById("tela-quiz").classList.add("escondido");
    document.getElementById("timer-container").classList.add("escondido");
    document.getElementById("tela-resultado").classList.remove("escondido");

    let tit = "", msg = "", winAvatar = "";

    if (modoDeJogo === 'solo') {
        tit = "DESISTIU! 🏳️";
        msg = `${j1Nome.toUpperCase()} abandonou o jogo.\nNenhuma Copa conquistada.`;
        winAvatar = "";
    } else {
        // Na Batalha, o outro jogador ganha automaticamente
        if (jogadorAtual === 1) { // J1 desistiu
            tit = `${j2Nome.toUpperCase()} VENCEU POR W.O.! 🏆`;
            winAvatar = j2Avatar;
            salvarNoRanking(j2Nome, j2Avatar);
            msg = `${j1Nome} desistiu da partida!\n${j2Nome} ganha uma Copa automática!`;
        } else { // J2 desistiu
            tit = `${j1Nome.toUpperCase()} VENCEU POR W.O.! 🏆`;
            winAvatar = j1Avatar;
            salvarNoRanking(j1Nome, j1Avatar);
            msg = `${j2Nome} desistiu da partida!\n${j1Nome} ganha uma Copa automática!`;
        }
    }

    document.getElementById("img-avatar-vencedor").src = winAvatar;
    document.getElementById("img-avatar-vencedor").style.display = winAvatar ? "block" : "none";
    document.getElementById("titulo-vencedor").innerText = tit;
    document.getElementById("mensagem-final").innerText = msg;
}

// =========================================
// LÓGICA DO QUIZ
// =========================================
function selecionarModo(modo) {
    modoDeJogo = modo;
    document.getElementById("tela-modo").classList.add("escondido");
    document.getElementById("tela-inicial").classList.remove("escondido");
    const container2 = document.getElementById("container-avatar2");
    if (modo === 'solo') container2.classList.add("escondido");
    else container2.classList.remove("escondido");
}

function selecionarAvatar(player, idx, el) {
    const caminho = listaAvatares[idx];
    if (player === 1) j1Avatar = caminho; else j2Avatar = caminho;
    const parent = el.parentElement;
    parent.querySelectorAll('.img-avatar-opcao').forEach(img => img.classList.remove('selecionado'));
    el.classList.add('selecionado');
}

function toggleMusica() { musicaFundo.muted = !musicaFundo.muted; document.getElementById("musica-icone").innerText = musicaFundo.muted ? "🔇" : "🔊"; }
function toggleFullscreen() { if (!document.fullscreenElement) document.documentElement.requestFullscreen(); else document.exitFullscreen(); }

function validarComeco() {
    j1Nome = document.getElementById("input-nome1").value;
    j2Nome = (modoDeJogo === 'solo') ? "Computador" : document.getElementById("input-nome2").value;

    if (!j1Nome || (modoDeJogo === 'batalha' && !j2Nome)) { alert("Preencham os nomes!"); return; }
    if (!j1Avatar || (modoDeJogo === 'batalha' && !j2Avatar)) { alert("Escolham os avatares!"); return; }

    musicaFundo.play();
    document.getElementById("btn-musica-toggle").style.display = "flex";
    perguntasDaRodada = bancoDePerguntas.sort(() => 0.5 - Math.random()).slice(0, 10);
    document.getElementById("tela-inicial").classList.add("escondido");

    if (modoDeJogo === 'solo') {
        document.getElementById("tela-quiz").classList.remove("escondido");
        document.getElementById("timer-container").classList.remove("escondido");
        mostrarPergunta(); iniciarCronometro();
    } else prepararTurno();
}

function prepararTurno() {
    clearInterval(controleCronometro);
    document.getElementById("timer-container").classList.add("escondido");
    const nome = (jogadorAtual === 1) ? j1Nome : j2Nome;
    const avatar = (jogadorAtual === 1) ? j1Avatar : j2Avatar;
    document.getElementById("nome-destaque").innerText = nome;
    document.getElementById("img-avatar-passagem").src = avatar;
    document.getElementById("tela-quiz").classList.add("escondido");
    document.getElementById("tela-passagem").classList.remove("escondido");
}

function iniciarTurno() {
    document.getElementById("tela-passagem").classList.add("escondido");
    document.getElementById("tela-quiz").classList.remove("escondido");
    document.getElementById("timer-container").classList.remove("escondido");
    mostrarPergunta(); iniciarCronometro();
}

function mostrarPergunta() {
    const dados = perguntasDaRodada[perguntaAtual];
    const nome = (jogadorAtual === 1 ? j1Nome : j2Nome);
    const avatar = (jogadorAtual === 1 ? j1Avatar : j2Avatar);
    document.getElementById("img-avatar-quiz").src = avatar;
    document.getElementById("aviso-turno-nome").innerText = "Vez de: " + nome;
    document.getElementById("texto-pergunta").classList.remove("escondido");
    document.getElementById("feedback-acerto").classList.add("escondido");
    document.getElementById("feedback-erro").classList.add("escondido");
    
    // CORREÇÃO DA CONTAGEM DE PERGUNTAS (1 de 5 na Batalha)
    let totalPerguntas = (modoDeJogo === 'solo') ? 10 : 5;
    let rodadaAtual = (modoDeJogo === 'solo') ? perguntaAtual + 1 : Math.floor(perguntaAtual / 2) + 1;
    document.getElementById("barra-progresso").innerText = `Pergunta ${rodadaAtual} de ${totalPerguntas}`;
    
    document.getElementById("texto-pergunta").innerText = dados.pergunta;
    
    const area = document.getElementById("area-botoes"); area.innerHTML = "";
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
    clearInterval(controleCronometro);
    controleCronometro = setInterval(() => {
        tempoRestante--; el.innerText = `Tempo: ${tempoRestante}s`;
        if (tempoRestante <= 0) verificarResposta(-1, null);
    }, 1000);
}

function verificarResposta(idx, btn) {
    clearInterval(controleCronometro);
    const correta = perguntasDaRodada[perguntaAtual].respostaCerta;
    const btns = document.querySelectorAll('.btn-resposta');
    btns.forEach(b => b.disabled = true);

    if (idx === correta) {
        somAcerto.currentTime = 0; // CORREÇÃO DO ÁUDIO
        somAcerto.play(); 
        btn.classList.add('correta');
        document.getElementById("feedback-acerto").classList.remove("escondido");
        document.getElementById("texto-pergunta").classList.add("escondido");
        if (jogadorAtual === 1) j1Pontos++; else j2Pontos++;
    } else {
        somErro.currentTime = 0; // CORREÇÃO DO ÁUDIO
        somErro.play(); 
        if(btn) btn.classList.add('errada');
        btns[correta].classList.add('correta');
        document.getElementById("feedback-erro").classList.remove("escondido");
        document.getElementById("texto-pergunta").classList.add("escondido");
    }

    setTimeout(() => {
        perguntaAtual++;
        if (perguntaAtual >= 10) mostrarResultadoFinal();
        else if (modoDeJogo === 'batalha') { jogadorAtual = (jogadorAtual === 1) ? 2 : 1; prepararTurno(); }
        else { mostrarPergunta(); iniciarCronometro(); }
    }, 2500);
}

function mostrarResultadoFinal() {
    clearInterval(controleCronometro);
    document.getElementById("tela-quiz").classList.add("escondido");
    document.getElementById("timer-container").classList.add("escondido");
    document.getElementById("tela-resultado").classList.remove("escondido");
    
    let tit = "", msg = "", winAvatar = "";

    if (modoDeJogo === 'solo') {
        winAvatar = j1Avatar;
        // REGRA NOVA: Fez 6 ou mais, ganha a Copa!
        if (j1Pontos >= 6) {
            tit = `MANDOU BEM, ${j1Nome.toUpperCase()}! 🏆`;
            msg = `Você marcou ${j1Pontos}/10 acertos e conquistou uma Copa pro Ranking!`;
            salvarNoRanking(j1Nome, j1Avatar); 
        } else {
            tit = `FIM DE JOGO, ${j1Nome.toUpperCase()}!`;
            msg = `Você marcou ${j1Pontos} pontos. Para ganhar uma Copa e entrar no ranking, você precisa acertar pelo menos 6 perguntas! Tente de novo!`;
        }
    } else {
        // Modo Batalha
        if (j1Pontos > j2Pontos) { 
            tit = `${j1Nome.toUpperCase()} VENCEU! 🏆`; 
            winAvatar = j1Avatar;
            salvarNoRanking(j1Nome, j1Avatar); 
            msg = `Parabéns! Você conquistou uma Copa para o Ranking.\n\n${j1Nome}: ${j1Pontos} acertos\n${j2Nome}: ${j2Pontos} acertos`;
        }
        else if (j2Pontos > j1Pontos) { 
            tit = `${j2Nome.toUpperCase()} VENCEU! 🏆`; 
            winAvatar = j2Avatar;
            salvarNoRanking(j2Nome, j2Avatar); 
            msg = `Parabéns! Você conquistou uma Copa para o Ranking.\n\n${j1Nome}: ${j1Pontos} acertos\n${j2Nome}: ${j2Pontos} acertos`;
        }
        else { 
            tit = "EMPATE! 🤝"; 
            winAvatar = ""; 
            msg = `Foi disputado! Ninguém leva a Copa desta vez.\n\n${j1Nome}: ${j1Pontos} acertos\n${j2Nome}: ${j2Pontos} acertos`;
        }
    }

    document.getElementById("img-avatar-vencedor").src = winAvatar;
    document.getElementById("img-avatar-vencedor").style.display = winAvatar ? "block" : "none";
    document.getElementById("titulo-vencedor").innerText = tit;
    document.getElementById("mensagem-final").innerText = msg;
}