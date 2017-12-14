module.exports = function(controller) {

    // create special handlers for certain actions in buttons
    // if the button action is 'say', act as if user said that thing
    controller.middleware.receive.use(function(bot, message, next) {
      if (message.type == 'interactive_message_callback') {
        if (message.actions[0].name.match(/^say$/)) {
            var reply = message.original_message;

            for (var a = 0; a < reply.attachments.length; a++) {
                reply.attachments[a].actions = null;
            }

            var person = '<@' + message.user + '>';
            if (message.channel[0] == 'D') {
                person = 'You';
            }

            reply.attachments.push(
                {
                    text: person + ' said, ' + message.actions[0].value,
                }
            );

            bot.replyInteractive(message, reply);
  
         }
      }
      
      next();    
      
    });
  
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


}
