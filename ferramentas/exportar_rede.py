"""Exporta as DQN finais do Campo Minado para campo-minado/rede.js (pesos em float32, base64).

Também gera tabuleiros de teste com os valores Q calculados pelo PyTorch, para conferir que a
versão em JavaScript (campo-minado/dqn.js) chega nos mesmos números.

Uso, com o repositório campo-minado-rl clonado ao lado:
    python ferramentas/exportar_rede.py ../campo-minado-rl campo-minado/rede.js testes_dqn.js
"""
import base64, json, sys
from pathlib import Path
import numpy as np, torch
repo, destino, teste = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3])
sys.path.insert(0, str(repo))
from campo_minado.ambiente import CampoMinado
from campo_minado.dqn import RedeQ, valores_q, mascara_fechadas, melhores_acoes

TABS = {"5x5": (5, 5, 4), "9x9": (9, 9, 10)}
resumo = json.loads((repo / "resultados/resumo.json").read_text(encoding="utf-8"))
redes, testes = {}, {}
for tab, (L, C, M) in TABS.items():
    pesos = torch.load(repo / "resultados" / tab / "dqn_final.pt")
    convs = sorted({k.split(".")[1] for k in pesos if k.endswith(".weight")}, key=int)
    rede = RedeQ(pesos[f"rede.{convs[0]}.weight"].shape[0], len(convs) - 1)
    rede.load_state_dict(pesos); rede.eval()
    simetria = resumo[tab]["DQN final"].get("simetria", False)
    camadas, blocos = [], []
    for i in convs:
        w, b = pesos[f"rede.{i}.weight"], pesos[f"rede.{i}.bias"]
        camadas.append({"saida": w.shape[0], "entrada": w.shape[1], "k": w.shape[2]})
        blocos += [w.numpy().astype("<f4").ravel(), b.numpy().astype("<f4").ravel()]
    tudo = np.concatenate(blocos)
    redes[tab] = {"linhas": L, "colunas": C, "minas": M, "simetria": simetria,
                  "vitorias": resumo[tab]["DQN final"]["vitorias"],
                  "camadas": camadas, "pesos": base64.b64encode(tudo.tobytes()).decode()}
    # tabuleiros de teste: estados no meio de partidas jogadas pela própria DQN
    estados = []
    env = CampoMinado(L, C, M)
    for s in range(60):
        est = env.reset(90_000_000 + s); fim = False; passos = 0
        alvo = s % 6
        while not fim and passos < alvo:
            a = int(melhores_acoes(valores_q(rede, est[None], simetria), mascara_fechadas(est[None]))[0])
            est, _, fim, _ = env.step(a); passos += 1
        if not fim:
            estados.append(est.copy())
    estados = np.stack(estados[:30])
    with torch.no_grad():
        q_sem = valores_q(rede, estados, False).numpy()
        q_com = valores_q(rede, estados, True).numpy()
    testes[tab] = {"estados": estados.reshape(len(estados), -1).tolist(),
                   "q_sem": q_sem.round(6).tolist(), "q_com": q_com.round(6).tolist()}
    print(tab, "camadas:", [(c["entrada"], c["saida"], c["k"]) for c in camadas], "| params:", tudo.size,
          "| simetria:", simetria, "| testes:", len(estados))

cab = ("// Pesos das DQN finais do Campo Minado (gerado a partir de resultados/<tab>/dqn_final.pt).\n"
       "// Cada camada: pesos [saida][entrada][k][k] seguidos do vies [saida], em float32 little-endian, base64.\n")
destino.write_text(cab + "window.REDES_CAMPO_MINADO = " + json.dumps(redes, ensure_ascii=False) + ";\n", encoding="utf-8")
teste.write_text("window.TESTES_DQN = " + json.dumps(testes) + ";\n", encoding="utf-8")
print("rede.js:", destino.stat().st_size // 1024, "KB")
