$(document).ready(function() {	
	function watcherOccupied(){
	    return "There are {x} watches still active";
	}

    $(document).on('click', '.material-icons.md-24', function()
    { $(this).parent().remove(); });

	$('.setting').click(function() {
		$('.main').css("opacity", "0").css("display","none");
		$('.main').removeClass("loaded");
		//setTimeout(function() {$('.dialog').removeClass("hide");}, 300);
		$(".dialog").css("opacity", "1").css("display", "inherit");
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
        $(this).parents().toggleClass("active");
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


    //SORTER TEXTBOX CHANGES
    function eventError(object)
    {
        $(object).parent().parent().addClass("error");
        $(object).css("border","1px solid #FFCDD2");
    }

    $(".change-value").focus(function() {
    })

    $(".change-value").focusout(function() {
        if($(this).val() == "")
            eventError(this);
        else
        {
            $(this).parent().parent().removeClass("error");
            $(this).css("border","none");
        }
    })

    $(".cancel").click(function() {
        $(".dialog").css("display", "none");
        //setTimeout(function() {$('.dialog').addClass("hide");}, 300);
	    //setTimeout(function() {$('.main').addClass("loaded");}, 600);
		$(".main").css("display","inherit").css("opacity","1");
		$(".main").addClass("loaded");
    })
});