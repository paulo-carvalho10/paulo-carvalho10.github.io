# Portfólio · Paulo Fernando Carvalho

Site com os meus principais projetos, cada um com descrição e um botão para abrir a demonstração.

**No ar em:** https://paulo-carvalho10.github.io

Feito em HTML, CSS e JavaScript, sem framework e sem etapa de build: o GitHub Pages publica os
arquivos como estão.

## Estrutura

| Arquivo | O que é |
|---|---|
| `index.html` | A página inicial: abertura, projetos, sobre e contato |
| `projetos.js` | **O conteúdo**: contatos, frases do topo e os textos de cada projeto |
| `site.js` | Monta contatos, cards, filtros e a janela de detalhes, e cuida dos efeitos |
| `rede-neural.js` | A rede neural animada do topo (canvas, sem bibliotecas) |
| `estilo.css` | O visual, com as cores do tema claro e do escuro no topo |
| `tema.js` | O botão de tema claro/escuro |
| `idioma.js` | O botão PT \| EN: escolhe o idioma e troca os textos da página |
| `textos-en.js` | Os textos fixos das páginas em inglês (o português está no próprio HTML) |
| `img/` | Capturas dos projetos (WebP) e a gravação do TraceFlow (MP4) |
| `campo-minado/` | A demonstração do Campo Minado, com a DQN rodando no navegador |
| `ferramentas/exportar_rede.py` | Gera `campo-minado/rede.js` a partir dos pesos treinados em PyTorch |

## Editar ou acrescentar um projeto

Tudo fica em `projetos.js`. Para acrescentar um projeto, copie um bloco `{ ... }` e troque os
campos; o comentário no topo do arquivo explica cada um. E-mail, redes e as frases digitadas no
topo ficam em `SOBRE`, no começo do arquivo.

Quem configura o sistema para reduzir animações vê o site parado: sem frases digitadas, números
contando nem sinais andando pela rede neural do topo.

## Português e inglês

O botão **PT | EN** no cabeçalho troca o idioma na hora, e a escolha fica guardada no navegador.
Para mandar o site já em inglês, use o link https://paulo-carvalho10.github.io/?lang=en. Na
primeira visita, sem escolha guardada, quem não tem português entre os idiomas do navegador vê o
site em inglês.

- **Textos fixos das páginas:** o português está no HTML, e cada elemento traduzível tem um
  `data-i18n="chave"`. O inglês da mesma chave fica em `textos-en.js`.
- **Projetos e contatos:** cada projeto em `projetos.js` tem um campo `en` com os mesmos textos em
  inglês. O que faltar nele aparece em português.
- **Mensagens montadas por JavaScript** (botões dos cards, mensagens do Campo Minado): ficam no
  próprio código, no formato `tr("português", "english")`.

## Ver no computador

Dê dois cliques em `index.html`. Ou, no terminal, dentro desta pasta:

```
python -m http.server 8000
```

e abra http://localhost:8000.

## O Campo Minado no navegador

A rede é a DQN final do repositório
[campo-minado-rl](https://github.com/CaueFAbreu/campo-minado-rl) (trabalho em dupla com Cauê
Abreu). Os pesos de `resultados/<tabuleiro>/dqn_final.pt` foram exportados para `rede.js`, e
`dqn.js` refaz em JavaScript o jogo (`ambiente.py`) e a rede convolucional (`dqn.py`), sem
bibliotecas.

A versão em JavaScript foi conferida contra o PyTorch: em 60 tabuleiros, a maior diferença nos
valores Q foi de 0,000008 e a jogada escolhida foi a mesma em todos. Jogando sozinha no navegador, a
rede venceu 65,8% de 3.000 partidas no 5×5 (no Python: 65,2%) e 85,5% de 400 partidas no 9×9 (no
Python: 87,3%, dentro da margem de erro).
