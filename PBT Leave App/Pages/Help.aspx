<%@ Page Language="C#" MasterPageFile="~masterurl/default.master" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <script type="text/javascript" src="../Scripts/jquery-2.1.4.min.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.runtime.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.js"></script>

    <!-- Add your CSS styles to the following file -->
    <link rel="stylesheet" type="text/css" href="../Content/bootstrap.css" />
    <link rel="stylesheet" type="text/css" href="../Content/font-awesome.css" />
    <link rel="stylesheet" type="text/css" href="../Content/font-awesome.min.css" />
    <link rel="stylesheet" type="text/css" href="../Content/App.css"/> 

    <!-- Add your JavaScript to the following file -->
    <script type="text/javascript" src="../Scripts/App.js"></script>
    <script type="text/javascript" src="../Scripts/requests.js"></script>
    <script type="text/javascript" src="../Scripts/bootstrap.js"></script>
</asp:Content>

<%-- The markup in the following Content element will be placed in the TitleArea of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    Help
</asp:Content>

<asp:Content ContentPlaceHolderID="PlaceHolderLeftNavBar" runat="server">
    <div class="navbar-side">
        <ul class="nav nav-pills nav-stacked">
            <li><a href="Default.aspx">Home</a></li>
            <li><a href="NewRequest.aspx">Request Leave</a></li>
            <li><a id="managerNav" href="ToBeApprovedByMe.aspx">Approve/Reject</a></li>
            <li><a href="Help.aspx">Help</a></li>
            <ul id="admin" class="nav nav-stacked nav-pills">
                <li class="nav-divider"></li>
                <li  id="adminSection"><strong>Admin Section</strong></li>
                <li><a href="javascript:displayLayover('../Lists/Admins/NewForm.aspx?IsDlg=1')">Add Administrator</a></li>
                <li><a href="javascript:displayLayover('../Lists/LeaveBalances/NewForm.aspx?&IsDlg=1')">Add New User</a></li>
                <li><a href="../Lists/Managers/AllItems.aspx">Manage Managers</a></li>
                <li><a href="../Lists/Admins/AllItems.aspx">Manage Administrators</a></li>
                <li><a href="../Lists/LeaveBalances/AllItems.aspx">View All Users</a></li>
                <li><a href="../Lists/Requests/AllItems.aspx">View All Requests</a></li>
            </ul>
        </ul>
    </div>
</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <!--Body -->
    <div class="container-fluid">
        <form>
            <fieldset class="form-group">
                <p>Please use the form below to report any issues that you may find. Please include as much information as possible.</p>
                <label for="subject" class="fa">Subject:</label>
                <input type="text" class="form-control" id="subject" placeholder="Enter subject" />
            </fieldset>
            <fieldset class="form-group">
                <label for="body" class="fa">Message:</label>
                <textarea class="form-control" id="body" rows="6"></textarea>
            </fieldset>
        </form>
        <button type="submit" class="btn btn-primary" style="width: 25%" onclick="processEmails(body,subject)">Submit</button>
    </div>
</asp:Content>
