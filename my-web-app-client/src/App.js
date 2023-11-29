import React, { useState } from 'react';
import './App.css';

function App() {
  const [userInput, setUserInput] = useState('');
  const [chatResponses, setChatResponses] = useState([]);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput }),
      });

      const data = await response.json();

      setChatResponses([...chatResponses, { user: userInput, bot: data.message }]);
    } catch (error) {
      console.error('Error:', error);
    }

    setUserInput('');
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className='header-container'>
          <h1>Assignment</h1>
          <form onSubmit={handleFormSubmit} className=''>
            <input type="text" value={userInput} onChange={handleInputChange} placeholder="Ask me anything" />
            <button type="submit">Send</button>
          </form>
        </div>

        <div className="chat-container">
          {chatResponses.map((chat, index) => (
            <div key={index} className='chat-thread'>
              <p className='user'>User: {chat.user}</p><br />
              <p className='bot'>Bot: {chat.bot}</p>
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
