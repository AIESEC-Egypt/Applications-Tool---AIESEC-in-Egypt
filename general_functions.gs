function dataExtraction(query) {
  var requestOptions = {
    method: "post",
    payload: query,
    contentType: "application/json",
    headers: {
      access_token: `${access_token}`,
    },
  };
  var response = UrlFetchApp.fetch(
    `https://gis-api.aiesec.org/graphql?access_token=${requestOptions["headers"]["access_token"]}`,
    requestOptions
  );
  var recievedDate = JSON.parse(response.getContentText());
  return recievedDate.data.allOpportunityApplication.data;
}

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("Update Sheets")
    .addItem("Run OGV code", "dataUpdating_OGV")
    .addItem("Run OGT code", "dataUpdating_OGT")
    .addItem("Run IGV code", "dataUpdating_IGV")
    .addItem("Run IGTa/e code", "dataUpdating_IGT")
    .addToUi();
}
