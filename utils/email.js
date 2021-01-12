const nodeMailer=require('nodemailer') 
const pug=require('pug') 
const htmlToText=require('html-to-text')
// Email(user,url).sendWelcome()
module.exports= class Email{
  constructor(user,url){
    this.name=user.name.split(' ')[0];
    this.to=user.email;
    this.from='Amandeep<amandeepbisht1994@gmail.com>';
    this.url=url
  }
  newTransport(){
    if (process.env.NODE_ENV==='production'){
      return nodeMailer.createTransport({
        service:'SendGrid',
        auth:{
          user:process.env.sendgrid_username,
          pass:process.env.sendgrid_password
        }
      })
    }
    return nodeMailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "ef511a13079037",
        pass: "b89c09f96db2ea"
      }
    })
  }
  async send(template,subject){
    //1) generate html base in the pug
    
    let html=pug.renderFile(`${__dirname}/../views/email/${template}.pug`,{
        firstName:this.name,
        url:this.url,
        subject
    })
    //2) mail options
    let mailOptions={
      from:this.from,
      to:this.to,
      subject,
      html
    }
    //3) send mail
    await this.newTransport().sendMail(mailOptions)
  }

  async sendWelcome(){
    await this.send('welcome_bootstrap','Welcome to scrappy')
  }

  async sendLoginLink(){
    await this.send('login_link_email','Scrappy Account-Reset Password Link')
  }
}

