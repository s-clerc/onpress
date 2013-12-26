(function(){
"use strict";
xtag.customEvents.press = {
    maxHold: 1500,
    attach: [
      //Touch events
      "touchstart",
      "touchmove",
      "touchleave",
      "touchcancel",
      "touchend",
      //Mouse events
      "mousedown",
      "mouseleave",
      "mouseup"
    ],
    condition: function (event) {
      //Creates data object
      var el = event.target,
          data;
      if (!el.xtag) el.xtag = {};
      if (!el.xtag.customEvents) el.xtag.customEvents = {};
      if (!el.xtag.customEvents.press) el.xtag.customEvents.press = {data: {activated: false}};
      if (el.xtag.customEvents.press.data.activated) return false;
      data = el.xtag.customEvents.press.data,
        type = event.type;
      //Start event
      if (type === "touchstart", "mousedown") {
        //Be a bit stupid to do this when not neccessary
        if (data.activated) return false;
         //Time is used to determine wheather or not the finget had been held too long
         data.starttime = Date.now();
         data.canceled = false;
        //Potentially used in the future
         data.starttype = type === "touchstart" ? "touch" : "mouse";
        //Cancels event if finger is moved or they stop touching/clicking the the button. Also cancels if touchcancel.
      } else if (type === "touchleave", "mouseleave", "touchmove", "touchcancel") {
        data.canceled = true;
      } else if (type === "touchend", "mouseup" && !data.canceled) {
        //Time between start of press to finish
        var time = Data.now(),
            difference = time - data.starttime;
        if (difference < 0) {
          console.warn("The system's internal clock is most likely damaged or incorrectly set!");
          difference = -difference;
        }
        //If they are holding the button too long, a longpress event would fire, not a press event.
        // 1.5s by default
        if (difference > xtag.customEvents.press.maxHold) return false;
        //100ms grace period between presses
        setTimeout(function () {
         this.activated=false;
        }.bind(el.xtag.customEvents.press.data), 100);
        el.xtag.customEvents.press.data.activated = true;
        return true;
      }
      return false;
    }
}
})();