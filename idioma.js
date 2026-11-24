// Idioma do site: português (padrão) ou inglês.
//
// O português está escrito direto no HTML. Para o inglês, os elementos marcados com
// data-i18n="chave" recebem o texto de TEXTOS_EN (textos-en.js), e data-i18n-attr="atributo:chave"
// faz o mesmo com atributos (aria-label, content...). Os textos montados por JavaScript
// (cards, mensagens do jogo) usam I18N.escolher("português", "english").
//
// Idioma inicial: o ?lang=en do endereço, senão a escolha guardada no navegador, senão o
// idioma do navegador (português se o visitante tiver português entre os idiomas preferidos).
(function () {
  "use strict";

  const CHAVE = "idioma";
  const raiz = document.documentElement;

  function idiomaInicial() {
    const doEndereco = new URLSearchParams(location.search).get("lang");
    if (doEndereco === "en" || doEndereco === "pt") return doEndereco;
    try {
      const salvo = localStorage.getItem(CHAVE);
      if (salvo === "en" || salvo === "pt") return salvo;
    } catch (e) {
      // armazenamento bloqueado: segue para o idioma do navegador
    }
    const preferidos = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || "pt"];
    return preferidos.some((l) => String(l).toLowerCase().startsWith("pt")) ? "pt" : "en";
  }

  let idioma = idiomaInicial();
  const textosOriginais = new WeakMap(); // o português de cada elemento, guardado antes da primeira troca

  function aplicar() {
    const en = window.TEXTOS_EN || {};
    const ingles = idioma === "en";
    raiz.lang = ingles ? "en" : "pt-BR";

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      if (!textosOriginais.has(el)) textosOriginais.set(el, el.textContent);
      const chave = el.dataset.i18n;
      el.textContent = ingles && en[chave] != null ? en[chave] : textosOriginais.get(el);
    });

    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      el.dataset.i18nAttr.split(";").forEach((par) => {
        const [atributo, chave] = par.split(":").map((s) => s.trim());
        if (!atributo || !chave) return;
        const guardado = `i18nPt${atributo.replace(/[^a-z]/gi, "")}`;
        if (el.dataset[guardado] == null) el.dataset[guardado] = el.getAttribute(atributo) || "";
        el.setAttribute(atributo, ingles && en[chave] != null ? en[chave] : el.dataset[guardado]);
      });
    });

    document.querySelectorAll(".botao-idioma [data-lang]").forEach((botao) => {
      botao.setAttribute("aria-pressed", String(botao.dataset.lang === idioma));
    });

    document.dispatchEvent(new CustomEvent("idioma-mudou", { detail: idioma }));
  }

  function trocar(novo) {
    if (novo === idioma || (novo !== "pt" && novo !== "en")) return;
    idioma = novo;
    try {
      localStorage.setItem(CHAVE, novo);
    } catch (e) {
      // sem armazenamento, a escolha vale só nesta página
    }
    // Mantém o endereço compartilhável: com ?lang=en, quem abrir o link já vê em inglês.
    try {
      const endereco = new URL(location.href);
      if (novo === "en") endereco.searchParams.set("lang", "en");
      else endereco.searchParams.delete("lang");
      history.replaceState(null, "", endereco);
    } catch (e) {
      // alguns navegadores não deixam mudar o endereço de arquivos abertos do disco
    }
    aplicar();
  }

  window.I18N = {
    get idioma() {
      return idioma;
    },
    en: () => idioma === "en",
    escolher: (portugues, ingles) => (idioma === "en" && ingles != null ? ingles : portugues),
    trocar,
  };

  document.querySelectorAll(".botao-idioma [data-lang]").forEach((botao) => {
    botao.addEventListener("click", () => trocar(botao.dataset.lang));
  });

  aplicar();
})();
