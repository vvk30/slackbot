module.exports = function(controller) {
var rasa = require('botkit-rasa')({rasa_uri: 'http://35.193.107.90:5000', rasa_project: 'default'}); 
controller.middleware.receive.use(rasa.receive);  
controller.hears(['device_request3'], 'direct_message,direct_mention,mention',rasa.hears,function(bot, message) {
  bot.reply(message,"Hi user.");
  bot.say(message.intent);
  bot.say(message.entities);
  /*
  bot.startConversation(message, function(err,convo){
     convo.addQuestion({text:'Please enter your employee code.'},[
       {
         pattern:'.*',
         callback: function(response, convo){
           //convo.gotoThread('ask_ticket_description');
           bot.reply(message,"ok, got your employee code.");           
         }
       },
       {
         pattern:'default',
         callback: function(response,convo){
           convo.repeat();
         }
       }
     ],{key:'employee_id_response'},'default'); 
    
    
    convo.addQuestion({text:'Do you want me to raise ticket?', function(bot,message){
      
    }});
    
   });
   */
  });
}


// conversation1
// user - Hi
// bot - Hi
// user : query
// bot - rasa -
//   1.intent = device_request
//     gotoThread('device allocation')
//   2.intent = software_installation
//     gotoThread('')