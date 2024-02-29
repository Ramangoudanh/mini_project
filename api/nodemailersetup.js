import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
const contactEmail=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.USER_EMAIL,
        pass:process.env.USER_PASS
    }
})

contactEmail.verify((error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Ready to Send");
    }
});

export default contactEmail;