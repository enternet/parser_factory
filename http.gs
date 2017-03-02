function doGet(e) {
  if (e) {
    var headers_json = get_my_headers();
    return ContentService.createTextOutput(JSON.stringify(headers_json));
  }
}

function doPost(e) {
  return doGet(e);
}

function get_my_headers() {
  var uri = "http://headers.jsontest.com/";
  var request = {
    "method": "post",
    "muteHttpExceptions": true,
    "validateHttpsCertificates": false,
    "headers": {
      "Accept": "application/json, text/javascript, */*; q=0.01",
      "Accept-Encoding": "gzip, deflate", // похоже, не передается
      "Accept-Language": "en,ru;q=0.8",
      // "Host": "test.it",  // запрещен к передаче
      // "X-Forwarded-For": "8.8.8.8", // запрещен к передаче
      "Origin": "http://test.it",
      "Referer": "http://test.it/index.php",
      "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko",
      "X-Requested-With": "XMLHttpRequest"
    }
  };
  var responce = UrlFetchApp.fetch(uri, request);
  
  if (responce) {
    var json = JSON.parse(responce.getContentText() || {});
    var spreadsheet_id = "1HBXjXul_G3Dunfi3k1E43SmZsYbEEUHumli5KlZ15DI";
    var spreadsheet = SpreadsheetApp.openById(spreadsheet_id);
    delete json["X-Cloud-Trace-Context"];
    
    log_json(spreadsheet, "XForwardedFor", json, { ".method": request.method.toUpperCase() });
    return json;
  }
  
  return {};
}
