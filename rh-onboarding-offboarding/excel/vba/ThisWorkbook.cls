Attribute VB_Name = "ThisWorkbook"
Attribute VB_Base = "0{00020819-0000-0000-C000-000000000046}"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = True
Attribute VB_TemplateDerived = False
Attribute VB_Customizable = True
Private Sub Workbook_Open()
    On Error Resume Next
    CriarBotao
End Sub
Private Sub Workbook_SheetChange(ByVal Sh As Object, ByVal Target As Range)
    On Error Resume Next
    If Sh.Name <> SHEET_REG Then Exit Sub
    If Target.Row < 3 Then Exit Sub
    Dim c As Long: c = Target.Column
    If c = 17 Or c = 24 Then NotificarDecisao Sh, Target.Row, c
End Sub
