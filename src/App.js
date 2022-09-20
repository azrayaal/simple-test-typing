import './App.css';
import React, { useEffect, useRef, useState } from 'react';

const getCloud = () =>
  `loreLorem ipsum dolor sit amet consectetur adipisicing elit. Magnam temporibus, sequi fugiat dolore tempora cumque ducimus nihil excepturi nisi quasi atque libero. Hic pariatur incidunt laudantium sunt ipsam, alias harum tempora dignissimos reprehenderit, doloribus optio magnam repellat, officiis beatae facere?m40`.split(
    ' '
  );
// .sort(() => (Math.random() > 0.5 ? 1 : -1));
function Word(props) {
  const { text, active, correct } = props;

  if (correct === true) {
    return <span className="correct">{text} </span>;
  }
  if (correct === false) {
    return <span className="incorrect">{text} </span>;
  }
  if (active) {
    return <span className="active">{text} </span>;
  }
  return <span>{text} </span>;
}

function Timer(props) {
  const { startCounting, correctWords } = props;
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    let id;
    if (startCounting) {
      id = setInterval(() => {
        // do something
        setTimeElapsed((oldTime) => oldTime + 1);
      }, 1000);
    }
    return () => {
      clearInterval(id);
    };
  }, [startCounting]);

  const minutes = timeElapsed / 60;

  return (
    <div>
      <p>Time: {timeElapsed}</p>
      <p>speed: {(correctWords / minutes || 0).toFixed(2)} WPM</p>
    </div>
  );
}

Word = React.memo(Word);

function App() {
  const [userInput, setUserInput] = useState('');
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [correctWordArray, setCorrectWordArray] = useState([]);
  const [startCounting, setStartCounting] = useState(false);
  const cloud = useRef(getCloud());

  function processInput(value) {
    // word count and the timer

    if (activeWordIndex === cloud.current.length) {
      // stop
      return;
    }

    if (!startCounting) {
      setStartCounting(true);
    }

    if (value.endsWith(' ')) {
      // the value has finished this word

      if (activeWordIndex === cloud.current.length - 1) {
        // overflow
        setStartCounting(false);
        setUserInput('Completed');
      } else {
        setUserInput('');
      }

      setActiveWordIndex((index) => index + 1);
      // correct word
      setCorrectWordArray((data) => {
        const word = value.trim();
        const newResult = [...data];
        newResult[activeWordIndex] = word === cloud.current[activeWordIndex];
        return newResult;
      });
    } else {
      setUserInput(value);
    }
  }

  return (
    <div className="App">
      <h1>Test Typing</h1>
      <Timer startCounting={startCounting} correctWords={correctWordArray.filter(Boolean).length} />
      <p>
        {cloud.current.map((word, index) => {
          return <Word text={word} active={index === activeWordIndex} correct={correctWordArray[index]} />;
        })}
      </p>
      <input type="text" placeholder="Start Typing" value={userInput} onChange={(e) => processInput(e.target.value)} />
    </div>
  );
}

export default App;
