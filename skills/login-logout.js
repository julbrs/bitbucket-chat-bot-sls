const db = require('../lib/db-controller')

module.exports = (controller) => {

    controller.hears('login', 'DM', function (bot, message, callback) {
      user = {
        id: message.sender.name,
        name: message.sender.displayName
      }
      db.save(user, (err, data) => {
        if(err) {
          console.log(err)
          callback(null, bot.say("error during login"))
        }
        else {
          callback(null, bot.say("logged as " + user.name))
        }

      } )
    });

    controller.hears('whoami', 'DM', function (bot, message, callback) {
    db.get(message.sender.name, (err, data) => {
      if(err) {
        console.log(err)
        callback(null, bot.say("You are not yet identified."))
      }
      else {
        callback(null, bot.say("You are " + data.Item.name))
      }

    } )
    });

    controller.hears('logout', 'DM', function (bot, message) {
      console.log("You want to logout !")
    });
}
