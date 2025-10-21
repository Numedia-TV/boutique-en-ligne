const SPREADSHEET_ID = '1ZX5LmkIZj8tRMfQ7V6AJLZTpXlgpN5GKpcZdjcgfksA'; // ID intégré
const SHEET_NAME = 'Dashboard';

function doPost(e){
  try{
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    if(!sheet) sheet = ss.insertSheet(SHEET_NAME);

    if(sheet.getLastRow() === 0){
      sheet.appendRow(['date','name','email','phone','address','cart_json','total']);
    }

    const row = [data.date||new Date().toISOString(), data.name, data.email, data.phone, data.address, JSON.stringify(data.cart), data.total];
    sheet.appendRow(row);

    return ContentService.createTextOutput('OK');
  }catch(err){
    return ContentService.createTextOutput('ERROR: ' + err.toString());
  }
}
