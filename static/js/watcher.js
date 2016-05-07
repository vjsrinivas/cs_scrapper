class WatchItem
{
    constructor(id){
        this.id = id;
        this.internalPos = 0;
        this.score = Math.floor((Math.random() * 100)+1);
    }
}

window.globalWatch = [];


if(store.get("watching") != undefined)
{
    var _watcher = store.get("watching").split("\n");
    var numWatching = _watcher.length;
    $(".watcher_inner").append('<h4 id="watch">Watch ('+ numWatching + ')</h4>');

    for(i = 0; i < _watcher.length; i++)
    {
        globalWatch[i] = new WatchItem(_watcher[i]);
        $(".watcher_body").append('<div class="watch-card"><i class="material-icons arrow success">arrow_upward</i><a class="rank_g"><b>(GR)</b> 1 </a><a class="rank_d"><b>(DR)</b> 1 </a><a class="rank_d"><b>(PR)</b> 1 </a><a class="ID">' + globalWatch[i].id + '</a><a class="score">300</a></div>');
    }
    //$(".watcher").append('<div class="watch-card"><div class="tracer disabled"></div><div class="heatmap disabled" title="Probability (based on EPOC): N/A"></div><i class="material-icons arrow success">arrow_upward</i><a class="rank_g">(GR) 1</a><a class="rank_d">(DR) 1</a><a class="rank_d">(PR) 1</a><a class="ID">08-0217</a><a class="score">300</a></div>');
}

//var skipper = setInterval(updateMe, 30000);
var test = [0,32,4,21,39,29,34];
quickSort(test, 0, test.length - 1)
function updateMe()
{
    if(globalWatch.length == 0)
        quickSort(globalWatch, 0, globalWatch.length-1);
}

function generateWatch(id)
{
    //clearInterval(skipper);
    var _watcher = store.get("watching");
    var grabber;
    $(".watcher_inner").empty();
    if(_watcher == undefined)
    {
        $("#watch").text("")
        $(".watcher_inner").empty();
        globalWatch = [];
        $(".watcher_body").empty();
    }
    else if(_watcher.indexOf("\n") != -1)
    {
        grabber = store.get("watching").split("\n");
        $(".watcher_inner").append('<h4 id="watch">Watch (' + grabber.length + ')</h4>')
        globalWatch = [];
        for(i = 0; i < grabber.length; i++)
        {
            globalWatch[i] = new WatchItem(grabber[i])
        }
    }
    else
    {
        grabber = store.get("watching")
        $(".watcher_inner").append('<h4 id="watch">Watch (1)</h4>')

        globalWatch = []
        globalWatch[0] = new WatchItem(grabber);
    }


    if(globalWatch != null)
    {
        if(globalWatch.length != 0)
        {
            $(".watcher_body").empty();
            for(i = 0; i < globalWatch.length; i++)
            {
                $(".watcher_body").append('<div class="watch-card"><i class="material-icons arrow success">arrow_upward</i><a class="rank_g"><b>(GR)</b> 1 </a><a class="rank_d"><b>(DR)</b> 1 </a><a class="rank_d"><b>(PR)</b> 1 </a><a class="ID">' + globalWatch[i].id + '</a><a class="score">300</a></div>');
            }
        }
    }
}


//NOT CODED BY ME; ALGORITHM: http://khan4019.github.io/front-end-Interview-Questions/sort.html#quickSort

function quickSort(arr, left, right){
   var len = arr.length,
   pivot,
   partitionIndex;


  if(left < right){
    pivot = right;
    partitionIndex = partition(arr, pivot, left, right);

   //sort left and right
   quickSort(arr, left, partitionIndex - 1);
   quickSort(arr, partitionIndex + 1, right);
  }
  return arr;
}

function partition(arr, pivot, left, right){
   var pivotValue = arr[pivot],
       partitionIndex = left;

   for(var i = left; i < right; i++){
    if(arr[i] < pivotValue){
      swap(arr, i, partitionIndex);
      partitionIndex++;
    }
  }
  swap(arr, right, partitionIndex);
  return partitionIndex;
}

function swap(arr, i, j){
   var temp = arr[i];
   arr[i] = arr[j];
   arr[j] = temp;
}