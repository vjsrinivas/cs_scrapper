$(document).ready(function() {

    var _input = "";
    var _watcher = new Array();
    init();

    function init()
    {
        if(store.enabled && typeof(EventSource) !== "undefined" && store.get("watching") != undefined)
        {
            _watcher = store.get("watching").split("\n");
            for(var i = 0; i < _watcher.length; i++)
            {
                var _watcherTemplate = "<li class=\"tag watch\"><i class=\"material-icons md-18\" style=\"float: left;\">remove_circle</i><p class=\"tag\">" + _watcher[i] + "</p></li>";
                $("#watchlist").append(_watcherTemplate);
            }
        }
    }

    if(_watcher.length > 0)
    {
        window.onbeforeunload = function(e){
            return "There are " + _watcher.length + " watches still active";
        }
    }

	function watcherChanged()
	{
	    $(".save").removeClass("unneeded");
	    $(".save").removeAttr("disabled");
	}

	function showEmptiness()
	{

	}

    $(document).on('click', '.material-icons.md-24', function()
    { $(this).parent().remove(); });

	$('.setting').click(function() {
		$('.main').css("opacity", "0").css("display","none");
		$('.main').removeClass("loaded");
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

    $(document).on("mouseenter",".material-icons",function(e) {
        $(this).addClass("active");
        $(this).parents("li").addClass("active");
    }).on("mouseleave", ".material-icons", function(e){
        $(this).removeClass("active");
        $(this).parents("li").removeClass("active");
    });

    $(document).on("click", ".material-icons", function(e) {
        var _val = $(this).next(".tag").text();
        $(this).parents("li").remove();
        var x = _watcher.indexOf(_val);
        if(x != -1)
            _watcher.splice(x, x+1);
        if(_watcher.length == 0)
           store.clear();
           //console.log("afafa");
        watcherChanged();
    });

    $()

    $(".normal-searcher").keypress(function(e){
        if(e.which == 13)
        {
            $(".empty").hide();
            _input = $(this).val();
            var _watcherTemplate = "<li class=\"tag watch\"><i class=\"material-icons md-18\" style=\"float: left;\">remove_circle</i><p class=\"tag\">" + _input + "</p></li>";
            _watcher.push(_input);
            $("#watchlist").append(_watcherTemplate);
            $(this).val("");
            watcherChanged();
        }
    })

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

    $(document).on("focusout", "input.change-value", function(e) {
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
		$(".main").css("display","inherit").css("opacity","1");
		$(".main").addClass("loaded");
		$("#watchlist").empty();
		init();
    })

    $(".btn.save").click(function(){

        var _tempcon = "";
        for(var i = 0; i < _watcher.length; i++)
        {
            if(i == (_watcher.length - 1))
                _tempcon += _watcher[i];
            else
                _tempcon += _watcher[i]+"\n";
        }
        if(store.enabled && _tempcon != "")
            store.set("watching", _tempcon);

        $(".dialog").css("display", "none");
		$(".main").css("display","inherit").css("opacity","1");
		$(".main").addClass("loaded");
		$(this).addClass("unneeded");
    })
});