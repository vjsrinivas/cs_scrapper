var isCheck = false;

if(Notification.permission == "denied")
{
    $("#noti_fail").removeClass("hide");
    $("#notifications").attr('disabled', true);
    logThis("[ NOTIFICATIONS ON ]");
}

else if(Notification.permission == "granted")
{
    $("#notifications").attr('checked', true);
    $(".choices").addClass("active");
    logThis("[ NOTIFICATIONS ON ]");
}

function onShowNotification () {
    console.log('notification is shown!');
}

function onCloseNotification () {
    console.log('notification is closed!');
}

function onClickNotification () {
    console.log('notification was clicked!');
}

function onErrorNotification () {
    console.error('Error showing notification. You may need to request permission.');
}

function onPermissionGranted () {
    console.log('Permission has been granted by the user');
}

function onPermissionDenied () {
    console.warn('Permission has been denied by the user');
    $("#notifications").attr('checked', false);
    $(".choices").removeClass("active");
    $("#noti_fail").removeClass("hide");
    $("#notifications").attr('disabled', true);
}

function doNotification (title, msg, tags, ico) {
    isCheck = $('#notifications').is(':checked');
    if(isCheck)
    {
        var myNotification = new Notify(title, {
            body: msg,
            tag: tags,
            icon: ico,
            notifyShow: onShowNotification,
            notifyClose: onCloseNotification,
            notifyClick: onClickNotification,
            notifyError: onErrorNotification,
            requireInteraction: false,
            timeout: 30
        });
        myNotification.show();
    }
}

function doLeader(msg)
{
    doNotification("There is a new leader!",msg, "leader", "./static/imgs/new_leader.png");
}

function doTop100(title)
{
    doNotification(title,"The team has hit the top 100 (global rank)","global rank hit 100","./static/imgs/top_leader.png");
}

function doTop20(title)
{
    doNotification(title,"The team has hit the top 20 (division rank)","global rank hit 100","./static/imgs/top_leader.png");
}

function doTime5min(title)
{
    doNotification(title,"The team is close to hitting the time limit!","time limit get on it loser","./static/imgs/time_warning.png");
}

function doTime(title)
{
    doNotification(title,"The team has hit the time limit! They risk point reduction!","time limit important","./static/imgs/time_warning_6.png");
}

$('#notifications').click(function() {
    isCheck = $('#notifications').is(':checked');
    if(isCheck)
    {
        $("#noti_keepalive").addClass("hide");
        $(".choices").addClass("active");
        if (!Notify.needsPermission)
        {
            logThis("[ " + Date.now() + " ] NOTIFICATIONS TURNED ON")
        }
        else if (Notify.isSupported()) {
        Notify.requestPermission(onPermissionGranted, onPermissionDenied);
        }
    }
    else
    {
        if(Notification.permission == "granted")
        {
            $("#noti_keepalive").removeClass("hide");
            $("#noti_ic").addClass("animated fadeInUp");
        }
        $(".choices").removeClass("active");
        logThis("[ " + Date.now() + " ] NOTIFICATIONS TURNED OFF")
    }
});