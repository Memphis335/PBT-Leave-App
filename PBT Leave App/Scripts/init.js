var context = SP.ClientContext.get_current();
var user = context.get_web().get_currentUser();
var siteurl;
var hostweburl;

function loadUser() {
    context.load(user);
    context.executeQueryAsync(onGetUserNameSuccess, onGetUserNameFail);
}

function onGetUserNameSuccess() {
    var username = user.get_title();
    getListItems(username);
}

function onGetUserNameFail(sender, args) {
    alert('Failed to get user name. Error:' + args.get_message());
}

function getListItems(name) {
    var oList = context.get_web().get_lists().getByTitle('Leave Balances');

    var query = new SP.CamlQuery();
    query.set_viewXml(
        '<View><Query><Where><Eq><FieldRef Name=\'User\'/>' +
        '<Value Type=\'User\'>' + name + '</Value></Eq></Where></Query>' +
        '</View>'
        );
    this.items = oList.getItems(query);

    context.load(items);
    context.executeQueryAsync(
       Function.createDelegate(this, this.onQuerySucceededLeave),
        Function.createDelegate(this, this.onQueryFailed)
    );
}

function onQuerySucceededLeave(sender, args) {
    var sick = "";
    var annual = "";
    var study = "";
    var matern = "";
    var family = "";
    var inception = "";

    var listItemEnumerator = items.getEnumerator();

    while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();
        annual = oListItem.get_item("AnnualLeave");
        sick = oListItem.get_item("SickLeave");
        study = oListItem.get_item("StudyLEave");
        matern = oListItem.get_item("MaternityLeave");
        family = oListItem.get_item("FamilyResponsibilityLeave");
        inception = oListItem.get_item("PBTInceptionDate");
    }

    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth();
    console.log(day, month);

    var inceptionDate = new Date(inception);
    var incDay = inceptionDate.getDate();
    var incMonth = inceptionDate.getMonth();
    console.log(incDay, incMonth);

}