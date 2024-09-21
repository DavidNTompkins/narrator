import useRef from 'react'
async function speak(messages,audioQueue,qLength) {
  qLength.current = qLength.current + 1
  const myIndex = qLength.current;
  console.log("attempting to say: " + messages)
  const response = await fetch("https://narratorbackendtesting.davidtompkins3.repl.co/endpoint4", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ messages }),
  });
  const audioData = await response.arrayBuffer();
  audioQueue.add(audioData,myIndex);
  
}

export default speak