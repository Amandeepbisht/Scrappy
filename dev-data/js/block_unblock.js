const unblock_friend=async(friend_id)=>{
  try{
    let res=await axios({
      method:'PATCH',
      url:'/api/v1/user/unblock_user',
      data:{
        friend_id:friend_id
      }
    })
    
  }
  catch(err){
    //console.log(err.response.data)
  }
}
const block_friend=async(friend_id)=>{
  try{
    let res=await axios({
      method:'PATCH',
      url:'/api/v1/user/block_user',
      data:{
        friend_id:friend_id
      }
    })
    
  }
  catch(err){
   // console.log(err.response.data)
  }
}

document.querySelector('.messenger_friends').addEventListener('click',e=>{
  let event=e.target
  let friend_id=event.parentElement.parentElement.parentElement.parentElement.id.split('_')[2]
  if(event.className=='block_unblock'){
    if (event.textContent=='Unblock'){
      unblock_friend(friend_id)
    }
    else if(event.textContent=='Block'){
      block_friend(friend_id)
    }
  }
})

