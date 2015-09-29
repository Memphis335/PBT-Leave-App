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
    <script type="text/javascript" src="/_layouts/15/SP.UI.Dialog.js"></script>
    <script type="text/javascript" src="//ajax.aspnetcdn.com/ajax/4.0/1/MicrosoftAjax.js"></script>
    <script type="text/javascript" src="../Scripts/peoplepicker.js"></script>
    <script type="text/javascript" src="../Scripts/peoplepicker.min.js"></script>
    <script type="text/javascript" src="../Scripts/App.js"></script>
    <script type="text/javascript" src="../Scripts/requests.js"></script>


    <link rel="Stylesheet" type="text/css" href="../Content/bootstrap.css" />
    <link rel="stylesheet" type="text/css" href="../Content/App.css" />
    <link rel="Stylesheet" type="text/css" href="../Content/font-awesome.css" />
    <link rel="Stylesheet" type="text/css" href="../Content/font-awesome.min.css" />

    <script type="text/javascript">
        $(document).ready(function () {
            $("#managerWho").spPeoplePicker();
            if (!window.FileReader) {
                alert('This browser does not support the FileReader API.');
            }
            var control = $("#ctl00_PlaceHolderMain_toDate_toDateDate");
            control.onchange = function(){workDays()};
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
                <li id="adminSection">Admin Section</li>
                <li><a href="../Lists/Admins/AllItems.aspx">Edit Admins</a></li>
                <li><a href="../Lists/LeaveBalances/AllItems.aspx">Add User</a></li>
                <li><a href="../Lists/Requests/AllItems.aspx">View All Requests</a></li>
            </ul>
        </ul>
    </div>
</asp:Content>

<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <form class="form-horizontal">
        <fieldset class="fa fa-2x">

            <!-- Form Name -->
            <legend>New Leave Request</legend>

            <!-- Multiple Checkboxes (inline) -->
            <div class="form-group">
                <label class="col-md-4 control-label" for="cbOnbehalf">Are you submitting leave on behalf of another user?</label>
                <div class="col-md-4">
                    <label class="checkbox-inline" for="cbOnbehalf">
                        <input type="checkbox" name="cbOnbehalf" id="cbOnbehalf" checked="" onclick="check();" />
                        Yes/No
                    </label>
                </div>
            </div>

            <!-- Text input-->
            <div class="form-group">
                <label class="col-md-4 control-label" for="txtName">Name :</label>
                <div class="col-md-4">
                    <input id="txtName" name="txtName" type="text" placeholder="" class="form-control input-md" required="required" value="" />
                </div>
            </div>

            <!-- Text input-->
            <div class="form-group">
                <label class="col-md-4 control-label" for="txtSurname">Surname :</label>
                <div class="col-md-4">
                    <input id="txtSurname" name="txtSurname" type="text" placeholder="" class="form-control input-md" required="required" value="" />
                </div>
            </div>
            <!-- Text input-->
            <div class="form-group">
                <label class="col-md-4 control-label" for="txtSurname">Phone number where we can reach you :</label>
                <div class="col-md-4">
                    <input id="txtNumber" name="txtNumber" type="text" placeholder="" class="form-control input-md" required="required" />
                </div>
            </div>

            <div class="form-group">
                <label class="col-md-4 control-label" for="managerWho">Approval Manager?</label>
                <div class="col-md-4">
                    <div class="input-md" id="managerWho">
                    </div>
                </div>
            </div>

            <!-- Select Basic -->
            <div class="form-group">
                <label class="col-md-4 control-label" for="selLeave">Type of Leave :</label>
                <div class="col-md-4">
                    <select id="selLeave" name="selLeave" class="form-control" onclick="hideShowNote();">
                        <option value="Annual Leave">Annual Leave</option>
                        <option value="Sick Leave">Sick Leave</option>
                        <option value="Study Leav">Study Leave</option>
                        <option value="Maternity Leave">Maternity Leave</option>
                        <option value="Family Responsibility Leave">Family Responsibility Leave</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            <!-- Date Controls -->
            <div class="form-group">
                <div class="col-md-4">
                    <label class="col-md-4">Period</label>
                </div>
            </div>
            <div class="form-group">
                <div class="col-md-4"></div>
                <div class="col-md-4">
                    <label class="col-md-4 control-label" for="fromDate">From :</label>
                    <SharePoint:DateTimeControl runat="server" ID="fromDate" DateOnly="true" UseTimeZoneAdjustment="false" TimeZoneId="1033" LocaleId="1033" DatePickerFrameUrl="../_layouts/15/iframe.aspx"/>
                </div>
            </div>
            <div class="form-group">
                <div class="col-md-4"></div>
                <div class="col-md-4">
                    <label class="col-md-4 control-label" for="toDate">To :</label>
                    <SharePoint:DateTimeControl runat="server" ID="DateTimeControl1" DateOnly="true" UseTimeZoneAdjustment="false" LocaleId="1033" DatePickerFrameUrl="../_layouts/15/iframe.aspx"/>
                </div>
            </div>
            <div class="form-group">
                <div class="col-md-4"></div>
                <div class="col-md-4">
                    <label class="col-md-4 control-label" style="width: 36%" for="workDays">Number of Work Days :</label>
                    <div id="workDays">6</div>
                </div>
            </div>

            <!-- File Button.Hidden if not sick leave-->
            <div class="form-group" id="SickNote" style="display: none">
                <label class="col-md-4 control-label" for="addFileButton">Upload Sick Note</label>
                <div class="col-md-4">
                    <input id="getFile" name="getfile" type="file" /><br />
                    <input id="displayName" name="displayName" type="text" placeholder="Enter a unique name" /><br />
                    <input id="addFileButton" name="addFileButton" type="button" value="Upload" onclick="uploadFile()" />
                </div>
            </div>

            <!-- Button -->
            <div class="form-group">
                <label class="col-md-4 control-label" for="btnSubmit"></label>
                <div class="col-md-4">
                    <button id="btnSubmit" onclick="requestLeave();" name="btnSubmit" class="btn btn-primary" style="width: 25%; margin-left: 0;">Submit</button>
                </div>
            </div>

        </fieldset>
    </form>

</asp:Content>
