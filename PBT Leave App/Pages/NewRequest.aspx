<%@ Page Language="C#" MasterPageFile="~masterurl/default.master" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <SharePoint:ScriptLink ID="ScriptLink1" Name="sp.ui.dialog.js" LoadAfterUI="true" Localizable="false" runat="server"></SharePoint:ScriptLink>
    <SharePoint:ScriptLink LoadAfterUI="true" runat="server" Name="datepicker.js" Localizable="false" Language="javascript" />
    <SharePoint:ScriptLink Name="clienttemplates.js" runat="server" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink Name="clientforms.js" runat="server" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink Name="clientpeoplepicker.js" runat="server" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink Name="autofill.js" runat="server" LoadAfterUI="true" Localizable="false" />

    <script type="text/javascript" src="../Scripts/jquery-2.1.4.js"></script>
    <script type="text/javascript" src="../Scripts/jquery-2.1.4.min.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.runtime.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.js"></script>
    <script type="text/javascript" src="//ajax.aspnetcdn.com/ajax/4.0/1/MicrosoftAjax.js"></script>
    <script type="text/javascript" src="../Scripts/peoplepicker.js"></script>
    <script type="text/javascript" src="../Scripts/peoplepicker.min.js"></script>
    <script type="text/javascript" src="../Scripts/App.js"></script>
    <script type="text/javascript" src="../Scripts/requests.js"></script>
    <script type="text/javascript" src="../Scripts/jquery.cookie.js"></script>

    <link rel="Stylesheet" type="text/css" href="../Content/bootstrap.css" />
    <link rel="stylesheet" type="text/css" href="../Content/App.css" />
    <link rel="Stylesheet" type="text/css" href="../Content/font-awesome.css" />
    <link rel="Stylesheet" type="text/css" href="../Content/font-awesome.min.css" />

    <script type="text/javascript">
        $(document).ready(function () {
            if (!window.FileReader) {
                alert('This browser does not support the FileReader API.');
            }
            $("#ctl00_PlaceHolderMain_fromDate_fromDateDate").value = "";
            $("#ctl00_PlaceHolderMain_todate_todateDate").value = "";
            window.setInterval(chkManager(), 2000);
            countRequests();
        });

    </script>
</asp:Content>

<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
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
                <li id="adminSection">Administration</li>
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
    <form class="form-horizontal">
        <fieldset class="fa fa-2x">

            <!-- Form Name -->
            <legend>New Leave Request</legend>

            <div id="hiddenDiv" style="opacity: 0"></div>

            <!-- Multiple Checkboxes (inline) -->
            <div class="form-group">
                <label class="col-md-4 control-label" for="cbOnbehalf">Are you submitting leave on behalf of another user?</label>
                <div class="col-md-4">
                    <label class="checkbox-inline" for="cbOnbehalf">
                        <input type="checkbox" name="cbOnbehalf" id="cbOnbehalf" checked="checked" onclick="check();" />
                        Yes/No
                    </label>
                </div>
            </div>

            <!-- Text input-->
            <div class="form-group">
                <label class="col-md-4 control-label" for="txtName">Name :</label>
                <div class="col-md-4">
                    <input id="txtName" name="txtName" type="text" placeholder="" class="form-control input-md" required="required" />
                </div>
            </div>

            <!-- Text input-->
            <div class="form-group">
                <label class="col-md-4 control-label" for="txtSurname">Surname :</label>
                <div class="col-md-4">
                    <input id="txtSurname" name="txtSurname" type="text" placeholder="" class="form-control input-md" required="required" onblur="chkManager();" />
                </div>
            </div>

            <!-- Text input-->
            <div class="form-group">
                <label class="col-md-4 control-label" for="txtSurname">Phone number where we can reach you :</label>
                <div class="col-md-4">
                    <input id="txtNumber" name="txtNumber" type="text" placeholder="" class="form-control input-md" required="required" onmouseenter="chkManager();" />
                </div>
            </div>
            
              <!-- Date Controls -->
            <div onmouseover="javascript:workDays();">
                <div class="form-group">
                    <div class="col-md-4">
                        <label class="col-md-4">Period</label>
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-md-4"></div>
                    <div class="col-md-4">
                        <label class="col-md-4 control-label">From :</label>
                        <SharePoint:DateTimeControl runat="server" ID="fromDate" DateOnly="true" UseTimeZoneAdjustment="false" TimeZoneID="1033" LocaleId="1033" DatePickerFrameUrl="../_layouts/15/iframe.aspx" />
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-md-4"></div>
                    <div class="col-md-4">
                        <label class="col-md-4 control-label">To :</label>
                        <SharePoint:DateTimeControl runat="server" ID="todate" DateOnly="true" UseTimeZoneAdjustment="false" LocaleId="1033" DatePickerFrameUrl="../_layouts/15/iframe.aspx" />
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-md-4"></div>
                    <div class="col-md-4">
                        <label class="col-md-4 control-label" style="width: 36%" for="workDays">Number of Work Days :</label>
                        <div id="workDays"></div>
                    </div>
                </div>
            </div>

            <!-- Text Input Manager (Autofilled) -->
            <div class="form-group">
                <label class="col-md-4 control-label" for="tbManager">Approval Manager</label>
                <div class="col-md-4">
                    <input type="text" id="tbManager" class="form-control input-md" disabled="disabled" placeholder="Generated Value..." />
                </div>
            </div>

            <!-- Select Leave Type -->
            <div class="form-group">
                <label class="col-md-4 control-label" for="selLeave">Type of Leave :</label>
                <div class="col-md-4">
                    <select id="selLeave" name="selLeave" class="form-control" onchange="hideShowNote();">
                        <option value="Annual Leave">Annual Leave</option>
                        <option value="Sick Leave">Sick Leave</option>
                        <option value="Study Leave">Study Leave</option>
                        <option value="Maternity Leave">Maternity Leave</option>
                        <option value="Family Responsibility Leave">Family Responsibility Leave</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            <!-- Reason for FR Leave -->
            <div id="FRLeave" class="form-group" style="display: none">
                <label class="col-md-4 control-label" for="FRLeave">Reason for Leave :</label>
                <div class="col-md-4">
                    <select id="leaveSelect" class="form-control">
                        <option value="childbirth">Birth of my child.</option>
                        <option value="childsick">My child is sick.</option>
                        <option value="death">Passing of spouse,life partner, parent, adoptive parent, grandparent, child, adopted child, grandchild or sibling</option>
                    </select>
                </div>
            </div>
            
            <!-- File Button.Hidden if not sick leave-->
            <div id="sckNote" class="col-md-4 control-label" style="padding: 10px 5px; width: 100%"></div>
            <div class="form-group" id="SickNote" style="display: none">
                <label class="col-md-4 control-label" for="getFile">Upload Sick Note</label>
                <div class="col-md-4">
                    <input id="getFile" name="getfile" type="file" />
                    <div id="progressBar" class="progress" style="margin-top: 2%; display: none">
                        <div id="barProgress" class="progress-bar" role="progressbar">
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <button class="btn btn-danger" id="btnUploadFile" name="btnUploadFile" type="button" onclick="javascript:uploadFile();">Upload file</button>
                </div>
            </div>
            
            <!-- Button -->
            <div class="form-group">
                <label class="col-md-4 control-label" for="btnSubmit"></label>
                <div class="col-md-4">
                    <button id="btnSubmit" onclick="validate();" name="btnSubmit" class="btn btn-primary" style="width: 25%; margin-left: 0;">Submit</button>
                </div>
            </div>

        </fieldset>
    </form>

</asp:Content>
