const userProfile=async()=>{
  try{
    let res=await axios({
      method:'GET',
      url:'http://127.0.0.1:3000/api/v1/user/myProfile'
    })
    return res.data
  }
  catch(err){
    console.log(err)
  }
} 

const logout=async()=>{
  try{
    const res=await axios({
      method:'GET',
      url:'http://127.0.0.1:3000/api/v1/user/logout'
    })
    console.log(res)
    if (res.data.status=='success'){
      window.open(`http://127.0.0.1:3000/login`,"_self")
      
    }
  }
  catch(err){
    console.log(err.response.data)
  }
}


const sendMessage=async()=>{
  let recipientObj={}
  let my_profile=await userProfile()
  recipientObj.recipient_id=document.querySelector('.send_msg').title
  //1) check if the logged in user have friend List
  let friendList=my_profile.data.arr
  if(friendList.length==0){
    
    recipientObj.isFriend=false
  }
  //2) check is the recipient is in the friend List
  let recipientArr=friendList.filter(obj=>
    obj.friendId==recipientObj.recipient_id
  )
  if(recipientArr.length!=0){
    recipientObj.isFriend=true
  }
  else if(recipientArr.length==0){
    recipientObj.isFriend=false
  }
  console.log(recipientObj)
  return recipientObj
}
sendMessage()


document.querySelector('.sign_out_btn_other_users').addEventListener('click',e=>{
  logout();
})
document.querySelector('.send_msg').addEventListener('click',async e=>{
  let friend=await sendMessage()
  console.log(friend)
  if (friend.isFriend==true){
    window.open(`http://127.0.0.1:3000/myMessenger/${friend.recipient_id}`,"_self")
  }
  else if (friend.isFriend==false){
    window.open(`http://127.0.0.1:3000/chat/${friend.recipient_id}`,"_self")
  }
  
})