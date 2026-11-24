// Textos em inglês das páginas. O português fica escrito direto no HTML.
// Cada chave corresponde a um elemento marcado com data-i18n="chave" (texto)
// ou data-i18n-attr="atributo:chave" (atributos como aria-label e content).
// Os textos dos projetos em inglês ficam em projetos.js, no campo "en" de cada projeto.

window.TEXTOS_EN = {
  // ---------- Página inicial ----------
  titulo: "Paulo Fernando Carvalho · Portfolio",
  "descricao-meta":
    "Portfolio of Paulo Fernando Carvalho, Computer Science student at UFU: end-to-end systems in Python and TypeScript, with demos that open in your browser.",
  "marca-aria": "Paulo Fernando Carvalho, home",
  "nav-aria": "Sections",
  "nav-projetos": "Projects",
  "nav-sobre": "About",
  "nav-contato": "Contact",
  local: "Uberlândia - MG, Brazil",
  disponivel: "Available for work and projects",
  lide:
    "Computer Science student at the Federal University of Uberlândia (UFU). I build systems end to end: the Python back-end, the React and Next.js front-end, the database, the deploy and the tests. Almost every project here opens in your browser.",
  "ver-projetos": "See projects",
  "fale-comigo": "Get in touch",
  "contatos-aria": "Contacts",
  "rede-aria": "Animation of a neural network: signals travel layer by layer and the neurons light up when a signal arrives.",
  pensando: "thinking",
  "num-demos": "projects with a demo you can open right now, no install needed",
  "num-testes": "automated tests across PRANCHETA 11, AgendaKi and PixCerto",
  "num-dqn": "win rate of our DQN on 9×9 Minesweeper",
  "faixa-aria": "Technologies I use",
  "rotulo-projetos": "01 · Projects",
  "titulo-projetos": "Things you can open and try",
  "texto-projetos": "Each card opens the demo or the project details. The numbers come from tests and measurements in the code.",
  "filtros-aria": "Filter projects",
  "filtro-todos": "All",
  "filtro-ia": "AI",
  "filtro-web": "Web systems",
  "filtro-jogo": "Games",
  "mais-github": "More on GitHub",
  "rotulo-sobre": "02 · About",
  "titulo-sobre-1": "Theory is the start.",
  "titulo-sobre-2": "A live system is the proof.",
  "sobre-citacao": "Tired of only seeing theory, I learned that the simplest way is to build systems and put them to work.",
  "sobre-1":
    "I study Computer Science at the Federal University of Uberlândia and build end to end: the back-end in Python, the front-end in React and Next.js with TypeScript, the database, the deploy and the tests.",
  "sobre-2":
    "I like projects you can verify. That's why every project here has a live demo or a recording, and the numbers on the cards come from tests and measurements in the repository.",
  "bloco-formacao": "Education",
  "formacao-curso": "Computer Science",
  "formacao-local": "Federal University of Uberlândia (UFU)",
  "bloco-agora": "Now",
  "agora-1": "Building TraceFlow",
  "agora-2": "and studying distributed systems, queues and time-series databases",
  "bloco-linguagens": "Languages",
  "bloco-backend": "Back-end & data",
  "bloco-frontend": "Front-end",
  "bloco-infra": "Infra & testing",
  "rotulo-contato": "03 · Contact",
  "contato-titulo-1": "Let's",
  "contato-titulo-2": "talk.",
  "contato-texto":
    "I'm available for full-time work, internships, freelance or projects, whatever makes sense. If you have a role or an idea, send me an email or reach out on LinkedIn.",
  "rodape-texto": "Handmade with HTML, CSS and JavaScript.",
  fechar: "Close",
  destaques: "Highlights",
  "como-testar": "How to try it",
  tecnologias: "Technologies",
  links: "Links",
  "imagens-aria": "Project images",

  // ---------- Página do Campo Minado ----------
  "cm-titulo": "Minesweeper with RL · Paulo Fernando Carvalho",
  "cm-descricao-meta":
    "A DQN trained in PyTorch playing Minesweeper live in the browser, showing the mine chance it estimates for each cell.",
  "cm-marca-aria": "Paulo Fernando Carvalho, back to the portfolio",
  "cm-nav-aria": "Navigation",
  "cm-voltar": "Projects",
  "cm-codigo": "Code",
  "cm-pilula": "Reinforcement learning · runs in your browser",
  "cm-h1": "Minesweeper played by a DQN",
  "cm-lide":
    "This is the network we trained in PyTorch, playing for real on this page. Ask for a move, let it play on its own, or click a cell to play yourself. Each cell's color shows the mine chance the network estimates.",
  "cm-demo-aria": "Demo",
  "cm-tamanho-aria": "Board size",
  "cm-9x9": "9×9 · 10 mines",
  "cm-5x5": "5×5 · 4 mines",
  "cm-proxima": "DQN's next move",
  "cm-nova": "New game",
  "cm-pensa": "Show what the DQN thinks",
  "cm-vitorias": "wins",
  "cm-derrotas": "losses",
  "cm-nesta-visita": "this visit",
  "cm-chance": "Mine chance estimated by the DQN",
  "cm-casa-proxima": "Cell the DQN would open now",
  "cm-dica": "The first cell you open is never a mine. A cell with 0 opens its neighbors in a chain.",
  "cm-resultados": "Results",
  "cm-resultados-texto": "Wins on 10,000 test boards the agent never saw in training. Every strategy plays the same boards.",
  "cm-grafico-tab-aria": "Chart board",
  "cm-grafico-aria": "Win rate by strategy",
  "cm-curva-link-aria": "Open the learning curve at full size",
  "cm-curva-alt":
    "Learning curves. On 5×5, the DQN goes from 3% to about 60% in 30,000 games and stays close to the logic solver (61%). On 9×9, it climbs from 0% to about 80% over 170,000 games, with jumps at the symmetry retraining and the switch to squared error, reaching the logic solver's level (79%).",
  "cm-curva-legenda":
    "Learning curve: wins on 1,000 test boards over training. The curve shows the network alone; averaging over the 8 symmetries, used when playing, takes 9×9 to 87.3%. Tap the image to enlarge.",
  "cm-como": "How it works",
  "cm-b1-t": "The network runs in your browser",
  "cm-b1":
    "These are the same 39,937 weights trained in PyTorch, rewritten in JavaScript with no libraries. Compared with PyTorch on 60 boards, the values match to the fifth decimal place and the chosen move is the same on every board.",
  "cm-b2-t": "What the color shows",
  "cm-b2":
    "For each closed cell, the network outputs a Q value: how much opening it is worth. Since a safe cell is worth +1 and a mine −10, the Q value can be turned into an estimated mine chance. That's what colors each cell.",
  "cm-b3-t": "Only convolutions",
  "cm-b3":
    "Five layers of 32 3×3 filters and a 1×1 at the end. The same filter evaluates every cell by looking at its neighborhood, the way a person reads the numbers around it.",
  "cm-b4-t": "Symmetry averaging",
  "cm-b4":
    "The game doesn't change if the board is rotated or mirrored. On 9×9, the network evaluates all 8 versions and averages the values, which added 5 to 14 points with no extra training.",
  "cm-b5-t": "Training",
  "cm-b5":
    "Double DQN with a 200,000-move replay buffer, a target network copied every 1,000 steps and γ = 0.1. The final 9×9 network trained for about 166,000 games, with squared error instead of Huber loss.",
  "cm-b6-t": "Where it still slips",
  "cm-b6":
    "Combined with logic, which opens the guaranteed cells, and used only to guess, the DQN reaches 89.7% on 9×9: less than 1 point below exact probability. On its own, it still misses a deduction now and then.",
  "cm-creditos":
    "Artificial Intelligence course project, built in a pair with Cauê Fernando Faria Abreu. The code, the training videos and the slides are in the",
  "cm-repositorio": "project repository",
  "cm-voltar-portfolio": "Back to the portfolio",
};
