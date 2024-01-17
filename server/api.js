const express = require('express')
const axios = require('axios')
const bodyParser = require('body-parser');
const app = express()
const { connectToDb, getDb } = require('./dbserver')
const { ObjectId } = require('mongodb')
const e = require('express')

let dataBase

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectToDb((err) => {
    if (!err) {
        app.listen(5000, () => {
            console.log('port 5000 opened')
        })
    }
    dataBase = getDb()
})

app.post('/verify', async (req, res) => {
  const secretKey = '6Ld0l1MpAAAAAGwDosazWGglfXXSd5pmXzxzDmgW';
  const { username, email, password, confermaPassword} = req.body;
  const gRecaptchaResponse = req.body['g-recaptcha-response'];
  
  try {
      var captchaVerify=await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${gRecaptchaResponse}`);
      
      console.log("reCAPTCHA verification response:", captchaVerify.data);

      if (captchaVerify.data.success) {
          console.log("User registration successful");
          res.status(200).json({ success: true });
      } else {
          console.log("reCAPTCHA verification failed");
          res.status(403).redirect('/signup')
        }
  } catch (error) {
      console.error('Error during reCAPTCHA verification:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

