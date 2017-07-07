function insertLastUpdated() {
   SpreadsheetApp.getActiveSheet()
     .getRange('G1')
     .setValue(
       '最終更新： ' + Utilities.formatDate(new Date(), 'JST', 'yyyy年MM月dd日HH時mm分ss秒') +
       'by' + Session.getActiveUser().getEmail()
     )
     .setFontColor('red');
}
