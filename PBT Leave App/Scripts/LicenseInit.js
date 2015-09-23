"use strict";
var LicenseInit = window.LicenseInit || {};
LicenseInit = function() {
     var b = function() {
         var d = "";
         $.ajax({
             url: appweburl + "/_api/contextinfo",
             method: "POST",
             async: false,
             headers: { Accept: "application/json; odata=verbose" },
             cache: false,
             success: function(e) {
                 d = e.d.GetContextWebInformation.FormDigestValue;
             },
             error: function (e, f, g) { alert(g) }
         });
             return d;
         }, c = function() {
             var d;
             var e = "$select=ID,TrialStartDate,ActivationKey,IsInitialized,IsValid";
             $.ajax({
                 url: appweburl + "/_api/Web/lists/getbytitle('Licenses')/items?" + e,
                 type: "GET",
                 async: false,
                 cache: false,
                 headers: { accept: "application/json;odata=verbose" },
                 dataType: "json",
                 success: function (f) { d = f.d.results[0] },
                 error: function (h, f, g) { alert(g) }
             });
                return d;
            }, a = function(d) {
                var e = b();
                   $.ajax({
                       url: appweburl + "/_api/Web/lists/getbytitle('Licenses')/items",
                       contentType: "application/json; odata=verbose",
                       async: false,
                       type: "POST",
                       data: JSON.stringify({
                           __metadata: { type: "SP.Data.LicensesListItem" },
                           Title: "",
                           TrialStartDate: moment(d).format(sharepointDateFormat),
                           ActivationKey: "",
                           IsInitialized: true,
                           IsValid: false
                       }),
                       headers: { accept: "application/json;odata=verbose", "x-requestforceauthentication": true, "X-RequestDigest": e }
                   });
               }; return { getLicense: c, getFormDigestValue: b, createLicenseEntry: a }
}();

$(document).ready(function() {
    var c = LicenseInit.getLicense();
    if (c == null) {
        var a = new Date();
        var b = LicenseInit.getFormDigestValue();
        $.ajax({
            url: appweburl + "/_api/Web/lists/getbytitle('Settings')/getItemByStringId('1')",
            type: "POST",
            async: false,
            contentType: "application/json;odata=verbose",
            data: JSON.stringify({
                __metadata: { type: "SP.Data.SettingsListItem" },
                Hidden: "true"
            }),
            headers: {
                accept: "application/json;odata=verbose",
                "X-RequestDigest": b,
                "X-Http-Method": "PATCH",
                "IF-MATCH": "*"
            },
            success: function(d) {
                $.ajax({
                    url: appweburl + "/_api/web/lists/getbytitle('Settings')/Items?$select=Modified&$filter=Id eq 1",
                    type: "GET",
                    async: false,
                    cache: false,
                    headers: { accept: "application/json;odata=verbose" },
                    dataType: "json",
                    success: function(e) {
                        if (e.d.results.length > 0) {
                            a = moment(e.d.results[0].Modified);
                        }
                    }
                });
            }
        });
        LicenseInit.createLicenseEntry(a);
    }
});