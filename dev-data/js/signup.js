document.querySelector('.back_to_login_btn').addEventListener('click',e=>{
  e.preventDefault();
  window.open('/login',"_self")
})

const register=async(obj)=>{
  let res
  try{
      res= await axios({
      method:'POST',
      url:'/api/v1/user/signUp',
      data:obj
    })
    if(res.data.status=='success'){
      signUpError({message:'a link has been sent to your email id. Use that link to access your account and register it successfully.'})
      emptyForm()
    }
  }
  catch(err){
      signUpError(err.response.data)
  }
}

const emptyForm=()=>{
  document.getElementById('register_name').value='';
  document.getElementById('email_id').value='';
  document.getElementById('password').value='';
  document.getElementById('retype_password').value='';
  document.getElementById('register_city').value='';
  document.getElementById('gender_select').value='--';
  document.getElementById('myself').value='';
  document.getElementById('upload_pic').value='';
}

document.querySelector('.register_btn').addEventListener('click',async e=>{
  e.preventDefault();
  let obj=new FormData()
  obj.append('name',document.getElementById('register_name').value)
  obj.append('email',document.getElementById('email_id').value)
  obj.append('password',document.getElementById('password').value)
  obj.append('passwordConfirm',document.getElementById('retype_password').value)
  obj.append('CurrentCity',document.getElementById('register_city').value)
  obj.append('gender',document.getElementById('gender_select').value)
  obj.append('aboutMe',document.getElementById('myself').value)
  obj.append('photo',document.getElementById('upload_pic').files[0])
  await register(obj)
  window.scrollTo(0,document.body.scrollHeight)
})

const signUpError=(err)=>{
  let err_arr
  const div=document.createElement("div");
  div.className='col-lg-6 col-md-6 error_container';
  if(err.message.endsWith('already exists')==true){
    err_arr=[err.message]
  }
  else if(err.message.endsWith('already exists')==false){
    err_arr=err.message.split('.');
  } 
  
  let ul=document.createElement('UL')
  ul.className='error_list'
   err_arr.forEach(el=>{
     
     if(el.length>0){
      let err_div=document.createElement("div")
      err_div.className='signUp_Notify'
      let p=document.createElement('p');
      if(err.status=='error'){p.className='sign_up_error';}
      else if(err.status='success'){p.className='sign_up_success'}
      let text=el.split(': ')
      let err_txt=document.createTextNode(text[text.length-1])
      p.appendChild(err_txt)
      err_div.appendChild(p)
      div.appendChild(err_div)
    }
  })
  const button=document.createElement("button")
  button.className="close_btn"
  let t=document.createTextNode('Close')
  button.appendChild(t)
  div.appendChild(button)
  document.querySelector('.sign_up_err').appendChild(div)
  document.querySelector('.register_btn').disabled=true;
}

document.querySelector('.sign_up_err').addEventListener('click',e=>{
  if(e.target.className=='close_btn'){
    let el=document.querySelector('.close_btn').parentNode
    el.parentNode.removeChild(el)
    document.querySelector('.register_btn').disabled=false;
  }
})

