import "./App.css";
import React, { useState, useEffect } from "react";

function App() {
  const [tidKvar, setTidKvar] = useState(25 * 60); //aktuell tid i sekunder
  const [timerStatus, setTimerStatus] = useState(false); //Boolean, false = timer stoppad initialt
  const [ärArbetsperiod, setÄrArbetsperiod] = useState(true); //starta med en arbetsperiod
  const [längdPåArbetsperiod, setLängdPåArbetsperiod] = useState(25 * 60); //25 min i sek
  const [längdPåPausperiod, setLängdPåPausperiod] = useState(5 * 60); // 5 min

  function toggleTimer() {
    setTimerStatus((prevStatus) => !prevStatus); // Växlar status mellan true och false
  }

  function incrementArbetsperiod() {
    setLängdPåArbetsperiod((längd) => längd + 60); // öka med 60 sek per tryck.
  }

  function reset() {
    setTimerStatus(false); // stoppa timer
    setTidKvar(25 * 60); // återställ tiden med 25 minuter
  }

  const startTimer = () => {
    if (!timerStatus && tidKvar > 0) {
      // Kontrollera att timern inte redan är igång och att det finns tid kvar
      setTimerStatus(true); // Sätt timerStatus till true för att indikera att timern är igång
    }
  };

  useEffect(() => {
    let interval = null;

    if (timerStatus) {
      interval = setInterval(() => {
        setTidKvar((tidKvar) => tidKvar - 1); // minska tidKvar med en sekund
      }, 1000); //uppdatera varje sekund
    }

    return () => clearInterval(interval); //rensa intervallet när komponenten avmonteras eller timerStatus ändras
  }, [timerStatus]);

  return (
    <div className="App">
      <h1>25 + 5 Clock</h1>
      <h2 id="break-label">Break Length</h2>
      <h2 id="session-label">Session Length</h2>
      <button id="break-decrement">Break decrement</button>
      <button id="session-decrement">Session decrement</button>
      <button id="break-increment">Break increment</button>
      <button id="session-increment" onClick={incrementArbetsperiod}>
        Session increment
      </button>
      <div id="break-length">5</div>
      <div id="session-length">25</div>
      <h2 id="timer-label">Session</h2>
      <div id="time-left">
        Tid Kvar: {Math.floor(tidKvar / 60)}:{("0" + (tidKvar % 60)).slice(-2)}
      </div>
      <button id="start_stop" onClick={toggleTimer}>
        Starta Timer
      </button>
      <button id="reset" onClick={reset}>
        Reset
      </button>
    </div>
  );
}

export default App;
