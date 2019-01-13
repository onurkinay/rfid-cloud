
'use strict';
 
var clientFromConnectionString = require('azure-iot-device-amqp').clientFromConnectionString;
var Message = require('azure-iot-device').Message;

var cardID = 0;

var rfid=require('node-rfid');

var connStr = 'HostName=checkpi.azure-devices.net;DeviceId=mypi;SharedAccessKey=cswX2P1zsl9TVutZdzklqaz1MfR7ej71S7zN83m04o0=';
 
var client = clientFromConnectionString(connStr);
 
function printResultFor(op) {
  return function printResult(err, res) {
    if (err) console.log(op + ' error: ' + err.toString());
    if (res) console.log(op + ' status: ' + res.constructor.name);
  };
}
  

var connectCallback = function (err) {
	

  if (err) {
    console.log('Could not connect to IoT Hub: ' + err);
  } else {
    console.log('Connected to the Cloud');
   
    client.on('message', function (msg) {
      client.complete(msg, printResultFor('completed'));
 
      if ( msg.data[0] == 42) {
        console.log("\x1b[33m",'Command = ' + msg.data);
        console.log("\x1b[0m", '------------------');
      } else {
        console.log("\x1b[31m",'Command = ' + msg.data);
        console.log("\x1b[0m", '------------------');
      }
    });
 
    // Create a message and send it to the IoT Hub every second
    setInterval(function(){
      
      rfid.read(function(err,result){
        if(err) console.log("Sorry, some hardware error occurred"); //some kind of hardware/wire error
         cardID = result;
    });
      var data = JSON.stringify({ cardID: cardID });
      var message = new Message(data);
 
      console.log("Telemetry sent: " + message.getData());
      client.sendEvent(message, printResultFor('send'));
    }, 3000);
  }
};
 
console.log("\x1b[31m",'A1Q Authentication');
console.log("\x1b[0m", '==================');
 
client.open(connectCallback);

process.on('SIGINT', function() {
  console.log("Caught interrupt signal");
  process.exit();
});
