import { useState } from 'react';

function App() {
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');

  const handleClick = () => {
    console.log(input);
  };

  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={handleClick}>Submit</button>
      </div>

      <pre>{code}</pre>
    </div>
  );
}

export default App;
