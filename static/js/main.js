$(document).ready(function() {	
	$('#notifications').click(function() {
		var isCheck = $('#notifications').is(':checked');
		if(isCheck)
		{
			$(".choices").addClass("active");
		}
		else
			$(".choices").removeClass("active");
	});

	$('.material-icons.md-24').click(function() {
		$(this).parent().toggle();
	});

	$('.setting').click(function() {
		$('.main').css("opacity", "0");
	});

	$(document).on("click", function (e){
		if(e.target.id == "sort")
		{
			$(".sorter").addClass("active");
			e.stopPropagation();
		}
		else if($(".sorter").is(":visible"))
		{
			$(".sorter").removeClass("active");
		}
	});

    var source = new EventSource("stream");
    source.onmessage = function(event) {
        if(event.data == "{isDone: true}")
        {
            event.target.close();
            $('.loader_wrapper').addClass('hide');
		    $('.main').addClass('loaded');
		    setTimeout( function(){$('.main').css("opacity", "1")},100);
        }
        else
        { console.log(event.data);}
    };
});