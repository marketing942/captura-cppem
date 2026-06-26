// ============================================================
// CPPEM Concursos — Google Apps Script
// Cole este código em: Extensions → Apps Script → Salve → Deploy
// ============================================================

function doPost(e) {
  try {
    const dados    = JSON.parse(e.postData.contents);
    const planilha = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Cria o cabeçalho na primeira vez (linha 1 vazia)
    if (planilha.getLastRow() === 0) {
      planilha.appendRow(["Data e Hora", "Nome", "E-mail", "Telefone"]);

      const header = planilha.getRange(1, 1, 1, 4);
      header.setFontWeight("bold");
      header.setBackground("#00E63C");
      header.setFontColor("#0A0A0A");

      planilha.setColumnWidth(1, 160);
      planilha.setColumnWidth(2, 220);
      planilha.setColumnWidth(3, 250);
      planilha.setColumnWidth(4, 180);
    }

    const agora = Utilities.formatDate(
      new Date(),
      "America/Recife",
      "dd/MM/yyyy HH:mm:ss"
    );

    // Telefone: setNumberFormat força texto, evita #ERROR! com o +55
    const linha = planilha.getLastRow() + 1;
    planilha.appendRow([agora, dados.nome || "", dados.email || "", dados.telefone || ""]);
    planilha.getRange(linha, 4).setNumberFormat("@"); // coluna D = texto puro

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "erro", mensagem: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput("CPPEM Sheets — funcionando.");
}
