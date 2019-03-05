// Load env
require('dotenv').config()
var { google } = require('googleapis');

const api_version = 'v1'


setup_google_auth = (worker, next) => {
  let google_auth_params = {}

  if(process.env.GOOGLE_APPLICATION_CREDENTIALS_DATA) {
    // Handle json file as a environement variable for Heroku like systems
    google_auth_params = {
        credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_DATA)
    }
  }
  else if (!process.env.GOOGLE_APPLICATION_CREDENTIALS && !process.env.GOOGLE_APPLICATION_CREDENTIALS_DATA) {
      console.log('Error: Specify a GOOGLE_APPLICATION_CREDENTIALS or GOOGLE_APPLICATION_CREDENTIALS_DATA in environment.');
      process.exit(1);
  }

  let params = {
      scopes: 'https://www.googleapis.com/auth/chat.bot',
      ...google_auth_params
  }

  google
      .auth
      .getClient(params)
      .then(client => {
          worker.authClient = client
          worker.api = google.chat({version: api_version, auth: worker.authClient})
          next();
      })
      .catch(err => {
          console.error('Could not get google auth client !')
          throw new Error(err);
      })
}


/* Receive a event from Bitbucket */
module.exports.event = (event, context, callback) => {
  var body = JSON.parse(event.body)

  var actorDisplayName = body.actor.display_name;
  var actorAvatarImageLink = body.actor.links.avatar.href;

  var typeNameMain;
  var typeNameOperation;
  var type = event.headers['X-Event-Key'];

  var typeSplitted = type.split(":");
  switch(typeSplitted[0]) {
      case 'pullrequest':
          typeNameMain = 'Pull request';
          break;
      default:
          typeNameMain = 'Pull request';
  }
  var operationSplitted = typeSplitted[1].split("_");
  var operation = "";
  operationSplitted.forEach(element => {
      operation += element+" ";
  });

  var reviewersString = '';
  let pr = body.pullrequest
  pr.reviewers.forEach(element => {
    reviewersString += reviewersString+" "+element.display_name+", ";
  });
  reviewersString = reviewersString.substr(0, reviewersString.length-2);

  //console.log(body)
  bot= {}
  setup_google_auth(bot, () => {

    message = {
      parent: "spaces/4LWz7AAAAAE",
      threadKey: undefined,
      requestBody: {
        text: typeNameMain+": "+operation + "["+pr.title+"] " + pr.links.html.href
      }
    }
    bot.api.spaces.messages.create(message)
      .then(res => {
          console.log('Successfully sent message to Google Hangouts : ' + res.data.name);
      })
      .catch(err => {
          console.log('Error while sending message to Google Hangouts', err);
      });
  })





  console.log(type)
  // get repo id

  // get list of all spaces connected to this repo id

    // for each space then launch the com !
  // if no space then we can do something ? delete the trigger on BB side ?

  callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      text: "hello bitbucket!"
    }),
  })
};
