function checkHoliday() {
    var myKey = "{AIzaSyCVqPUvC4PUNQ4xqgoQ_qEiB5q8G5FViUY}";
    var calendarId = "en.sa#holiday@group.v.calendar.google.com";

    $.ajax({
        type: "GET",
        url: encodeURI("https://www.googleapis.com/calendar/v3/calendars/" + calendarId + "/events?key=" + myKey),
        dataType: "json",
        success: function(response) {
            //do whatever you want with each
            console.log(response);
        },
        error: function(response) {
            //tell that an error has occurred
            console.log("Error occured");
            console.log(response);
        }
    });
}