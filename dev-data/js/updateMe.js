const updateUser=async(obj)=>{
  try{
    let res=await axios({
      method:'PATCH',
      url:'/api/v1/user/updateMe',
      data:obj
    })
    return(res.data)
    
  }
  catch(err){
    let obj=err.response.data
    return (obj)
  }
}

const my_data=async()=>{
  try{
    let res=await axios({
      method:'GET',
      url:'/api/v1/user/myProfile',
      
    })
    return res.data;
  }
  catch(err){
    //console.log(err)
  }
}

const update_error=(err_array)=>{
  const div=document.createElement('div')
  div.className='update_notify'
  const div_1=document.createElement('div')
  div_1.className='update_err_container'
  const btn=document.createElement('button') 
  btn.className='close_update_err'
  btn.textContent='Try again'
  for (var i in err_array){
      div.insertAdjacentHTML('afterbegin',`<p class=${i}_err>${err_array[i]}</p>`)
    }
  div.appendChild(btn)
  //div.appendChild(div_1)  
  document.querySelector('.update_page_msg').appendChild(div) 
}

const save_updates=()=>{
  const div=document.createElement('div')
  div.className='save_changes'
  const btn=document.createElement('button')
  btn.className='close_save_box'
  btn.textContent='OKAY'
  div.insertAdjacentHTML('afterbegin','<p class=changes_saved>Your changes have been saved.</p>')
  div.appendChild(btn)
  document.querySelector('.update_page_msg').appendChild(div)
  
} 

// fetches the data from the update-form
const getUpdate=()=>{
  let obj=new FormData()
  
  let name,CurrentCity,aboutMe,file
  name=document.getElementById('register_name').value
  CurrentCity=document.getElementById('register_city').value
  aboutMe=document.getElementById('myself').value
  gender=document.getElementById('gender_select').value
  file=document.getElementById('upload_pic').files[0]
  if(name.trim().length>0){
    obj.append('name',document.getElementById('register_name').value)
  }
  if(CurrentCity.trim().length>0){
    obj.append('CurrentCity',document.getElementById('register_city').value)
  }
  if(aboutMe.trim().length>0){
    obj.append('aboutMe',document.getElementById('myself').value)
  }
  if (file){
    obj.append('photo',document.getElementById('upload_pic').files[0])
  }
  obj.append('gender',document.getElementById('gender_select').value)
  return obj
}

// fetches the data from the user's profile and displays it on the update-form
const me=async()=>{
  let me=await my_data()
  
  let obj=me.data.user;
  document.getElementById('register_name').value=obj.name
  document.getElementById('register_city').value=obj.CurrentCity
  document.getElementById('myself').value=obj.aboutMe
  document.getElementById('gender_select').value=obj.gender
}
me();



document.querySelector('.save_changes_btn').addEventListener('click',async e=>{
  let el=document.body
  e.preventDefault()
  let update=getUpdate();
  

  if (update){
    let err_res=await updateUser(update)
    
    if(err_res.status=='error'){
     update_error(err_res.message.split('.'))
     document.querySelector('.save_changes_btn').disabled=true
     }
    else{
      save_updates()
      document.querySelector('.save_changes_btn').disabled=true
      if(document.body.scrollHeight!=document.body.scrollTop){
      }
    }
  }
})


document.querySelector('.back_to_my_profile_btn').addEventListener('click',e=>{
  e.preventDefault()
  window.open(`http://127.0.0.1:3000/myProfile`,"_self")
})

document.querySelector('.update_password_btn').addEventListener('click',e=>{
  e.preventDefault()
  window.open(`http://127.0.0.1:3000/updatePassword`,"_self")
})

document.querySelector('.update_page_msg').addEventListener('click',async e=>{
 
  if (e.target.className=='close_update_err'){
    let el=document.querySelector('.update_err_container')
    el.parentNode.removeChild(el)
    location.reload();
    
  }
})

document.querySelector('.update_page_msg').addEventListener('click',async e=>{
 
  if (e.target.className=='close_save_box'){
    let el=document.querySelector('.save_changes')
    el.parentNode.removeChild(el)
    location.reload();
    
  }
})