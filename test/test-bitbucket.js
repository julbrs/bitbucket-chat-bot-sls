var bitbucket = require('../endpoints/bitbucket')
var should = require('chai').should()
const fs = require('fs');


// Load env
require('dotenv').config()


describe('Bitbucket', function() {
  it('handle a PR creation event', (done) => {
    let bodyraw = fs.readFileSync('test/data/event_bb_pr_created.json')
    let defaultmsg = JSON.parse(bodyraw)
    var event = {
      body: JSON.stringify(defaultmsg),
      headers: {
        'X-Event-Key': 'pullrequest:created'
      }
    }
    bitbucket.event(event, null, (error, result) => {
      if(error) {
        done(error)
      }
      console.log(result)
      done()
    })
  })
});
