﻿//Function to check if leave is submitted on behalf of another user
function check() {
    var cbOnbehalf = $("#cbOnbehalf:checked").val();

    if (cbOnbehalf === "on") {
        $("#txtName").val("");
        $("#txtSurname").val("");
        $("#tbManager").val("");
        $("#txtName").attr("placeholder", "Enter username here");
        $("#txtSurname").attr("placeholder", "Enter surname here");
        $("#tbManager").attr("placeholder", "Waiting for input");
    } else {
        printName();
    }
}

function show() {
    var secApprover = $("#2ndApprover:checked").val();

    if (secApprover === "on") {
        $("#div2ndApprover").css("display", "inherit");
    } else {
        $("#div2ndApprover").css("display", "none");
    }
}
//Request Leave function
function requestLeave() {
    var context = new SP.ClientContext.get_current();

    //Get values from form
    var count = $("#hiddenDiv").text();
    var name = $("#txtName").val();
    var surname = $("#txtSurname").val();
    var number = $("#txtNumber").val().toString();
    var manager = $("#tbManager").val();
    var fromDate = $("#ctl00_PlaceHolderMain_fromDate_fromDateDate").val();
    var date = new Date(fromDate);
    date.setHours(date.getHours() + 22);
    var toDate = $("#ctl00_PlaceHolderMain_todate_todateDate").val();
    var dateTo = new Date(toDate);
    dateTo.setHours(dateTo.getHours() + 22);
    var selLeave = $("#selLeave").val();
    var frLeave = $("#leaveSelect").val();
    var cbOnbehalf = $("#cbOnbehalf:checked").val();
    var workDaysVar = $("#workDays").text();
    var secApprover = $("#2ndApprover").val();
    var secApproverName = $("#tb2ndApprover_TopSpan_ResolvedList").find("span.ms-entity-resolved").attr("title");


    alert(secApproverName);
    //Send values to Sharepoint list
    var oList = context.get_web().get_lists().getByTitle("Leave Requests");
    var itemCreateInfo = new SP.ListItemCreationInformation();
    this.oListItem = oList.addItem(itemCreateInfo);

    oListItem.set_item("Title", "Request #" + count);
    oListItem.set_item("Name1", name);
    oListItem.set_item("Surname", surname);
    oListItem.set_item("ReachableNumber", number);
    oListItem.set_item("Manager", SP.FieldUserValue.fromUser(manager));
    oListItem.set_item("From1", date);
    oListItem.set_item("To", dateTo);
    oListItem.set_item("TypeofLeave", selLeave);
    oListItem.set_item("Reason", frLeave);
    if (cbOnbehalf == "on") {
        cbOnbehalf = "True";
    } else {
        cbOnbehalf = "False";
    }
    oListItem.set_item("OnBehalf", cbOnbehalf);
    oListItem.set_item("WorkDays", workDaysVar);
    if (secApprover == "on") {
        secApprover = "True";
    } else {
        secApprover = "False";
    }
    oListItem.set_item("RequiresecondaryApproval", secApprover);
    oListItem.set_item("SecondaryApprover", SP.FieldUserValue.fromUser(secApproverName));

    oListItem.update();
    context.load(oListItem);
    context.executeQueryAsync(Function.createDelegate(this, this.onSubmitSucceeded), Function.createDelegate(this, this.onSubmitFailed));
}

function onSubmitSucceeded() {
    alert("Thank You!" + "\n" + "Your leave request has been submitted." + "\n" + "Request number : " + oListItem.get_id());
    window.location.href("../Pages/Default.aspx");
}

function onSubmitFailed(sender, args) {
    alert("Request failed to submit leave! " + args.get_message());
    window.location.href("../Pages/Default.aspx");
}

function uploadFile() {
    var name = $("#txtName").val();
    var count = $("#hiddenDiv").text();
    $("#progressBar").css("display", "inherit");
    $("#barProgress").css("width", "0");
    $("#barProgress").html("0%");


    var serverRelativeUrlToFolder = "Lists/Sicknotes";
    // Get test values from the file input and text input page controls.
    var fileInput = $("#getFile");
    var newName = name + count;

    // Get the server URL.
    var serverUrl = window._spPageContextInfo.webAbsoluteUrl;

    // Initiate method calls using jQuery promises.
    // Get the local file as an array buffer.
    function getFileBuffer() {
        var deferred = jQuery.Deferred();
        var reader = new FileReader();
        reader.onloadend = function (e) {
            deferred.resolve(e.target.result);
        }
        reader.onerror = function (e) {
            deferred.reject(e.target.error);
        }
        reader.readAsArrayBuffer(fileInput[0].files[0]);
        return deferred.promise();
    }

    var getFile = getFileBuffer();

    function addFileToFolder(arrayBuffer) {

        // Get the file name from the file input control on the page.
        var parts = fileInput[0].value.split('\\');
        var fileName = parts[parts.length - 1];

        // Construct the endpoint.
        var fileCollectionEndpoint = String.format(
            "{0}/_api/web/getfolderbyserverrelativeurl('{1}')/files" +
            "/add(overwrite=true, url='{2}')",
            serverUrl, serverRelativeUrlToFolder, fileName);

        // Send the request and return the response.
        // This call returns the SharePoint file.
        return jQuery.ajax({
            url: fileCollectionEndpoint,
            type: "POST",
            data: arrayBuffer,
            processData: false,
            headers: {
                "accept": "application/json;odata=verbose",
                "X-RequestDigest": jQuery("#__REQUESTDIGEST").val(),
                "content-length": arrayBuffer.byteLength
            }
        });
    }

    function getListItem(fileListItemUri) {

        // Send the request and return the response.
        return jQuery.ajax({
            url: fileListItemUri,
            type: "GET",
            headers: { "accept": "application/json;odata=verbose" }
        });
    }

    function updateListItem(itemMetadata) {

        // Define the list item changes. Use the FileLeafRef property to change the display name. 
        // For simplicity, also use the name as the title. 
        // The example gets the list item type from the item's metadata, but you can also get it from the
        // ListItemEntityTypeFullName property of the list.
        var body = String.format("{{'__metadata':{{'type':'{0}'}},'FileLeafRef':'{1}','Title':'{2}'}}",
            itemMetadata.type, newName, newName);

        // Send the request and return the promise.
        // This call does not return response content from the server.
        return jQuery.ajax({
            url: itemMetadata.uri,
            type: "POST",
            data: body,
            headers: {
                "X-RequestDigest": jQuery("#__REQUESTDIGEST").val(),
                "content-type": "application/json;odata=verbose",
                "content-length": body.length,
                "IF-MATCH": itemMetadata.etag,
                "X-HTTP-Method": "MERGE"
            }
        });
    }

    getFile.done(function (arrayBuffer) {
        $("#barProgress").css("width", "10%");
        $("#barProgress").html("10%");
        $("#barProgress").css("width", "20%");
        $("#barProgress").html("20%");
        // Add the file to the SharePoint folder.
        var addFile = addFileToFolder(arrayBuffer);
        addFile.done(function (file) {
            $("#barProgress").css("width", "30%");
            $("#barProgress").html("30%");

            // Get the list item that corresponds to the uploaded file.
            var getItem = getListItem(file.d.ListItemAllFields.__deferred.uri);
            $("#barProgress").css("width", "40%");
            $("#barProgress").html("40%");
            getItem.done(function (listItem) {
                $("#barProgress").css("width", "50%");
                $("#barProgress").html("50%");

                // Change the display name and title of the list item.
                var changeItem = updateListItem(listItem.d.__metadata);
                $("#barProgress").css("width", "60%");
                $("#barProgress").html("60%");

                changeItem.done(function () {
                    $("#barProgress").css("width", "80%");
                    $("#barProgress").html("80%");
                    $("#btnUploadFile").html("File Uploaded!");
                    $("#btnUploadFile").removeClass("btn btn-danger");
                    $("#btnUploadFile").addClass("btn btn-success");
                    $("#barProgress").css("width", "100%");
                    $("#barProgress").html("100%");
                    $("#btnSubmit").removeAttr("disabled");
                });
                changeItem.fail(onError);
            });
            getItem.fail(onError);
        });
        addFile.fail(onError);
    });
    getFile.fail(onError);
}

// Display error message for file upload.
function onError(error) {
    $("#barProgress").css("background-color", "firebrick");
    $("#barProgress").html("Error!");
    alert(error.responseText);
}

//Hide or show sicknote
function hideShowNote() {
    var selLeave = $("#selLeave").val();
    var days = $("#workDays").text();
    var dateFrom = $("#ctl00_PlaceHolderMain_fromDate_fromDateDate").val();
    var dateTo = $("#ctl00_PlaceHolderMain_todate_todateDate").val();
    var daysVal = 3;
    var sickLeaveVal = "Sick Leave";
    var frLeave = "Family Responsibility Leave";
    var currentDate = new Date(dateFrom);
    var lastDay = new Date(dateTo);

    if (selLeave === sickLeaveVal) {
        if (+days >= +daysVal) {
            $("#sckNote").html("***Sick leave of 3 days or more require a sick note from a registered doctor. Please upload your sicknote below.***");
            $("#SickNote").css("display", "inherit");
            $("#getFile").attr({ "required": "required" });
            $("#btnSubmit").attr("disabled", "disabled");
        } else {
            while (currentDate <= lastDay) {
                var weekDay = currentDate.getDay();
                console.log(weekDay);
                if (weekDay === 1 || weekDay === 5) {
                    $("#sckNote").html("***Sick leave on a Friday or Monday require a sick note from a registered doctor. Please upload your sicknote below.***");
                    $("#SickNote").css("display", "inherit");
                    $("#getFile").attr({ "required": "required" });
                    $("#btnSubmit").attr("disabled", "disabled");
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }
    } else {
        $("#SickNote").css("display", "none");
        $("#getFile").removeAttr("required");
        $("#sckNote").html("");
        $("#btnSubmit").removeAttr("disabled");
    }

    if (selLeave === frLeave) {
        $("#FRLeave").css("display", "inherit");
    } else {
        $("#FRLeave").css("display", "none");
    }
}

//Calculate amount of workdays
function workDays() {
    var dateFrom = $("#ctl00_PlaceHolderMain_fromDate_fromDateDate").val();
    var dateTo = $("#ctl00_PlaceHolderMain_todate_todateDate").val();

    if (dateFrom === "" || dateTo === "") {
        $("#ctl00_PlaceHolderMain_fromDate_fromDateDate").css("border-color", "red");
        $("#ctl00_PlaceHolderMain_todate_todateDate").css("border-color", "red");
    } else {
        $("#ctl00_PlaceHolderMain_fromDate_fromDateDate").css("border-color", "green");
        $("#ctl00_PlaceHolderMain_todate_todateDate").css("border-color", "green");

        function getWorkingDays(startDate, endDate) {
            var result = 0;

            var currentDate = new Date(startDate);
            var lastDay = new Date(endDate);
            while (currentDate <= lastDay) {
                var weekDay = currentDate.getDay();
                if (weekDay !== 0 && weekDay !== 6)
                    result++;
                currentDate.setDate(currentDate.getDate() + 1);
            }

            return result;
        }

        function getDateArray(startDate, endDate) {

            var dateArray = [],
                currentDate = new Date(startDate),
                lastDay = new Date(endDate);
            while (currentDate <= lastDay) {
                if (!(currentDate.getUTCDay() === 5 || currentDate.getUTCDay() === 6)) {
                    dateArray.push(new Date(currentDate));
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }
            return dateArray;
        }

        function getHolidaysToSub(data) {
            var array1 = [];
            array1.push.apply(array1, getDateArray(dateFrom, dateTo));
            var array2 = [];
            array2.push.apply(array2, data);
            var daysToSub = 0;
            for (var i = 0; i < array2.length; i++) {
                for (var j = 0; j < array1.length; j++) {
                    if (array1[j].getDate() === (array2[i]).getDate()) {
                        daysToSub++;
                    }
                }
            }
            return daysToSub;
        }


        var defaults = $.extend({
            calendarId: 'en.sa#holiday@group.v.calendar.google.com',
            apiKey: 'AIzaSyAFZiKbVRH13BFhOxU6LfM50TxTxMY8sOk',
            dateFormat: 'LongDate',
            errorMsg: 'No events in calendar',
            maxEvents: 50,
            futureEventsOnly: true,
            sortDescending: true
        });
        var feedUrl = 'https://www.googleapis.com/calendar/v3/calendars/' +
            encodeURIComponent(defaults.calendarId.trim()) + '/events?key=' + defaults.apiKey +
            '&orderBy=startTime&singleEvents=true';
        if (defaults.futureEventsOnly) {
            feedUrl += '&timeMin=' + new Date().toISOString() + '&timeMax=' + new Date(dateTo).toISOString();
        }

        $.ajax({
            url: feedUrl,
            dataType: 'json',
            success: function (response) {
                var holidayArray = [];
                for (var i = 0; i < response.items.length; i++) {
                    var daysToConvert = new Date(response.items[i].start.date);
                    daysToConvert.setHours(daysToConvert.getHours() - 2);
                    holidayArray.push(daysToConvert);
                }
                var testNum = getHolidaysToSub(holidayArray);
                var numOfWorkDays = getWorkingDays(dateFrom, dateTo);
                var dayDiff = numOfWorkDays - testNum;
                $("#workDays").text(dayDiff);
            },
            error: function () {
                alert("Error has occured while checking for holidays!" + '\n' + "Please notify IT.");
            }
        });
    }
}

//Function to check whether user is male or female
function checkMF() {
    var oList = context.get_web().get_lists().getByTitle("Leave Balances");
    var id = user.get_id();

    var camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml(
        '<View><Query><Where><Eq><FieldRef Name=\'User\' LookupId=\'True\'/>' +
        '<Value Type=\'Lookup\'>' + id + '</Value></Eq></Where></Query>' +
        '<RowLimit>10</RowLimit></View>'
    );
    this.ListItem = oList.getItems(camlQuery);

    context.load(ListItem);
    context.executeQueryAsync(
       Function.createDelegate(this, this.checkMFQuerySucceeded),
        Function.createDelegate(this, this.checkMFQueryFailed)
    );
}

function checkMFQuerySucceeded() {
    var listItemInfo = '';
    var listItemEnumerator = ListItem.getEnumerator();

    while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();
        listItemInfo += oListItem.get_item("Sex");
    }

    if (listItemInfo === "Female") {
        $("#maternBlock").css("display", "inherit");
    } else {
        $("#selLeave option[value='Maternity Leave']").remove();
    }
}

function checkMFQueryFailed(sender, args) {
    alert('Request failed to verify if this user is male or female. Error : ' + args.get_message() +
        '\n' + args.get_stackTrace());
}

function chkManager() {
    var name = $("#txtName").val();
    var surname = $("#txtSurname").val();
    var username = name.concat(" " + surname);

    var oList = context.get_web().get_lists().getByTitle("Managers");

    var camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml(
        '<View><Query><Where><Eq><FieldRef Name=\'User\'/>' +
        '<Value Type=\'User\'>' + username + '</Value></Eq></Where></Query>' +
        '<RowLimit>10</RowLimit></View>'
    );
    this.manListItem = oList.getItems(camlQuery);

    context.load(manListItem);
    context.executeQueryAsync(
       Function.createDelegate(this, this.checkManagerQuerySucceeded),
        Function.createDelegate(this, this.checkManagerQueryFailed)
    );
}

function checkManagerQuerySucceeded() {
    var listItemInfo = "";
    var manager = "";
    var listItemEnumerator = manListItem.getEnumerator();
    while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();
        listItemInfo = oListItem.get_item("BDM");
    }
    manager = listItemInfo.$4K_1;
    $("#tbManager").val(manager);
}

function checkManagerQueryFailed() {
    $("#tbManager").val("Error!");
}

function validate() {
    var workerNum = 0;
    var selLeave = $("#selLeave").val();
    var workDaysVar = $("#workDays").text();

    if (selLeave === "Annual Leave") {
        console.log("True");
        workerNum = annual;
        console.log(workDaysVar);
        console.log(annual);
    } else if (selLeave === "Sick Leave") {
        workerNum = sick;
    } else if (selLeave === "Study Leave") {
        workerNum = study;
    } else if (selLeave === "Maternity Leave") {
        workerNum = matern;
    } else if (selLeave === "Family Responsibility Leave") {
        workerNum = family;
    }

    if (+workerNum < +workDaysVar) {
        $("#selLeave").css("border-color", "red");
        $("#workDays").css("color", "red");
        alert("You do not have enough leave available for the type you are requesting. Please select another type or reduce your number of days!" + '\n'
            + "You only have " + workerNum + " days " + selLeave + " left.");
        return;
    } else {
        requestLeave();
    }
}

function displayLayover(url) {

    var options = SP.UI.$create_DialogOptions();

    options.url = url;

    options.dialogReturnValueCallback = Function.createDelegate(

    null, null);

    SP.UI.ModalDialog.showModalDialog(options);

}

function getLeaveRequests(name) {
    var username = name.split(" ", 1)[0];

    var oList = context.get_web().get_lists().getByTitle('Leave Requests');

    var query = new SP.CamlQuery();
    query.set_viewXml(
        '<View><Query><Where><Eq><FieldRef Name=\'Name1\'/>' +
        '<Value Type=\'Text\'>' + username + '</Value></Eq></Where></Query>' +
        '</View>'
        );
    this.items = oList.getItems(query);

    context.load(items);
    context.executeQueryAsync(
       Function.createDelegate(this, this.onQuerySuccess),
        Function.createDelegate(this, this.onQueryFail)
    );
}

function onQuerySuccess() {
    var title = "";
    var name = "";
    var surname = "";
    var number = "";
    var manager = "";
    var from = "";
    var to = "";
    var type = "";
    var requestedBy = "";
    var when = "";
    var status = "";
    var days = "";

    var table = $("#tblCustomListData");
    var tableData = "<thead><tr><th>Title</th><th>Name</th><th>Surname</th><th>Cell Number</th><th>Manager</th><th>From</th><th>To</th><th>Days</th><th>Leave Type</th><th>Requested By</th><th>When</th><th>Status</th></tr></thead>";

    var listEnumerator = items.getEnumerator();
    while (listEnumerator.moveNext()) {
        var oListItem = listEnumerator.get_current();
        title = oListItem.get_item("Title");
        name = oListItem.get_item("Name1");
        surname = oListItem.get_item("Surname");
        number = oListItem.get_item("ReachableNumber");
        manager = oListItem.get_item("Manager");
        from = new Date(oListItem.get_item("From1"));
        to = oListItem.get_item("To");
        type = oListItem.get_item("TypeofLeave");
        requestedBy = oListItem.get_item("Author");
        when = oListItem.get_item("Created");
        status = oListItem.get_item("Approved_x002f_Rejected");
        days = oListItem.get_item("WorkDays");

        var fromDate = from.toISOString().slice(0, 10).replace(/-/g, "-");
        var toDate = to.toISOString().slice(0, 10).replace(/-/g, "-");
        var reqWhen = when.toISOString().slice(0, 10).replace(/-/g, "-");

        tableData += "<tbody><tr><td>" + title + "</td><td>" + name + "</td><td>" + surname + "</td><td>" + number + "</td><td>" + manager.$4K_1 + "</td><td>" + fromDate + "</td><td>" + toDate + "</td><td>" + days + "</td><td>"
            + type + "</td><td>" + requestedBy.$4K_1 + "</td><td>" + reqWhen + "</td><td>" + status + "</td></tr></tbody>";
    }
    table.html(tableData);
}

function onQueryFail(sender, args) {
    alert("failed Message" + args.get_message());
}