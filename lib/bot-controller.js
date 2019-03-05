
// Bot creation

module.exports.bot = () => {
  // define a bot !
  bot = {}

  bot.events = {}

  bot.debug = (msg) => {
    if(process.env.SLS_DEBUG) {
      console.log(msg)
    }
  }

  bot.hears = (keywords, events, cb) => {
    if (typeof(keywords) == 'string') {
      keywords = [keywords];
    }

    if (keywords instanceof RegExp) {
      keywords = [keywords];
    }

    if (typeof(events) == 'string') {
      events = events.split(/\,/g).map(function(str) {
        return str.trim();
      });
    }

    var test_function = (tests, message) => {
        for (var t = 0; t < tests.length; t++) {
            if (message.text) {
                /*
                 * the pattern might be a string to match (including regular expression syntax)
                 * or it might be a prebuilt regular expression
                 */
                var test = null;
                if (typeof(tests[t]) == 'string') {
                    try {
                        test = new RegExp(tests[t], 'i');
                    } catch (err) {
                        bot.log('Error in regular expression: ' + tests[t] + ': ' + err);
                        return false;
                    }
                    if (!test) {
                        return false;
                    }
                } else {
                    test = tests[t];
                }

                var match = message.text.match(test);
                if (match) {
                    message.match = match;
                    return true;
                }
            }
        }
        return false;
    };

    for (var e = 0; e < events.length; e++) {
      (function(keywords, test_function) {
        bot.on(events[e], (bot, message, call) => {

          if (test_function(keywords, message)) {
            bot.debug('I HEARD ' + keywords);

            cb.apply(this, [bot,message, call]);
            return false;
          }
        }, true);
      })(keywords, test_function);
    }
  }

  // populate events skills
  bot.on = (event, cb) => {
    var events = (typeof(event) == 'string') ? event.split(/\,/g) : event;

    // Trim any whitespace out of the event name.
    events = events.map(function(event) { return event.trim(); });

    for (var e in events) {
      bot.debug("adding event handler on " + events[e])
      if (!bot.events[events[e]]) {
          bot.events[events[e]] = [];
      }
      bot.events[events[e]].push(cb);
    }
    return bot;
  };

  bot.trigger = function(event, data, callback) {
    bot.debug("Will answer [" + event+"/"+data.text+"]")
    if (bot.events[event]) {
      for (var e = 0; e < this.events[event].length; e++) {
        var res = bot.events[event][e].apply(bot, [bot, data, callback]);

        if (res === false) {
          return;
        }
      }
    }
  }

  // // send a message
  // bot.answer = (msg) => {
  //   if(!msg) {
  //     return {
  //       statusCode: 401,
  //       body: "No input message"
  //     };
  //   }
  //   bot.debug("Will answer [" + msg.text+"]")
  //   if(bot.events[msg.space.type]) {
  //     bot.events[msg.space.type].forEach(item => {
  //       if(!item(bot, msg)) return
  //       //console.log(item(bot, msg))
  //     })
  //     // TODO change this answer
  //
  //     return bot.say('bla')
  //
  //   }
  //   return {
  //     statusCode: 401,
  //     body: "No skill setup for that"
  //   };
  // }

  // send a message
  bot.say = (msg) => {
    return {
      statusCode: 200,
      body: JSON.stringify({
        text: msg
      }),
    };
  }
  return bot;
}
