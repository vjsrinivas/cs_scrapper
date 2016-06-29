class WatchItem
{
    constructor(id){
        this.id = id;
        this.time = "";
        this.isWarned = false;
        this.hitTop100 = false;
        this.hitTop20 = false;
        this.internalPos = 0;
        this.score = 0;
        this.gr = 0;
        this.dr = 0;
        this.status = 0; //0 = undetermined | 1 = increased | 2 = decreased
    }
}

window.globalWatch = [];
window.logger = "===\"" + Date.now() + "\"===\r\nSTARTING LOG...\r\n\r\n";

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
                    globalWatch[i].time = maintab.row(k).data().time
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

        for(k = 0; k < maintab.data().length; k++)
            {
                if(maintab.row(k).data().teamid == grabber)
                {
                    globalWatch[0].score = maintab.row(k).data().score
                    globalWatch[0].gr = maintab.row(k).data().gr;
                    globalWatch[0].dr = maintab.row(k).data().dr;
                    globalWatch[0].time = maintab.row(k).data().time
                }
            }
    }


    if(globalWatch != null)
    {
        if(globalWatch.length != 0)
        {
            $(".watcher_body").empty();
            globalWatch = mergeSort(globalWatch);
            drawBlankTabs(globalWatch.length);
            fillBlankTabs();
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
///////////////////////////////////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////
/////////////////GEN2//////////////////////////


//Primitive function - Draws blanks
//NOTE: DONT GIVE ACTUAL IDNAMES OF WATCHERLIST. IF YOU DO, YOU'LL FUCK UP MY FILLER
//syntax for idName will be watcher_[NUMBER] from 0 to n
function drawBlankTabs(numOfTimes)
{
    for(i = 0; i < numOfTimes; i++)
        $(".watcher_body").append('<a><div class="watch-card" id="watcher_' + i + '"></div></a>');
}


//ONLY RUN AFTER BLANKS OF APPROPRIATE NUMBER ARE CREATED
function fillBlankTabs()
{
    var undetermined = '<i class="material-icons arrow undetermined">remove</i>';
    var increased = '<i class="material-icons arrow success">arrow_upward</i>';
    var decreased = '<i class="material-icons arrow drop">arrow_downward</i>';

    for(i = 0; i < globalWatch.length; i++)
    {
        globalWatch[i].internalPos = i+1;
        var taker = "";
        if(globalWatch[i].status == 0)
            taker = undetermined;
        else if(globalWatch[i].status == 1)
            taker = decreased;
        else
            taker = increased;

        //destory insides
        $("#watcher_"+i).empty();
        //
        if($("#watcher_"+i).length != 0)
        {
            $("#watcher_"+i).append(taker + '<a class="rank_g"><b>(GR)</b> ' + globalWatch[i].gr  + ' </a><a class="rank_d"><b>(DR)</b> ' + globalWatch[i].dr + ' </a><a class="rank_d"><b>(PR)</b> ' + globalWatch[i].internalPos + ' </a><a class="ID">' + globalWatch[i].id + '</a><a class="score">' + globalWatch[i].score + '</a>')
        }
        else { console.log("threw error: Empty draw not found! <" + i + ">"); }
    }
}

function redrawCardAuto()
{
    console.log("Refreshing watcher...")
    var temper = globalWatch;
    var leader = temper[0];

    for(i = 0; i < globalWatch.length; i++)
    {
        for(k = 0; k < maintab.data().length; k++)
        {
            if(maintab.row(k).data().teamid == temper[i].id)
            {
                globalWatch[i].score = maintab.row(k).data().score
                globalWatch[i].gr = maintab.row(k).data().gr;
                globalWatch[i].dr = maintab.row(k).data().dr;
                globalWatch[i].time = maintab.row(k).data().time
            }
        }
    }

    globalWatch = mergeSort(globalWatch);

    if(globalWatch[0].id != leader.id)
    {
        logThis("[ " + Date.now() + " ] NEW LEADER: " + globalWatch[0].id);
        doLeader(globalWatch[0].id + " has taken the lead from " + leader.id);
    }

    logThis("[ " + Date.now() + " ]");
    for(i = 0; i < globalWatch.length; i++)
    {
        logThis(globalWatch[i].id);
        logThis("\t[GR] "+globalWatch[i].gr);
        logThis("\t[DR] "+globalWatch[i].dr);
        logThis("\t[SCORE] "+globalWatch[i].score);

        if(globalWatch[i].time == "5:55")
        {
            if(!globalWatch[i].isWarned)
            {
                logThis("\t[WARNING] " + globalWatch[i].id + " HAS TIME LIMIT WARNING!");
                doTime5min(globalWatch[i].id + " has hit 5 minute warning (5:55)");
            }
        }

        if(globalWatch[i].time.slice(0,1) == "6")
        {
            if(!globalWatch[i].isWarned)
            {
                logThis("\t[WARNING] " + globalWatch[i].id + " HAS TIME LIMIT!");
                doTime(globalWatch[i].id + " has hit time limit (6:00)");
            }
            globalWatch[i].isWarned = true;
        }

        if(temper[i].gr > 100 && globalWatch[i].gr <= 100)
        {
            if(!globalWatch[i].hitTop100)
            {
                logThis("\t[META] " + globalWatch[i].id + " HAS BROKEN TOP 100 (GLOBAL) AND IS NOW " + globalWatch[i].gr);
                doTop100(globalWatch[i].id + " has broken top 100 (global rank)!");
            }
            globalWatch[i].hitTop100 = true;
        }

        if(temper[i].dr > 20 && globalWatch[i].dr <= 20)
        {
            if(!globalWatch[i].hitTop20)
            {
                logThis("\t[META] " + globalWatch[i].id + " HAS BROKEN TOP 20 (DIVISION) AND IS NOW " + globalWatch[i].dr);
                doTop100(globalWatch[i].id + " has broken top 20 (division rank)!");
            }
            globalWatch[i]. hitTop20 = true;
        }

        for(x = 0; x < temper.length; x++)
        {
            if(globalWatch[i].id == temper[x].id)
            {
                if(x == i)
                {
                    globalWatch[i].status = 0;
                }
                else if(x > i)
                {
                    globalWatch[i].status = 2;
                    logThis("[ " + Date.now() + " ] " + globalWatch[i].id + " HAS FALLEN IN RANK" )
                }
                else
                {
                    globalWatch[i].status = 1;
                    logThis("[ " + Date.now() + " ] " + globalWatch[i].id + " HAS INCREASED IN RANK" )
                }
            }
        }
        logThis("");
    }
    logThis("");
    fillBlankTabs()
}

function checkTime()
{
    for(i = 0; i < globalWatch.length; i++)
    {

    }
}

function logThis(msg)
{
    window.logger += msg + "\r\n";
    return 0;
}

//Code by: http://khan4019.github.io/front-end-Interview-Questions/sort.html#mergeSort
function mergeSort(arr){
   var len = arr.length;
   if(len <2)
      return arr;
   var mid = Math.floor(len/2),
       right = arr.slice(0,mid),
       left =arr.slice(mid);
   //send left and right to the mergeSort to broke it down into pieces
   //then merge those
   return merge(mergeSort(right),mergeSort(left));
}


function merge(left, right){
  var result = [],
      lLen = left.length,
      rLen = right.length,
      l = 0,
      r = 0;
  while(l < lLen && r < rLen){
     if(right[r].score < left[l].score){
       result.push(left[l++]);
     }
     else{
       result.push(right[r++]);
    }
  }
  //remaining part needs to be addred to the result
  return result.concat(left.slice(l)).concat(right.slice(r));
}