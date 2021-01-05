var five = require("johnny-five");
var board = new five.Board();

var pubnub = require('pubnub').init({
  publish_key: 'pub-c-1f9fb199-56d5-40a1-b80c-312fe960f706', // Use your pub key
  subscribe_key: 'sub-c-5388a5c2-edf2-11e8-aba4-3a82e8287a69' // Use your sub key
});

var channel = 'stepper'

board.on("ready", function() {

  var stepper = new five.Stepper({
    type: five.Stepper.TYPE.FOUR_WIRE,
    stepsPerRev: 2046,
    pins: {
      motor1: 8,
      motor2: 9,
      motor3: 10,
      motor4: 11
    }
  });

  pubnub.subscribe({
    channel: channel,
    message: function(m) {
      console.log("received message")
      if (m.dir === "cw") {
        stepper.rpm(300).cw().accel(20).decel(10).step(210, function() {
            console.log("Done moving in cw");
          });
      } else if (m.dir === "ccw") {
        stepper.rpm(300).ccw().accel(20).decel(10).step(210, function() {
          console.log("Done moving in ccw");
        });
      }
    },
    error: function(err) {console.log(err);}
    })
  })
