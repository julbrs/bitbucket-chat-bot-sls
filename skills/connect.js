const db = require('../lib/db-controller')

module.exports = (controller) => {
    controller.hears('connect', ['DM', 'message_received'], function (bot, message, callback) {


      return bot.say("let's connect")
    });

}
