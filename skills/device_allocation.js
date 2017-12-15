module.exports = function(controller,rasa) {
//var rasa = require('botkit-rasa')({rasa_uri: 'http://35.193.107.90:5000', rasa_project: 'default'}); 
//controller.middleware.receive.use(rasa.receive);  
controller.hears(['device_request'], 'direct_message,direct_mention,mention',rasa.hears, function(bot, message) {
  bot.reply(message,"Hi user, i am raising ticket for you.");

  bot.startConversation(message, function(err,convo){
     convo.addQuestion({text:'Please enter your employee code.'},[
       {
         pattern:'X[0-9]{4}',
         callback: function(response, convo){
           //convo.gotoThread('ask_ticket_description');
           bot.reply(message,"ok, got your employee code.");
           convo.gotoThread('ask_ticket_description');
         }
       },
       {
         pattern:'default',
         callback: function(response,convo){
           convo.repeat();
         }
       }
     ],{key:'employee_id'},'default');         
    
  convo.addQuestion({text:'Please describe your query in brief.'},[
       {
         pattern:'.+',
         callback: function(response, convo){
           convo.gotoThread('ticket_info_confirmation');
         }
       },
       {
         pattern:'stop',
         callback: function(response,convo){
           convo.stop();
         }
       },
     ],{key:'ticket_description'},'ask_ticket_description');
    
   
     convo.beforeThread('ticket_info_confirmation', function(convo, next)
    {
      var employee_id = convo.extractResponse('employee_id');
      var ticket_description = convo.extractResponse('ticket_description');
      convo.setVar('employee_id', employee_id);
      convo.setVar('ticket_description', ticket_description);
      
      next();
    });

    //present captured ticket information and ask for confirmation from user
    convo.addMessage({text:'Here is information for ticket I got.'}, 'ticket_info_confirmation');
    convo.addMessage({text:'Employee id: {{vars.employee_id}}'},'ticket_info_confirmation');
    convo.addMessage({text:'ticket description: {{vars.ticket_description}}', action:'verify_ticket_info'},'ticket_info_confirmation');
    //convo.gotoThread('verify_ticket_info');
    convo.addQuestion(
      {attachments:[
            {
                title: 'Do you want to proceed?',
                callback_id: '123',
                attachment_type: 'default',
                actions: [
                    {
                        "name":"say",
                        "text": "Yes",
                        "value": "yes",
                        "type": "button",
                    },
                    {
                        "name":"say",
                        "text": "No",
                        "value": "no",
                        "type": "button",
                    }
                ]
            }
        ]},
      [
        {
            pattern: "yes",
            callback: function(reply, convo) {
                convo.say('We\'re raising your ticket. Hang tight!');  
                convo.say("Ticket has been raised");
                convo.next();
                // do something awesome here.
            }
        },
        {
            pattern: "no",
            callback: function(reply, convo) {
                convo.say('Too bad');
                convo.stop();
            }
        },
        {
            default: true,
            callback: function(reply, convo) {
                // do nothing
            }
        }
    ],{},'ticket_info_confirmation');

    /*
    {
      "_id": {
      },
      "id": "T7T7WKK3L",
      "createdBy": "U8DQ6PRCH",
      "url": "https://botcreationworkspace.slack.com/",
      "name": "BotCreation",
      "bot": {
          "user_id": "U8E3H9NHZ",
          "createdBy": "U8DQ6PRCH",
          "name": "newbot"
      }
    }
    */
    //perform save operation on end of conversation
    convo.on('end', function(convo) {
           if (convo.status == 'stopped') {
             //stopped status indicates ticket raise failed.
             bot.reply(message," ticket raising process failed.");
           }
            if(convo.status == 'completed'){
              //completed status indicates success.
             bot.reply(message," ticket raising process completed.")
            //direct message ---------------- Api call here =  ticket/create
              var employee_id = convo.extractResponse('employee_id');
              var ticket_description = convo.extractResponse('ticket_description');
             bot.api.im.open({
                user: 'U7T5M6L3V'//send manager for ticket approval
              }, (err, res) => {
                  if (err) {
                      bot.botkit.log('Failed to open IM with user', err)
                  }
                  console.log(res);
                  bot.startConversation({
                      user: 'U7T5M6L3V',//manager in context
                      channel: res.channel.id,
                      text: 'WOWZA... 1....2'
                  }, (err, convo1) => {
                      convo1.addQuestion(
                {attachments:[
                      {
                          title: 'Ticket',
                          text:'Employee id: '+employee_id+'\n'+ticket_description+'\n'+'Do you want to approve this request?',
                          color: "#36a64f",
                          callback_id: '124',
                          attachment_type: 'default',
                          actions: [
                              {
                                  "name":"say",
                                  "text": "Approve",
                                  "value": "yes",
                                  "type": "button",
                              },
                              {
                                  "name":"say",
                                  "text": "Reject",
                                  "value": "no",
                                  "type": "button",
                              }
                          ]
                      }
                  ]},
                [
                  {
                      pattern: "yes",
                      callback: function(reply, convo1) {
                          convo1.say('Ticket approved');
                          convo1.next();
                          // do something awesome here.
                      }
                  },
                  {
                      pattern: "no",
                      callback: function(reply, convo1) {
                          convo1.say('Reason for rejecting the ticket?');
                          convo1.stop();
                      }
                  },
                  {
                      default: true,
                      callback: function(reply, convo) {
                          // do nothing
                      }
                  }
              ],{},'default');
                    
                    
             convo1.on('end', function(convo1) {
           if (convo1.status == 'stopped') {
             //stopped status indicates ticket raise failed.
             bot.reply(message,"Your ticket has been rejected");
             // bot.api.im.open({
             //    user: 'U8DQ6PRCH'
             //  }, (err, res) => {
             //      if (err) {
             //          bot.botkit.log('Failed to open IM with user', err)
             //      }
             //      console.log(res);
             //      bot.startConversation({
             //          user: 'U8DQ6PRCH',
             //          channel: res.channel.id,
             //          text: 'WOWZA... 1....2'
             //       }), (err, convo2) => {
             //        convo2.say("Your ticket has been rejected");
             //      }
             //   });     
             
           }
             if(convo1.status == 'completed'){
           //    //completed status indicates success.
             bot.reply(message,"Your ticket has been approved")
           //  //direct message ---------------- Api call here =  ticket/create
             // bot.api.im.open({
             //    user: 'U8DQ6PRCH'
             //  }, (err, res) => {
             //      if (err) {
             //          bot.botkit.log('Failed to open IM with user', err)
             //      }
             //      console.log(res);
             //      bot.startConversation({
             //          user: 'U8DQ6PRCH',
             //          channel: res.channel.id,
             //          text: 'WOWZA... 1....2'
             //       }), (err, convo2) => {
             //        convo2.say("Your ticket has been approved");
             //      }
             //   });                    
             }
                  });
                  });
              })
           }      
    });
});
});
  
  /*
  //dont require this - since it not required.
  controller.on('interactive_message_callback', function(bot, message) {
    
    // These 3 lines are used to parse out the id's
    var ids = message.callback_id.split(/\-/);
    var user_id = ids[0];
    var item_id = ids[1];

    var callbackId = message.callback_id;
    
    // Example use of Select case method for evaluating the callback ID
    // Callback ID 123 for weather bot webcam
    switch(callbackId) {
    case "123":
        //bot.replyInteractive(message, "Button works!");
        bot.reply(message, "Button hit");
        break;
    // Add more cases here to handle for multiple buttons    
    default:
        // For debugging
        bot.reply(message, 'The callback ID has not been defined');
    }
});
*/
}

