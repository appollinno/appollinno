# Especificação de Campos

## Secção 0 — Tipo de Processo
| Campo | Tipo | Obrigatório | Opções |
|-------|------|:-----------:|--------|
| Tipo de Processo | Lista | ✅ | Onboarding / Offboarding |

## Secção 1 — Recursos Humanos (RH)
| Campo | Tipo | Obrigatório | Notas |
|-------|------|:-----------:|-------|
| Nome | Texto curto | ✅ | |
| Apelido | Texto curto | ✅ | |
| Sexo | Escolha múltipla | ✅ | Masculino / Feminino / Outro / Prefiro não indicar |
| Data de Nascimento | Data | ✅ | com ano |
| Email Pessoal | Texto curto | ✅ | validação de email |
| Data de Início do Contrato | Data | ✅ | com ano |
| Data de Término do Contrato | Data | ✅ | com ano |
| ID do Contrato | Texto curto | ✅ | |
| Manager | Texto curto | ✅ | |
| Departamento | Lista | ✅ | configurável em `CONFIG.DEPARTMENTS` |
| Remarks | Parágrafo | ✅ | |

## Secção 2 — ICT (aprovação pelo responsável ICT da IOM)
| Campo | Tipo | Obrigatório | Notas |
|-------|------|:-----------:|-------|
| Necessita de alocação / devolução de Laptop? | Escolha múltipla | ✅ | Sim / Não |
| Tipo / Especificações do Laptop | Texto curto | ❌ | preencher se "Sim" |
| Justificação do pedido | Parágrafo | ❌ | |

➡️ Se **Sim**, a submissão gera um pedido de aprovação para `ICT_APPROVER_EMAIL`.

## Secção 3 — Administração (aprovação pela Administração da IOM)
| Campo | Tipo | Obrigatório | Notas |
|-------|------|:-----------:|-------|
| Necessita de alocação / devolução de Celular? | Escolha múltipla | ✅ | Sim / Não |
| Necessita de SIM Card? | Escolha múltipla | ✅ | Sim / Não |
| Observações (Celular / SIM Card) | Parágrafo | ❌ | |

➡️ Se qualquer um for **Sim**, a submissão gera um pedido de aprovação para `ADMIN_APPROVER_EMAIL`.

## Colunas acrescentadas automaticamente ao Sheet
`ICT · Estado`, `ICT · Decisor`, `ICT · Data da Decisão`, `ICT · Comentário`,
`ADM · Estado`, `ADM · Decisor`, `ADM · Data da Decisão`, `ADM · Comentário`.

Estados: `PENDENTE` (amarelo) · `APROVADO` (verde) · `REJEITADO` (vermelho) · `N/A`.
