$(document).ready(function() {	
	function watcherOccupied(){
	    return "There are {x} watches still active";
	}

	$('.material-icons.md-24').click(function() {
		$(this).parent().toggle();
	});

	$('.setting').click(function() {
		$('.main').css("opacity", "0");
		setTimeout(function() {$('.main').removeClass("loaded")}, 300);
		setTimeout(function() {$('.dialog').removeClass("hide");}, 300);
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

    $(".tag.watch > .material-icons").hover(function() {
        $(this).toggleClass("active");
        $(this.parents()).toggleClass("active");
    });

    if(typeof(EventSource) !== "undefined") {
        var source = new EventSource("stream");
        source.onmessage = function(event) {
        var parser = event.data;
        objr = JSON.parse(parser);
        if(objr['isDone'])
        {
            event.target.close();
            $('.loader_wrapper').addClass('hide');
		    $('.main').addClass('loaded');
		    setTimeout( function(){$('.main').css("opacity", "1")},100);
        }
        else
        { console.log(event.data);}
        };
    } else {
        $("#status").removeClass("hide");
        $("#status_target").text('error: Browser not supported');
    }
});