import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";

function App() {

  const [messages, setMessage] = useState([]);
  const wsref = useRef();

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8081");

    ws.onmessage = (e) => {
      setMessage((m) => [...m, e.data]);
    };


    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "join",
        payload: {
          roomId: "red"
        }
      }));
    };
    wsref.current = ws;

    return () => {
      ws.close();
    };
  }, [])

  function sendMessage() {
    const message = document.getElementById("message")?.value;

    if(!message || !wsref.current)return;
    wsref.current.send(JSON.stringify({
      type: "chat",
      payload: {
        message: message
      }
    }))
  }

  return (
    <>
      <div className="h-screen bg-black flex justify-center items-center ">
        <div className="bg-slate-50 w-4/6 h-4/6 rounded-3xl">
          <div className="m-5 ml-8 md:min-h-96 text-blue-700">
            {
              messages.map((message) => <span className="flex">{message}</span>)
            }
          </div>
          <div className="border-y-2 border-blue-600"></div>
          <div className="flex gap-2 m-5 h-auto">
            <input id="message" className="outline-none rounded-3xl border-2 border-blue-600 p-2 w-full" type="text" placeholder="typing....." />
            <button onClick={sendMessage} className="bg-blue-600 w-1/5 rounded-3xl  text-cyan-300">Send</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
