import { useEffect, useState, useRef } from 'react'
import './App.css'

function App() {
  const [messages, setMessages] = useState(["Welcome to the Chat!", "Type a message to begin..."]);
  const wsRef = useRef<WebSocket | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onmessage = (event) => {
      setMessages(m => [...m, event.data]);
    };
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "join",
        payload: {
          roomId: "red"
        }
      }));
    };

     return ()=> {ws.close()};
  }, []);

  const handleSend = () => {
    const message = inputRef.current?.value;
    if (message?.trim() && wsRef.current) {
      wsRef.current.send(JSON.stringify({
        type: "chat",
        payload: { message }
      }));
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 p-4 border-b border-slate-700">
        <h1 className="text-xl font-bold text-white">Chat Room</h1>
        <p className="text-slate-400 text-sm">Room: #red</p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index}
            className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
          >
            <div className={`max-w-[70%] rounded-lg p-3 ${
              index % 2 === 0 
                ? 'bg-slate-800 text-white' 
                : 'bg-purple-600 text-white'
            }`}>
              <p className="break-words">{message}</p>
              <p className="text-xs mt-1 opacity-70 text-right">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-800 border-t border-slate-700">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            placeholder="Type your message..."
            className="flex-1 rounded-full px-6 py-3 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6 py-3 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default App