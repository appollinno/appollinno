Attribute VB_Name = "Module1"
' ====== Configuracao: altere os emails dos aprovadores do IOM ======
Public Const SHEET_REG As String = "Registos"
Public Const ICT_EMAIL As String = "ict.approver@iom.int"
Public Const ADM_EMAIL As String = "admin.approver@iom.int"
Public Const HR_EMAIL As String = "hr@iom.int"
Public Const SHEET_DASH As String = "Dashboard"
' AUTO_SEND = True -> envia direto pelo Outlook (.Send)
' AUTO_SEND = False -> abre o email para rever antes (.Display)
Public Const AUTO_SEND As Boolean = True

' Cria/actualiza o botao 'Enviar pedidos pendentes' no Dashboard (chamado no Open)
Public Sub CriarBotao()
    Dim ws As Worksheet, shp As Shape
    On Error Resume Next
    Set ws = ThisWorkbook.Sheets(SHEET_DASH)
    If ws Is Nothing Then Exit Sub
    ws.Shapes("btnEnviar").Delete
    On Error GoTo 0
    Set shp = ws.Shapes.AddShape(msoShapeRoundedRectangle, 300, 36, 220, 30)
    shp.Name = "btnEnviar"
    shp.Fill.ForeColor.RGB = RGB(0, 51, 160)
    shp.Line.Visible = msoFalse
    With shp.TextFrame2.TextRange
        .Text = "Enviar pedidos pendentes"
        .Font.Fill.ForeColor.RGB = RGB(255, 255, 255)
        .Font.Size = 11
        .Font.Bold = msoTrue
    End With
    shp.TextFrame2.VerticalAnchor = msoAnchorMiddle
    shp.OnAction = "EnviarPedidosPendentes"
End Sub

' Envia por email todos os pedidos com Estado = PENDENTE (botao/manual)
Public Sub EnviarPedidosPendentes()
    Dim ws As Worksheet, r As Long, lastR As Long, n As Long
    Set ws = ThisWorkbook.Sheets(SHEET_REG)
    lastR = ws.Cells(ws.Rows.Count, 3).End(xlUp).Row
    For r = 3 To lastR
        If UCase(ws.Cells(r, 17).Value) = "PENDENTE" Then
            EnviarEmail ICT_EMAIL, "Aprovacao ICT (Laptop) - " & Nome(ws, r), CorpoICT(ws, r)
            n = n + 1
        End If
        If UCase(ws.Cells(r, 24).Value) = "PENDENTE" Then
            EnviarEmail ADM_EMAIL, "Aprovacao Admin (Celular+SIM) - " & Nome(ws, r), CorpoADM(ws, r)
            n = n + 1
        End If
    Next r
    MsgBox n & " pedido(s) preparado(s) no Outlook.", vbInformation
End Sub

' Chamado automaticamente quando a coluna Estado muda para Aprovado/Rejeitado
Public Sub NotificarDecisao(ws As Object, r As Long, c As Long)
    Dim estado As String, seccao As String, dest As String
    estado = UCase(ws.Cells(r, c).Value)
    If estado <> "APROVADO" And estado <> "REJEITADO" Then Exit Sub
    If c = 17 Then seccao = "ICT (Laptop)" Else seccao = "Admin (Celular+SIM)"
    dest = HR_EMAIL
    If ws.Cells(r, 7).Value <> "" Then dest = dest & ";" & ws.Cells(r, 7).Value
    EnviarEmail dest, estado & " - " & seccao & " - " & Nome(ws, r), _
        "O pedido de " & seccao & " para " & Nome(ws, r) & " foi " & estado & "."
End Sub

Private Function Nome(ws As Object, r As Long) As String
    Nome = ws.Cells(r, 3).Value & " " & ws.Cells(r, 4).Value
End Function

Private Function CorpoICT(ws As Object, r As Long) As String
    CorpoICT = "Colaborador: " & Nome(ws, r) & vbCrLf & _
        "Departamento: " & ws.Cells(r, 12).Value & vbCrLf & _
        "Laptop: " & ws.Cells(r, 15).Value & vbCrLf & _
        "Justificacao: " & ws.Cells(r, 16).Value
End Function

Private Function CorpoADM(ws As Object, r As Long) As String
    CorpoADM = "Colaborador: " & Nome(ws, r) & vbCrLf & _
        "Celular: " & ws.Cells(r, 21).Value & " | SIM: " & ws.Cells(r, 22).Value & vbCrLf & _
        "Observacoes: " & ws.Cells(r, 23).Value
End Function

' Usa o Outlook (late binding). Troque .Display por .Send para enviar directo.
Private Sub EnviarEmail(para As String, assunto As String, corpo As String)
    On Error Resume Next
    Dim ol As Object, m As Object
    Set ol = CreateObject("Outlook.Application")
    Set m = ol.CreateItem(0)
    m.To = para
    m.Subject = "[IOM] " & assunto
    m.Body = corpo & vbCrLf & vbCrLf & "Mensagem automatica do sistema de Onboarding/Offboarding."
    If AUTO_SEND Then
        m.Send
    Else
        m.Display
    End If
End Sub
