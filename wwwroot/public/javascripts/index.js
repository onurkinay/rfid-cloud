$(document).ready(function () {
   
  var ws = new WebSocket('wss://' + location.host);
  ws.onopen = function () {
    console.log('Successfully connect WebSocket');
    $("#deviceSuccess").toggle();
  }

  ws.onerror = function () {
    console.log('Not successfully connect WebSocket');
    $("#deviceDanger").toggle();
  }

  ws.onmessage = function (message) {
    console.log('receive message' + message.data); 
    if(message.data != "no data"){
    try {
      var obj = JSON.parse(message.data);
      var IDs = JSON.parse(obj.cardID);
      console.log(obj.cardID[1]);
      var kimlik = obj.cardID[1];
if(obj.cardID != 0){
  $("#deviceDanger").css("display", "none");
  $("#deviceSuccess").css("display", "block");

      if(kimlik == 3){
      $("#card1").css("display", "none");
      $("#card2").css("display", "block");
      }else if(kimlik == 1){
        $("#card2").css("display", "none");
        $("#card1").css("display", "block");
      }else{


      }}else{

        $("#deviceDanger").css("display", "block");
        $("#deviceSuccess").css("display", "none");

        $("#card2").css("display", "none");
        $("#card1").css("display", "none");
      }
       
    } catch (err) {
      console.error(err);
    }
  }else {
    
    $("#deviceDanger").css("display", "block");
    $("#deviceSuccess").css("display", "none");
  }
}
});
