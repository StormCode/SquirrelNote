var nodemailer = require('nodemailer');

module.exports = function(credentials) {
  var mailTransport = nodemailer.createTransport('SMTP', {
    service: 'Gmail',
    auth: {
      user: credentials.username,
      pass: credentials.password,
    },
  });
  var from = credentials.username;
  var errorRecipient = credentials.username;
  return {
    send: function(to, subj, body) {
      mailTransport.sendMail(
        {
          from: from,
          to: to,
          subject: subj,
          html: body,
        },
        function(err) {
          if (err) {
            console.log('Unable to send email: ' + err);
          }
        },
      );
    },
    emailError: function(message, filename, exception) {
      var body =
        '<h1>Send Mail Error</h1>' + 'message:<br><pre>' + message + '</pre><br>';
      if (exception) body += 'exception:<br><pre>' + exception + '</pre><br>';
      if (filename) body += 'filename:<br><pre>' + filename + '</pre><br>';
      mailTransport.sendMail(
        {
          from: from,
          to: errorRecipient,
          subject: 'Send Mail Error',
          html: body,
          generateTextFromHtml: true,
        },
        function(err) {
          if (err) {
            console.log('Unable to send email: ' + err);
          }
        },
      );
    },
  };
};