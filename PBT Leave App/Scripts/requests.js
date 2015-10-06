﻿function check() {
    var cbOnbehalf = $("#cbOnbehalf:checked").val();

    if (cbOnbehalf == "on") {
        document.getElementById("txtName").value = "";
        document.getElementById("txtSurname").value = "";
    } else {
        printName();
    }
}

function requestLeave() {
    var context = new SP.ClientContext.get_current();
    var user = context.get_web().get_currentUser();

    //Get values from form
    var count = 0;
    var name = $("#txtName").val();
    var surname = $("#txtSurname").val();
    var number = $("#txtNumber").val().toString();
    var managerWho = $("#managerWho_TopSpan_ResolvedList").find("span.ms-entity-resolved").attr("title");
    var fromDate = $("#ctl00_PlaceHolderMain_fromDate_fromDateDate").val();
    var date = new Date(fromDate);
    date.setHours(date.getHours() + 22);
    var toDate = $("#ctl00_PlaceHolderMain_todate_todateDate").val();
    var dateTo = new Date(toDate);
    dateTo.setHours(dateTo.getHours() + 22);
    var selLeave = $("#selLeave").val();
    var cbOnbehalf = $("#cbOnbehalf:checked").val();

    //Send values to Sharepoint list
    var oList = context.get_web().get_lists().getByTitle("Leave Requests");
    var itemCreateInfo = new SP.ListItemCreationInformation();
    this.oListItem = oList.addItem(itemCreateInfo);
    count++;
    oListItem.set_item("Title", "Request #" + count);
    oListItem.set_item("Name1", name);
    oListItem.set_item("Surname", surname);
    oListItem.set_item("ReachableNumber", number);
    oListItem.set_item("Manager", SP.FieldUserValue.fromUser(managerWho));
    oListItem.set_item("From1", date);
    oListItem.set_item("To", dateTo);
    oListItem.set_item("TypeofLeave", selLeave);
    if (cbOnbehalf == "on") {
        cbOnbehalf = "Yes";
    } else {
        cbOnbehalf = "No";
    }
    oListItem.set_item("OnBehalf", cbOnbehalf);

    oListItem.update();
    context.load(oListItem);
    context.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceeded), Function.createDelegate(this, this.onQueryFailed));
}

function onQuerySucceeded() {
        alert("Thank You!" + "\n" + "Your leave request has been submitted." + "\n" + "Request number : " + oListItem.get_id());
    }

    function onQueryFailed(sender, args) {
        alert("Request failed to submit leave! " + args.get_message() + "\n" + args.get_stackTrace());
    }

function uploadFile() {
 
    // Define the folder path for this example.
    var serverRelativeUrlToFolder = "Lists/Sicknotes";
    // Get test values from the file input and text input page controls.
    var fileInput = $("#getFile");
    var newName = oListItem.get_id();

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

        // Add the file to the SharePoint folder.
        var addFile = addFileToFolder(arrayBuffer);
        addFile.done(function (file, status, xhr) {

            // Get the list item that corresponds to the uploaded file.
            var getItem = getListItem(file.d.ListItemAllFields.__deferred.uri);
            getItem.done(function (listItem, status, xhr) {

                // Change the display name and title of the list item.
                var changeItem = updateListItem(listItem.d.__metadata);
                changeItem.done(function (data, status, xhr) {
                    alert('Sicknote uploaded');
                });
                changeItem.fail(onError);
            });
            getItem.fail(onError);
        });
        addFile.fail(onError);
    });
    getFile.fail(onError);
}

// Display error messages. 
function onError(error) {
    alert(error.responseText);
}

function hideShowNote() {
    var selLeave = $("#selLeave").val();
    var sickLeaveVal = "Sick Leave";
    if (selLeave == sickLeaveVal) {
        $("#SickNote").css("display", "inherit");
        $("#getFile").attr({ "required": "required"});
    } else {
        $("#SickNote").css("display", "none");
        $("#getFile").removeAttr("required");
    }
}

function workDays() {
    var dateFrom = $("#ctl00_PlaceHolderMain_fromDate_fromDateDate").val();
    var dateTo = $("#ctl00_PlaceHolderMain_todate_todateDate").val();

    function getWorkingDays(startDate, endDate) {
        var result = 0;

        var currentDate = new Date(startDate);
        var lastDay = new Date(endDate);
        while (currentDate <= lastDay) {
            var weekDay = currentDate.getDay();
            if (weekDay != 0 && weekDay != 6)
                result++;
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return result;
    }

    function getDateArray(startDate, endDate) {

        var dateArray = new Array(),
        currentDate = new Date(startDate),
        lastDay = new Date(endDate);
        while (currentDate <= lastDay) {
            if (!(currentDate.getUTCDay() == 5 || currentDate.getUTCDay() == 6)) {
                dateArray.push(new Date(currentDate));
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dateArray;
    }

    function holidays() {
        var defaults = $.extend({
            calendarId: 'en.sa#holiday@group.v.calendar.google.com',
            apiKey: 'AIzaSyAFZiKbVRH13BFhOxU6LfM50TxTxMY8sOk',
            dateFormat: 'LongDate',
            errorMsg: 'No events in calendar',
            maxEvents: 50,
            futureEventsOnly: true,
            sortDescending: true
        });
        var holidayArray = new Array();

        var s = '';
        var feedUrl = 'https://www.googleapis.com/calendar/v3/calendars/' +
          encodeURIComponent(defaults.calendarId.trim()) + '/events?key=' + defaults.apiKey +
          '&orderBy=startTime&singleEvents=true';
        if (defaults.futureEventsOnly) {
            feedUrl += '&timeMin=' + new Date().toISOString();
        }

        $.ajax({
            url: feedUrl,
            dataType: 'json',
            success: function (response) {
                for (var i = 0; i < response.items.length; i++) {
                    var daysToConvert = new Date(response.items[i].start.date);
                    daysToConvert.toUTCString();
                    holidayArray.push(daysToConvert);
                }
            },
            error: function (response) {
                alert("Error has occured while checking for holidays!" + '\n' + "Please notify IT.");
            }
        });
        return holidayArray;
    }

    function getHolidaysToSub() {
        var array1 = new Array();
        array1.push.apply(array1, getDateArray(dateFrom, dateTo));
        var array2 = new Array();
        array2.push.apply(array2, holidays());
        var daysToSub = 0;
        console.log(array1);
        console.log(array2);
        for (var i = 0; i < array2.length; i++) {
            for (var j = 0; j < array1.length; j++) {
                if (array1[i] == array2[j]) {
                    daysToSub++;
                }
            }
        }
        console.log("Days to Subtract");
        console.log(daysToSub);
        return daysToSub;
    }

    var dayDiff = getWorkingDays(dateFrom, dateTo) - getHolidaysToSub();
    $("#workDays").text(dayDiff);
}
