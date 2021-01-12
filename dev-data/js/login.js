// alert functions
const removeAlert=()=>{
  var el=document.querySelector(`.popup_error`)
  if(el){
    
    el.parentElement.removeChild(el)
  }
}

const showAlert=(msg,type)=>{
  
  let div=document.createElement('div')
  div.className=`popup_${type}`
  div.innerHTML=`<h8 class="popup">${msg}</h8>`
  
  document.querySelector('.log_in_form_notify').appendChild(div)
  if(type=='error'){
    
    window.setTimeout(removeAlert,4000)
  }
  
}

const login=async(email,password)=>{
  let res
  try{
    res=await axios({
      method:'POST',
      url:'/api/v1/user/login',
      data:{
        email:email,
        password:password
      }
    })
    if(res.data.status=='success'){
      window.setTimeout(showAlert('you are logged in!','success'))
      window.setTimeout(()=>{
         location.assign('/myProfile')
       },1500)
    }
  }
  catch(err){
    
    showAlert(`${err.response.data.message}`,'error')
    
  }
}

const forgotPassword=async(email)=>{
  let res
  
  try{
    res=await axios({
      method:'GET',
      url:`http://127.0.0.1:3000/api/v1/user/${email}`,
      params:{
        email:email
      }
      
    })
  }
  catch(err){
    //console.log(err.response.data.message)
  }
}

document.querySelector('.login_btn').addEventListener('click',e=>{
  e.preventDefault();
  const email=document.getElementById('email_id').value
  const password=document.getElementById('password').value
  
  login(email,password)
})

document.querySelector('.sign_up_btn').addEventListener('click',e=>{
  e.preventDefault()
  window.open('http://127.0.0.1:3000/signUp',"_self")
})

document.querySelector('.reset_password_btn').addEventListener('click',e=>{
  e.preventDefault()
  window.open('http://127.0.0.1:3000/forgotPassword',"_self")
})

document.querySelector('.lost_login_link').addEventListener('click',e=>{
  e.preventDefault()
  window.open('http://127.0.0.1:3000/newLoginLink',"_self")
})





