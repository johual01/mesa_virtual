"use client" 
import React, { useState } from 'react';
import { rollDiceString } from '../../../diceLogic';

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [submittedValue, setSubmittedValue] = useState('');
  function submit(){
    setSubmittedValue(JSON.stringify(rollDiceString(inputValue)))
  }
  return (
    <main>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={submit}>Submit</button>
      {submittedValue && <p>Submitted: {submittedValue}</p>}
    </main>
  );
}
