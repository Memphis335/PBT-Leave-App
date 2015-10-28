<%-- The following 4 lines are ASP.NET directives needed when using SharePoint components --%>

<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~masterurl/default.master" Language="C#" %>

<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%-- The markup and script in the following Content element will be placed in the <head> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <script type="text/javascript" src="../Scripts/jquery-2.1.4.min.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.runtime.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.js"></script>
    <script type="text/javascript" src="/_layouts/15/SP.UI.Dialog.js"></script>
    <script type="text/javascript" src="/_layouts/15/SP.UI.Dialog.debug.js"></script>
    <meta name="WebPartPageExpansion" content="full" />

    <!-- CSS styles -->
    <link rel="Stylesheet" type="text/css" href="../Content/App.css" />
    <link rel="Stylesheet" type="text/css" href="../Content/metro-bootstrap.css" />
    <link rel="Stylesheet" type="text/css" href="../Content/font-awesome.css" />
    <link rel="Stylesheet" type="text/css" href="../Content/font-awesome.min.css" />

    <!-- Javascript -->
    <script type="text/javascript" src="../Scripts/App.js"></script>
    <script type="text/javascript" src="../Scripts/requests.js"></script>
    <script type="text/javascript" src="../Scripts/tasks.js"></script>
    <script type="text/javascript" src="../Scripts/bootstrap.js"></script>
    <script type="text/javascript" src="../Scripts/bootstrap.min.js"></script>

</asp:Content>

<%-- The markup in the following Content element will be placed in the TitleArea of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    <p class="fa fa-2x">To Approve By Me</p>
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
                <li id="adminSection">Admin Section</li>
                <li><a href="javascript:displayLayover('../Lists/Admins/NewForm.aspx?IsDlg=1')">Add Administrator</a></li>
                <li><a href="javascript:displayLayover('../Lists/LeaveBalances/NewForm.aspx?&IsDlg=1')">Add New User</a></li>
                <li><a href="../Lists/Managers/AllItems.aspx">Manage Managers</a></li>
                <li><a href="../Lists/Admins/AllItems.aspx">Manage Administrators</a></li>
                <li><a href="../Lists/LeaveBalances/AllItems.aspx">View All Users</a></li>
                <li><a href="../Lists/Requests/AllItems.aspx">View All Requests</a></li>
                <li><a href="../Lists/Sicknotes/Forms/AllItems.aspx">View Sicknotes</a></li>
            </ul>
        </ul>
    </div>
</asp:Content>

<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <div class="containerWrapper">
        <!--Main Content-->
        <div id="container-fluid" class="container-fluid">
            <div class="row-fluid" id="mainContainer" style="clear: both;">
                <div class="table table-hover" id="PendingRequests"></div>
            </div>
        </div>
    </div>
</asp:Content>
