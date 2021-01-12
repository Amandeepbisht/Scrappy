

const user=async()=>{
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


// checks of the user have recieved any new msg
const createSound=()=>{
  let newMsg=document.createElement('Audio')
  newMsg.id='newMsg';
  newMsg.controls=true;
  newMsg.autoplay=true;
  newMsg.style.display='none'
  newMsg.src='/sounds/appointed.mp3';
  document.body.appendChild(newMsg)
}

const msgNotify=async()=>{
  let myProfile=await user()
  let newMsgs=document.querySelector('.msgNotify').innerHTML
  let x=0
  myProfile.data.arr.forEach(el=>{
    if(el.lastMsgRecievedAt>el.lastMsgSentAt||el.lastMsgSentAt==undefined){
        x+=1
    }
    })
  if(x!=newMsgs*1){
    
    if(document.querySelector('.new_msg')!=undefined){
      document.querySelector('.new_msg').innerHTML=x;
    }
    
    document.querySelector('.msgNotify').innerHTML=x;
    if(x>newMsgs*1|| newMsgs==''){
      createSound()
    }
  }
}




setInterval(()=>{msgNotify()},1200)

