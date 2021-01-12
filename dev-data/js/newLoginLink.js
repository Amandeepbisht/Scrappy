const sendNewLink=async(email_id)=>{
  let res
  try{
    res=await axios({
      method:'POST',
      url:'/api/v1/user/resendLoginLink',
      data:{
        email:email_id
      }
    })
    
    createNotify('success','A new link has been sent at your email-id')
  }
  catch(err){
   //console.log(err.response.data)
    createNotify('error',err.response.data.message)
  }
  
}

document.querySelector('.send_reset_link').addEventListener('click', e=>{
  e.preventDefault()
  const email=document.getElementById('email_id_forgotPassword').value
  
  sendNewLink(email);
})
document.querySelector('.back_to_login').addEventListener('click',e=>{
  e.preventDefault();
  window.open('http://127.0.0.1:3000/login',"_self")
})

const createNotify=(str,msg)=>{
  let div=document.createElement('div')
  let btn=document.createElement('button')
  let p=document.createElement('p')
  div.className=`new_link_notify_${str}`
  btn.className='closeLinkRqstBtn'
  btn.innerHTML='Okay'
  p.className='new_link_notify_content'
  p.textContent=msg
  div.appendChild(p)
  div.appendChild(btn)
  let referenceNode=document.getElementById('new_login_link')
  referenceNode.parentNode.insertBefore(div,referenceNode.nextSibling)
  document.querySelector('.send_reset_link').disabled=true;
}
document.querySelector('.new_link_container').addEventListener('click',e=>{
  if(e.target.className=='closeLinkRqstBtn'){
    let el=document.querySelector('.new_link_notify_error')
    if(el==undefined){
      el=document.querySelector('.new_link_notify_success')
    }
    el.parentNode.removeChild(el)
    document.querySelector('.send_reset_link').disabled=false;
    
  }
})
