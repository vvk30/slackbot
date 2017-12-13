module.exports = function(controller) {

controller.hears(['test button'], 'direct_message,direct_mention,mention', function (bot, message) {
    var testButtonReply = {
                username: 'Button Bot' ,
                text: 'This is a test message with a button',
                replace_original: 'true',
                attachments: [
                    {
                        fallback: "fallback text",
                        callback_id: '123',
                        attachment_type: 'default',
                        title: 'message title',
                        text: 'message content',
                        color: '#0075C7',
                        actions: [
                            {
                              "name": "button name",
                              "text": "button text",
                              "type": "button",
                              "value": "whatever you want to pass into the interactive_message_callback"}
                        ]
                    }
                ],
                icon_url: 'http://14379-presscdn-0-86.pagely.netdna-cdn.com/wp-content/uploads/2014/05/ButtonButton.jpg'
                
            }
    bot.reply(message, testButtonReply);            
});
  
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
        bot.replyInteractive(message, "Button works!");
        break;
    // Add more cases here to handle for multiple buttons    
    default:
        // For debugging
        bot.reply(message, 'The callback ID has not been defined');
    }
});
}