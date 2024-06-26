import sendEmail from "../helpers/sendemail.js"


const emailSend =async(req,res)=>{
    const {to, subject,text}=req.body

   try {
    const info = await sendEmail(to, subject,text)
    console.log(`Email sent: ${info.response}`)
    res.send({
        message: 'email send successfully'
    })

   } catch (error) {
     console.log(error)
   }
}

export default emailSend;