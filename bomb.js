var state = "wait"; // "wait", "run", "finish"

var prevx = -1000;

var cfg;
var deadline;
var timer;
var bombinterval;
var spinner;

var nextmoment

var starttime
var lasttime
var lastdiff
var round
var fmain_fontsize

// spinner.js oprtions
var opts = {
  lines: 15, // The number of lines to draw
  length: 0, // The length of each line
  width: 52, // The line thickness
  radius: 42, // The radius of the inner circle
  scale: 1.5, // Scales overall size of the spinner
  corners: 1, // Corner roundness (0..1)
  color: '#fff', // #rgb or #rrggbb or array of colors
  opacity: 0.1, // Opacity of the lines
  rotate: 0, // The rotation offset
  direction: 1, // 1: clockwise, -1: counterclockwise
  speed: 0.6, // Rounds per second
  trail: 60, // Afterglow percentage
  fps: 20, // Frames per second when using setTimeout() as a fallback in IE 9
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  className: 'spinner', // The CSS class to assign to the spinner
  top: '50%', // Top position relative to parent
  left: '50%', // Left position relative to parent
  shadow: true, // Whether to render a shadow
  position: 'absolute' // Element positioning
};


function updateClock() 
{
    if (state == "wait") 
    { 
        $("#ftime_val").html("00:00.0")
    }
    else if (state == "run")
    {
        timer = timer - 1;
        $("#ftime_val").html(timer);
    
        // BOMB!
        if (timer == 0)
        {
            state = "wait";

            clearInterval(bombinterval);

            var audio = new Audio('bomb.mp3');
            audio.play();

            spinner.stop();
            var bunnyno = deadline % 6; // bunny 0-5 . gif
            $("#fmain_val").html("<img class='bombbunny' src='bunny"+bunnyno+".gif'>");

            $("#btn_next_label").html("Start")
        }
    }
    else // finish
    {

    }
}

function click_next() 
{
    if (state == "wait")
    {
        state = "run"
        $("#btn_next_label").html("Koniec")
        $("#fmain_val").html(""); // hide bunny

        cfg = "#5:10"; // default
        if (window.location.hash)
        {
            cfg = window.location.hash;
        }
    
        cfg = cfg.substr(1);
        var cfgr = cfg.split(":");
    
        var xl = cfgr[0] * 1.0;
        var xr = cfgr[1] * 1.0;
    
        var diff10 = Math.floor((xr - xl) * 0.1); // 10%
    
        var b = xr - xl + 1;
        var a = xl;
   
        console.log("---------------------------------------------");
        console.log("xl="+xl+" xr="+xr+" a="+a+" b="+b); 
        do {
            var r = Math.random();
            var deadline_fl = ((r * b) + a);
            deadline = Math.floor(deadline_fl);
            console.log("r("+r+") * b("+b+") + a("+a+") = "+deadline_fl+" (+"+deadline+" floored)");
            var dist = Math.abs(prevx - deadline);
            console.log("dist(prev="+prevx+" - new="+deadline+")="+dist+" < "+diff10);
        } while (dist < diff10);
        prevx = deadline;

        $("#ftime_val").html(deadline);

        // $("#ftitle").html(cfg.title + " " + cfg.rounds + "/" + cfg.questions.length + ", czas: " + cfg.timelimit + "s");
        console.log("deadline="+deadline+" "+cfgr[0]+":"+cfgr[1]+" d10="+diff10);

        timer = deadline;
        bombinterval = setInterval(updateClock, 1000);

        var target = document.getElementById('fmain_val');
        spinner = new Spinner(opts).spin(target);
    }
    else if (state == "run")
    {
        timer = 1; // simulate deadline
        updateClock();
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

//    fmain_fontsize = $("#fmain_val").css("font-size")
//    $("#fmain_val").css("font-size", "100vh")


});


