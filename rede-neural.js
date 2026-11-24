// A rede neural animada do topo da página (decoração, para dar "cara de algo pensante").
//
// Sinais percorrem as conexões de camada em camada. Cada neurônio acende quando um sinal
// chega e, às vezes, dispara novos sinais para a camada seguinte. Passe o mouse para acender
// os neurônios por perto; clique para disparar uma onda nova.
(function () {
  "use strict";

  const tela = document.getElementById("rede-neural");
  if (!tela || !tela.getContext) return;
  const ctx = tela.getContext("2d");
  const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const CAMADAS = [4, 6, 7, 6, 3]; // neurônios em cada camada, da entrada para a saída
  const MAX_SINAIS = 90;
  const DURACAO_SINAL = 750; // milissegundos para um sinal atravessar uma conexão

  // Gerador com semente: a rede tem sempre o mesmo desenho e os mesmos pesos.
  let semente = 20261124;
  const aleatorio = () => {
    semente = (Math.imul(semente, 1664525) + 1013904223) >>> 0;
    return semente / 4294967296;
  };

  // ------------------------------------------------------------------
  // Neurônios e conexões
  // ------------------------------------------------------------------

  const neuronios = [];
  CAMADAS.forEach((quantos, camada) => {
    for (let i = 0; i < quantos; i++) {
      neuronios.push({ camada, i, quantos, x: 0, y: 0, bx: 0, by: 0, fase: aleatorio() * Math.PI * 2, brilho: 0, ultimoDisparo: -1e9, saidas: [] });
    }
  });

  const conexoes = [];
  neuronios.forEach((origem, de) => {
    neuronios.forEach((alvo, para) => {
      if (alvo.camada === origem.camada + 1) {
        origem.saidas.push(conexoes.length);
        conexoes.push({ de, para, peso: aleatorio() * 2 - 1, brilho: 0 });
      }
    });
    // as conexões de peso mais forte primeiro
    origem.saidas.sort((a, b) => Math.abs(conexoes[b].peso) - Math.abs(conexoes[a].peso));
  });

  // ------------------------------------------------------------------
  // Cores (lidas do CSS, então acompanham o tema claro/escuro)
  // ------------------------------------------------------------------

  let cores = null;

  function paraRgb(texto) {
    const t = texto.trim();
    if (t.startsWith("#")) {
      const h = t.length === 4 ? [...t.slice(1)].map((c) => c + c).join("") : t.slice(1, 7);
      return [0, 2, 4].map((k) => parseInt(h.slice(k, k + 2), 16));
    }
    const numeros = t.match(/[\d.]+/g);
    return numeros ? numeros.slice(0, 3).map(Number) : [128, 128, 128];
  }

  function lerCores() {
    const estilo = getComputedStyle(document.documentElement);
    const fundo = paraRgb(estilo.getPropertyValue("--fundo"));
    cores = {
      azul: paraRgb(estilo.getPropertyValue("--azul")),
      verde: paraRgb(estilo.getPropertyValue("--verde")),
      superficie: paraRgb(estilo.getPropertyValue("--superficie")),
      escuro: (fundo[0] + fundo[1] + fundo[2]) / 3 < 128,
    };
  }

  const misturar = (a, b, t) => a.map((v, k) => Math.round(v + (b[k] - v) * t));
  const rgba = (c, alfa) => `rgba(${c[0]},${c[1]},${c[2]},${alfa})`;
  const corDaCamada = (camada) => misturar(cores.azul, cores.verde, camada / (CAMADAS.length - 1));

  // ------------------------------------------------------------------
  // Tamanho e posições
  // ------------------------------------------------------------------

  let largura = 0;
  let altura = 0;

  function medir() {
    const caixa = tela.getBoundingClientRect();
    if (!caixa.width || !caixa.height) return false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    largura = caixa.width;
    altura = caixa.height;
    tela.width = Math.round(largura * dpr);
    tela.height = Math.round(altura * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const margemX = largura * 0.09;
    const margemY = altura * 0.12;
    const passoX = (largura - 2 * margemX) / (CAMADAS.length - 1);
    const passoY = (altura - 2 * margemY) / (Math.max(...CAMADAS) - 1);
    neuronios.forEach((n) => {
      n.bx = margemX + n.camada * passoX;
      n.by = altura / 2 + (n.i - (n.quantos - 1) / 2) * passoY;
    });
    return true;
  }

  // ------------------------------------------------------------------
  // Simulação: disparos e sinais
  // ------------------------------------------------------------------

  const sinais = [];
  let tempo = 0; // relógio da simulação, em milissegundos
  let proximaOnda = 0;
  let ponteiro = null;

  function disparar(indice) {
    const n = neuronios[indice];
    n.brilho = 1;
    n.ultimoDisparo = tempo;
    if (n.camada === CAMADAS.length - 1) return; // a saída não dispara adiante

    // dois sinais entre as quatro conexões mais fortes e, às vezes, um terceiro qualquer
    const fortes = n.saidas.slice(0, 4);
    const escolhidas = new Set();
    while (escolhidas.size < 2) escolhidas.add(fortes[Math.floor(aleatorio() * fortes.length)]);
    if (aleatorio() < 0.5) escolhidas.add(n.saidas[Math.floor(aleatorio() * n.saidas.length)]);
    for (const k of escolhidas) {
      if (sinais.length >= MAX_SINAIS) break;
      sinais.push({ k, t: 0, velocidade: (0.8 + aleatorio() * 0.4) / DURACAO_SINAL });
    }
  }

  function chegou(sinal) {
    const conexao = conexoes[sinal.k];
    conexao.brilho = 1;
    const destino = neuronios[conexao.para];
    destino.brilho = Math.max(destino.brilho, 0.75);
    if (tempo - destino.ultimoDisparo > 450 && aleatorio() < 0.8) disparar(conexao.para);
  }

  function atualizar(dt) {
    tempo += dt;
    if (tempo >= proximaOnda) {
      const quantas = 2 + Math.floor(aleatorio() * 2);
      for (let j = 0; j < quantas; j++) disparar(Math.floor(aleatorio() * CAMADAS[0]));
      proximaOnda = tempo + 900 + aleatorio() * 700;
    }

    for (let s = sinais.length - 1; s >= 0; s--) {
      const sinal = sinais[s];
      sinal.t += sinal.velocidade * dt;
      if (sinal.t >= 1) {
        sinais.splice(s, 1);
        chegou(sinal);
      }
    }

    const quedaNeuronio = Math.exp(-dt / 520);
    const quedaConexao = Math.exp(-dt / 700);
    neuronios.forEach((n) => (n.brilho *= quedaNeuronio));
    conexoes.forEach((c) => (c.brilho *= quedaConexao));

    if (ponteiro) {
      neuronios.forEach((n) => {
        const distancia = Math.hypot(n.x - ponteiro.x, n.y - ponteiro.y);
        if (distancia < 80) n.brilho = Math.max(n.brilho, 0.9 * (1 - distancia / 80));
      });
    }
  }

  // ------------------------------------------------------------------
  // Desenho
  // ------------------------------------------------------------------

  function desenhar() {
    if (!largura) return;
    ctx.clearRect(0, 0, largura, altura);

    const oscila = reduzirMovimento ? 0 : 3;
    neuronios.forEach((n) => {
      n.x = n.bx + Math.sin(tempo / 1700 + n.fase) * oscila;
      n.y = n.by + Math.cos(tempo / 2100 + n.fase * 1.3) * oscila;
    });

    // conexões
    const base = cores.escuro ? 0.1 : 0.12;
    conexoes.forEach((c) => {
      const a = neuronios[c.de];
      const b = neuronios[c.para];
      const cor = misturar(corDaCamada(a.camada), corDaCamada(b.camada), 0.5);
      ctx.strokeStyle = rgba(cor, base + Math.abs(c.peso) * 0.1 + c.brilho * 0.55);
      ctx.lineWidth = 1 + c.brilho * 1.2;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    });

    // sinais: um ponto brilhante com rastro
    ctx.save();
    if (cores.escuro) ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round";
    sinais.forEach((s) => {
      const c = conexoes[s.k];
      const a = neuronios[c.de];
      const b = neuronios[c.para];
      const t0 = Math.max(0, s.t - 0.32);
      const x = a.x + (b.x - a.x) * s.t;
      const y = a.y + (b.y - a.y) * s.t;
      const x0 = a.x + (b.x - a.x) * t0;
      const y0 = a.y + (b.y - a.y) * t0;
      const cor = misturar(corDaCamada(a.camada), corDaCamada(b.camada), s.t);
      const rastro = ctx.createLinearGradient(x0, y0, x, y);
      rastro.addColorStop(0, rgba(cor, 0));
      rastro.addColorStop(1, rgba(cor, 0.9));
      ctx.strokeStyle = rastro;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.fillStyle = rgba(cor, 1);
      ctx.shadowColor = rgba(cor, 1);
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(x, y, 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });
    ctx.restore();

    // neurônios: primeiro os halos de quem está aceso, depois os corpos
    const raio = Math.max(4, Math.min(7.5, largura / 72));
    neuronios.forEach((n) => {
      if (n.brilho < 0.03) return;
      const cor = corDaCamada(n.camada);
      const halo = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, raio * 4.5);
      halo.addColorStop(0, rgba(cor, 0.45 * n.brilho));
      halo.addColorStop(1, rgba(cor, 0));
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(n.x, n.y, raio * 4.5, 0, Math.PI * 2);
      ctx.fill();
    });
    neuronios.forEach((n) => {
      const cor = corDaCamada(n.camada);
      ctx.fillStyle = rgba(cores.superficie, 1);
      ctx.beginPath();
      ctx.arc(n.x, n.y, raio, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = rgba(cor, 0.55 + 0.45 * n.brilho);
      ctx.stroke();
      ctx.fillStyle = rgba(cor, 0.18 + 0.82 * n.brilho);
      ctx.beginPath();
      ctx.arc(n.x, n.y, raio * 0.55, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // ------------------------------------------------------------------
  // Laço de animação (só roda com a rede visível na tela)
  // ------------------------------------------------------------------

  let rodando = false;
  let naTela = true;
  let anterior = 0;
  let quadro = 0;

  function laco(agora) {
    if (!rodando) return;
    const dt = anterior ? Math.min(50, agora - anterior) : 16;
    anterior = agora;
    atualizar(dt);
    desenhar();
    quadro = requestAnimationFrame(laco);
  }

  function ligarOuDesligar() {
    const deveRodar = !reduzirMovimento && naTela && !document.hidden && largura > 0;
    if (deveRodar && !rodando) {
      rodando = true;
      anterior = 0;
      quadro = requestAnimationFrame(laco);
    } else if (!deveRodar && rodando) {
      rodando = false;
      cancelAnimationFrame(quadro);
    }
  }

  // Avança a simulação sem desenhar, para a rede já aparecer com sinais andando.
  function adiantar(milissegundos) {
    for (let t = 0; t < milissegundos; t += 16) atualizar(16);
  }

  // ------------------------------------------------------------------
  // Interação
  // ------------------------------------------------------------------

  function posicao(evento) {
    const caixa = tela.getBoundingClientRect();
    return { x: evento.clientX - caixa.left, y: evento.clientY - caixa.top };
  }

  tela.addEventListener("pointermove", (evento) => (ponteiro = posicao(evento)));
  tela.addEventListener("pointerleave", () => (ponteiro = null));
  tela.addEventListener("pointerdown", (evento) => {
    const p = posicao(evento);
    let maisPerto = -1;
    let menor = 44;
    neuronios.forEach((n, i) => {
      const d = Math.hypot(n.x - p.x, n.y - p.y);
      if (d < menor) {
        menor = d;
        maisPerto = i;
      }
    });
    if (maisPerto >= 0) disparar(maisPerto);
    else for (let i = 0; i < CAMADAS[0]; i++) disparar(i); // clique no vazio: onda pela entrada toda
  });

  // ------------------------------------------------------------------
  // Início
  // ------------------------------------------------------------------

  lerCores();
  medir();
  adiantar(2600);
  desenhar();

  new ResizeObserver(() => {
    if (medir()) desenhar();
    ligarOuDesligar();
  }).observe(tela);

  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entradas) => {
      naTela = entradas[0].isIntersecting;
      ligarOuDesligar();
    }).observe(tela);
  }
  document.addEventListener("visibilitychange", ligarOuDesligar);

  // Troca de tema: relê as cores e redesenha.
  const aoMudarTema = () => {
    lerCores();
    desenhar();
  };
  new MutationObserver(aoMudarTema).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", aoMudarTema);

  ligarOuDesligar();
})();
