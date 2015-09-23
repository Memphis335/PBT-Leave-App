"use strict";

$.support.cors = true;
var commonDateFormat = "yy-mm-dd";
var commonDateFormat2 = "YYYY-MM-DD";
var commonDateFormatWithHour = "YYYY-MM-DD HH:mm";
var sharepointDateFormat = "YYYY-MM-DDTHH:mm:ssZZ";
var CurrentUser = {
    Name: "",
    Id: 0,
    Email: "",
    IsAdmin: false
};

var SystemSettings = {
    DefaultCurrencyNameName: "",
    OrganizationName: "",
    AppInitExecuted: "false"
};

var RequestStatusEnum = {
    Draft: { Name: "Draft", Value: "Draft" },
    PendingApproval: { Name: "Pending Approval", Value: "PendingApproval" },
    Rejected: { Name: "Rejected", Value: "Rejected" },
    Approved: { Name: "Approved", Value: "Approved" }
};

function getQueryStringParameter(c) {
    var b = window.location.search.substring(1);
    var e = b.split("&");
    for (var a = 0; a < e.length; a++) {
        var d = e[a].split("=");
        if (d[0] == c) {
            return d[1];
        }
    }
}

function addMessage(a, b) {
    $.notify(a, {
        globalPosition: "top left",
        className: b + " notifyjsCustom",
        clickToHide: true,
        autoHideDelay: 10000
    });
}

String.prototype.StripTags = function() {
    return this.replace(/<[^>]+>/ig, "").replace("null", "");
};

function getSettingValue(a, b) {
    var c = "";
    $.each(a, function () {
         if (this.EnumValue == b) {
             c = this.SettingValue;
             return;
         }
    });
    return c;
}

function HasAccessToRequest(b, a, c, d, f, e) {
     if (d) {
         return true;
     }
     if (f == RequestStatusEnum.Approved.Value && e == true) {
         return false;
     }
     if (b == c) {
         return true;
     }
     if (a != null && a == c) {
         return true;
     }
    return false;
}

function HasUserAdminRole(a) {
    var b = false;
    $.each(a, function() {
         if (this.Title == "TravelRequestAdmins") {
             b = true;
             return;
         }
    });
    return b;
}

function openPopupWindow(e, j, i, h, d) {
    var a = parseInt((window.screen.availWidth - i) / 2);
    var b = parseInt(((window.screen.availHeight - h) / 2) - 50);
    var c = " ,status=no, location=no, scrollbars=yes, resizable=no";
    var g = "width=" + i + ",height=" + h + ",left=" + a + ",top=" + b + c;
    var f = window.open(e, "travelrequestsystem", g);
    f.focus();
    return f;
}

var hostweburl = getQueryStringParameter("SPHostUrl");
var appweburl = getQueryStringParameter("SPAppWebUrl");
if (typeof hostweburl != "undefined" && appweburl != "undefined") {
    hostweburl = decodeURIComponent(hostweburl);
    appweburl = decodeURIComponent(appweburl);
    $.cookie("hostweburl", hostweburl, { expires: 365 });
    $.cookie("appweburl", appweburl, { expires: 365 });
}
else {
    hostweburl = $.cookie("hostweburl");
    appweburl = $.cookie("appweburl");
    if (typeof appweburl === "undefined") {
        location.href = "AuthError.aspx";
    }
}

$(document).ready(function() {
    $.ajax({
        url: appweburl + "/_api/web/currentUser?$expand=Groups",
        method: "GET",
        cache: false,
        async: false,
        headers: { Accept: "application/json; odata=verbose" },
        success: function(a) {
            CurrentUser.Name = a.d.Title;
            CurrentUser.Id = a.d.Id;
            CurrentUser.Email = a.d.Email;
            CurrentUser.LoginName = a.d.LoginName;
            $.ajax({
                url: appweburl + "/_vti_bin/ListData.svc/CustomUserRoles/?$filter=RoleName eq 'Admin' and UserId eq " + CurrentUser.Id,
                type: "GET",
                async: false,
                headers: { accept: "application/json;odata=verbose" },
                dataType: "json",
                cache: false,
                success: function(b) {
                    if (b.d.results.length > 0) {
                        CurrentUser.IsAdmin = true;
                    }
                }
            });
        }, error: function() {
            location.href = "AuthError.aspx";
            return;
        }
    });

    $.ajax({
        url: appweburl + "/_vti_bin/ListData.svc/Settings/?$select=EnumValue,SettingValue",
        type: "GET",
        async: false,
        headers: { accept: "application/json;odata=verbose" },
        dataType: "json",
        cache: false,
        success: function(a) {
            SystemSettings.DefaultCurrencyName = getSettingValue(a.d.results, "DefaultCurrencyName");
            SystemSettings.OrganizationName = getSettingValue(a.d.results, "OrganizationName");
            SystemSettings.AppInitExecuted = getSettingValue(a.d.results, "AppInitExecuted");
            if (SystemSettings.AppInitExecuted == "") {
                SystemSettings.AppInitExecuted = "false";
                CurrentUser.IsAdmin = true;
            }
        }, error: function () { SystemSettings.AppInitExecuted = "" }
    });

    $("#userWelcomeMsg").text("Welcome " + CurrentUser.Name);
    $("#containerLeft").loadTemplate("Shared/Menu.html");
    $("#previousSiteUrl").prop("href", hostweburl);
});