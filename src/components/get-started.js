import React, {useState, useCallback, useEffect} from 'react'
import io from 'socket.io-client'
import axios from 'axios'

const socket = io('https://git.heroku.com/a-chat-system.git')


export const GetStarted = () => {
    /*useEffect(
        axios.get('https://git.heroku.com/a-chat-system.git').then(res => {
            console.log(res)
        }), []
    )*/
    
const [clickBtn, setClickBtn] = useState(true)
const [dm, setDm] = useState(false)
const [hello, setHello] = useState(false)
const [name, setName] = useState('')
const [msg, setMsg] = useState('')
const [chat, setChat] = useState([])
const [usersAvailable, setUsersAvailable] = useState([])
const [myId, setMyId] = useState('')

let username = name
socket.on('message', ({name, msg, y, w}) => { 
    let color
    if (w == myId ){
        let name = 'me'
        color = 'blue'
        setChat([...chat, {name, msg, color, w}])
    }else{
        switch(y){
            case 1:
                color = 'red';
                break;
            case 2:
                color = 'green';
                break;
            case 3:
                color = 'orange';
                break;
            case 4:
                color = 'brown';
                break;
            case 5:
                color = 'purple';
                break;
        }
        setChat([...chat, {name, msg, color, w}])
    }
})

socket.on('my-id', id => {
    setMyId(id)
})

socket.on('in-chat', (z) => {
    setUsersAvailable(z)
})

function usernameInput(e){
    setName(e.target.value)
}
    
function usernameFormSubmitted (e){
    e.preventDefault();
    setClickBtn(false)
    setDm(true) 
    setHello(true) 
    socket.emit('username', name); 
}
function typingMsg(e){
  setMsg(e.target.value)
}

function sentMsg (e){
  e.preventDefault();
  if (msg.trim() != ''){
    socket.emit('msgSent', {name, msg, myId})
}
  setMsg('')
}

const displayChat = useCallback(
    ()=>{
         return ( 
            <div className='msg-area'>
            {chat.map((item,index) => (
                <div key={index} className={ 'text-box ' + item.color + ' ' + item.w}>
                    <div className='sender'>{item.name}</div>
                    <div className='msg-content'>{item.msg}</div>
                </div>
                ))}
            </div>
        )
    }, [chat]
)
function lastItemTest(item, index){
    if (index == usersAvailable.length - 1){
        return item.charAt(0).toUpperCase() + item.slice(1) + '.'
    }else{
        return item.charAt(0).toUpperCase() + item.slice(1)  + ', '
    }
}
    return(
        <div className='messaging '>
        <div className='header'>
            <div className='heading'><p>Chat with friends</p></div>
            {hello && (
                <div className='extras'>
                    <div className='hi-msg'><p>hi <span>{name}</span></p></div>
                    <div className='in-chat-box'>
                    <p>Online: </p>
                    <div className='in-chat'><span>
                        {usersAvailable.map((item, index) => (
                        lastItemTest(item, index)
                        ))}
                        </span></div>
                    </div> 
                    </div>   
            )}
                    </div>
        <div className='msg-box'>
            {clickBtn && (
                <div className='get-started container-fluid'>
                    <div className='text'>Enter your name</div>
                    <form onSubmit={usernameFormSubmitted} >
                        <input type='text' className='input'name='username' id='username' onChange={usernameInput}/>
                        <input type='submit' className='btn'/>
                    </form>
                </div>
            )}
            {dm && (
                <div>
                        {displayChat()}
                    <form className='chat-form' onSubmit={sentMsg}>
                        <input type='text' value={msg} className='chat-input' onChange={typingMsg}/>
                        <input type='submit' value='Send' className="chat-button"  />
                    </form>
                </div>
            )}
        </div>
    </div>

    )
}

/*   {https://}git.heroku.com/a-chat-system.git*/
