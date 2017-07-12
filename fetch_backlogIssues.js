function main(){
  var sheet = SpreadsheetApp.getActive().getSheetByName("Issues");

  // setting necessary item
  var url	=	"https://s-cubism.backlog.jp/";
  var apiKey = "aFf31EZzO1KxLvqRYtHrGaayV5md30I0j5ru5DHLW5EAZfvJYMKysYzERohrXFuo";
  var accessUri = "api/v2/users?";
  var uri = url + accessUri + "apiKey=" + apiKey;
  var options = {
    'method': 'get',
    'contentType': 'application/json',
  };
  var response = UrlFetchApp.fetch(url, options)

  sheet.getRange("A1").setValue(uri);
}
