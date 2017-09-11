var cfg
var cfgid
var qs // questions shuffled
var state = "wait"; // "wait", "run", "finish"

var nextmoment

var starttime
var lasttime
var lastdiff
var round
var fmain_fontsize

function updateClock() 
{
    if (state == "wait") 
    { 
        $("#ftime_val").html("00:00.0")
    }
    else if (state == "run")
    {
        lasttime = moment()
        var tdiff = moment(lasttime).diff(starttime)
        lastdiff = moment(tdiff).format('mm:ss.S')
        $("#ftime_val").html(lastdiff)
    }
    else // finish
    {

    }
}

// https://github.com/Daplie/knuth-shuffle/blob/master/index.js
function shuffle(array) {
var currentIndex = array.length
  , temporaryValue
  , randomIndex
  ;

// While there remain elements to shuffle...
while (0 !== currentIndex) {

  // Pick a remaining element...
  randomIndex = Math.floor(Math.random() * currentIndex);
  currentIndex -= 1;

  // And swap it with the current element.
  temporaryValue = array[currentIndex];
  array[currentIndex] = array[randomIndex];
  array[randomIndex] = temporaryValue;
}

return array;
}

function click_next() 
{
    if (state == "wait")
    {
        state = "run"
        $("#btn_next_label").html("Dalej")
        round = 1;
        starttime = moment()
    }
    else if (state == "run")
    {
        round++
        if (round == cfg.rounds) // last round
        {
            $("#btn_next_label").html("Koniec")
        }
        else if (round > cfg.rounds)
        {
            state = "finish"
            $("#fmain_val").css("font-size", fmain_fontsize)
            $("#fmain_val").html("KONIEC")
            $("#ftime_val").css("visibility", "visible")
            $("#btn_next_label").html("Od nowa")           
        }
    }
    else if (state == "finish") // start again
    {
        state = "wait"
        qs = shuffle(qs) // reshuffle
        $("#btn_next_label").html("Start")
        $("#fmain_val").html("")
        $("#fmain_val").css("font-size", cfg.fontsize + "vh")
        $("#ftime_val").css("visibility", "hidden")
    }

    if (state == "run")
    {
        var q = qs[round - 1]
        if (q.match(/\.(png|jpe?g)/))
        {
            $("#fmain_val").html("<img src='"+cfgid.substr(1)+"/"+q+"'>")
        }   
        else if (q.match(/`/)) // AsciiMath default delimiter
        {
            $("#fmain_val").css("visibility", "hidden")
            $("#fmain_val").html(q)
            MathJax.Hub.Queue(["Typeset",MathJax.Hub,"fmain_val"])
            MathJax.Hub.Queue(function () { $("#fmain_val").css("visibility", "visible") })
        }
        else
        {
            $("#fmain_val").html(q)
        }
    }
}

function click_prev()
{
    if (state == "wait")
    {
        // nothing
    }
    else if (state == "run" || state == "finish")
    {
        if (round > 1)
        {
            round -= 2
            $("#btn_next_label").html("Dalej")
            $("#fmain_val").css("font-size", cfg.fontsize + "vh")
            state = "run"
            click_next();
        }
    }

}

function click_reset()
{
    location.reload()
}

function click_time()
{
    if ($("#ftime_val").css("visibility") == "visible")
    {
        $("#ftime_val").css("visibility", "hidden")
    }
    else
    {
        $("#ftime_val").css("visibility", "visible")
    }

}

$( window ).resize(function() 
{
    // prepareClock();
});

$( document ).ready(function() 
{
    moment.locale("pl");

    $.ajaxSetup({
        async: false
    });

    cfgid = "#a10";
    if (window.location.hash)
    {
        cfgid = window.location.hash;
    }

    var cfgjson = cfgid.substr(1) + ".json"

    $.getJSON(cfgjson)
    .done(function(json) 
    { 
        cfg = json; 
    })
    .fail(function( jqxhr, textStatus, error) 
    {
        var err = textStatus + ", " + error;
        alert("JSON ERROR in file " + cfgjson + ": " + err );
    });

    // $("#ftitle").html(cfg.title + " " + cfg.rounds + "/" + cfg.questions.length + ", czas: " + cfg.timelimit + "s");
    $("#ftitle").html(cfg.title + ", czas: " + cfg.timelimit);

    fmain_fontsize = $("#fmain_val").css("font-size")
    $("#fmain_val").css("font-size", cfg.fontsize + "vh")
    qs = cfg.questions;
    qs = shuffle(qs);

    setInterval(updateClock, 100);

});

