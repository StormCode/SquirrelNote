var nodemailer = require('nodemailer');

module.exports = function(credentials) {
  var mailTransport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: credentials.username,
      clientId: credentials.clientId,
      clientSecret: credentials.clientSecret,
      refreshToken: credentials.refreshToken
    }
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
          html: body
        }
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
          generateTextFromHtml: true
        }
      );
    },
  };
};