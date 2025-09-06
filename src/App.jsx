import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

const API_URL = '/words.json';
const WORD_LENGTH = 5;

function App() {
  const [solution, setSolution] = useState('hello'); // For now, hardcoded for testing
  const [guesses, setGuesses] = useState(Array(6).fill(null));
  const [currentGuess, setCurrentGuess] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);

  useEffect(() => {
    const handleType = (event) => {
      if (isGameOver || !solution) return;

      if (event.key === 'Enter') {
        if (currentGuess.length !== WORD_LENGTH) return;

        const newGuesses = [...guesses];
        const nextIndex = guesses.findIndex(val => val === null);
        newGuesses[nextIndex] = currentGuess;
        setGuesses(newGuesses);
        setCurrentGuess('');

        const isCorrect = solution === currentGuess;
        if (isCorrect) setIsWin(true);

        if (isCorrect || newGuesses.every(val => val !== null)) {
          setIsGameOver(true);
        }
        return;
      }

      if (event.key === 'Backspace') {
        setCurrentGuess(currentGuess.slice(0, -1));
        return;
      }

      const isLetter = /^[a-zA-Z]$/.test(event.key);
      if (isLetter && currentGuess.length < WORD_LENGTH) {
        setCurrentGuess(old => old + event.key.toLowerCase());
      }
    };

    window.addEventListener('keydown', handleType);
    return () => window.removeEventListener('keydown', handleType);
  }, [currentGuess, guesses, solution, isGameOver]);

  useEffect(() => {
    const fetchWord = async () => {
      const response = await fetch(API_URL);
      const words = await response.json();
      const randomWord = words[Math.floor(Math.random() * words.length)];
      // setSolution(randomWord.toLowerCase()); // Uncomment to fetch from file
    };
    fetchWord();
  }, []);

  return (
    <div className="board">
      {guesses.map((g, i) => {
        const isCurrent = i === guesses.findIndex(val => val === null);
        return (
          <Line
            key={i}
            guess={isCurrent ? currentGuess : g ?? ''}
            isfinal={g !== null}
            solution={solution}
          />
        );
      })}
      {isGameOver && (
        <div className="gameover">
          {isWin
            ? '🎉 You guessed it!'
            : `❌ Game Over! The word was "${solution.toUpperCase()}"`}
        </div>
      )}
    </div>
  );
}

function Line({ guess, isfinal, solution }) {
  const tiles = [];

  for (let i = 0; i < WORD_LENGTH; i++) {
    const char = guess[i]?.toUpperCase() || '';
    let className = 'tile';

    if (isfinal) {
      if (char.toLowerCase() === solution[i]) {
        className += ' correct';
      } else if (solution.includes(char.toLowerCase())) {
        className += ' close';
      } else {
        className += ' incorrect';
      }
    }

    tiles.push(
      <div key={i} className={className}>
        {char}
      </div>
    );
  }

return <div className={`line ${isfinal ? 'is-final' : ''}`}>{tiles}</div>;
}

export default App;
