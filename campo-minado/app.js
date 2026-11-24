// A página do Campo Minado: liga o jogo e a DQN (dqn.js) ao tabuleiro, aos botões e ao gráfico.
// Os textos montados aqui seguem o idioma escolhido (idioma.js) e são refeitos quando ele muda.
(function () {
  "use strict";

  const { FECHADA, CampoMinado, RedeQ, chanceDeMina } = window.CampoMinadoDQN;
  const DEFINICOES = window.REDES_CAMPO_MINADO;
  const I18N = window.I18N || { en: () => false, escolher: (pt) => pt };
  const tr = (portugues, ingles) => I18N.escolher(portugues, ingles);

  const tabuleiro = document.getElementById("tabuleiro");
  const status = document.getElementById("status");
  const botaoJogada = document.getElementById("botao-jogada");
  const botaoAuto = document.getElementById("botao-auto");
  const botaoNova = document.getElementById("botao-nova");
  const mostrarPensamento = document.getElementById("mostrar-pensamento");
  const legendaCalor = document.getElementById("legenda-calor");

  const redes = {}; // cada rede é montada uma vez só
  const estado = {
    tab: "9x9",
    rede: null,
    jogo: null,
    q: null,
    proxima: -1,
    auto: false,
    relogio: null,
    recentes: new Set(),
    vitorias: 0,
    derrotas: 0,
    aviso: null, // função que monta a última mensagem no idioma atual
  };
  let casas = [];

  const porcento = (p) => `${Math.round(p * 100)}%`;

  function coordenadas(casa) {
    const colunas = estado.jogo.colunas;
    const linha = Math.floor(casa / colunas) + 1;
    const coluna = (casa % colunas) + 1;
    return tr(`linha ${linha}, coluna ${coluna}`, `row ${linha}, column ${coluna}`);
  }

  // Mostra uma mensagem no quadro de status. `gerar` devolve [destaque, texto] no idioma
  // atual; ela é guardada para a mensagem ser traduzida se o idioma mudar.
  function avisar(gerar) {
    estado.aviso = gerar;
    const [destaque, texto] = gerar();
    const partes = [];
    if (destaque) {
      const forte = document.createElement("strong");
      forte.textContent = destaque;
      partes.push(forte, " ");
    }
    partes.push(texto);
    status.replaceChildren(...partes);
  }

  // Ícone de mina (um círculo com pontas), copiado para cada casa que precisa.
  const modeloMina = (() => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML =
      '<g stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 2.5v4M12 17.5v4M2.5 12h4M17.5 12h4M5.3 5.3l2.8 2.8M15.9 15.9l2.8 2.8M5.3 18.7l2.8-2.8M15.9 8.1l2.8-2.8"/></g><circle cx="12" cy="12" r="6" fill="currentColor"/><circle cx="10" cy="10" r="1.6" style="fill: var(--casa)"/>';
    return svg;
  })();

  // ------------------------------------------------------------------
  // Tabuleiro
  // ------------------------------------------------------------------

  function rotularTabuleiro() {
    const j = estado.jogo;
    tabuleiro.setAttribute(
      "aria-label",
      tr(`Tabuleiro ${j.linhas} por ${j.colunas} com ${j.nMinas} minas`, `${j.linhas} by ${j.colunas} board with ${j.nMinas} mines`)
    );
  }

  function montarTabuleiro() {
    const jogo = estado.jogo;
    tabuleiro.dataset.lado = String(jogo.colunas);
    tabuleiro.setAttribute("role", "group");
    rotularTabuleiro();
    casas = Array.from({ length: jogo.nCasas }, (_, i) => {
      const botao = document.createElement("button");
      botao.type = "button";
      botao.className = "casa";
      botao.addEventListener("click", () => {
        alternarAuto(false);
        jogar(i, "voce");
      });
      return botao;
    });
    tabuleiro.replaceChildren(...casas);
  }

  // A rede avalia o tabuleiro atual: valor Q de cada casa e a jogada que ela faria.
  function pensar() {
    const jogo = estado.jogo;
    if (jogo.terminou) {
      estado.q = null;
      estado.proxima = -1;
      return;
    }
    estado.q = estado.rede.valoresQ(jogo.visivel);
    estado.proxima = estado.rede.melhorJogada(jogo.visivel, estado.q);
  }

  function desenhar() {
    const jogo = estado.jogo;
    const mostrar = mostrarPensamento.checked;
    tabuleiro.classList.toggle("pensando", mostrar);
    tabuleiro.classList.toggle("venceu", jogo.terminou && jogo.venceu);
    tabuleiro.classList.toggle("perdeu", jogo.terminou && !jogo.venceu);
    legendaCalor.style.opacity = mostrar ? "1" : "0.45";

    casas.forEach((botao, i) => {
      const valor = jogo.visivel[i];
      const classes = ["casa"];
      let rotulo;
      botao.style.removeProperty("--p");

      if (valor === FECHADA && jogo.terminou && jogo.minas[i]) {
        classes.push("mina");
        if (i === jogo.explodiu) classes.push("explodiu");
        botao.replaceChildren(modeloMina.cloneNode(true));
        rotulo = i === jogo.explodiu ? tr("a mina que explodiu", "the mine that exploded") : tr("mina", "mine");
      } else if (valor === FECHADA) {
        classes.push("fechada");
        const chance = document.createElement("span");
        chance.className = "chance";
        rotulo = tr("fechada", "closed");
        if (estado.q) {
          const p = chanceDeMina(estado.q[i]);
          botao.style.setProperty("--p", (p * 0.92).toFixed(3));
          if (p > 0.6) classes.push("quente");
          if (p > 0.8) classes.push("muito-quente");
          chance.textContent = porcento(p);
          if (mostrar) rotulo += tr(`, chance de mina estimada ${porcento(p)}`, `, estimated mine chance ${porcento(p)}`);
          if (i === estado.proxima && mostrar) {
            classes.push("proxima");
            rotulo += tr(", a DQN abriria esta", ", the DQN would open this one");
          }
        }
        botao.replaceChildren(chance);
      } else {
        classes.push("aberta");
        if (valor > 0) classes.push(`n${valor}`);
        if (estado.recentes.has(i)) classes.push("recente");
        botao.replaceChildren(valor > 0 ? String(valor) : "");
        if (valor === 0) rotulo = tr("aberta, sem minas em volta", "open, no mines around");
        else rotulo = tr(`aberta, ${valor} ${valor === 1 ? "mina" : "minas"} em volta`, `open, ${valor} ${valor === 1 ? "mine" : "mines"} around`);
      }

      botao.className = classes.join(" ");
      botao.disabled = jogo.terminou || valor !== FECHADA;
      botao.setAttribute("aria-label", `${coordenadas(i)}: ${rotulo}`);
    });
    estado.recentes.clear();

    botaoJogada.disabled = jogo.terminou;
    document.getElementById("vitorias").textContent = String(estado.vitorias);
    document.getElementById("derrotas").textContent = String(estado.derrotas);
  }

  // ------------------------------------------------------------------
  // Jogadas
  // ------------------------------------------------------------------

  function jogar(casa, quem) {
    const jogo = estado.jogo;
    if (jogo.terminou || casa < 0) return;
    const chanceEstimada = estado.q ? chanceDeMina(estado.q[casa]) : null;
    const resultado = jogo.jogar(casa);
    if (resultado === "repetida") return;

    const sujeito = () => (quem === "dqn" ? tr("A DQN", "The DQN") : tr("Você", "You"));
    if (resultado === "mina") {
      estado.derrotas++;
      avisar(() => {
        const final =
          chanceEstimada == null
            ? "."
            : tr(`, onde a DQN estimava ${porcento(chanceEstimada)} de chance de mina.`, `, where the DQN estimated a ${porcento(chanceEstimada)} mine chance.`);
        return [tr("Mina!", "Mine!"), tr(`${sujeito()} abriu a ${coordenadas(casa)}${final}`, `${sujeito()} opened ${coordenadas(casa)}${final}`)];
      });
    } else {
      jogo.ultimasAbertas.forEach((i) => estado.recentes.add(i));
      if (resultado === "vitoria") {
        estado.vitorias++;
        const seguras = jogo.nCasas - jogo.nMinas;
        avisar(() => [tr("Vitória!", "Win!"), tr(`${sujeito()} abriu todas as ${seguras} casas seguras.`, `${sujeito()} opened all ${seguras} safe cells.`)]);
      } else {
        const cadeia = jogo.ultimasAbertas.length - 1;
        const falta = jogo.fechadasSeguras;
        avisar(() => {
          const extra =
            cadeia > 0 ? tr(` e mais ${cadeia} ${cadeia === 1 ? "casa" : "casas"} em cadeia`, ` and ${cadeia} more ${cadeia === 1 ? "cell" : "cells"} in a chain`) : "";
          const restante = tr(
            falta === 1 ? "Falta 1 casa segura." : `Faltam ${falta} casas seguras.`,
            falta === 1 ? "1 safe cell left." : `${falta} safe cells left.`
          );
          return [null, tr(`${sujeito()} abriu a ${coordenadas(casa)}${extra}. ${restante}`, `${sujeito()} opened ${coordenadas(casa)}${extra}. ${restante}`)];
        });
      }
    }
    pensar();
    desenhar();
  }

  function novaPartida(semente) {
    estado.jogo.reset(semente);
    estado.recentes.clear();
    pensar();
    desenhar();
    const j = estado.jogo;
    avisar(() => [
      null,
      tr(
        `Tabuleiro novo: ${j.linhas}×${j.colunas} com ${j.nMinas} minas. Peça a primeira jogada da DQN ou clique numa casa.`,
        `New board: ${j.linhas}×${j.colunas} with ${j.nMinas} mines. Ask for the DQN's first move or click a cell.`
      ),
    ]);
  }

  function trocarTabuleiro(tab) {
    estado.tab = tab;
    estado.rede = redes[tab] || (redes[tab] = new RedeQ(DEFINICOES[tab]));
    const r = estado.rede;
    estado.jogo = new CampoMinado(r.linhas, r.colunas, r.minas);
    montarTabuleiro();
    novaPartida();
  }

  // ------------------------------------------------------------------
  // Jogar sozinha
  // ------------------------------------------------------------------

  const intervalo = () => (estado.tab === "9x9" ? 450 : 700);

  function rotularAuto() {
    botaoAuto.textContent = estado.auto ? tr("Pausar", "Pause") : tr("Jogar sozinha", "Autoplay");
    botaoAuto.setAttribute("aria-pressed", String(estado.auto));
  }

  function alternarAuto(ligar) {
    estado.auto = ligar;
    rotularAuto();
    clearTimeout(estado.relogio);
    if (ligar) estado.relogio = setTimeout(passoAutomatico, 120);
  }

  function passoAutomatico() {
    if (!estado.auto) return;
    if (estado.jogo.terminou) {
      novaPartida();
    } else {
      jogar(estado.proxima, "dqn");
    }
    estado.relogio = setTimeout(passoAutomatico, estado.jogo.terminou ? 2200 : intervalo());
  }

  // ------------------------------------------------------------------
  // Controles
  // ------------------------------------------------------------------

  botaoJogada.addEventListener("click", () => {
    alternarAuto(false);
    jogar(estado.proxima, "dqn");
  });
  botaoAuto.addEventListener("click", () => alternarAuto(!estado.auto));
  botaoNova.addEventListener("click", () => novaPartida());
  mostrarPensamento.addEventListener("change", desenhar);

  // Grupo de botões que funciona como opção única (setas do teclado também trocam).
  function grupoDeOpcoes(grupo, aoEscolher) {
    const opcoes = [...grupo.querySelectorAll("[role=radio]")];
    const escolher = (botao) => {
      opcoes.forEach((b) => {
        b.setAttribute("aria-checked", String(b === botao));
        b.tabIndex = b === botao ? 0 : -1;
      });
      aoEscolher(botao.dataset.tab);
    };
    opcoes.forEach((botao, i) => {
      botao.tabIndex = botao.getAttribute("aria-checked") === "true" ? 0 : -1;
      botao.addEventListener("click", () => escolher(botao));
      botao.addEventListener("keydown", (evento) => {
        const passo = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[evento.key];
        if (!passo) return;
        evento.preventDefault();
        const alvo = opcoes[(i + passo + opcoes.length) % opcoes.length];
        alvo.focus();
        escolher(alvo);
      });
    });
  }

  grupoDeOpcoes(document.getElementById("escolha-tabuleiro"), (tab) => {
    const ligado = estado.auto;
    alternarAuto(false);
    trocarTabuleiro(tab);
    if (ligado) alternarAuto(true);
  });

  // ------------------------------------------------------------------
  // Gráfico de resultados (números de resultados/resumo.json do repositório)
  // ------------------------------------------------------------------

  const ESTRATEGIAS = {
    exata: {
      nome: ["Probabilidade exata", "Exact probability"],
      descricao: ["referência forte: calcula a chance exata de mina em cada casa", "strong baseline: computes the exact mine chance of each cell"],
    },
    logicaDqn: {
      nome: ["Lógica + chute da DQN", "Logic + DQN guess"],
      descricao: ["a lógica abre as casas garantidas; a DQN só escolhe o chute", "logic opens the guaranteed cells; the DQN only picks the guess"],
    },
    dqn9: {
      nome: ["DQN final", "Final DQN"],
      descricao: ["a rede sozinha, com a média nas 8 simetrias", "the network alone, averaged over the 8 symmetries"],
    },
    dqn5: {
      nome: ["DQN final", "Final DQN"],
      descricao: ["a rede sozinha (no 5×5, a média nas simetrias não ajudou)", "the network alone (on 5×5, symmetry averaging didn't help)"],
    },
    resolvedor: {
      nome: ["Resolvedor lógico", "Logic solver"],
      descricao: ["deduz pelos números e chuta ao acaso quando não há certeza", "deduces from the numbers and guesses at random when unsure"],
    },
    acaso: {
      nome: ["Ao acaso", "Random"],
      descricao: ["abre qualquer casa fechada", "opens any closed cell"],
    },
  };

  // vitórias em 10.000 tabuleiros e o percentual com uma casa decimal (como no README)
  const RESULTADOS = {
    "9x9": [
      { chave: "exata", vitorias: 9016, pct: "90,2" },
      { chave: "logicaDqn", vitorias: 8973, pct: "89,7" },
      { chave: "dqn9", vitorias: 8733, pct: "87,3", destaque: true },
      { chave: "resolvedor", vitorias: 7917, pct: "79,2" },
      { chave: "acaso", vitorias: 1, pct: "0,0" },
    ],
    "5x5": [
      { chave: "exata", vitorias: 7525, pct: "75,2" },
      { chave: "logicaDqn", vitorias: 7400, pct: "74,0" },
      { chave: "dqn5", vitorias: 6523, pct: "65,2", destaque: true },
      { chave: "resolvedor", vitorias: 6122, pct: "61,2" },
      { chave: "acaso", vitorias: 285, pct: "2,9" },
    ],
  };

  const grafico = document.getElementById("grafico");
  const dica = document.createElement("div");
  dica.className = "dica-grafico";
  dica.hidden = true;
  let graficoAtual = "9x9";

  function textos(item) {
    const e = ESTRATEGIAS[item.chave];
    const k = I18N.en() ? 1 : 0;
    const pct = (I18N.en() ? item.pct.replace(",", ".") : item.pct) + "%";
    return { nome: e.nome[k], descricao: e.descricao[k], pct };
  }

  function mostrarDica(linha, item, evento) {
    const t = textos(item);
    const local = I18N.en() ? "en-US" : "pt-BR";
    dica.textContent = tr(
      `${t.nome}: venceu ${item.vitorias.toLocaleString(local)} de 10.000 tabuleiros (${t.pct}).`,
      `${t.nome}: won ${item.vitorias.toLocaleString(local)} of 10,000 boards (${t.pct}).`
    );
    dica.hidden = false;
    const caixa = grafico.getBoundingClientRect();
    const alvo =
      evento && evento.clientX
        ? { x: evento.clientX, y: evento.clientY }
        : (() => {
            const r = linha.querySelector(".barra").getBoundingClientRect();
            return { x: r.right, y: r.top };
          })();
    const x = Math.min(alvo.x - caixa.left + 12, caixa.width - dica.offsetWidth - 8);
    dica.style.left = `${Math.max(8, x)}px`;
    dica.style.top = `${alvo.y - caixa.top - dica.offsetHeight - 10}px`;
  }

  function desenharGrafico(tab) {
    graficoAtual = tab;
    const linhas = RESULTADOS[tab].map((item) => {
      const t = textos(item);
      const linha = document.createElement("div");
      linha.className = "barra-linha" + (item.destaque ? " destacada" : "");
      linha.setAttribute("role", "listitem");
      linha.tabIndex = 0;
      linha.setAttribute("aria-label", tr(`${t.nome}, ${t.descricao}: ${t.pct} de vitórias`, `${t.nome}, ${t.descricao}: ${t.pct} win rate`));
      linha.innerHTML =
        '<div class="barra-rotulo"><strong></strong><span></span></div>' +
        `<div class="barra-trilho" aria-hidden="true"><div class="barra" style="width:${item.vitorias / 100}%"></div></div>` +
        '<div class="barra-valor" aria-hidden="true"></div>';
      linha.querySelector("strong").textContent = t.nome;
      linha.querySelector(".barra-rotulo span").textContent = t.descricao;
      linha.querySelector(".barra-valor").textContent = t.pct;
      linha.addEventListener("mousemove", (e) => mostrarDica(linha, item, e));
      linha.addEventListener("focus", () => mostrarDica(linha, item));
      linha.addEventListener("mouseleave", () => (dica.hidden = true));
      linha.addEventListener("blur", () => (dica.hidden = true));
      return linha;
    });
    const eixo = document.createElement("div");
    eixo.className = "eixo";
    eixo.setAttribute("aria-hidden", "true");
    eixo.innerHTML = "<div><span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span></div>";
    grafico.replaceChildren(...linhas, eixo, dica);
  }

  grupoDeOpcoes(document.getElementById("escolha-grafico"), desenharGrafico);

  // ------------------------------------------------------------------
  // Início e troca de idioma
  // ------------------------------------------------------------------

  document.getElementById("ano").textContent = String(new Date().getFullYear());
  desenharGrafico("9x9");
  rotularAuto();
  trocarTabuleiro("9x9");

  document.addEventListener("idioma-mudou", () => {
    rotularTabuleiro();
    rotularAuto();
    desenhar();
    if (estado.aviso) avisar(estado.aviso);
    desenharGrafico(graficoAtual);
  });

  // #capa: monta um tabuleiro no meio de uma partida, só para gerar a imagem do card.
  if (location.hash === "#capa") {
    document.body.classList.add("modo-capa");
    for (let semente = 1; semente < 500; semente++) {
      novaPartida(semente);
      for (let k = 0; k < 4 && !estado.jogo.terminou; k++) jogar(estado.proxima, "dqn");
      const abertas = estado.jogo.visivel.filter((v) => v !== FECHADA).length;
      if (!estado.jogo.terminou && abertas >= 34 && abertas <= 52) break;
    }
  }
})();
