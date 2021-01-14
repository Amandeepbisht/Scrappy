

// function to create a popUp if the sender have been blocked by the recipient
const create_Pop_up=msg=>{
  let div=document.createElement('div');
  div.className="err_msg_container";
  let t=document.createElement("div")
  t.className='err_msg';
  t.innerHTML=`<h5 class="block_msg">${msg}</h5>`
  let btn=document.createElement("button")
  btn.className='close_pop_up'
  btn.textContent='okay'
  div.appendChild(t)
  div.appendChild(btn)
  document.querySelector('.block_err_container').appendChild(div)
  let el=document.querySelector('.all_msgs')
  el.parentNode.removeChild(el)
}

document.querySelector('.messenger_container').addEventListener('click',e=>{
  if(e.target.className=='close_pop_up'){
    let container=document.querySelector('.err_msg_container')
    container.parentNode.removeChild(container)
    let div=document.createElement('div')
    div.className='all_msgs'
    div.id='conversation'
    document.querySelector('.chat_row').appendChild(div)
    loadMessages().then(res=>{
      const reciever_id=document.querySelector('.send_btn').value;
      res.forEach(el => {
        messageCount+=1
        if(el.reciever==reciever_id){
          displayText(el.text,"sent_msg")
        }
        else{
          displayText(el.text,"recieved_msg")
        }    
      });
    });
  }
})




// SAVES THE MESSAGE IN THE DB
const sendText=async(message,reciever_id,sender_id)=>{
  try{
    res=await axios({
      method:'POST',
      url:`/api/v1/message/${reciever_id}`,
      data:{
        text:message,
        reciever_id:reciever_id,
        sender_id:sender_id
      }
    })
   return(res.data)
  }
  catch(err){
    // console.log(err.response.data.message)
    // console.log(err.response.data.stack)
    create_Pop_up(err.response.data.message)
  }
}

// DISPLAYS THE MESSAGE THAT IS JUST SENT FROM THE TEXT-AREA
const displayText=(text,messageType)=>{
  var h =document.createElement("h")
  if (messageType=='sent_msg'){h.classList.add('message_S')}
  else if (messageType=='recieved_msg'){h.classList.add('message_R')}
  var d=document.createElement("div")
  d.classList.add(messageType)
  var t=document.createTextNode(text)
  h.appendChild(t)
  d.appendChild(h)
  document.querySelector('.all_msgs').appendChild(d)
}



// loads messages from the old chat
const loadMessages=async()=>{
  try{
    const reciever_id=document.querySelector('.send_btn').value;
    const sender_id=document.querySelector('.sender_id').value;
    //console.log(reciever_id,sender_id)
    let res=await axios({
      method:'GET',
      type:JSON,
      url:'/api/v1/message/getChatMessages',
      params:{
        reciever_id:reciever_id,
        sender_id:sender_id
      },
    })
    return res.data.data.messageArray
  }
  catch(err){
    //console.log(err.response.data)
  }
}


// function that always keeps the scroll at the bottom 
const scrollBottom=()=>{
  var div =document.getElementById('conversation')
  div.scrollTop=div.scrollHeight;
}

let messageCount=0
loadMessages().then(res=>{
  const reciever_id=document.querySelector('.send_btn').value;
  res.forEach(el => {
    messageCount+=1
    if(el.reciever==reciever_id){
      displayText(el.text,"sent_msg")
    }
    else{
      displayText(el.text,"recieved_msg")
    }    
  });
  scrollBottom()
  
});

// send button functionality
document.querySelector('.send_btn').addEventListener('click', async e=>{
  const message=document.getElementById('my_message').value;
  const reciever_id=document.querySelector('.send_btn').value;
  const sender_id=document.querySelector('.sender_id').value;
  const div=document.querySelector('.err_msg_container')
  if(message.trim().length>0&&div==null){
    let x= await sendText(message,reciever_id,sender_id)
    // for the following "if" condition
    x.sender.chatList.sort((a,b)=>{
      return new Date(b.lastMsgSentAt)- new Date(a.lastMsgSentAt)
    })
  if(x.sender.chatList[0].friendId!=document.querySelector('.send_btn').value){
    /* 
    after this following reload the myMessenger.js will run and hence the left
    chat list will be updated
    */ 
    location.reload(); 
  }
    displayText(message,"sent_msg")
    messageCount+=1
  }
  document.getElementById('my_message').value=""
  scrollBottom()
})


const checkScroll=()=>{
  let div=document.getElementById('conversation')
  if(div.scrollHeight!=div.scrollTop+div.clientHeight){
    return false
  }
  return true
}
// const newMsgNotify=()=>{
//   const div=document.createElement('div')
//   div.className='newMsgNotify row'
//   let i=document.createElement('div')
//   i.className='fas fa-arrow-down fa-lg arrow'
//   const div_1=document.createElement('div')
//   div_1.className='new_message'
//   div_1.textContent='New Message'
//   div.appendChild(div_1)
//   div.appendChild(i)
  
//   //div.textContent='New Message'
  
//   document.querySelector('.right_container').appendChild(div)
// }

const newMsgNotify=()=>{
  const div=document.createElement('div')
  div.className='newMsgNotify row justify-content-center'
  
  const i=document.createElement('div')
  i.className='fas fa-arrow-down fa-lg arrow'
  
  let div_2=document.createElement('div')
  div_2.className='col'
  div_2.appendChild(i)
  
  const div_1=document.createElement('div')
  div_1.className='col-lg-6 col-md-4 new_message'
  //div_1.textContent='New Message'
  div_1.appendChild(i)

  div.appendChild(div_1)
  //div.appendChild(div_2)
  
  //div.textContent='New Message'
  
  document.querySelector('.chat_row').appendChild(div)
}

const newMessage=async()=>{
  let message
  let x=await loadMessages()
  let lastMessage
  let scrollAtBottom
  if(x.length>messageCount){
    lastMessage=x[x.length-1]
    message=lastMessage.text;
    scrollAtBottom=checkScroll();
    displayText(message,"recieved_msg")
    if(scrollAtBottom){
      scrollBottom()
    }
    if(!scrollAtBottom){
      document.querySelector('.new_message').textContent='New Message'
      document.querySelector('.new_message').style.backgroundColor="white"
    }
    messageCount+=1
  }
}

document.getElementById('conversation').addEventListener('scroll',()=>{
  let div=document.getElementById('conversation')
  let div_1=document.querySelector('.newMsgNotify')
  let scrollAtBottom=checkScroll();
  if(div.scrollHeight!=div.scrollTop+div.clientHeight){
    if(div_1==undefined){
      newMsgNotify();
    }
  }
  if(scrollAtBottom==true&&div_1!=undefined){
    div_1.parentElement.removeChild(div_1)
  }
})

document.querySelector('.chat_row').addEventListener('click',(e)=>{
  
  let el=e.target.classList[e.target.classList.length-1]
  if (document.querySelector(`.${el}`).textContent='New Message'){
    scrollBottom();
  }
  if(el=='arrow'){scrollBottom()}
})

setInterval(newMessage,3000)


