

const no_friends_pop_up=()=>{
  let container=document.createElement('div');
  container.className='container'
  let row=document.createElement('div')
  row.className='row'
  let col=document.createElement('div')
  col.className='col-lg-4 col-md-6 mx-auto'
  let div_1=document.createElement('div')
  div_1.className='no_friends_pop_up'
  let div=document.createElement('div')
  div.className='no_friends_msg'
  let t=document.createTextNode("You don't have any friends.To access the 'MESSENGER' click on 'OTHER USERS' button to find people and message them personally:)")
  div.appendChild(t)
  let btn=document.createElement('button')
  btn.className='no_friend_btn'
  btn.textContent='OKAY'
  div_1.appendChild(div)
  div_1.appendChild(btn)
  col.append(div_1)
  document.querySelector('.no_friends').appendChild(col)
}

document.querySelector('.no_friends').addEventListener('click',e=>{
  if(e.target.className=='no_friend_btn'){
    let el= document.querySelector('.no_friends_pop_up')
    el.parentElement.removeChild(el)
  }
})

let my_id=document.querySelector('.messenger_btn').id

const userProfile=async()=>{
  try{
    let res=await axios({
      method:'GET',
      url:'/api/v1/user/myProfile'
    })
    return res.data
  }
  catch(err){
    //console.log(err)
  }
} 

// asigns the id to the "friend_id" variable
const chatList=async()=>{
  const friendList=await userProfile();
  const chatList=friendList.data.arr;
  let sentArr=[]
  let recievedArr=[]
  chatList.forEach(el=>{
    if(el.lastMsgSentAt>el.lastMsgRecievedAt){
      sentArr.push({friendId:el.friendId,name:el.name,lastMsgAt:el.lastMsgSentAt,blocked:el.blocked,type:'sent'})
    }
    else if(el.lastMsgRecievedAt==undefined){
      sentArr.push({friendId:el.friendId,name:el.name,lastMsgAt:el.lastMsgSentAt,blocked:el.blocked,type:'sent'})
    }
    else if(el.lastMsgSentAt==undefined){
      recievedArr.push({friendId:el.friendId,name:el.name,lastMsgAt:el.lastMsgRecievedAt,blocked:el.blocked,type:'recieved'})
    }
    else{
      recievedArr.push({friendId:el.friendId,name:el.name,lastMsgAt:el.lastMsgRecievedAt,blocked:el.blocked,type:'recieved'})
    }
  })
  let sortedArr=sentArr.concat(recievedArr)
  sortedArr=sortedArr.sort((a,b)=>{
    return new Date(b.lastMsgAt)- new Date(a.lastMsgAt)
  })
  
  if(sortedArr.length>0){
    return sortedArr[0].friendId
  }
  else return undefined
}

const logout=async()=>{
  try{
    const res=await axios({
      method:'GET',
      url:'/api/v1/user/logout'
    })
    
    if (res.data.status=='success'){
      window.open(`http://127.0.0.1:3000/login`,"_self")
    }
  }
  catch(err){
    //console.log(err.response.data)
  }
}

document.querySelector('.messenger_btn').addEventListener('click', async e=>{
  let friend_id=await chatList()
  if(friend_id!=undefined){
    window.open(`http://127.0.0.1:3000/myMessenger/${friend_id}`,"_self")
  }
  else{
    no_friends_pop_up()
  }
})

document.querySelector('.sign_out_btn').addEventListener('click',e=>{
  logout();
})






