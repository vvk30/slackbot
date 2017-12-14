module.exports = function(controller) {

controller.hears(['software installation'], 'direct_message,direct_mention,mention', function(bot, message) {
  //bot.reply(message,"Hi user, i am raising ticket for you.");

  bot.startConversation(message, function(err,convo){
     convo.addQuestion({text:'Please enter your employee code.'},[
       {
         pattern:'X[0-9]{4}',
         callback: function(response, convo){
           //convo.gotoThread('ask_ticket_description');
           bot.reply(message,"ok, got your employee code.");
           convo.gotoThread('choose_software_install_question');
         }
       },
       {
         pattern:'default',
         callback: function(response,convo){
           convo.stop();
         }
       }
     ],{key:'employee_id'},'default');         

    //question for software installation - give options to user 1) antivirus 2) freeware 3)Open Source 4)Licensed softwares.
    convo.addQuestion(
      {attachments:[
            {
                title: 'Which type of software you want to install?',
                callback_id: '456',
                attachment_type: 'default',
                actions: [
                    {
                        "name":"say",
                        "text": "antivirus",
                        "value": "antivirus",
                        "type": "button",
                    },
                    {
                        "name":"say",
                        "text": "freeware",
                        "value": "freeware",
                        "type": "button",
                    },
                    {
                        "name":"say",
                        "text": "Open Source",
                        "value": "Open Source",
                        "type": "button",
                    },
                    {
                        "name":"say",
                        "text":"licensed softwares",
                        "value": "licensed softwares",
                        "type": "button",                        
                    }
                ]
            }
        ]},
      [
        {
            pattern: "antivirus",
            callback: function(reply, convo) {
                convo.say('Installing antivirus softwares');     
                convo.setVar('software_type', 'antivirus');
                convo.gotoThread('ask_ticket_description');
                // do something awesome here.
            }
        },
        {
            pattern: "freeware",
            callback: function(reply, convo) {
                convo.say('Installing freeware softwares');  
                convo.setVar('software_type', 'freeware');
                convo.gotoThread('ask_ticket_description');
            }
        },
        {
            pattern: "Open Source",
            callback: function(reply, convo) {
                convo.say('Installing Open Source software');                
                convo.setVar('software_type', 'open source');
                convo.gotoThread('ask_ticket_description');

                // do something awesome here.
            }
        },
        {
            pattern: "licensed softwares",
            callback: function(reply, convo) {
                convo.say('Installing licensed softwares');  
                convo.setVar('software_type', 'licensed software');
                convo.gotoThread('ask_ticket_description');
            }
        },
        {
            default: true,
            callback: function(reply, convo) {
                // do nothing
              convo.repeat();
            }
        }
    ],{},'choose_software_install_question');

    convo.addQuestion({text:'Please describe your query in brief.'},[
       {
         pattern:'.+',
         callback: function(response, convo){
           convo.gotoThread('ticket_info_confirmation');
         }
       },
       {
         pattern:'',
         callback: function(response,convo){
           convo.repeat();
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
    convo.addMessage({text:'software type: {{vars.software_type}}'},'ticket_info_confirmation');
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

    //perform save operation on end of conversation
    convo.on('end', function(convo) {
           if (convo.status == 'stopped') {
             //stopped status indicates ticket raise failed.
             bot.reply(message," ticket raising process failed.");
           }
            if(convo.status == 'completed'){
              //completed status indicates success.
             bot.reply(message," ticket raising process completed.")   
           }      
    });
});
});

}