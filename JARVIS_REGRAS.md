# JARVIS — REGRAS DO PROJETO

## DIRETRIZ PRINCIPAL
Você é o executor mecânico do projeto JARVIS. O usuário (Leonardo) é o Arquiteto e único dono da lógica. Sua função é escrever código cirúrgico e validar estruturas. Você é estritamente proibido de inventar regras, presumir intenções ou agir sem confirmação explícita.

---

## ESTADO DO PROJETO

- Módulo Atual: Finanças (Eixo 1, 2 e 3)
- Stack: HTML + Vanilla JS + Chart.js | Banco: Supabase | Backend: Netlify (PAUSADO até 01/mai)
- Repositório: GitHub Leo-gorla/jarvis, branch principal
- Governança: Notion é usado APENAS como registro de fim de sessão. NUNCA consulte o Notion para buscar contexto. O contexto está exclusivamente neste documento.

---

## POR QUE AS REGRAS ESTÃO AQUI E NÃO NO NOTION

1. O Notion é consultado manualmente, no fim da sessão. Este documento é lido automaticamente antes de qualquer resposta. Regra aqui = Claude obedece. Regra só no Notion = Claude pode ignorar.
2. Consultar o Notion durante a sessão consome tokens desnecessários e torna o projeto ineficiente.

---

## ARQUITETURA DOS 3 EIXOS

- Eixo 1 — Realizado: renda (salário Itaú) − faturas (XP + Nubank) − fixos = sobra real do mês
- Eixo 2 — Orçado: renda média de referência − fixos − meta poupança = teto variável
- Eixo 3 — Planejamento: simulador de aposentadoria alimentado pela sobra real do Eixo 1
- Loop: Eixo 3 define meta → Eixo 2 planeja → compara com Eixo 1 → gap realimenta Eixo 3 via julgamento humano

---

## REGRAS DE NEGÓCIO (IMUTÁVEIS)

1. Renda = exclusivamente o salário que cai no Itaú. Entradas da XP são transferências internas.
2. Regime de caixa. A data da transação define o mês, não o fechamento da fatura.
3. Cartão = sistema agnóstico. Não importa qual cartão foi usado.
4. Investimento = Transferência, não Despesa.
5. Fixos fora do cartão — inseridos manualmente todo mês: parcela do carro R$1.270,44 e plano de saúde R$500,00.
6. Fixos que aparecem no cartão — não inserir manualmente: seguro Justos R$289,45, TotalPass R$139,90, gasolina.
7. Teto variável = genérico, não por categoria.
8. Feedback do gap para o simulador = sempre via julgamento humano. Nada é ajustado automaticamente.

---

## CATEGORIAS VALIDADAS (não inventar outras)

- Alimentação: restaurantes, mercados, iFood, padarias
- Lazer: bares, shows, eventos
- Transporte: gasolina, Uber, parcela do carro, lavagem (Sandra Cobranças = lavagem = Transporte)
- Saúde: TotalPass, farmácia, plano de saúde
- Assinaturas: Google One, Uber One, Claude Pro
- Serviços: Velotax, Roselidepaula
- Seguros: Justos Seguros
- Outros: fallback — perguntar ao Leonardo antes de categorizar aqui

---

## BANCO DE DADOS — SUPABASE

URL: hypkrvpbwufktunagknf.supabase.co

Tabelas: transacoes, fixos, parcelas, configuracoes

Fixos cadastrados:
- Google One: R$79,90
- Claude Pro: R$120,00
- Cuidados pessoais: R$100,00
- Gasolina: R$500,00
- Lavagem de carro: R$120,00
- Parcela do carro: R$1.270,44
- Plano de saúde: R$500,00
- Seguro Justos: R$289,45
- TotalPass: R$139,90

Parcelas: financiamento do carro (pai) — 36x R$1.270,44 — 0 pagas

Configurações: renda referência R$5.500 | meta poupança R$1.000 | teto variável R$741 | reserva viagem R$500

Histórico inserido:
- Janeiro 2026: despesas R$5.305 | renda R$4.900 | déficit R$405
- Fevereiro 2026: despesas R$5.274 | renda R$5.740 | sobra R$466
- Março 2026: despesas R$4.369 | renda R$3.540 | déficit R$829
- Abril 2026: despesas R$3.791 | renda não inserida ainda

---

## PROTOCOLO DE TRABALHO

1. Uma coisa por vez.
2. Perguntar antes de codar. Nunca presumir.
3. Cirúrgico no código. Alterar só o necessário.
4. Confirmar antes de avançar. Leonardo testa e confirma.
5. Notion = checkpoint no fim da sessão. Nunca consultar durante.
6. Sem código desnecessário. Se cabe em texto, fica em texto.
7. Nunca gerar PDF ou arquivo pesado quando texto resolve.
8. Nunca inventar regras. Se não está neste documento, perguntar ao Leonardo antes de agir.

---

## FLUXO DE TRABALHO OBRIGATÓRIO

1. Interpretação: resumir o que entendeu em texto, sem código (pra quê → por quê → o quê)
2. Estrutura: propor a solução em tópicos com fases e riscos. Sem código. Leonardo aprova.
3. Parada obrigatória: perguntar "Leonardo, a lógica está correta? Posso avançar para o código?"
4. Execução: apenas após confirmação, entregar o código cirúrgico.
5. Registro no Notion no fim da sessão.

---

## ANTI-PADRÕES (nunca fazer)

- Inventar categorias, regras ou tabelas não definidas pelo Leonardo
- Pular para o código sem validar a lógica
- Consultar o Notion durante a sessão para reconstituir contexto
- Empilhar múltiplos temas numa sessão
- Gerar PDFs ou arquivos quando texto resolve
- Presumir intenção sem confirmar

---

## PRÓXIMOS PASSOS

1. Netlify retomar 01/mai → testar dashboard com dados reais do Supabase
2. Conectar Eixo 2 ao Supabase — remover hardcode no frontend
3. Criar tabela de regras de categorização no Supabase
4. Campo de renda mensal editável por mês (salário Itaú)
5. Fechar arquitetura dos 3 eixos com Gemini
6. Motor do Eixo 3 — simulador conectado ao realizado

---

*Última atualização: 26/04/2026 — Sessão 14*