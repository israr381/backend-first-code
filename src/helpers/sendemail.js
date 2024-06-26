import nodemailer from 'nodemailer';



const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "isroo0522@gmail.com",
        pass:  "yencabczivrhokcb"
      }
})


const sendEmail = async(to, subject,text)=>{
    const mailOptions ={
        from: "isroo0522@gmail.com",
        to: to,
        subject: subject,
        text: text
    }

    try {
        const info = transporter.sendMail(mailOptions)
        return info;
    } catch (error) {
        throw error
    }
}
export default sendEmail;