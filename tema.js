// Usado em todas as páginas: o botão de tema claro/escuro (a escolha fica guardada no navegador),
// a linha do cabeçalho que aparece ao rolar e a barra de progresso no topo da tela.
(function () {
  "use strict";
  const raiz = document.documentElement;
  const sistemaEscuro = window.matchMedia("(prefers-color-scheme: dark)");

  function temaAtual() {
    return raiz.dataset.theme || (sistemaEscuro.matches ? "dark" : "light");
  }

  document.querySelectorAll(".botao-tema").forEach((botao) => {
    const rotular = () => {
      const ingles = window.I18N && window.I18N.en();
      const escuro = temaAtual() === "dark";
      const texto = escuro ? (ingles ? "Switch to light theme" : "Usar tema claro") : ingles ? "Switch to dark theme" : "Usar tema escuro";
      botao.setAttribute("aria-label", texto);
      botao.title = texto;
    };
    rotular();
    sistemaEscuro.addEventListener("change", rotular);
    document.addEventListener("idioma-mudou", rotular);
    botao.addEventListener("click", () => {
      const novo = temaAtual() === "dark" ? "light" : "dark";
      raiz.dataset.theme = novo;
      try {
        localStorage.setItem("tema", novo);
      } catch (e) {
        // navegação privada ou armazenamento bloqueado: o tema vale só nesta visita
      }
      rotular();
    });
  });

  // Ao rolar: mostra a linha do cabeçalho e enche a barra de progresso do topo.
  const topo = document.querySelector(".topo");
  const barra = document.createElement("div");
  barra.className = "progresso";
  barra.setAttribute("aria-hidden", "true");
  barra.append(document.createElement("span"));
  document.body.prepend(barra);
  const preenchimento = barra.firstChild;

  function atualizarRolagem() {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const fracao = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
    preenchimento.style.transform = `scaleX(${fracao})`;
    if (topo) topo.classList.toggle("rolou", window.scrollY > 8);
  }
  atualizarRolagem();
  window.addEventListener("scroll", atualizarRolagem, { passive: true });
  window.addEventListener("resize", atualizarRolagem);
  // a página muda de altura quando as imagens carregam ou os cards são montados
  if ("ResizeObserver" in window) new ResizeObserver(atualizarRolagem).observe(document.body);
})();
