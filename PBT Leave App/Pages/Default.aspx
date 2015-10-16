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
    <script type="text/javascript" src="../Scripts/App.js"></script>
    <script type="text/javascript" src="../Scripts/requests.js"></script>
    <script type="text/javascript" src="../Scripts/bootstrap.js"></script>
    <script type="text/javascript" src="../Scripts/bootstrap.min.js"></script>
    <meta name="WebPartPageExpansion" content="full" />

    <!-- CSS styles -->
    <link rel="Stylesheet" type="text/css" href="../Content/App.css" />

    <link rel="Stylesheet" type="text/css" href="../Content/metro-bootstrap.css" />
    <link rel="Stylesheet" type="text/css" href="../Content/font-awesome.css" />
    <link rel="Stylesheet" type="text/css" href="../Content/font-awesome.min.css" />

</asp:Content>

<%-- The markup in the following Content element will be placed in the TitleArea of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    <p class="fa fa-2x">PBT Leave Requests</p>
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
                <li><a href="../Lists/Admins/AllItems.aspx">Edit Admins</a></li>
                <li><a href="../Lists/LeaveBalances/AllItems.aspx">Add User</a></li>
                <li><a href="../Lists/Requests/AllItems.aspx">View All Requests</a></li>
            </ul>
        </ul>
    </div>
</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-4">
                <div class="thumbnail tile tile-wide tile-pbt">
                    <a href="NewRequest.aspx" class="fa-links">
                        <h1>Request Leave</h1>
                        <i class="fa fa-3x fa-plus"></i>
                    </a>
                </div>
            </div>
            <div class="col-md-4" id="manager">
                <div class="thumbnail tile tile-wide tile-pbt">
                    <a href="ToBeApprovedByMe.aspx" class="fa-links">
                        <h1>Approve/Reject</h1>
                        <i class="fa fa-3x fa-check"></i>
                    </a>
                </div>
            </div>
            <div class="col-md-4">
                <div class="thumbnail tile tile-wide tile-pbt">
                    <a href="Help.aspx" class="fa-links">
                        <h1>Help</h1>
                        <i class="fa fa-3x fa-hospital-o"></i>
                    </a>
                </div>
            </div>
        </div>
    </div>
    <div class="container-fluid" id="leaveBal">
        <div class="row-fluid" style="font-size: large;">
            <p id="message" class="fa"></p>
            <p>Your leave balances is as follow : </p>
            <div class="col-md-2">
                <div class="thumbnail tile tile-medium">
                    <h4>Annual Leave</h4>
                    <p id="annual" class="fa" style="text-align: center; margin-top: 20px; font-size: 30px;">
                    </p>
                </div>
            </div>
            <div class="col-md-2">
                <div class="thumbnail tile tile-medium">
                    <h4>Sick Leave</h4>
                    <p id="sick" class="fa" style="text-align: center; margin-top: 20px; font-size: 30px;">
                    </p>
                </div>
            </div>
            <div class="col-md-2">
                <div class="thumbnail tile tile-medium">
                    <h4>Study Leave</h4>
                    <p id="study" class="fa" style="text-align: center; margin-top: 20px; font-size: 30px;">
                    </p>
                </div>
            </div>
            <div id="maternBlock" class="col-md-2">
                <div class="thumbnail tile tile-medium">
                    <h4>Maternity Leave</h4>
                    <p id="matern" class="fa" style="text-align: center; margin-top: 20px; font-size: 30px;">
                    </p>
                </div>
            </div>
            <div class="col-md-2">
                <div class="thumbnail tile tile-medium">
                    <h4>Family Responsibility Leave</h4>
                    <p id="family" class="fa" style="text-align: center; margin-top: 10px; font-size: 30px;">
                    </p>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
