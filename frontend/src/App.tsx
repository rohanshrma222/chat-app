
import { useEffect, useState,useRef } from 'react'
import './App.css'

function App() {
  const [messages,setMessages]= useState(["hi There","Hi"]);
  const  wsRef= useRef();
  const inputRef = useRef();
    useEffect(()=>{
      const ws = new WebSocket("http://localhost:3000");
      ws.onmessage = (event) => {
        setMessages(m=>[...m,event.data])
      } 
      wsRef.current=ws;
      
      ws.onopen = () => {
        ws.send(JSON.stringify({
            type: "join",
            payload:{
              roomId:"red"
            }
        }))
      }
    },[])

  return (
      <div className='h-screen w-full  bg-black'>
        <br /><br/>
          <div className='h-[95vh]'>
            {messages.map(message => <div className='m-8'>
               <span className='bg-white text-black rounded p-4 m-8'>
                {message}
               </span>
               </div>)}
          </div>
            <div className='w-full bg-white flex'>
              <input  ref={inputRef}className='flex-1 p-4'></input>
              <button onClick={()=>{
                const message = inputRef.current?.value;
                wsRef.current.send(JSON.stringify({
                  type:"chat",
                  payload:{
                    message:message
                  }
                }))
              }}
                className='bg-purple-600 text-white p-4'> 
                Send Message
              </button>
            </div>
      </div>
    )
}

export default App
