"use strict";

var Default = window.Default || {};
Default = function() {
     var a = function(d, c) {
         var f;
         var g = moment().subtract(14, "days").format(commonDateFormat2);
         var b = "CreatedById eq " + CurrentUser.Id + " and ((RequestStatus eq 'Draft' or RequestStatus eq 'PendingApproval' or SettlementStatus eq 'Draft' or SettlementStatus eq 'PendingApproval' ) or  (Created ge datetime'" + g + "T00%3a00%3a00')   )";
         var e = appweburl + "/_vti_bin/ListData.svc/TravelRequests/?$filter=" + b + "&$inlinecount=allpages&$select=Id,TripStartDate,TripEndDate,RequestStatus,SettlementStatus, IsSettlement, TripPurpose&$expand=RequestApprover&$orderby=" + c.jtSorting.replace(" DESC", " desc").replace(" ASC", " asc") + "&$skip=" + c.jtStartIndex + "&$top=" + c.jtPageSize;
         return $.Deferred(function(h) {
             $.ajax({
                 url: e,
                 type: "GET",
                 headers: { accept: "application/json;odata=verbose" },
                 dataType: "json",
                 data: d,
                 cache: false,
                 success: function(i) {
                     f = {
                         Result: "OK",
                         Records: i.d.results,
                         TotalRecordCount: i.d.__count
                     };
                     h.resolve(f);
                 },
                 error: function() { h.reject() }
             });
         });
     }; return { getListData: a }
}();

$(function() {
    $("#PendingRequests").jtable({
        title: "My current items",
        paging: true,
        pageSize: 10,
        sorting: true,
        gotoPageArea: "none",
        multiSorting: false,
        defaultSorting: "TripStartDate desc",
        actions: { listAction: Default.getListData },
        fields: {
            Id: { key: true, create: false, edit: false, list: false },
            Type: { title: "Type", width: "10%", sorting: false, display: function(a) {
                return a.record.IsSettlement == true ? "Settlement" : "Request";
            }
            },
            Status: { title: "Status", width: "15%", sorting: false, display: function(a) {
                return a.record.IsSettlement == true ? a.record.SettlementStatus : a.record.RequestStatus;
            }
            },
            TripStartDate: {
                title: "Trip Start Date", width: "15%", display: function (a) {
                    var b = moment(a.record.TripStartDate);
                    if (b.isValid()) { return b.format(commonDateFormat2) }
                }
            }, TripEndDate: { title: "Trip End Date", width: "15%", display: function(a) {
                 var b = moment(a.record.TripEndDate); if (b.isValid()) { return b.format(commonDateFormat2) }
            }
            }, TripPurpose: { title: "Trip Purpose", width: "35%" },
            CustomViewAction: {
                title: "", listClass: "jtable-command-column",
                sorting: false,
                width: "1%",
                display: function(a) {
                     if (a.record.IsSettlement == true) {
                          return "<button title='View' onclick='location.href=\"SettlementFormView.aspx?requestID=" + a.record.Id + "\"' class='jtable-command-button jtable-view-command-button'><span>View</span></button>"
                     } else
                     { return "<button title='View' onclick='location.href=\"RequestFormView.aspx?requestID=" + a.record.Id + "\"' class='jtable-command-button jtable-view-command-button'><span>View</span></button>" }
                }
            }
        }
    }); $("#PendingRequests").jtable("load");
    $(".jtable-page-size-change").hide();
});