# Versão Excel — Onboarding & Offboarding

Duas variantes, conforme o que precisas:

| Ficheiro | Macros | Notificação por email | Quando usar |
|----------|:------:|:---------------------:|-------------|
| **`IOM_Onboarding_Offboarding.xlsx`** | ❌ | manual | Simples, abre em qualquer lado, sem avisos de segurança |
| **`IOM_Onboarding_Offboarding_Macro.xlsm`** | ✅ (VBA) | **automática via Outlook** | Quando queres email automático aos aprovadores do IOM |

Ambas têm a **mesma estrutura**: folhas `Instruções`, `Registos`, `Dashboard`, `Listas`.

## Campos
Ver [`../docs/fields.md`](../docs/fields.md).
- **RH:** Nome, Apelido, Sexo, Data de Nascimento, Email Pessoal, Data Início/Término do Contrato, ID do Contrato, Manager, Departamento, Remarks.
- **ICT:** Necessita Laptop? + especificações + **ICT · Estado** (aprovação pelo IOM).
- **Administração:** Necessita Celular? / SIM Card? + observações + **ADM · Estado**.

## Fluxo de aprovação (igual nas duas)
1. RH preenche a linha e marca `Necessita Laptop?` / `Necessita Celular?` / `Necessita SIM Card?`.
2. O aprovador do **IOM** muda a coluna **Estado** (lista suspensa): `Pendente → Aprovado / Rejeitado`.
3. As cores aplicam-se sozinhas e o **Dashboard** atualiza as contagens.

---

## Versão .xlsm — macro de email

Ao abrir, o Excel mostra a barra amarela **"Ativar conteúdo"** → clicar para ligar as macros.

O que o macro faz (código em [`vba/`](vba/)):
- **Botão «Enviar pedidos pendentes»** no `Dashboard`: criado automaticamente ao abrir o ficheiro (evento `Workbook_Open` → `CriarBotao`). Clicar corre `EnviarPedidosPendentes`.
- **`EnviarPedidosPendentes`**: percorre as linhas e, para cada uma com Estado `Pendente`, envia email ao aprovador de **ICT** (Laptop) e/ou **Administração** (Celular+SIM).
- **Automático:** quando alguém muda a coluna **Estado** para `Aprovado`/`Rejeitado`, envia email ao RH + email pessoal do colaborador (evento `Workbook_SheetChange`).

### Envio automático vs. rever antes (`AUTO_SEND`)
No topo de `vba/Module1.bas`:
```vba
' True  -> envia direto pelo Outlook (.Send)
' False -> abre o email para rever antes (.Display)
Public Const AUTO_SEND As Boolean = True
```
Está **`True`** (envio automático). Com `.Send`, o Outlook pode mostrar um aviso de segurança na primeira vez — autorize, ou configure o Outlook/Exchange para permitir envio programático. Para rever cada email antes de enviar, ponha `AUTO_SEND = False`.

### ⚠️ Importante sobre o .xlsm deste repositório
Foi gerado **sem Excel** (ambiente Linux), com o `vbaProject.bin` construído e validado por `olefile` + `olevba` (o macro extrai-se corretamente). Deve abrir e correr no Excel normalmente. **Se** a tua versão do Excel reclamar do projeto, usa o método de importação abaixo — é 100% fiável e demora 1 minuto.

### Importar o macro manualmente (método garantido)
1. Abre `IOM_Onboarding_Offboarding.xlsx` → **Guardar como** → tipo **"Livro com permissão para macros (*.xlsm)"**.
2. `Alt + F11` (abre o editor VBA).
3. **File → Import File…** → escolhe `vba/Module1.bas`.
4. No painel esquerdo, abre **ThisWorkbook**, abre `vba/ThisWorkbook.cls` num bloco de notas e cola o conteúdo (sem as linhas `Attribute`).
5. Edita os emails no topo de `Module1` e **Guarda**.

### Alterar os emails dos aprovadores
No topo de `vba/Module1.bas` (ou no editor VBA):
```vba
Public Const ICT_EMAIL As String = "ict.approver@iom.int"
Public Const ADM_EMAIL As String = "admin.approver@iom.int"
Public Const HR_EMAIL  As String = "hr@iom.int"
```

---

## Regenerar os ficheiros
```bash
python3 build_xlsx.py    # cria o .xlsx  (requer openpyxl)
python3 build_xlsm.py    # cria o .xlsm  (requer openpyxl; valida com olefile/oletools)
```

## Nota
A alternativa com notificação automática **sem depender do Outlook/cliente** é a versão **Google Forms** deste repositório (`../apps-script/`), que envia emails pelo servidor do Google.
