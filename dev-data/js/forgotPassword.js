const resetPasswordLink=async(emailId)=>{
  try{
    let res=await axios({
      method:'POST',  
      url:'http://127.0.0.1:3000/api/v1/user/forgotPassword',
      data:{
        email:emailId
      }
    })
    
    password_reset_pop_up(res.data.message)
  }
  catch(err){
   
    password_reset_pop_up(err.response.data.message)
  }
}

const password_reset_pop_up=(str)=>{
  let div = document.createElement('div')
  div.className='col-lg-4'
  let div_1=document.createElement('div')
  div_1.className='reset_password_msg_container'
  let p=document.createElement('p')
  p.className='pswd_reset_txt'
  p.innerHTML=str;
  let btn=document.createElement('button')
  btn.className='close_reset_pswd_msg'
  btn.textContent='OKAY'
  div_1.appendChild(p)
  div_1.appendChild(btn)
  div.appendChild(div_1)
  document.querySelector('.password_reset_pop_up').appendChild(div)
  
}
document.querySelector('.back_to_login').addEventListener('click',(e)=>{
  e.preventDefault();
  window.open('http://127.0.0.1:3000/login','_self')
})
document.querySelector('.send_reset_link').addEventListener('click',async e=>{
  e.preventDefault();
  let emailId=document.getElementById('email_id_forgotPassword').value;
  await resetPasswordLink(emailId)
  document.querySelector('.send_reset_link').disabled=true
})

document.querySelector('.password_reset_pop_up').addEventListener('click',e=>{
  if(e.target.className=='close_reset_pswd_msg'){
    let el=document.querySelector('.reset_password_msg_container').parentNode
    el.parentNode.removeChild(el)
    document.getElementById('email_id_forgotPassword').value='';
    document.querySelector('.send_reset_link').disabled=false
  }
})