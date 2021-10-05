// const nodemailer = require('nodemailer');

// const sendEmail = async (options) => {
//   console.log(options.email);
//   const transporter = nodemailer.createTransport({
//     host: 'smtp.mailtrap.io',
//     port: 2525,
//     auth: {
//       user: '97f3ba6072da11',
//       pass: '231e56c50f1f1d',
//     },
//   });

//   const mailOptions = {
//     from: process.env.EMAIL_USERNAME,
//     to: options.to,
//     subject: options.subject,
//     text: options.message,
//   };

//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (options) => {
  const msg = {
    to: options.to, // Change to your recipient
    from: 'durgicharan81@gmail.com', // Change to your verified sender
    subject: 'Sending with SendGrid is Fun',
    templateId: 'd-0543bda39ed04c268db4273dadec93a5',
    dynamic_template_data: {
      code: options.code,
    },
    // text: 'and easy to do anywhere, even with Node.js',
    // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };
  return await sgMail.send(msg);
};

module.exports = sendEmail;
