var secret = 'YourSecretKey';
var databasePath = 'https://Your-Project-Name.firebaseio.com/';

var testName;
var programName;
var year;

function getFirebaseUrl(jsonPath) {
    /*
    We then make a URL builder
    This takes in a path, and
    returns a URL that updates the data in that path
    */
    return databasePath + jsonPath + '.json?auth=' + secret
}

function syncMasterSheet(data) {
    /*
    We make a PUT (update) request,
    and send a JSON payload
    More info on the REST API here : https://firebase.google.com/docs/database/rest/start
    */
    var options = {
        method: 'put',
        contentType: 'application/json',
        payload: JSON.stringify(data)
    };
    var fireBaseUrl = getFirebaseUrl('tests/' + testName + ' ' + programName + ' ' + year);

    /*
    We use the UrlFetchApp google scripts module
    More info on this here : https://developers.google.com/apps-script/reference/url-fetch/url-fetch-app
    */
    UrlFetchApp.fetch(fireBaseUrl, options);
}

function writeDataToFirebase() {
    var sheet = SpreadsheetApp.getActiveSheet();
    var data = sheet.getDataRange().getValues();
    var dataToImport = {};

    testName = data[51][0];
    programName = data[51][1];
    year = data[51][2];

    var d = new Date();
    var ms = d.getTime();

    dataToImport["done"] = false;
    dataToImport["timestamp"] = ms;

    // Start at one to skip the first row
    //
    var questionCount = 0;
    for(var i = 1; i < 50; i++) {
        if (data[i][0] !== '') {
            questionCount++;
            var choiceA = data[i][0];
            var choiceB = data[i][1];
            var choiceC = data[i][2];
            var choiceD = data[i][3];
            var choiceE = data[i][4];
            var choiceF = data[i][5];
            var done = false;

            dataToImport[i] = {
                a: choiceA,
                b: choiceB,
                c: choiceC,
                d: choiceD,
                e: choiceE,
                f: choiceF,
                done: done,
            };
        }
    }
    // i should be the last non-empty row number
    //
    dataToImport["numberOfQuestions"] = questionCount;
    syncMasterSheet(dataToImport);
}

