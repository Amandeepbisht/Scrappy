// show notification 
 const notify_new=(msg,status)=>{
  let div=document.createElement('div')
  div.className='update_password_msg'
  let p=document.createElement('p')
  p.className=`password_update_${status}`
  let t= document.createTextNode(msg)
  p.appendChild(t)
  let btn=document.createElement('button')
  btn.className='remove_el_btn'
  btn.textContent='Okay'
  div.appendChild(p)
  div.appendChild(btn)
  let referenceNode=document.getElementById('update_form') 
  referenceNode.parentNode.insertBefore(div, referenceNode.nextSibling);
}

const removeNotify=()=>{
  var el=document.querySelector(`.update_password_msg`)
  if(el){
    el.parentElement.removeChild(el)
  }
}

document.querySelector('.update_page').addEventListener('click',e=>{
  if(e.target.className=='remove_el_btn'){
    removeNotify()
    document.getElementById('current_password').value='';
    document.getElementById('new_password').value='';
    document.getElementById('confirm_new_password').value='';
    document.querySelector('.update_password_btn').disabled=false;
  }
  
})

const updatePassword=async(password,newPassword,confirmPassword)=>{
  let res
  
  try{
    res= await axios({
      method:'PATCH',
      url:'/api/v1/user/updatePassword',
      data:{
        password:password,
        newPassword:newPassword,
        confirmPassword:confirmPassword
      }
    })
    
    if(res.data.status=='success'){
      notify_new('Password Updated successfully','success') 
      //setTimeout(removeNotify,3000) 
      document.getElementById('current_password').value='';
      document.getElementById('new_password').value='';
      document.getElementById('confirm_new_password').value='';
    }

    
  }
  catch(err){
    //console.log("This is log from line#19 updatePassword.js")
    let msg
    // console.log(err.response.data.message)
    // console.log(err.response.data)
    // console.log(err.response.data.errorName)
    if(err.response.data.errorName=='ValidationError'){
      msg=err.response.data.message.split(':')[err.response.data.message.split(':').length-1]
      notify_new(msg,'err')
    }
    else{
      msg=err.response.data.message
      notify_new(msg,'err')
    }
  }
}



document.querySelector('.back_to_my_profile_btn').addEventListener('click',e=>{
  e.preventDefault();
  window.open('http://127.0.0.1:3000/myProfile',"_self")
})
document.querySelector('.update_password_btn').addEventListener('click',e=>{
  e.preventDefault();
  let password=document.getElementById('current_password').value;
  let newPassword=document.getElementById('new_password').value;
  let confirmPassword=document.getElementById('confirm_new_password').value;
  
  updatePassword(password,newPassword,confirmPassword)
  document.querySelector('.update_password_btn').disabled=true;
})