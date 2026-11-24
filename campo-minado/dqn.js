// O Campo Minado e a DQN treinada, rodando no navegador sem bibliotecas.
//
// É a mesma lógica do repositório campo-minado-rl:
//   - campo_minado/ambiente.py  -> classe CampoMinado
//   - campo_minado/dqn.py       -> classe RedeQ (convoluções 3x3 + ReLU e uma 1x1 no fim)
// Os pesos vêm de rede.js, exportados dos arquivos dqn_final.pt.

(function (global) {
  "use strict";

  const FECHADA = -1;
  const RECOMPENSA_SEGURA = 1;
  const RECOMPENSA_MINA = -10;
  const GAMMA = 0.1;

  // ------------------------------------------------------------------
  // O jogo
  // ------------------------------------------------------------------

  // Gerador pseudoaleatório com semente (mulberry32): a mesma semente gera o mesmo tabuleiro.
  function geradorComSemente(semente) {
    let a = semente >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  class CampoMinado {
    constructor(linhas, colunas, minas) {
      this.linhas = linhas;
      this.colunas = colunas;
      this.nMinas = minas;
      this.nCasas = linhas * colunas;
    }

    // Começa uma partida nova. Sem semente, o tabuleiro é sorteado.
    reset(semente) {
      const aleatorio = semente == null ? Math.random : geradorComSemente(semente);
      const casas = Array.from({ length: this.nCasas }, (_, i) => i);
      this.minas = new Uint8Array(this.nCasas);
      for (let k = 0; k < this.nMinas; k++) {
        const j = k + Math.floor(aleatorio() * (this.nCasas - k));
        [casas[k], casas[j]] = [casas[j], casas[k]];
        this.minas[casas[k]] = 1;
      }
      this._contarVizinhas();
      this.visivel = new Int8Array(this.nCasas).fill(FECHADA);
      this.fechadasSeguras = this.nCasas - this.nMinas;
      this.primeiraJogada = true;
      this.terminou = false;
      this.venceu = false;
      this.explodiu = -1;
      return this.visivel;
    }

    vizinhos(casa) {
      const l = Math.floor(casa / this.colunas), c = casa % this.colunas;
      const lista = [];
      for (let dl = -1; dl <= 1; dl++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nl = l + dl, nc = c + dc;
          if ((dl || dc) && nl >= 0 && nl < this.linhas && nc >= 0 && nc < this.colunas) {
            lista.push(nl * this.colunas + nc);
          }
        }
      }
      return lista;
    }

    _contarVizinhas() {
      this.vizinhas = new Int8Array(this.nCasas);
      for (let i = 0; i < this.nCasas; i++) {
        for (const v of this.vizinhos(i)) this.vizinhas[i] += this.minas[v];
      }
    }

    // Abre a casa e, se ela for 0, abre as vizinhas em cadeia (busca em largura).
    _abrir(casa) {
      const abertas = [casa];
      const fila = [casa];
      this.visivel[casa] = this.vizinhas[casa];
      this.fechadasSeguras--;
      while (fila.length) {
        const atual = fila.shift();
        if (this.vizinhas[atual] !== 0) continue;
        for (const v of this.vizinhos(atual)) {
          if (this.visivel[v] === FECHADA) {
            this.visivel[v] = this.vizinhas[v];
            this.fechadasSeguras--;
            abertas.push(v);
            fila.push(v);
          }
        }
      }
      return abertas;
    }

    // Abre a casa `casa`. Devolve "repetida", "segura", "vitoria" ou "mina".
    jogar(casa) {
      if (this.terminou) return "fim";

      // A primeira casa aberta é sempre segura: se houver uma mina nela, a mina vai
      // para a primeira casa livre, linha a linha (como no ambiente.py).
      if (this.primeiraJogada) {
        this.primeiraJogada = false;
        if (this.minas[casa]) {
          const livre = this.minas.findIndex((m, i) => !m && i !== casa);
          this.minas[casa] = 0;
          this.minas[livre] = 1;
          this._contarVizinhas();
        }
      }

      if (this.visivel[casa] !== FECHADA) return "repetida";
      if (this.minas[casa]) {
        this.terminou = true;
        this.explodiu = casa;
        return "mina";
      }
      this.ultimasAbertas = this._abrir(casa);
      if (this.fechadasSeguras === 0) {
        this.terminou = true;
        this.venceu = true;
        return "vitoria";
      }
      return "segura";
    }
  }

  // ------------------------------------------------------------------
  // A rede
  // ------------------------------------------------------------------

  function decodificarPesos(base64) {
    const texto = atob(base64);
    const bytes = new Uint8Array(texto.length);
    for (let i = 0; i < texto.length; i++) bytes[i] = texto.charCodeAt(i);
    return new Float32Array(bytes.buffer);
  }

  // As 8 simetrias do tabuleiro quadrado (4 rotações, com e sem espelho).
  // Cada uma é uma lista: casa no tabuleiro transformado -> casa no tabuleiro original.
  function simetrias(lado) {
    const lista = [];
    for (let k = 0; k < 4; k++) {
      for (const espelho of [false, true]) {
        const origem = new Int32Array(lado * lado);
        for (let i = 0; i < lado; i++) {
          for (let j = 0; j < lado; j++) {
            let a = i, b = espelho ? lado - 1 - j : j;
            for (let r = 0; r < k; r++) [a, b] = [b, lado - 1 - a]; // giro de 90 graus
            origem[i * lado + j] = a * lado + b;
          }
        }
        lista.push(origem);
      }
    }
    return lista;
  }

  class RedeQ {
    // `def` vem de rede.js: tamanho do tabuleiro, camadas e pesos em base64.
    constructor(def) {
      this.linhas = def.linhas;
      this.colunas = def.colunas;
      this.minas = def.minas;
      this.simetria = def.simetria;
      const pesos = decodificarPesos(def.pesos);
      let pos = 0;
      this.camadas = def.camadas.map((c) => {
        const n = c.saida * c.entrada * c.k * c.k;
        const w = pesos.subarray(pos, pos + n);
        pos += n;
        const b = pesos.subarray(pos, pos + c.saida);
        pos += c.saida;
        return { ...c, w, b };
      });
      if (pos !== pesos.length) throw new Error("O tamanho dos pesos não confere com as camadas.");
      this.transformacoes = this.linhas === this.colunas ? simetrias(this.linhas) : null;
    }

    // Uma passada pela rede: tabuleiro visível (-1 a 8 por casa) -> valor Q de cada casa.
    _passar(estado) {
      const H = this.linhas, W = this.colunas, N = H * W;
      // Entrada em one-hot: canal 0 = fechada, canais 1 a 9 = números 0 a 8.
      let x = new Float64Array(10 * N);
      for (let i = 0; i < N; i++) x[(estado[i] + 1) * N + i] = 1;

      const ultima = this.camadas.length - 1;
      this.camadas.forEach((c, indice) => {
        const y = new Float64Array(c.saida * N);
        const k = c.k, meio = (k - 1) >> 1;
        for (let o = 0; o < c.saida; o++) {
          const yo = o * N;
          y.fill(c.b[o], yo, yo + N);
          for (let e = 0; e < c.entrada; e++) {
            const xe = e * N;
            const base = (o * c.entrada + e) * k * k;
            for (let di = 0; di < k; di++) {
              const oi = di - meio;
              const i0 = Math.max(0, -oi), i1 = Math.min(H, H - oi);
              for (let dj = 0; dj < k; dj++) {
                const peso = c.w[base + di * k + dj];
                const oj = dj - meio;
                const j0 = Math.max(0, -oj), j1 = Math.min(W, W - oj);
                for (let i = i0; i < i1; i++) {
                  const linhaY = yo + i * W;
                  const linhaX = xe + (i + oi) * W + oj;
                  for (let j = j0; j < j1; j++) y[linhaY + j] += peso * x[linhaX + j];
                }
              }
            }
          }
        }
        if (indice < ultima) {
          for (let t = 0; t < y.length; t++) if (y[t] < 0) y[t] = 0; // ReLU
        }
        x = y;
      });
      return x;
    }

    // Valores Q de cada casa. Com simetria, tira a média da rede nas 8 versões do tabuleiro.
    valoresQ(estado, simetria = this.simetria) {
      if (!simetria || !this.transformacoes) return this._passar(estado);
      const N = this.linhas * this.colunas;
      const media = new Float64Array(N);
      const girado = new Int8Array(N);
      for (const origem of this.transformacoes) {
        for (let i = 0; i < N; i++) girado[i] = estado[origem[i]];
        const q = this._passar(girado);
        for (let i = 0; i < N; i++) media[origem[i]] += q[i];
      }
      for (let i = 0; i < N; i++) media[i] /= this.transformacoes.length;
      return media;
    }

    // A casa fechada de maior valor Q (a jogada da DQN).
    melhorJogada(estado, q) {
      let melhor = -1, valor = -Infinity;
      for (let i = 0; i < estado.length; i++) {
        if (estado[i] === FECHADA && q[i] > valor) {
          valor = q[i];
          melhor = i;
        }
      }
      return melhor;
    }
  }

  // Converte o valor Q numa estimativa da chance de mina (a mesma conta do demo.py).
  // Abrir uma casa segura vale +1 (mais um pouco das jogadas seguintes) e uma mina vale -10,
  // então Q ≈ (1 - p)(1 + γ) + p(-10), e daí sai p. É só uma estimativa para visualizar.
  function chanceDeMina(q) {
    const seguro = RECOMPENSA_SEGURA * (1 + GAMMA);
    return Math.min(1, Math.max(0, (seguro - q) / (seguro - RECOMPENSA_MINA)));
  }

  global.CampoMinadoDQN = { FECHADA, CampoMinado, RedeQ, chanceDeMina };
})(window);
