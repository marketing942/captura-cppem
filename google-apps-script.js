// ============================================================
// CPPEM Concursos — Google Apps Script
// Cole este código em: Extensions → Apps Script → Salve → Deploy
// ============================================================

function doPost(e) {
  try {
    const dados   = JSON.parse(e.postData.contents);
    const planilha = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Cria o cabeçalho na primeira vez (linha 1 vazia)
    if (planilha.getLastRow() === 0) {
      planilha.appendRow(["Data e Hora", "Nome", "E-mail", "Telefone"]);

      // Formata o cabeçalho: negrito + fundo verde CPPEM
      const header = planilha.getRange(1, 1, 1, 4);
      header.setFontWeight("bold");
      header.setBackground("#00E63C");
      header.setFontColor("#0A0A0A");

      // Ajusta largura das colunas
      planilha.setColumnWidth(1, 160); // Data e Hora
      planilha.setColumnWidth(2, 220); // Nome
      planilha.setColumnWidth(3, 250); // E-mail
      planilha.setColumnWidth(4, 180); // Telefone
    }

    // Formata data/hora no fuso de Brasília
    const agora = Utilities.formatDate(
      new Date(),
      "America/Recife",
      "dd/MM/yyyy HH:mm:ss"
    );

    // Insere nova linha com os dados do lead
    planilha.appendRow([
      agora,
      dados.nome     || "",
      dados.email    || "",
      dados.telefone || "",
    ]);

    // Retorno de sucesso (o browser ignora por causa do no-cors, mas é boa prática)
    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "erro", mensagem: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Necessário para o Google aceitar requisições GET (teste rápido no navegador)
function doGet() {
  return ContentService.createTextOutput("CPPEM Sheets — funcionando.");
}
