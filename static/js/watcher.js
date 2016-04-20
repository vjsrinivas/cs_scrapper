class WatchItem
{
    constructor(id){
        this.id = id;
        this.internalPos = 0;
    }
}

if(store.get("watching") != undefined)
{
    var _watcher = store.get("watching").split("\n");
    var numWatching = _watcher.length;
    var lister = [];
    $(".watcher").append('<h4 id="watch">Watch ('+ numWatching + ')</h4>');

    for(i = 0; i < _watcher.length; i++)
    {
        lister[i] = new WatchItem(_watcher[i]);
    }

    $(".watcher").append('<div class="watch-card"><div class="tracer disabled"></div><div class="heatmap disabled" title="Probability (based on EPOC): N/A"></div><i class="material-icons arrow success">arrow_upward</i><a class="rank_g">(GR) 1</a><a class="rank_d">(DR) 1</a><a class="rank_d">(PR) 1</a><a class="ID">08-0217</a><a class="score">300</a></div>');
}

function generateWatch(id)
{
    var _watcher = store.get("watching").split("\n");
    $("#watch").text("Watch (" + _watcher.length + ")")
}