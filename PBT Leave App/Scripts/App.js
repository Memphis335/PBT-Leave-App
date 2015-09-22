var context = SP.ClientContext.get_current();
var user = context.get_web().get_currentUser();
var siteurl;
var hostweburl;

// This code runs when the DOM is ready and creates a context object which is needed to use the SharePoint object model
$(document).ready(function () {
    getUserName();
    getCurrentAdmins();
});

// This function prepares, loads, and then executes a SharePoint query to get the current users information
function getUserName() {
    context.load(user);
    context.executeQueryAsync(onGetUserNameSuccess, onGetUserNameFail);
}

// This function is executed if the above call is successful
// It replaces the contents of the 'message' element with the user name
function onGetUserNameSuccess() {
    var username = user.get_title();
    $('#message').text('Welcome ' + username);
    IsManager();
    getListItems(username);
    hideDiv(1);
}

// This function is executed if the above call fails
function onGetUserNameFail(sender, args) {
    alert('Failed to get user name. Error:' + args.get_message());
}

function getListItems(name) {
    var oList = context.get_web().get_lists().getByTitle('Leave Balances');

    var query = new SP.CamlQuery();
    query.set_viewXml(
        '<View><Query><Where><Eq><FieldRef Name=\'User\'/>' +
        '<Value Type=\'User\'>' + name + '</Value></Eq></Where></Query>' +
        '</View>'
        );
    this.items = oList.getItems(query);

    context.load(items);
    context.executeQueryAsync(
       Function.createDelegate(this, this.onQuerySucceededLeave), 
        Function.createDelegate(this, this.onQueryFailed)
    );
}

function onQuerySucceededLeave(sender, args) {
    var sick = '';
    var annual = '';
    var study = '';
    var matern = '';
    var family = '';

    var listItemEnumerator = items.getEnumerator();

    while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();
        annual = oListItem.get_item('AnnualLeave');
        sick = oListItem.get_item('SickLeave');
        study = oListItem.get_item('StudyLEave');
        matern = oListItem.get_item('MaternityLeave');
        family = oListItem.get_item('FamilyResponsibilityLeave');
    }

    $('#annual').text(annual);
    $('#sick').text(sick);
    $('#study').text(study);
    $('#matern').text(matern);
    $('#family').text(family);
    
}

function getQueryStringParameter(paramToRetrieve) {
    var params = document.URL.split("?").length > 1 ?
        document.URL.split("?")[1].split("&") : [];
    var strParams = "";
    for (var i = 0; i < params.length; i = i + 1) {
        var singleParam = params[i].split("=");
        if (singleParam[0] == paramToRetrieve)
            return singleParam[1];
    }
}
function processEmails() {
    var from = user.get_email();
    var to = 'lourens.marx@pbtgroup.co.za';
    var subject = $('#subject').val().toString();
    var body = $('#body').val().toString();

    sendEmail(from, to, body, subject);
}

function sendEmail(from, to, body, subject) {

    siteurl = _spPageContextInfo.webServerRelativeUrl;
    var urlTemplate = siteurl + "/_api/SP.Utilities.Utility.SendEmail";
    $.ajax({
        contentType: 'application/json',
        url: urlTemplate,
        type: "POST",
        data: JSON.stringify({
            'properties': {
                '__metadata': { 'type': 'SP.Utilities.EmailProperties' },
                'From': from,
                'To': { 'results': [to] },
                'Body': body,
                'Subject': subject
            }
        }
      ),
        headers: {
            "Accept": "application/json;odata=verbose",
            "content-type": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val()
        },
        success: function (data) {
            console.log('success');
        },
        error: function (err) {
            console.log(JSON.stringify(err));
        }
    });
}

function sickNote() {
    alert("Applications in respect of sick leave of three days or more must be accompanied by a " +
        "medical certificate issued by a registered medical practitioner");
}

function workDays(start, end) {

    // The number of milliseconds in one day
    var ONE_DAY = 1000 * 60 * 60 * 24;

    // Convert both dates to milliseconds
    var start_ms = start.getTime();
    var end_ms = end.getTime();

    // Calculate the difference in milliseconds
    var difference_ms = Math.abs(start_ms - end_ms);

    // Convert back to days and return
    $('#daysMaternity').text(Math.floor(difference_ms / ONE_DAY));

}

function getCurrentAdmins() {

    var oList = context.get_web().get_lists().getByTitle('Administrators');

    var camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml(
        '<View><Query><Where><Geq><FieldRef Name=\'ID\'/>' +
        '<Value Type=\'Number\'>1</Value></Geq></Where></Query>' +
        '<RowLimit>10</RowLimit></View>'
    );
    this.collListItem = oList.getItems(camlQuery);

    context.load(collListItem);
    context.executeQueryAsync(
       Function.createDelegate(this, this.onQuerySucceeded),
        Function.createDelegate(this, this.onQueryFailed)
    );
}

function onQuerySucceeded(sender, args) {
    var listItemInfo = '';
    var listItemEnumerator = collListItem.getEnumerator();

    while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();
        listItemInfo += oListItem.get_item('Title');
    }

    if (listItemInfo == user.get_title()) {
        document.getElementById('admin').style.display = 'initial';
    }
}

function onQueryFailed(sender, args) {
    alert('Request failed. ' + args.get_message() +
        '\n' + args.get_stackTrace());
}

function IsManager() {

    var oList = context.get_web().get_lists().getByTitle('Leave Balances');

    var camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml(
        '<View><Query><Where><Eq><FieldRef Name=\'ID\'/>' +
        '<Value Type=\'Number\'>1</Value></Eq></Where></Query>' +
        '<RowLimit>10</RowLimit></View>'
    );
    this.ListItem = oList.getItems(camlQuery);

    context.load(ListItem);
    context.executeQueryAsync(
       Function.createDelegate(this, this.ManagerQuerySucceeded),
        Function.createDelegate(this, this.ManagerQueryFailed)
    );
}

function ManagerQuerySucceeded(sender, args) {
    var listItemInfo = '';
    var listItemEnumerator = ListItem.getEnumerator();

    while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();
        listItemInfo += oListItem.get_item("IsManager");
    }
    
    if (listItemInfo == "Yes") {
        document.getElementById("managerNav").style.display = "inherit";
        document.getElementById("manager").style.display = "initial";
    }
}

function ManagerQueryFailed(sender, args) {
    alert('Request failed. ' + args.get_message() +
        '\n' + args.get_stackTrace());
}

function hideDiv(val) {
    document.getElementById("leaveBal").style.opacity = 1;
}

function printName() {
    var username = user.get_title();
    username.toString();
    var name = username.split(" ", 1)[0];
    var surname = username.split(" ")[1];
    document.getElementById("txtName").value = name;
    document.getElementById("txtSurname").value = surname;
}
