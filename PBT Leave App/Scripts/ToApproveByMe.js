"use strict";

var ToApproveByMe = window.ToApproveByMe || {};
ToApproveByMe = function () {
    var b = function () {
        var e = "";
        $.ajax({
            url: appweburl + "/_api/contextinfo",
            method: "POST",
            async: false,
            headers: { Accept: "application/json; odata=verbose" },
            cache: false,
            success: function (f) { e = f.d.GetContextWebInformation.FormDigestValue },
            error: function (f, g, h) {
                alert(h)
            }
        });
        return e
    },
        c = function (g, f) {
            var i;
            var e = "RequestApproverId eq " + CurrentUser.Id + " and RequestStatus eq 'PendingApproval'";
            var h = appweburl + "/_vti_bin/ListData.svc/TravelRequests/?$filter=" + e + "&$inlinecount=allpages&$select=Id,RequesterName,Created,TripStartDate,TripEndDate,RequestStatus,TripPurpose,RequestTotalCost&$orderby=" + f.jtSorting.replace(" DESC", " desc").replace(" ASC", " asc") + "&$skip=" + f.jtStartIndex + "&$top=" + f.jtPageSize; return $.Deferred(function (j) { $.ajax({ url: h, type: "GET", headers: { accept: "application/json;odata=verbose" }, dataType: "json", data: g, cache: false, success: function (k) { i = { Result: "OK", Records: k.d.results, TotalRecordCount: k.d.__count }; j.resolve(i) }, error: function () { j.reject() } }) })
        }, d = function (g, f) { var i; var e = "SettlementApproverId eq " + CurrentUser.Id + " and IsSettlement eq true  and SettlementStatus eq 'PendingApproval'"; var h = appweburl + "/_vti_bin/ListData.svc/TravelRequests/?$filter=" + e + "&$inlinecount=allpages&$select=Id,RequesterName,Created,TripStartDate,TripEndDate,SettlementStatus,TripPurpose,SettlementTotalCost&$orderby=" + f.jtSorting.replace(" DESC", " desc").replace(" ASC", " asc") + "&$skip=" + f.jtStartIndex + "&$top=" + f.jtPageSize; return $.Deferred(function (j) { $.ajax({ url: h, type: "GET", headers: { accept: "application/json;odata=verbose" }, dataType: "json", data: g, cache: false, success: function (k) { i = { Result: "OK", Records: k.d.results, TotalRecordCount: k.d.__count }; j.resolve(i) }, error: function () { j.reject() } }) }) }, a = function (f) { var e = b(); var g; return $.Deferred(function (h) { $.ajax({ url: appweburl + "/_api/Web/lists/getbytitle('TravelRequests')/getItemByStringId('" + f + "')", async: true, type: "DELETE", headers: { accept: "application/json;odata=verbose", "X-RequestDigest": e, "IF-MATCH": "*" }, success: function (i) { g = { Result: "OK" }; h.resolve(g) }, error: function (k, i, j) { h.reject() } }) }) }; return { getPendingRequests: c, getPendingSettlements: d, deleteItem: a }
}();

$(document).ready(function() {
     $(function() {
          $("#PendingRequests").jtable({
              title: "Requests to approve",
              paging: true,
              pageSize: 10,
              sorting: true,
              multiSorting: true,
              defaultSorting: "Id desc",
              actions: { listAction: ToApproveByMe.getPendingRequests },
              fields: {
                   Id: {
                       key: true,
                       create: false,
                       edit: false,
                       list: true,
                       title: "ID",
                       width: "5%"
                   },
                   Created: {
                       title: "Created",
                       width: "10%",
                       display: function(a) {
                           var b = moment(a.record.Created);
                           if (b.isValid()) {
                               return b.format(commonDateFormat2);
                           }
                       }
                   }, TripStartDate: { title: "Trip Start", width: "10%", display: function (a) { var b = moment(a.record.TripStartDate); if (b.isValid()) { return b.format(commonDateFormat2) } } }, TripEndDate: { title: "Trip End", width: "10%", display: function (a) { var b = moment(a.record.TripEndDate); if (b.isValid()) { return b.format(commonDateFormat2) } } }, RequesterName: { title: "Requester Name", width: "15%" }, RequestTotalCost: { title: "Total Cost", width: "10%", sorting: false, }, TripPurpose: { title: "Trip Purpose", width: "35%", sorting: false, }, CustomViewAction: { title: "", listClass: "jtable-command-column", sorting: false, width: "1%", display: function (a) { return "<button title='View' onclick='location.href=\"RequestFormView.aspx?requestID=" + a.record.Id + "\"' class='jtable-command-button jtable-view-command-button'><span>View</span></button>" } }
              }
          });
         $("#PendingRequests").jtable("load");
     }); 
});