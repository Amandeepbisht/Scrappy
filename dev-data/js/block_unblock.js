const unblock_friend=async(friend_id)=>{
  try{
    let res=await axios({
      method:'PATCH',
      url:'http://127.0.0.1:3000/api/v1/user/unblock_user',
      data:{
        friend_id:friend_id
      }
    })
    console.log(res)
  }
  catch(err){
    console.log(err.response.data)
  }
}
const block_friend=async(friend_id)=>{
  try{
    let res=await axios({
      method:'PATCH',
      url:'http://127.0.0.1:3000/api/v1/user/block_user',
      data:{
        friend_id:friend_id
      }
    })
    console.log(res)
  }
  catch(err){
    console.log(err.response.data)
  }
}

document.querySelector('.messenger_friends').addEventListener('click',e=>{
  
  let event=e.target
  console.log(event)
  console.log(event.className)
  console.log(event.textContent)
  console.log(event.parentElement)
  console.log(event.parentElement.id)
  let friend_id=event.parentElement.parentElement.parentElement.parentElement.id.split('_')[2]
  if(event.className=='block_unblock'){
    
    if (event.textContent=='Unblock'){
      console.log("This user is currently blocked")
      
      unblock_friend(friend_id)
    }
    else if(event.textContent=='Block'){
      
      console.log("This user is currently unblocked")
      block_friend(friend_id)
    }
  }
})

