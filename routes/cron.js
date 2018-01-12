var cron = require('node-cron');
var request = require('request');
var nodemailer = require('nodemailer');

var step = '*/30 * * * *';
// step = '*/5 * * * * *';

var task = cron.schedule(step, function () {
  request.get({
    url: 'https://poloniex.com/public?command=returnTicker',
    json: true
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var result = Object.keys(body)
        .filter(key => key.includes('USDT'))
        .map(key => {
          return {
            'pair': key.replace('USDT_', ''),
            'percentChange': body[key].percentChange
          }
        });

      var up = result
        .filter(item => item.percentChange >= 0.15)
        .filter(item => item.percentChange <= 0.17)
        .map(item => item.pair);

      if (up.length) {
        var upText = '+++' + up.toString();
        console.log(upText);
        send(upText);
      }

      var down = result
        .filter(item => item.percentChange <= -0.1)
        .filter(item => item.percentChange >= -0.13)
        .map(item => item.pair);

      if (down.length) {
        var downText = '---' + down.toString();
        console.log(downText);
        send(downText);
      }

      var up_30 = result
        .filter(item => item.percentChange >= 0.3)
        .filter(item => item.percentChange <= 0.4)
        .map(item => item.pair);

      if (up_30.length) {
        var upText = '30 +++' + up_30.toString();
        console.log(upText);
        send(upText);
      }

      var down_30 = result
        .filter(item => item.percentChange <= -0.3)
        .filter(item => item.percentChange >= -0.4)
        .map(item => item.pair);

      if (down_30.length) {
        var downText = '30 ---' + down_30.toString();
        console.log(downText);
        send(downText);
      }
    }
  });
}, false);

function send(text) {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'kangxieth@gmail.com',
      pass: 'Windows7'
    }
  });

  var mailOptions = {
    to: 'ps19880624@gmail.com,lvkangxi@gmail.com',
    subject: text
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

module.exports = {
  task: task
};
