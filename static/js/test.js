$(document).ready(function() {

    if(Notification.permission == "denied"){
        $("#noti_fail").removeClass("hide");
        $("#notifications").attr('disabled', true);
    }
    else if(Notification.permission == "granted"){
        $("#notifications").attr('checked', true);
        $(".choices").addClass("active");
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
        //console.log('Permission has been granted by the user');
        doDecrease();
    }

    function onPermissionDenied () {
        console.warn('Permission has been denied by the user');
        $("#notifications").attr('checked', false);
        $(".choices").removeClass("active");
        $("#noti_fail").removeClass("hide");
        $("#notifications").attr('disabled', true);
    }

    function doNotification (title, msg, tags, ico) {
        var myNotification = new Notify(title, {
            body: msg,
            tag: tags,
            icon: ico,
            notifyShow: onShowNotification,
            notifyClose: onCloseNotification,
            notifyClick: onClickNotification,
            notifyError: onErrorNotification,
            requireInteraction: false,
            timeout: 5
        });

        myNotification.show();
    }

    function doIncrease()
    {
        doNotification("","", "", "./static/imgs/new_leader.png");
    }

    function doDecrease()
    {
        doNotification("","","","./static/imgs/drop_leader.png");
    }

    function doSwap()
    {
        doNotification("","","","./static/imgs/switch_leader.png");
    }

    function doTime()
    {
        doNotification("","","","./static/imgs/time_warning.png");
    }

    $('#notifications').click(function() {

        var isCheck = $('#notifications').is(':checked');
		if(isCheck)
		{
		    $("#noti_keepalive").addClass("hide");
			$(".choices").addClass("active");
		    if (!Notify.needsPermission) {
        	doIncrease();
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
        }
	});

});