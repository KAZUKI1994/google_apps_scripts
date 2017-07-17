var ENDPOINT = "https://qiita.com/api/v1";

var ACCOUNT_LIST_ = {
  SHEET_NAME : "アカウント一覧",
  ROW_START: 3,
  COL_ACCOUNT: 2
};

/**
 * Writing Qiita Information to spreadsheet
**/
function qiitaInfoWriteToSpreadSheet(){
  var accountList = getQiitaAccountList();

  var values = [];
  var cnt = 1;

  for each(var val in accountList){
    var userinfo = getUserQiitaInfo(val);
    var uinflist = [];

    uinflist.push(cnt);
    uinflist.push(userinfo.account);
    uinflist.push(userinfo.status);
    uinflist.push(userinfo.items);
    uinflist.push(userinfo.follow_tags);
    uinflist.push(userinfo.following_users);
    uinflist.push(userinfo.following_users);
    uinflist.push(userinfo.organization);
    uinflist.push(userinfo.url);

    values.push(uinflist);
    cnt++;
  }

  var sheet = SpreadsheetApp.getActive().getSheetByName(ACCOUNT_LIST_.SHEET_NAME);
  var srange = sheet.getRange(ACCOUNT_LIST_.ROW_START, 1, values.length, uinflist.length);

  srange.setValues(values)
}

/**
 * return accountlist
**/
function getQiitaAccountList(){
  var spApp = SpreadsheetApp.getActive();
  var sheet = spApp.getSheetByName(ACCOUNT_LIST_.SHEET_NAME);
  var values = sheet.getDataRange().getValues();

  var accountListMap = {};

  for(var i = ACCOUNT_LIST_.ROW_START-1; i < values.length; i++){
    var val = values[i];

    var account = val[ACCOUNT_LIST_.COL_ACCOUNT-1];
    if(!account){
      continue;
    }
    if(accountListMap[account]){
      accountListMap[account].status = 'err:duplicate';
      continue;
    }

    return accountListMap;
  }
}
  /**
   * return qiita account information
   **/
function getUserQiitaInfo(accountMap){

 // getting specific user information
 var result = requestQiita('/users/' + accountMap.account, 'GET');

 if(result.parseError){
   accountMap.isError = true;
   accountMap.status += 'parseError';
   return accountMap;
 }

 if(result.body.error){
   accountMap.isError = true;
   accountMap.status += result.body.error;
   return accountMap;
 }

 // getting tag information which specific user follows
 var resultf = requestQiita('/users/' + accountMap.account + '/following_tags', 'GET');
 var rbody = resultf.body;

 var follow_tags = '';
 for each(var val in rbody){
   var follow_tags = follow_tags + ',' + val.name;
 }
 follow_tags = follow_tags.replace(/^,/,'');

 accountMap.status += ',normal';
 accountMap.items = result.body.items;
 accountMap.followers = result.body.followers;
 accountMap.following_users = result.body.following_users;
 accountMap.url = result.body.url;
 accountMap.organization = result.body.organization;
 accountMap.follow_tags = follow_tags;

 return accountMap;
}

 /**
  * request Qiita
  **/
function requestQiita(path, method){
  var url = ENDPOINT + path;

  var urlFetchOption = {
    'method': (method || 'get'),
    'contentType': 'application/json; charset=utf-8',
    'muteHttpExceptions': true
  };

  var response = UrlFetchApp.fetch(url, urlFetchOption);
  try{
    return{
      responseCode: response.getResponseCode(),
      rateLimit: {
        limit: response.getHeaders()['X-RateLimit-Limit'],
        remaining: response.getHeaders()['X-RateLimit-Remaining'],
      },
      parseError: false,
      body: JSON.parse(response.getContentText()),
      bodyText: response.getContentText()
    };
  }catch(e){
    return{
      responseCode: response.getResponseCode(),
      rateLimit: {
        limit : response.getHeaders()['X-RateLimit-Limit'],
        remaining : response.getHeaders()['X-RateLimit-Remaining'],
      },
      parseError: true,
      body: null,
      bodyText:  response.getContentText()
    };
  }
}
