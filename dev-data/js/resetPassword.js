const resetPassword=async(obj)=>{
  try{
    let res=await axios({
      method:'PATCH',
      url:`/api/v1/user/resetPassword/${obj.token}`,
      data:{
        password:obj.password,
        passwordConfirm:obj.passwordConfirm 
      }
    })
    return (res.data)
  }
  catch(err){
    return (err.response.data)
  }
}

const createResetContainer=(str,msg)=>{
  let div=document.createElement('div')
  let p=document.createElement('p')
  let text=document.createTextNode(msg)
  let close_reset_container_btn=document.createElement('button')
  close_reset_container_btn.className=`reset_pswd_notify_${str}`
  close_reset_container_btn.textContent='Close'
  div.className=`reset_pswd_${str}`
  p.className='reset_notify'
  p.appendChild(text)
  div.appendChild(p)
  div.appendChild(close_reset_container_btn)
  let form=document.getElementById('password_reset_form')
  form.parentNode.insertBefore(div,form.nextSibling);
}

document.querySelector('.password_reset_container').addEventListener('click',e=>{
  if (e.target.className=='reset_pswd_notify_err'){
    let div=document.querySelector('.reset_pswd_err')
    div.parentNode.removeChild(div)
    document.querySelector('.save_reset_pswd_btn').disabled=false;
    document.getElementById('reset_password').value='';
    document.getElementById('confirm_reset_password').value='';
  }
  if (e.target.className=='reset_pswd_notify_success'){
    window.open('/login',"_self")
  }
})

document.querySelector('.save_reset_pswd_btn').addEventListener('click',async e=>{
  e.preventDefault()
  const obj={
    password:document.getElementById('reset_password').value,
    passwordConfirm:document.getElementById('confirm_reset_password').value,
    token:document.querySelector('.save_reset_pswd_btn').value
  }
  
  let reset=await resetPassword(obj)
  
  if(reset.status=='success'){
    createResetContainer('success','Password changed successfully. Try login again.')
  }
  else{
    let msg=reset.message.split(':')[reset.message.split(':').length-1]
    createResetContainer('err',msg)
  }
  document.querySelector('.save_reset_pswd_btn').disabled=true;
})

