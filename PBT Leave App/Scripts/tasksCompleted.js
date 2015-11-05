/* Requires jQuery */

var Module = {} || Module;

Module.GetTasks = (function (varStatus) {
    var pub = {},
        user,            //userID of current user
        tasks = [],        //List of our tasks
        options = {
            listName: "WorkflowTaskList",                  //Name of list we want
            container: "#CompletedRequests"    //id of html element we're rendering our list of tasks in
        };

    //Module Initializer
    pub.init = function () {
        var clientContext = new SP.ClientContext.get_current();
        user = clientContext.get_web().get_currentUser();
        clientContext.load(user);
        clientContext.executeQueryAsync(getUserInfo, _onQueryFailed);
    };


    //Once we have our userId, we make Asyncronous call to get our list defined by _options.listName
    function getUserInfo() {
        user = user.get_id();

        getSpecifiedList(options.listName, user);
    }

    //Makes a REST Call to grab a specified List with items assigned to the userId. Items must not have a status of 'Completed'
    function getSpecifiedList(listName, userId) {
        var url = _spPageContextInfo.webAbsoluteUrl + "/_api/lists/getbytitle('" + listName + "')/items?$filter=(AssignedTo eq '" + userId + "') and (Status ne 'Not Started')";
        $.ajax({
            url: url,
            type: "GET",
            headers: {
                "accept": "application/json;odata=verbose"
            },
            success: function (results) { createTaskView(results, listName); },
            error: function (error) {  
                $(options.container).html("Error retrieving your " + listName + ".");
            }
        });
    }

    //Upon Receiving Task List data, we set as our module's _task list .
    //We then iterate through each task and add to a table which we then insert into our container defined in _options.container
    function createTaskView(results, listName) {
        tasks = results.d.results;
        var url = "https://pbtgroupza-274e8fa5793687.sharepoint.com/sites/Develop/PBTLeaveApp/Lists/WorkflowTaskList/EditForm.aspx?ID=";
        var table = $("<table style='width: 100%;'>" +
                            "<tr>" +
                                "<th>Title</th>" +
                                "<th>Due Date</th>" +
                                "<th>Created</th>" +
                                "<th>Status</th>" +
                                "<th>Approve/Reject</th>" +
                            "</tr>" +
                      "</table>");
        $.each(tasks, function (index, task) {
            var tr = '<tr>' +
                '<td>' + task.Title + '</td>' +
                '<td>' + new Date(task.DueDate).toLocaleDateString() + '</td>' +
                       '<td>' + new Date(task.Created).toLocaleDateString() + '</td>' +
                       '<td>' + task.Status + '</td>' +
                       '<td><a href='+ url + task.ID + '>Go to item</a></td>' +
                    '</tr>';
            table.append(tr);
        });
        $(options.container).html(table);
    }

    function _onQueryFailed(sender, args) {
        alert('Request failed. \nError: ' + args.get_message() + '\nStackTrace: ' + args.get_stackTrace());
    }

    return pub;
}());

$(document).ready(function () {
    //must wait for SP scripts as we require them in our code
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function () {
        //Module.GetTasks.init();
    });
});
