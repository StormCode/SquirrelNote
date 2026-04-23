var nodemailer = require('nodemailer');

module.exports = function (credentials) {
  var mailTransport = nodemailer.createTransport({
    service: 'gmail',
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
    send: async function (to, subj, body) {
      try {
        let info = await mailTransport.sendMail({
          from: from,
          to: to,
          subject: subj,
          html: body
        });
        console.log('郵件發送成功:', info.messageId);
        return info;
      } catch (err) {
        // 這裡會抓到 535 5.7.8 之類的驗證錯誤
        console.error('發送郵件時發生錯誤 [send]:', err);
        throw err; // 將錯誤往外丟，讓主程式知道失敗了
      }
    },
    emailError: async function (message, filename, exception) {
      var body = '<h1>Send Mail Error</h1>' + 'message:<br><pre>' + message + '</pre><br>';
      if (exception) body += 'exception:<br><pre>' + exception + '</pre><br>';
      if (filename) body += 'filename:<br><pre>' + filename + '</pre><br>';

      try {
        await mailTransport.sendMail({
          from: from,
          to: errorRecipient,
          subject: '系統錯誤回報',
          html: body
        });
      } catch (err) {
        console.error('發送錯誤報告郵件失敗 [emailError]:', err);
      }
    },
    verifyConnection: async function () {
      try {
        await mailTransport.verify();
        console.log("Nodemailer 驗證成功，Token 有效！");
        return true;
      } catch (err) {
        console.error("Nodemailer 驗證失敗 (535 錯誤通常發生在此):", err);
        return false;
      }
    }
  };
};