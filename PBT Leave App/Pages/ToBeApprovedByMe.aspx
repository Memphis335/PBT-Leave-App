<%@ Page language="C#" MasterPageFile="~masterurl/default.master" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<asp:Content ContentPlaceHolderId="PlaceHolderAdditionalPageHead" runat="server">
    <SharePoint:ScriptLink name="sp.js" runat="server" OnDemand="true" LoadAfterUI="true" Localizable="false" />
</asp:Content>

<asp:Content ContentPlaceHolderId="PlaceHolderMain" runat="server">
    <asp:WebPartZone runat="server" FrameType="TitleBarOnly" ID="full" Title="loc:full" />
</asp:Content>
/* Requires jQuery */

var Module = {} || Module;

Module.GetTasks = (function () {
    var pub = {},
        _userId,            //userID of current user
        _tasks = [],        //List of our tasks
        _options = {
            listName: "Tasks",                  //Name of list we want
            container: "#TaskListContainer",    //id of html element we're rendering our list of tasks in
        };

    //Module Initializer
    pub.init = function () {
        var clientContext = new SP.ClientContext.get_current();
        _userId = clientContext.get_web().get_currentUser();
        clientContext.load(_userId);
        clientContext.executeQueryAsync(getUserInfo, _onQueryFailed);
       
    };


    //Once we have our userId, we make Asyncronous call to get our list defined by _options.listName
    function getUserInfo() {
        _userId = _userId.get_id();

        getSpecifiedList(_options.listName, _userId);
    }

    //Makes a REST Call to grab a specified List with items assigned to the userId. Items must not have a status of 'Completed'
    function getSpecifiedList(listName, userId) {
        var url = _spPageContextInfo.webAbsoluteUrl + "/_api/lists/getbytitle('" + listName + "')/items?$filter=(AssignedTo eq '" + userId + "') and (Status ne 'Completed')";
        $.ajax({
            url: url,
            type: "GET",
            headers: {
                "accept": "application/json;odata=verbose",
            },
            success: function (results) { createTaskView(results, listName); },
            error: function (error) { 
                console.log("Error in getting List: " + listName); 
                $(_options.container).html("Error retrieving your " + listName + ".");
            }
        });
    }

    //Upon Receiving Task List data, we set as our module's _task list .
    //We then iterate through each task and add to a table which we then insert into our container defined in _options.container
    function createTaskView(results, listName) {
        _tasks = results.d.results;

        var table = $("<table style='width: 100%;'>" +
                            "<tr>" +
                                "<th>Title</th>" +
                                "<th>Due Date</th>" +
                                "<th>Status</th>" +
                            "</tr>" +
                      "</table>");
        $.each(_tasks, function (index, task) {
            var tr = '<tr>' +
                       '<td>' + task.Title + '</td>' +
                       '<td>' + new Date(item.DueDate).toLocaleDateString() + '</td>' +
                       '<td>' + task.Status + '</td>' +
                    '</tr>';
            table.append(tr);
        });
        $(_options.container).html(table);
    }

    function _onQueryFailed(sender, args) {
        alert('Request failed. \nError: ' + args.get_message() + '\nStackTrace: ' + args.get_stackTrace());
    }

    return pub;
}());

$(document).ready(function () {
    //must wait for SP scripts as we require them in our code
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function () {
        Module.GetTasks.init();
    });
});