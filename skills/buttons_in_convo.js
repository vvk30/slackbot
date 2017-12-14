module.exports = function(controller) {
controller.hears(['quesin'], 'direct_message,direct_mention,mention', function(bot, message) {
  bot.startConversation(message, function(err, convo) {

    convo.ask({
        attachments:[
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
        ]
    },[
        {
            pattern: "yes",
            callback: function(reply, convo) {
                convo.say('FABULOUS');
                convo.next();
                // do something awesome here.
            }
        },
        {
            pattern: "no",
            callback: function(reply, convo) {
                convo.say('Too bad');
                convo.next();
            }
        },
        {
            default: true,
            callback: function(reply, convo) {
                // do nothing
            }
        }
    ]);
});
});
}