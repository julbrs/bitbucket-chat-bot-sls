var hangout = require('../endpoints/hangout')
var should = require('chai').should()
const fs = require('fs');


// Load env
require('dotenv').config()

// setup default message
let bodyraw = fs.readFileSync('test/data/message_from_hangout.json');
let defaultmsg = JSON.parse(bodyraw);
defaultmsg.token = process.env.GOOGLE_TOKEN

describe('Hangout', function() {
  it('should send 401 if no token', (done) => {
    var body = {
      type: "MESSAGE"
    }
    var event = {
      body: JSON.stringify(body)
    }
    hangout.receive(event, null).then((result)=> {
      result.statusCode.should.equal(401)
      done()

    }).catch((err)=> {
      done(err)
    })
  })

  it('should send 401 if not the right token', (done) => {
    var body = {
      type: "MESSAGE",
      token: 'fff'
    }
    var event = {
      body: JSON.stringify(body)
    }
    hangout.receive(event, null).then((result)=> {
      result.statusCode.should.equal(401)
      done()

    }).catch((err)=> {
      done(err)
    })
  })

  it('should send 200 if the right token', (done) => {
    var body = {
      type: "MESSAGE",
      token: process.env.GOOGLE_TOKEN,
      message: {}
    }
    var event = {
      body: JSON.stringify(body)
    }
    hangout.receive(event, null).then((result)=> {
      result.statusCode.should.equal(200)
      done()

    }).catch((err)=> {
      done(err)
    })
  })
  it('should respond help message to [hello]', (done) => {
    var event = {
      body: JSON.stringify(defaultmsg)
    }
    hangout.receive(event, null).then((result)=> {
      result.statusCode.should.equal(200)
      data = JSON.parse(result.body)
      data.text.should.contains('help')
      done()

    }).catch((err)=> {
      done(err)
    })
  })
  it('should respond with help info to [help]')
  it('should respond with connect info to [connect]', (done) => {
    defaultmsg.message.text = 'connect'
    var event = {
      body: JSON.stringify(defaultmsg)
    }
    hangout.receive(event, null).then((result)=> {
      result.statusCode.should.equal(200)
      data = JSON.parse(result.body)
      data.text.should.contains('connect')
      done()

    }).catch((err)=> {
      done(err)
    })
  })
  it('should respond with login info to [login]')
  it('should respond with logout info to [logout]')
  it('should respond with identified info to [whoami]', (done) => {
    defaultmsg.message.text = 'whoami'
    var event = {
      body: JSON.stringify(defaultmsg)
    }
    hangout.receive(event, null, (err, result) => {
      if(err) {
        console.log("err " + err)
        done(err)
      }
      result.statusCode.should.equal(200)
      data = JSON.parse(result.body)
      data.text.should.contains('undefined')
      done()
    })
  })
  it('should respond with repo info to [list]')

});
