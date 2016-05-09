class WatchItem
{
    constructor(id){
        this.id = id;
        this.internalPos = 0;
        this.score = 0;
        this.gr = 0;
        this.dr = 0;
    }
}

window.globalWatch = [];
window.logger = "===\"" + Date.now() + "\"===\nSTARTING LOG...\n\n";


var test = ["a","c","d","b"];
quickSort(test, 0, test.length - 1)

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
            for(k = 0; k < maintab.data().length; k++)
            {
                if(maintab.row(k).data().teamid == grabber[i])
                {
                    globalWatch[i].score = maintab.row(k).data().score
                    globalWatch[i].gr = maintab.row(k).data().gr;
                    globalWatch[i].dr = maintab.row(k).data().dr;
                }
            }
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
                $(".watcher_body").append('<div class="watch-card"><i class="material-icons arrow success">arrow_upward</i><a class="rank_g"><b>(GR)</b> ' +  globalWatch[i].gr  + ' </a><a class="rank_d"><b>(DR)</b> ' + globalWatch[i].dr + ' </a><a class="rank_d"><b>(PR)</b> ' + globalWatch[i].internalPos + ' </a><a class="ID">' + globalWatch[i].id + '</a><a class="score">' + globalWatch[i].score + '</a></div>');
            }
        }
    }
}

function startWatching(entry)
{
    //check if ID is valid
    var searchitem = maintab.column(2).data()
    for(i = 0; i < searchitem.length; i++)
    {
        if(searchitem[i] == entry)
            return true
    }
    return false;
}


var timekeeper = setInterval(trackWatch, 30000)
function trackWatch()
{
    quickSort(globalWatch, 0, globalWatch.length-1)
    for(i = 0; i < globalWatch.length; i++)
    {

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
    if(arr[i].score < pivotValue){
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