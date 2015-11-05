var context = SP.ClientContext.get_current();
var user = context.get_web().get_currentUser();
var siteurl;
var hostweburl;
var sick = "";
var annual = "";
var study = "";
var matern = "";
var family = "";

// This code runs when the DOM is ready and creates a context object which is needed to use the SharePoint object model
$(document).ready(function () {
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function () {
        getUserName();
    });
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
    getCurrentAdmins();
    IsManager(username);
    getListItems(username);
    hideDiv(1);
    checkMF();
    $.cookie("Username", username);
    $.cookie("Visited", true, { expires: 5 });
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
    var inception = "";
    var id = "";
    var sex = "";
    var accrued = "";
    var deal = "";
    var sickLeave = "";

    var listItemEnumerator = items.getEnumerator();

    while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();
        annual = oListItem.get_item("AnnualLeave");
        accrued = oListItem.get_item("Accrued");
        sick = oListItem.get_item("SickLeave");
        study = oListItem.get_item("StudyLeave");
        matern = oListItem.get_item("MaternityLeave");
        family = oListItem.get_item("FamilyResponsibilityLeave");
        inception = oListItem.get_item("PBTInceptionDate");
        deal = oListItem.get_item("DaysDeal");
        sex = oListItem.get_item("Sex");
        sickLeave = oListItem.get_item("SickLeaveCounter");
        id = oListItem.get_id();
    }

    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    var inceptionDate = new Date(inception);
    var incDay = inceptionDate.getDate();
    var incMonth = inceptionDate.getMonth() + 1;
    var incYear = inceptionDate.getFullYear();
    var yearDiff = year - incYear;

    //Get username
    var username = user.get_title();

    //Check cookie
    var visit = $.cookie("Visited");
    if (!visit) {
        if (day === incDay) {
            accrueLeave(id, accrued);
            $.cookie("Username", username);
            $.cookie("Visited", true, { expires: 1 });
        }
    }

    if (!visit) {
        if (day === incDay && month === incMonth) {
            resetLeave(id, annual, yearDiff, sex, sick, deal, sickLeave);
        }
    }

    $("#annual").text(annual);
    $("#accrued").text(accrued);
    $("#sick").text(sick);
    $("#study").text(study);
    $("#matern").text(matern);
    $("#family").text(family);

    getLeaveRequests(username);
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

function resetLeave(id, num, year, sex, sick, deal, counter) {
    var resetList = context.get_web().get_lists().getByTitle("Leave Balances");

    var carryOver = num;
    var term = year;
    var maternityVal;
    var sickCarry;

    //Sick Leave Rule
    if (counter === +2) {
        sickCarry = sick;
        counter++;
    } else {
        sickCarry = 30;
        counter = +0;
    }

    //Annual Leave Rule
    if (deal == "Yes") {
        if (carryOver > 4) {
            carryOver = 24;
        } else carryOver = +20 + +num;
    } else {
        if (carryOver > 4) {
            carryOver = 19;
        } else carryOver = +15 + +num;
    }

    //Maternity Leave Rule
    if (sex == "Male") {
        maternityVal = 0;
    } else {
        maternityVal = 86.68;
    }

    this.oListItem = resetList.getItemById(id);
    oListItem.set_item("AnnualLeave", carryOver);
    oListItem.set_item("Accrued", 0);
    oListItem.set_item("SickLeave", sickCarry);
    oListItem.set_item("StudyLeave", 5);
    oListItem.set_item("MaternityLeave", maternityVal);
    oListItem.set_item("FamilyResponsibilityLeave", 3);
    oListItem.set_item("SickLeaveCounter", counter);

    oListItem.update();

    context.executeQueryAsync(
        Function.createDelegate(this, this.onResetQuerySucceeded),
        Function.createDelegate(this, this.onQueryFailed)
    );
}

function onResetQuerySucceeded() {
    alert("Your Leave balances has been reset!");
}

function accrueLeave(id, accrued) {
    var resetList = context.get_web().get_lists().getByTitle("Leave Balances");

    var numToInc = +accrued + +1.25;
    console.log(numToInc);

    this.oListItem = resetList.getItemById(id);
    oListItem.set_item("Accrued", numToInc);

    oListItem.update();

    context.executeQueryAsync(
        Function.createDelegate(this, this.onAccruedQuerySucceeded),
        Function.createDelegate(this, this.onQueryFailed)
    );
}

function onAccruedQuerySucceeded() {
    alert("Annual Leave accrued!");
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

function getCurrentAdmins() {

    var oList = context.get_web().get_lists().getByTitle('Administrators');
    var username = user.get_title();

    var camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml(
        '<View><Query><Where><Eq><FieldRef Name=\'Name1\'/>' +
        '<Value Type=\'User\'>' + username + '</Value></Eq></Where></Query>' +
        '</View>'
    );
    this.collListItem = oList.getItems(camlQuery);

    context.load(collListItem);
    context.executeQueryAsync(
       Function.createDelegate(this, this.onQuerySucceeded),
        Function.createDelegate(this, this.onAdminFailed)
    );
}

function onQuerySucceeded(sender, args) {
    var listItemInfo = '';
    var listItemEnumerator = collListItem.getEnumerator();

    while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();
        listItemInfo = oListItem.get_item("Name1");
    }

    var userTitle = listItemInfo.$4J_1;
    if (userTitle == user.get_title()) {
        $("#admin").css("display", "inherit");
    }
}

function onAdminFailed(sender, args) {
    alert('Request failed. ' + args.get_message() +
        '\n' + args.get_stackTrace());
}

function IsManager(username) {

    var oList = context.get_web().get_lists().getByTitle('Leave Balances');

    var camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml(
        '<View><Query><Where><Eq><FieldRef Name=\'User\'/>' +
        '<Value Type=\'User\'>' + username + '</Value></Eq></Where></Query>' +
        '</View>'
    );
    this.manItem = oList.getItems(camlQuery);

    context.load(manItem);
    context.executeQueryAsync(
       Function.createDelegate(this, this.ManagerQuerySucceeded),
        Function.createDelegate(this, this.ManagerQueryFailed)
    );
}

function ManagerQuerySucceeded(sender, args) {
    var listItemInfo = '';
    var listItemEnumerator = manItem.getEnumerator();

    while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();
        listItemInfo = oListItem.get_item("IsManager");
    }

    if (listItemInfo == "Yes") {
        $("#managerNav").css("display", "inherit");
        $("#manager").css("display", "inherit");
    }
}

function ManagerQueryFailed(sender, args) {
    alert('Request failed to verify if this user is a manager. Error : ' + args.get_message() +
        '\n' + args.get_stackTrace());
}

function hideDiv(val) {
    $("#leaveBal").css("opacity", val);
}

function printName() {
    var username = user.get_title();
    username.toString();
    var name = username.split(" ", 1)[0];
    var surname = username.split(" ")[1];
    document.getElementById("txtName").value = name;
    document.getElementById("txtSurname").value = surname;
    chkManager();
}

//function to count list items
function countRequests() {
    this.countList = context.get_web().get_lists().getByTitle('Leave Requests');

    context.load(countList);
    context.executeQueryAsync(
        Function.createDelegate(this, this.onQuerySucceededCount),
        Function.createDelegate(this, this.onQueryFailedcount)
    );
}

//Success function for Count
function onQuerySucceededCount(sender, args) {
    var count = 0;
    count = countList.get_itemCount();
    count++;
    $("#hiddenDiv").text(count);
}

//Failure for count
function onQueryFailedcount(sender, args) {
    alert('Count failed. ' + args.get_message() +
        '\n' + args.get_stackTrace());
}

function refreshTable() {
    var username = user.get_title();
    $("#tblCustomListData").load(getLeaveRequests(username));
}
