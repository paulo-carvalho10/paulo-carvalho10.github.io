// Monta a página inicial a partir de projetos.js: contatos, cards, filtros, janela de detalhes
// e os efeitos (frases digitadas, números que contam, elementos que aparecem ao rolar).
// Tudo que é montado aqui é refeito quando o idioma muda (evento "idioma-mudou", de idioma.js).
(function () {
  "use strict";

  const PROJETOS = window.PROJETOS || [];
  const SOBRE = window.SOBRE || {};
  const I18N = window.I18N || { idioma: "pt", en: () => false, escolher: (pt) => pt };
  const tr = (portugues, ingles) => I18N.escolher(portugues, ingles);
  // Um campo do objeto no idioma atual (o português é o padrão quando falta tradução).
  const campo = (objeto, nome) => (I18N.en() && objeto.en && objeto.en[nome] != null ? objeto.en[nome] : objeto[nome]);
  const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ------------------------------------------------------------------
  // Ajudantes
  // ------------------------------------------------------------------

  // Cria um elemento: el("a", { href: "#", class: "botao" }, "texto", outroElemento)
  function el(tag, atributos, ...filhos) {
    const no = document.createElement(tag);
    for (const [nome, valor] of Object.entries(atributos || {})) {
      if (valor === false || valor == null) continue;
      if (nome === "class") no.className = valor;
      else if (nome.startsWith("on")) no.addEventListener(nome.slice(2), valor);
      else no.setAttribute(nome, valor === true ? "" : valor);
    }
    for (const filho of filhos.flat()) {
      if (filho == null || filho === false) continue;
      no.append(filho instanceof Node ? filho : document.createTextNode(filho));
    }
    return no;
  }

  // Ícones: traço (stroke) ou preenchidos (fill), em caixa 24x24.
  const ICONES = {
    externo: { d: "M7 17 17 7M8 7h9v9" },
    seta: { d: "M5 12h14M13 6l6 6-6 6" },
    play: { d: "M8 5v14l11-7z", cheio: true },
    codigo: { d: "m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14" },
    copiar: { d: "M9 9h10v10H9zM5 15V5h10" },
    email: { d: "M3 6h18v12H3zM3 7l9 6 9-6" },
    github: {
      cheio: true,
      d: "M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.2-3.1-.1-.4-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.6 18.3 5 18.3 5c.7 1.6.2 2.8.1 3.2.8.8 1.2 1.9 1.2 3.1 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5z",
    },
    linkedin: {
      cheio: true,
      d: "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z",
    },
    instagram: { d: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zM16 11.4a4 4 0 1 1-7.9 1.2 4 4 0 0 1 7.9-1.2zM17.5 6.5h.01" },
    x: {
      cheio: true,
      d: "M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.59-6.64 7.59H.47l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41z",
    },
  };

  function icone(nome) {
    const def = ICONES[nome];
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    if (def.cheio) {
      svg.setAttribute("fill", "currentColor");
    } else {
      svg.setAttribute("fill", "none");
      svg.setAttribute("stroke", "currentColor");
      svg.setAttribute("stroke-width", "2");
      svg.setAttribute("stroke-linecap", "round");
      svg.setAttribute("stroke-linejoin", "round");
    }
    const caminho = document.createElementNS("http://www.w3.org/2000/svg", "path");
    caminho.setAttribute("d", def.d);
    svg.append(caminho);
    return svg;
  }

  function linkExterno(rotulo, url, classe) {
    return el("a", { class: classe, href: url, target: "_blank", rel: "noopener" }, rotulo, icone("externo"));
  }

  // ------------------------------------------------------------------
  // Contatos (topo, seção de contato e rodapé)
  // ------------------------------------------------------------------

  const links = SOBRE.links || [];
  const aviso = el("span", { class: "aviso-copiado", role: "status" });
  let relogioAviso = null;

  function avisar(texto) {
    aviso.textContent = texto;
    clearTimeout(relogioAviso);
    relogioAviso = setTimeout(() => (aviso.textContent = ""), 2500);
  }

  async function copiarEmail() {
    try {
      await navigator.clipboard.writeText(SOBRE.email);
      avisar(tr("E-mail copiado!", "Email copied!"));
    } catch (e) {
      avisar(SOBRE.email);
    }
  }

  function desenharContatos() {
    const rotuloEmail = tr("E-mail", "Email");

    const redesAbertura = document.getElementById("redes-abertura");
    redesAbertura.replaceChildren(
      SOBRE.email &&
        el("li", {}, el("a", { href: `mailto:${SOBRE.email}`, "aria-label": `${rotuloEmail}: ${SOBRE.email}`, title: SOBRE.email }, icone("email"))),
      ...links.map((l) => el("li", {}, el("a", { href: l.url, target: "_blank", rel: "noopener", "aria-label": l.rotulo, title: l.rotulo }, icone(l.rede))))
    );

    const linhaEmail = document.getElementById("email-linha");
    if (SOBRE.email) {
      linhaEmail.replaceChildren(
        el("a", { class: "botao primario", href: `mailto:${SOBRE.email}` }, icone("email"), SOBRE.email),
        el("button", { class: "botao", type: "button", onclick: copiarEmail }, icone("copiar"), tr("Copiar", "Copy")),
        aviso
      );
    }

    document.getElementById("lista-contatos").replaceChildren(
      ...links.map((l) =>
        el(
          "li",
          {},
          el(
            "a",
            { href: l.url, target: "_blank", rel: "noopener" },
            el("span", { class: "icone-rede" }, icone(l.rede)),
            el("span", {}, el("strong", {}, l.rotulo), el("span", { class: "usuario" }, l.usuario)),
            el("span", { class: "seta" }, icone("externo"))
          )
        )
      )
    );

    if (SOBRE.nomeCompleto) document.getElementById("nome-completo").textContent = SOBRE.nomeCompleto;
    document.getElementById("curso-cidade").textContent = `${campo(SOBRE, "curso")} · ${campo(SOBRE, "cidade")}`;

    document.getElementById("contatos").replaceChildren(
      SOBRE.email && el("a", { href: `mailto:${SOBRE.email}` }, SOBRE.email),
      ...links.map((l) => linkExterno(l.rotulo, l.url, ""))
    );
  }

  // ------------------------------------------------------------------
  // Frases digitadas no topo
  // ------------------------------------------------------------------

  const digitado = document.getElementById("texto-digitado");
  const frasesAtuais = () => (campo(SOBRE, "frases") || []).map((f) => f.toLowerCase());
  let qual = 0;
  let letras = 0;
  let apagando = false;

  function passoDigitacao() {
    const frases = frasesAtuais();
    if (!frases.length) return;
    const frase = frases[qual % frases.length];
    letras = Math.max(0, Math.min(frase.length, letras + (apagando ? -1 : 1)));
    digitado.textContent = frase.slice(0, letras);
    let espera = apagando ? 28 : 55 + Math.random() * 45;
    if (!apagando && letras === frase.length) {
      apagando = true;
      espera = 2200;
    } else if (apagando && letras === 0) {
      apagando = false;
      qual = (qual + 1) % frases.length;
      espera = 400;
    }
    setTimeout(passoDigitacao, espera);
  }

  function reiniciarFrases() {
    const frases = frasesAtuais();
    if (!digitado || !frases.length) return;
    if (reduzirMovimento) {
      digitado.textContent = frases[frases.length - 1];
      return;
    }
    qual = 0;
    letras = 0;
    apagando = false;
    digitado.textContent = "";
  }

  // ------------------------------------------------------------------
  // Números que contam
  // ------------------------------------------------------------------

  function formatarNumero(alvo, valor) {
    const casas = parseInt(alvo.dataset.casas || "0", 10);
    const local = I18N.en() ? "en-US" : "pt-BR";
    return valor.toLocaleString(local, { minimumFractionDigits: casas, maximumFractionDigits: casas }) + (alvo.dataset.sufixo || "");
  }

  function contar(alvo) {
    if (reduzirMovimento) return;
    const final = parseFloat(alvo.dataset.contar);
    const inicio = performance.now();
    const quadro = (agora) => {
      const t = Math.min(1, (agora - inicio) / 1400);
      alvo.textContent = formatarNumero(alvo, final * (1 - Math.pow(1 - t, 3)));
      if (t < 1) requestAnimationFrame(quadro);
    };
    requestAnimationFrame(quadro);
  }

  function reformatarNumeros() {
    document.querySelectorAll("[data-contar]").forEach((alvo) => (alvo.textContent = formatarNumero(alvo, parseFloat(alvo.dataset.contar))));
  }

  // ------------------------------------------------------------------
  // Cards
  // ------------------------------------------------------------------

  const lista = document.getElementById("lista-projetos");
  const principais = PROJETOS.filter((p) => !p.compacto);
  const compactos = PROJETOS.filter((p) => p.compacto);
  let primeiraVez = true;
  let filtroAtual = "todos";

  const legendaDe = (projeto, i) => {
    const legendas = I18N.en() && projeto.en && projeto.en.legendas;
    return (legendas && legendas[i]) || projeto.galeria[i].legenda || "";
  };

  function botaoDemo(projeto, aoAbrirVideo) {
    const demo = projeto.demo;
    if (!demo) return null;
    const rotulo = tr(demo.rotulo, projeto.en && projeto.en.demo);
    if (demo.tipo === "link") return linkExterno(rotulo || tr("Abrir demo", "Open demo"), demo.url, "botao primario");
    if (demo.tipo === "pagina") return el("a", { class: "botao primario", href: demo.url }, rotulo, icone("seta"));
    if (demo.tipo === "video") return el("button", { class: "botao primario", type: "button", onclick: aoAbrirVideo }, icone("play"), rotulo);
    return null;
  }

  function seloDoProjeto(projeto) {
    const status = campo(projeto, "status");
    if (status) return el("span", { class: "selo construcao" }, status);
    if (projeto.demo && projeto.demo.tipo === "pagina") return el("span", { class: "selo no-ar" }, tr("Roda aqui no site", "Runs right here"));
    if (projeto.demo && projeto.demo.tipo === "link") return el("span", { class: "selo no-ar" }, tr("Demo no ar", "Live demo"));
    return null;
  }

  function desenharCards() {
    lista.replaceChildren();
    principais.forEach((projeto, n) => {
      const nome = campo(projeto, "nome");
      const numero = campo(projeto, "numero");
      const abrir = (indice) => () => abrirDetalhes(projeto, indice);
      const indiceCapa = Math.max(0, (projeto.galeria || []).findIndex((item) => item.src === projeto.capa));

      const card = el(
        "article",
        {
          class: "card" + (primeiraVez ? " revelar" : ""),
          "data-id": projeto.id,
          "data-categorias": (projeto.categorias || []).join(" "),
          style: `--atraso: ${(n % 2) * 0.08}s`,
        },
        projeto.capa &&
          el(
            "button",
            { class: "card-capa", type: "button", "aria-label": tr(`Ver imagens e detalhes de ${nome}`, `See images and details of ${nome}`), onclick: abrir(indiceCapa) },
            el("img", { src: projeto.capa, alt: "", loading: "lazy", decoding: "async" }),
            seloDoProjeto(projeto)
          ),
        el(
          "div",
          { class: "card-corpo" },
          el("h3", {}, nome),
          el("p", { class: "resumo" }, campo(projeto, "resumo")),
          projeto.descricao && el("p", { class: "descricao" }, campo(projeto, "descricao")),
          projeto.autoria && el("p", { class: "autoria" }, campo(projeto, "autoria")),
          numero && el("p", { class: "numero" }, el("strong", {}, numero.valor), el("span", {}, numero.rotulo)),
          el("ul", { class: "etiquetas", "aria-label": tr("Tecnologias", "Technologies") }, (campo(projeto, "tecnologias") || []).map((t) => el("li", {}, t))),
          el(
            "div",
            { class: "card-acoes" },
            botaoDemo(projeto, abrir(0)),
            el("button", { class: "botao", type: "button", onclick: abrir(0) }, tr("Detalhes", "Details")),
            projeto.codigo && el("a", { class: "botao discreto", href: projeto.codigo, target: "_blank", rel: "noopener" }, icone("codigo"), tr("Código", "Code"))
          )
        )
      );

      // holofote que segue o mouse
      card.addEventListener("pointermove", (evento) => {
        const caixa = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${evento.clientX - caixa.left}px`);
        card.style.setProperty("--my", `${evento.clientY - caixa.top}px`);
      });
      lista.append(card);
    });

    const caixaMais = document.getElementById("mais-projetos");
    caixaMais.querySelector("ul").replaceChildren(
      ...compactos.map((p) =>
        el(
          "li",
          { "data-categorias": (p.categorias || []).join(" ") },
          el(
            "a",
            { href: p.codigo, target: "_blank", rel: "noopener" },
            el("strong", {}, campo(p, "nome")),
            el("span", { class: "resumo" }, `${campo(p, "resumo")} ${(p.tecnologias || []).join(" · ")}`),
            el("span", { class: "seta" }, "GitHub ↗")
          )
        )
      )
    );

    aplicarFiltro(filtroAtual, false);
  }

  // ------------------------------------------------------------------
  // Filtros
  // ------------------------------------------------------------------

  const botoesFiltro = document.querySelectorAll(".filtro");

  function aplicarFiltro(filtro, anunciar) {
    filtroAtual = filtro;
    botoesFiltro.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.filtro === filtro)));
    let visiveis = 0;
    document.querySelectorAll("#lista-projetos .card, #mais-projetos li").forEach((item) => {
      const mostra = filtro === "todos" || item.dataset.categorias.split(" ").includes(filtro);
      item.hidden = !mostra;
      if (mostra) visiveis++;
    });
    // com filtro, o card largo volta ao tamanho normal para a grade não ficar com buracos
    document.querySelectorAll("#lista-projetos .card").forEach((card) => {
      const projeto = principais.find((p) => p.id === card.dataset.id);
      card.classList.toggle("largo", Boolean(projeto && projeto.destaque && filtro === "todos"));
    });
    const caixaMais = document.getElementById("mais-projetos");
    caixaMais.hidden = !caixaMais.querySelector("li:not([hidden])");
    if (anunciar) {
      document.getElementById("aviso-filtro").textContent = tr(
        `${visiveis} ${visiveis === 1 ? "projeto" : "projetos"}`,
        `${visiveis} ${visiveis === 1 ? "project" : "projects"}`
      );
    }
  }

  botoesFiltro.forEach((botao) => botao.addEventListener("click", () => aplicarFiltro(botao.dataset.filtro, true)));

  // ------------------------------------------------------------------
  // Janela de detalhes
  // ------------------------------------------------------------------

  const janela = document.getElementById("detalhes");
  const visor = document.getElementById("visor-midia");
  const legenda = document.getElementById("visor-legenda");
  const miniaturas = document.getElementById("miniaturas");
  let projetoAberto = null;
  let indiceAberto = 0;

  function mostrarMidia(projeto, i) {
    const item = projeto.galeria[i];
    const texto = legendaDe(projeto, i);
    indiceAberto = i;
    visor.replaceChildren(
      item.video
        ? el("video", { src: item.video, poster: item.poster, autoplay: true, muted: true, loop: true, playsinline: true, controls: true, "aria-label": texto })
        : el("img", { src: item.src, alt: texto })
    );
    const video = visor.querySelector("video");
    if (video) {
      video.muted = true;
      video.play().catch(() => {});
    }
    legenda.textContent = texto;
  }

  function abrirDetalhes(projeto, indice) {
    if (!projeto.galeria && projeto.capa) projeto.galeria = [{ src: projeto.capa, legenda: projeto.nome }];
    const galeria = projeto.galeria || [];
    indice = Math.min(indice || 0, Math.max(galeria.length - 1, 0));
    projetoAberto = projeto;

    document.getElementById("detalhes-titulo").textContent = campo(projeto, "nome");
    const status = document.getElementById("detalhes-status");
    status.textContent = campo(projeto, "status") || "";
    status.hidden = !projeto.status;

    if (galeria.length) mostrarMidia(projeto, indice);
    miniaturas.replaceChildren(
      ...(galeria.length > 1
        ? galeria.map((item, i) =>
            el(
              "button",
              {
                class: "miniatura",
                type: "button",
                "aria-label": legendaDe(projeto, i) || tr(`Imagem ${i + 1}`, `Image ${i + 1}`),
                "aria-current": String(i === indice),
                onclick: (evento) => {
                  miniaturas.querySelectorAll(".miniatura").forEach((m) => m.setAttribute("aria-current", "false"));
                  evento.currentTarget.setAttribute("aria-current", "true");
                  mostrarMidia(projeto, i);
                },
              },
              el("img", { src: item.poster || item.src, alt: "", loading: "lazy" }),
              item.video && el("span", { class: "play" }, icone("play"))
            )
          )
        : [])
    );
    miniaturas.hidden = galeria.length <= 1;

    document.getElementById("detalhes-resumo").textContent = campo(projeto, "resumo") || "";
    document.getElementById("detalhes-descricao").textContent = campo(projeto, "descricao") || "";
    const autoria = document.getElementById("detalhes-autoria");
    autoria.textContent = campo(projeto, "autoria") || "";
    autoria.hidden = !projeto.autoria;
    document.getElementById("detalhes-destaques").replaceChildren(...(campo(projeto, "destaques") || []).map((d) => el("li", {}, d)));

    document.getElementById("detalhes-como").hidden = !projeto.nota;
    document.getElementById("detalhes-nota").textContent = campo(projeto, "nota") || "";

    document.getElementById("detalhes-tecnologias").replaceChildren(...(campo(projeto, "tecnologias") || []).map((t) => el("li", {}, t)));

    const extrasEn = (I18N.en() && projeto.en && projeto.en.extras) || [];
    const linksDetalhes = [];
    if (projeto.demo && projeto.demo.tipo !== "video") linksDetalhes.push(botaoDemo(projeto));
    (projeto.extras || []).forEach((x, i) => linksDetalhes.push(linkExterno(extrasEn[i] || x.rotulo, x.url, "botao")));
    if (projeto.codigo) linksDetalhes.push(linkExterno(tr("Código no GitHub", "Code on GitHub"), projeto.codigo, "botao"));
    document.getElementById("detalhes-links").replaceChildren(...linksDetalhes);

    if (!janela.open) {
      janela.querySelector(".detalhes-rolagem").scrollTop = 0;
      janela.showModal();
    }
  }

  janela.addEventListener("click", (evento) => {
    if (evento.target === janela || evento.target.closest("[data-fechar]")) janela.close();
  });
  janela.addEventListener("close", () => {
    visor.replaceChildren();
    projetoAberto = null;
  });

  // ------------------------------------------------------------------
  // Primeira montagem, aparecer ao rolar e troca de idioma
  // ------------------------------------------------------------------

  desenharContatos();
  desenharCards();
  primeiraVez = false;
  document.getElementById("ano").textContent = String(new Date().getFullYear());

  if (digitado) {
    reiniciarFrases();
    if (!reduzirMovimento) setTimeout(passoDigitacao, 500);
  }

  const revelaveis = document.querySelectorAll(".revelar");
  if ("IntersectionObserver" in window && !reduzirMovimento) {
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;
          const alvo = entrada.target;
          alvo.classList.add("visto");
          alvo.querySelectorAll("[data-contar]").forEach(contar);
          observador.unobserve(alvo);
          // depois de aparecer, devolve ao elemento as transições normais (hover dos cards)
          const atraso = parseFloat(getComputedStyle(alvo).getPropertyValue("--atraso")) || 0;
          setTimeout(() => alvo.classList.remove("revelar", "visto"), 900 + atraso * 1000);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revelaveis.forEach((r) => observador.observe(r));
  } else {
    revelaveis.forEach((r) => r.classList.remove("revelar"));
  }
  reformatarNumeros();

  // Faixa de tecnologias: duplica a lista para o rolamento não ter emenda.
  const faixa = document.querySelector(".faixa");
  if (faixa && !reduzirMovimento) {
    const trilho = faixa.querySelector(".faixa-trilho");
    [...trilho.children].forEach((item) => {
      const copia = item.cloneNode(true);
      copia.setAttribute("aria-hidden", "true");
      trilho.append(copia);
    });
    faixa.classList.add("rolando");
  }

  document.addEventListener("idioma-mudou", () => {
    desenharContatos();
    desenharCards();
    reiniciarFrases();
    reformatarNumeros();
    if (projetoAberto) abrirDetalhes(projetoAberto, indiceAberto);
  });
})();
