$(document).ready(function() {

    var _input = "";
    var _empty = "<div class=\"empty\"><i class=\"material-icons\">info_outline</i><p class=\"empty\">Collection is empty</p></div>";
    var _watcher = new Array();
    var _emptier = new Array();
    window.predictNationals = false;
    window.enableLog = false;
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

	function watcherChanged()
	{
	    $(".save").removeClass("unneeded");
	    $(".save").removeAttr("disabled");
	}

	function showEmptiness()
	{
        if(_watcher.length > 0 && store.get("watching") != "undefined")
		    $(".empty").hide();
        else
            $(".empty").show();
	}

    $(document).on('click', '.material-icons.md-24', function()
    {
        $(this).parent().remove();
        maintab.search("").columns().search("").draw();
    });

	$('.setting').click(function() {
		$('.main').css("opacity", "0").css("display","none");
		$('.main').removeClass("loaded");
		$(".dialog").css("opacity", "1").css("display", "inherit");
		showEmptiness();
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

    $(document).on("mouseenter",".material-icons.md-18",function(e) {
        $(this).addClass("active");
        $(this).parents("li").addClass("active");
    }).on("mouseleave", ".material-icons.md-18", function(e){
        $(this).removeClass("active");
        $(this).parents("li").removeClass("active");
    });

    $(document).on("click", ".material-icons.md-18", function(e) {
        var _val = $(this).next(".tag").text();
        $(this).parents("li").remove();
        var x = _watcher.indexOf(_val);
        if(x != -1)
            _watcher.splice(x, x+1);
        if(_watcher.length == 0)
           store.clear();
        showEmptiness();
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

    window.maintab = $('#example').DataTable( {
        "processing": true,
        "ajax": "../data",
        "aoColumns": [
            {"mData": "gr"},
            {"mData": "dr"},
            {"mData": "teamid"},
            {"mData": "loc"},
            {"mData": "div"},
            {"mData": "tier"},
            {"mData": "time"},
            {"mData": "score"},
            {"mData": "penalties.0.overtime"},
        ],
        "columnDefs": [
            { className: "my_class", "targets": [ 0,1 ] }
        ],
        "columnDefs": [
            {"orderable": false, "targets": [0,5,8]},
        ],
        "sortable": true,
        "sDom": '<"top">rt<"bottom"lp><"clear">',
        "bLengthChange": false,
        "scroller": true,
        "scrollY": 500,
        "deferRender": true,
    } );

    setInterval( function () {
    maintab.ajax.reload(null, false);
    }, 500000 );

    $("#mainsearch").on("keyup", function() {
        maintab.columns(2).search($("#mainsearch").val()).draw();
    })

    if(typeof(EventSource) !== "undefined") {
            var source = new EventSource("stream");
            source.onmessage = function(event) {
            var parser = event.data;
            objr = JSON.parse(parser);
            if(objr['isDone'] && objr['isAvailable'])
            {
                event.target.close();
                createLastFetch();
                //CHECK FOR PREDICTNATIONALS IN STORE.JS
                if(store.get("predictNationals") != undefined)
                {
                    if(store.get("predictNationals") == 'true')
                    {
                        predictNationals = true;
                        $("#nationals_sub").addClass("on");
                    }
                    else
                        predictNationals = false;
                }

                if(store.get("enableLog") != undefined)
                {
                    if(store.get("enableLog") == 'true')
                    {
                        enableLog = true;
                        $("#logdown_sub").addClass("on");
                        $("#download").addClass("active");
                    }
                    else
                        enableLog = false;
                }

                $('.loader_wrapper').addClass('hide');
		        $('.main').addClass('loaded');
		        setTimeout( function(){$('.main').css("opacity", "1")},100);
            }
            else if (!objr['isAvailable'])
            {
                console.log("Is the fucking website down again?");
                event.target.close();
                $("#liststatus").append('<li id="status" class="status_loader hide" style="background-color: #f1c40f !important;"><i class="material-icons md-18" style="margin-top: 3px">warning</i><p id="status_target" style="margin: 0; float: right; margin-top: 2px; margin-left: 7px;">error<></p></li>')
	            $("#status").removeClass("hide");
                $("#status_target").text('warning: fatal - Source Offline');
                $("#liststatus").append('<li class="status_loader"><a href="./old" id="status_target" style="color: white; margin-left: 58px;">get last round logs</a></li>');
            }
            else
            {
                console.log(event.data);
                event.target.close();
                $("#liststatus").append('<li id="status" class="status_loader hide"><i class="material-icons md-18" style="margin-top: 3px">error_outline</i><p id="status_target" style="margin: 0; float: right; margin-top: 2px; margin-left: 7px;">error<></p></li>')
	            $("#status").removeClass("hide");
                $("#status_target").text('error: Table could not draw');
                $("#liststatus").append('<li class="status_loader"><a href="./old" id="status_target" style="color: white; margin-left: 72px;">try alt. version</a></li>');
            }
        }
    }
    else {
        $("#liststatus").append('<li id="status" class="status_loader hide"><i class="material-icons md-18" style="margin-top: 3px">error_outline</i><p id="status_target" style="margin: 0; float: right; margin-top: 2px; margin-left: 7px;">error<></p></li>')
	    $("#status").removeClass("hide");
        $("#status_target").text('error: Browser not supported');
        $("#liststatus").append('<li class="status_loader"><a href="./old" id="status_target" style="color: white; margin-left: 72px;">try alt. version</a></li>');
    }

    function createLastFetch()
    {
        var src = new EventSource("meta");
        src.onmessage = function(event)
        {
            var jsoner = JSON.parse(event.data)
            $(".lastmod").text("(Last Fetch: " + jsoner["lastFetch"] + ")" )
        }
    }


    //SORTER TEXTBOX CHANGES
    function eventError(object)
    {
        $(object).parent().parent().addClass("error");
        $(object).css("border","1px solid #FFCDD2");
    }

    $(document).on("focusin", "input#score-sort", function(e) {
        var strung = $("input#score-sort").val();
        var res = strung.slice(1, strung.length-1);
        $("input#score-sort").val(res);
    })

    $(document).on("focusout", "input#score-sort", function(e) {
        $("input#score-sort").val("("+$("input#score-sort").val()+")");
        if($("input#score-sort").val() == "()")
            $("input#score-sort").val("");
        maintab.draw();
    })

    $(document).on("focusin", "input#state-sort", function(e) {
        var strung = $("input#state-sort").val();
        var res = strung.slice(1, strung.length-1);
        $("input#state-sort").val(res);
    })

    $(document).on("focusout", "input#state-sort", function(e) {
        maintab.columns(3).search($("input#state-sort").val()).draw();
        $("input#state-sort").val("("+$("input#state-sort").val()+")");
        if($("input#state-sort").val() == "()")
            $("input#state-sort").val("");
    })

     $(document).on("focusin", "input#division-sort", function(e) {
        var strung = $("input#division-sort").val();
        var res = strung.slice(1, strung.length-1);
        $("input#division-sort").val(res);
    })

    $(document).on("focusout", "input#division-sort", function(e) {
        maintab.columns(4).search($("input#division-sort").val()).draw();
        $("input#division-sort").val("("+$("input#division-sort").val()+")");
        if($("input#division-sort").val() == "()")
            $("input#division-sort").val("");
    })

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
		if(store.get("watching") == undefined)
		$("#watchlist").append(_empty);
		$(".save").addClass("unneeded");
	    $(".save").attr("disabled");
		init();
    })

    $(".btn.more").click(function() {
        $(this).toggleClass("active");
        $(".dialog.extended").toggleClass("inactive ");
    })

    $(".btn.save").click(function(){

        if(!($(".save").is(":disabled")))
        {
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

            generateWatch($(this).val())

            $(".dialog").css("display", "none");
            $(".main").css("display","inherit").css("opacity","1");
            $(".main").addClass("loaded");
            $(this).addClass("unneeded");
            $(this).prop("disabled", true);
		}
    })

    $("#nationals").click(function() {
       $("#nationals_sub").toggleClass("on");

       if($("#nationals_sub").hasClass("on"))
       {
           store.set('predictNationals','true')
           window.predictNationals = true;
       }
       else
       {
           store.set('predictNationals', 'false')
           window.predictNationals = false;
       }
    })

    $("#logdown").click(function(){
        $("#logdown_sub").toggleClass("on");
        $("#download").toggleClass("active");

        if($("#logdown_sub").hasClass("on"))
        {
            store.set("enableLog","true")
            enableLog = true;
        }
        else
        {
            store.set('enableLog', 'false')
            enableLog = false;
        }
    })

    function download(filename, content) {
        var pom = document.createElement('a');
        pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
        pom.setAttribute('download', filename);
        pom.click();
    }

    $("#download").click(function() {
        download("test.txt", "Success :)");
    })
});