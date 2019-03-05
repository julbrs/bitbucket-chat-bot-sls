// Require core bot ressources
const Controller = require('../lib/bot-controller')

// Load env
require('dotenv').config()

/* Receive a message from Gogle Hangout Chat */
module.exports.receive = (event, context, callback) => {
  var body = JSON.parse(event.body)

  // Check google tokem
  if(body == null || !process.env.GOOGLE_TOKEN || process.env.GOOGLE_TOKEN != body.token) {
    return {
      statusCode: 401,
      body: "Token GOOGLE_TOKEN not valid or not present"
    };
  }

  const bot = Controller.bot({
    my: "params"
  })

  // add skills to the bot !
  const normalizedPath = require("path").join(__dirname, "../skills");
  require("fs").readdirSync(normalizedPath).forEach(function(file) {
      require("../skills/" + file)(bot);
  });

  if(body.type != 'MESSAGE') {
    var error = " I understand only MESSAGE type >> " + body.type
    callback(error)
  }
  else {
    var message = body.message
    bot.trigger(message.space.type, message, callback)
  }
};
