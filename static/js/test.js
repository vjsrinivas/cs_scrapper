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
        doNotification();
    }

    function onPermissionDenied () {
        console.warn('Permission has been denied by the user');
        $("#notifications").attr('checked', false);
        $(".choices").removeClass("active");
        $("#noti_fail").removeClass("hide");
        $("#notifications").attr('disabled', true);
    }

    function doNotification () {
        var myNotification = new Notify('Yo dawg!', {
            body: 'This is an awesome notification This is an awesome notification!',
            tag: 'My unique id',
            icon: "./static/imgs/new_leader.png ",
            notifyShow: onShowNotification,
            notifyClose: onCloseNotification,
            notifyClick: onClickNotification,
            notifyError: onErrorNotification,
            requireInteraction: false,
            timeout: 5
        });

        myNotification.show();
    }

    $('#notifications').click(function() {

        var isCheck = $('#notifications').is(':checked');
		if(isCheck)
		{
			$(".choices").addClass("active");
		    if (!Notify.needsPermission) {
        	doNotification();
    	    }
    	    else if (Notify.isSupported()) {
         	Notify.requestPermission(onPermissionGranted, onPermissionDenied);
    	    }
		}
		else
			$(".choices").removeClass("active");
	});
});