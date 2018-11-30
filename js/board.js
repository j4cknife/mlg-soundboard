var context;
var bufferLoader;

// default options
var stopOnChange = true;
var allowOverlap = false;

window.onload = init;

// Is used for loading in all the buffers which are then played!
var bList;

// Holds all active buffers. Is used so that we can stop them at all times
var activeBuffers = [];


// mp3 files and sources
var soundfiles = ["2big2fast.mp3",
                            "2ez.mp3",
                            "3saCrowd.mp3",
                            "airmail.mp3",
                            "bananapeel.mp3",
                            "big_papa.mp3",
                            "blast_off.mp3",
                            "blow_over.mp3",
                            "boom_ka.mp3",
                            "boom_no_shaka.mp3",
                            "boomshakalaka_give_lil.mp3",
                            "boom_shakalaka.mp3",
                            "boomshakalaka_puts_the.mp3",
                            "boomshakala_knock.mp3",
                            "boom_wo_kaboom.mp3",
                            "bullseye.mp3",
                            "butter_fingers.mp3",
                            "butterfly.mp3",
                            "chicks_will_dig_you.mp3",
                            "disconnect.mp3",
                            "dont_start.mp3",
                            "embarrassing.mp3",
                            "empty.mp3",
                            "facial.mp3",
                            "finger_roll.mp3",
                            "fire_edition.mp3",
                            "fire_heating_up.mp3",
                            "fire_heat_trend.mp3",
                            "fire_hes_on.mp3",
                            "flinch.mp3",
                            "from_down_town.mp3",
                            "get_that_out.mp3",
                            "go_outside.mp3",
                            "head_cough_doctor.mp3",
                            "head_cough.mp3",
                            "here_it_comes.mp3",
                            "hop_table.mp3",
                            "hunting_license.mp3",
                            "i_love_it.mp3",
                            "jams_in.mp3",
                            "joking.mp3",
                            "knocks_down.mp3",                            
                            "long_range.mp3",
                            "mil_move_2_shot.mp3",
                            "monster_jam.mp3",
                            "move_it.mp3",
                            "mudpie.mp3",
                            "my_house.mp3",
                            "no_good.mp3",
                            "no_mans_land.mp3",
                            "no_surprise.mp3",
                            "no_way.mp3",
                            "o_no_he_didnt.mp3",
                            "ouch.mp3",
                            "party.mp3",
                            "rejected.mp3",
                            "retirement.mp3",
                            "road_rage.mp3",
                            "scuse_me.mp3",
                            "section_c.mp3",
                            "shoes.mp3",
                            "shove_love.mp3",
                            "slam_home.mp3",
                            "sorry.mp3",
                            "spectacular_dunk.mp3",
                            "swipes_away.mp3",
                            "too_far.mp3",
                            "tye_dye.mp3",
                            "uhoh.mp3",
                            "uncool.mp3",
                            "waffle_house.mp3",
                            "whats_your_name.mp3",
                            "where_ref.mp3",
                            "wild_shot.mp3",
                            "yonder.mp3"];

var sourcefiles = new Array(".");







// buffer loader class

function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = [];
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  };

  request.onerror = function(e) {
    alert('BufferLoader: XHR error');
    console.log(e);
  };

  request.send();
};

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
      this.loadBuffer(this.urlList[i], i);
};

// END bufferloader class

// BEGIN custom code


function generatePanelLinks(idName, linkfiles, modifyLinktext) {

  var links = $("#" + idName).append('<ul class="list-group">');

    $.each(soundfiles, function (i) {
        links.append("<li class=\"list-group-item\"><a href=\"" +
                       linkfiles[i] + "\" target=\"_blank\">" + 
                       modifyLinktext(soundfiles[i]) + "</a></li>");
    });

}


function generateSourceLinks() {
  generatePanelLinks("sourcelinks", sourcefiles, function (s) { return s.slice(0, -4); });
}


function generateDownloadLinks() {
  // NOTICE: Maybe I have to change the linkfiles to an absolute path.
  generatePanelLinks("downloadlinks", soundfiles, function (s) { return s; });
}


function loadFilesInMemory() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();

    bufferLoader = new BufferLoader(
        context,
        soundfiles,
        finishedLoading
    );

    bufferLoader.load();
}


function init() {
  generateSourceLinks();
  generateDownloadLinks();
  loadFilesInMemory();
}


function generateListOfHotKeys() {
    var hotkeys = [];
  for(var i = 48; i <= 57; i++) {
        hotkeys.push(i);
  }
    for(var i = 97; i <= 122; i++) {
        hotkeys.push(i);
  }
  return hotkeys;
}
  


function createHotkeys() {
  var hotkeys = generateListOfHotKeys();

    $.each(soundfiles, function (i) {
        var btn = document.getElementById(i);
        var badge = document.createElement("span");
        badge.classList.add("badge", "hotkey-badge");
        badge.style.marginLeft = "1.2em";
        badge.innerHTML = String.fromCharCode(hotkeys[i]);
        btn.appendChild(badge);
    });
}

function createButtonWrapper (){
  var wrapper = document.createElement("div");
  $(wrapper).addClass('col-xs-12 col-sm-6 col-md-4');
  return wrapper;
}

function cycleButtonColors(i){
  var options = ['primary','success','info','warning','danger'];
  var random = options[Math.floor(Math.random() * options.length)];
  var selected = options[i%options.length];
  return selected;
}

function displayPlayButtons () {
    $.each(soundfiles, function (i) {
        var btn = document.createElement("button");
        var buttonColor = 'btn-' + cycleButtonColors(i);
        btn.type = "button";
        btn.innerHTML = "<strong>" + soundfiles[i].slice(0,-4) + "</strong>";
        btn.id = i;
        btn.onclick = function() { playComposition(bList[this.id]); };
        btn.classList.add("btn", buttonColor, "btn-block", "spaced-button");
        
        var wrapper = createButtonWrapper();
        wrapper.appendChild(btn);
        document.getElementById("buttons").appendChild(wrapper);
    });
}


function setUpToggleHotkeys() {
    $("#togglehotkeys").bind("click", function () {
        $("span.badge").toggleClass("hidden");
        $(this).text( $(this).text() == "Show Hotkeys" ? "Hide Hotkeys" : "Show Hotkeys");
    });
}


function addKeyboardControls() {
    $(document).keypress(function (e) {
        // for 0 to 9
        if (e.which >= 48 && e.which <= 57) {
            $("#" + (e.which - 48)).click();
        }
        // for a to z
        else if (e.which >= 97 && e.which <= 122)
        {
            $("#" + (e.which - 87)).click();
        }
    });
}


function loadUIElements() {
    $("#loading").hide();

  displayPlayButtons();
    createHotkeys();
  setUpToggleHotkeys();
  addKeyboardControls();
}



function finishedLoading(bufferList) {
  // HACK: Makes the parameter global so that we get access to it. 
  // It is implicitly loaded
    bList = bufferList;
  
  loadUIElements();
}

function IsNumeric(input)
{
    return (input - 0) == input && (''+input).trim().length > 0;
}


function play(buffer, drive, gain) {
  var source = context.createBufferSource();
  source.buffer = buffer;

  // check if we are allowing sounds to overlap
  if (!allowOverlap){
    stopPlaying();
  }

  activeBuffers.push(source);

  var gainNode = context.createGain();
  
  var adjustedGain = IsNumeric(gain) && gain > 0 ? gain / 10 : 0;

  gainNode.gain.value = adjustedGain;
  activeBuffers.push(gainNode);
  
  source.connect(gainNode);
  
  if (drive === 0)
  {
    gainNode.connect(context.destination); 

  } else {
    // workaround for using overdrive which is a bit low in volume
    var overdrive = new Overdrive(context);
    overdrive.drive = drive;
    overdrive.color = 8000;
    gainNode.connect(overdrive.input);

    var gain2 = context.createGain();
    overdrive.connect(gain2);
    activeBuffers.push(gain2);
    
    // apply second gain of 2.6
    gain2.gain.value = 2.6;
    gain2.connect(context.destination);
  }
  
  source.start(0);
}



function playComposition(buf) {
  var drive = document.getElementById("drive").value / 10.0;
  var gain = document.getElementById("gain").value;
  play(buf, drive, gain);
}

function stopPlaying (){
  for (var i = 0; i < activeBuffers.length; i++) {
      activeBuffers[i].disconnect(0);
  }
  activeBuffers = [];
}

// hitting escape or enter will stop all sounds
document.onkeyup = function(e) {
  if (e.keyCode == 13 || e.keyCode == 27) {
    stopPlaying();
  }
};
