var Arduino = require("./arduino.js");
var blah = new Arduino("/dev/ttyACM1", { });
blah.ready(function() {
    setInterval(function(){
        blah.send("i command thee", function() {
            console.log("SENT")
        })
    },200);
})
