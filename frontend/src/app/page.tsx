"use client" 
import React, { useState } from 'react';
import { rollDiceString } from '../../../diceLogic';

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [submittedValue, setSubmittedValue] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedValue(JSON.stringify(rollDiceString(inputValue)));
  };
  return (
    <main>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      {submittedValue && <p>Submitted: {submittedValue}</p>}
    </main>
  );
}
