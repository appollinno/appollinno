# Versão Excel — Onboarding & Offboarding

Ficheiro: **`IOM_Onboarding_Offboarding.xlsx`** — funciona em qualquer Excel (ou LibreOffice/Google Sheets), **sem macros**.

## Folhas
| Folha | Função |
|-------|--------|
| **Instruções** | Como usar + legenda de cores |
| **Registos** | Entrada de dados — 1 linha por colaborador (RH + ICT + Administração) |
| **Dashboard** | Contagens automáticas (`COUNTA` / `COUNTIF`) |
| **Listas** | Fonte das listas suspensas (pode ocultar) |

## Campos
Iguais à versão Google (ver [`../docs/fields.md`](../docs/fields.md)):
- **RH:** Nome, Apelido, Sexo, Data de Nascimento, Email Pessoal, Data Início/Término do Contrato, ID do Contrato, Manager, Departamento, Remarks.
- **ICT:** Necessita Laptop? + especificações + **ICT · Estado** (aprovação pelo IOM).
- **Administração:** Necessita Celular? / SIM Card? + observações + **ADM · Estado** (aprovação).

## Como funciona a aprovação (Excel nativo)
1. RH preenche a linha e marca `Necessita Laptop?` / `Necessita Celular?` / `Necessita SIM Card?`.
2. O aprovador do **IOM** muda a coluna **Estado** correspondente de `Pendente` → `Aprovado`/`Rejeitado` (lista suspensa) e preenche Aprovador, Data e Comentário.
3. As cores aplicam-se sozinhas (amarelo/verde/vermelho) e o **Dashboard** atualiza as contagens.

### Dropdowns disponíveis
Tipo de Processo · Sexo · Departamento · Sim/Não · Estado de Aprovação.

## Limitação
O Excel **não envia emails** sozinho. Para notificação automática aos aprovadores:
- use a **versão Google Forms** (pasta `../apps-script/`), **ou**
- peça a variante **`.xlsm`** com macro VBA de envio por Outlook.

## Regenerar o ficheiro
```bash
python3 build_xlsx.py   # requer openpyxl
```
