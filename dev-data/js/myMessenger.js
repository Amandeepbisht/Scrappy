

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

/* 
  Update the names on the left column of the messenger
  and also highlights the names whose msgs hasn't been replied yet
*/

const updateChatList_bootstrap=arr=>{
  arr.forEach(el => {
    let name_col=document.createElement('div')
    name_col.className='col-lg-8 col-md-8 friend_name'
    let btn_col=document.createElement('div')
    btn_col.className='col-lg-4 col-md-4'

    let row=document.createElement('div')
    row.className='row'
    let name_and_btn_row=document.createElement('div')
    name_and_btn_row.className='row'
    name_and_btn_row.appendChild(name_col)
    name_and_btn_row.appendChild(btn_col)
    
    let btn= document.createElement('button')
    btn.className='block_unblock'
    if(el.blocked==true){
      btn.textContent='Unblock'
      btn.id='blocked_user'
    }
    else if(el.blocked==false){btn.textContent='Block'}
    
    let nameTag=document.createElement('a')
    nameTag.innerHTML=`${el.name}`
    nameTag.className='user_name_my_messenger'
    nameTag.setAttribute('href',`/user/${el.friendId}`)
    name_col.appendChild(nameTag)
    

    let div_1=document.createElement('div');
    div_1.className='row chat_btns'
    div_1.appendChild(btn)
    btn_col.appendChild(div_1)

    let aTag= document.createElement('a')
    aTag.className=`myMessenger_tag container`
    aTag.setAttribute('href',`/myMessenger/${el.friendId}`)
    aTag.setAttribute('style','text-decoration: none')
    aTag.id=`friend_anchor_${el.friendId}`
    aTag.classList.add('friend')
    if(el.type=="recieved"){
      aTag.style.backgroundColor='#00e6ac'
    }
    aTag.appendChild(name_and_btn_row)
    row.appendChild(aTag)
    document.querySelector('.chat_list').appendChild(row)
  });

}

/*
 arranges the chatList array accoprding to the condition: 
 {lastMsgSentAt > lastMsgRecievedAt}
 and assigns "sent" and "recieved" property
 to the elements of the chatList array 
*/
chatArray=async()=>{
  const friendList=await userProfile();

  const chatList=friendList.data.arr;
  
  let sentArr=[]
  let recievedArr=[]
  chatList.forEach(el=>{
    if(el.lastMsgSentAt>el.lastMsgRecievedAt){
      sentArr.push({friendId:el.friendId,friendPic:el.friendPic,name:el.name,lastMsgAt:el.lastMsgSentAt,blocked:el.blocked,type:'sent'})
    }
    else if(el.lastMsgRecievedAt==undefined){
      sentArr.push({friendId:el.friendId,friendPic:el.friendPic,name:el.name,lastMsgAt:el.lastMsgSentAt,blocked:el.blocked,type:'sent'})
    }
    else if(el.lastMsgSentAt==undefined){
      recievedArr.push({friendId:el.friendId,friendPic:el.friendPic,name:el.name,lastMsgAt:el.lastMsgRecievedAt,blocked:el.blocked,type:'recieved'})
    }
    else{
      recievedArr.push({friendId:el.friendId,friendPic:el.friendPic,name:el.name,lastMsgAt:el.lastMsgRecievedAt,blocked:el.blocked,type:'recieved'})
    }
  })
  let sortedArr=sentArr.concat(recievedArr)
  sortedArr=sortedArr.sort((a,b)=>{
    return new Date(b.lastMsgAt)- new Date(a.lastMsgAt)
  })
  
  
  return(sortedArr)
}


/*
  1) Uses chatArray() and updateChatList() to update the order & color of 
     users column of "myMessenger" page
  
  2) changes the color of the active user of the users column
*/
const displayChatList=async()=>{
  array=await chatArray()
  
  updateChatList_bootstrap(array)
  let user_id=document.querySelector('.send_btn').value;
  let found=array.find(el=>el.friendId==user_id)
 
  document.querySelector('.recipient').innerHTML=found.name
  document.getElementById(`friend_anchor_${user_id}`).classList.add('friend_active')
  document.querySelector('.recipient_pic').src=`/images/${found.friendPic}`
}

const displayChatList_bootstrap=async()=>{
  array=await chatArray()
  updateChatList_bootstrap(array)
  let user_id=document.querySelector('.send_btn').value;
  let found=array.find(el=>el.friendId==user_id)
  document.querySelector('.recipient').innerHTML=found.name
  document.getElementById(`friend_anchor_${user_id}`).classList.add('friend_active')
}



//updates the user column of "myMessenger" page upon recieving a new message
const update=async()=>{
  let divs=document.querySelectorAll('.myMessenger_tag')
  divs.forEach(el=>{
    el.parentNode.removeChild(el)
  })
  await displayChatList()
}


const recieveMsg=async()=>{
  let array=await chatArray()
  const div_id=document.querySelector('.friend').id.split('_')[2]
  let color=document.getElementById(`friend_anchor_${div_id}`).style.backgroundColor
  
  
  if(array[0].friendId!=div_id){
    
    await update()
  }
  /* 
    the following logic is if the msg is recieved by the user who is on the top
    of the chatList
  */
  if(array[0].friendId==div_id){
    if(array[0].type=='recieved'&&color!='rgb(0, 230, 172)'){
      await update()
    }
    if(array[0].type=='sent'&&color=='rgb(0, 230, 172)'){
      document.getElementById(`friend_anchor_${div_id}`).style= null;
      await update()
    }
  }



}
displayChatList()

setInterval(recieveMsg,1200)

