import "./App.css";
import React, { useState, useEffect } from "react";

function App() {
  const [tidKvar, setTidKvar] = useState(25 * 60); //aktuell tid i sekunder på work
  const [pausKvar, setPausKvar] = useState(5 * 60);
  const [timerStatus, setTimerStatus] = useState(false); //Boolean, false = timer stoppad initialt
  const [ärArbetsperiod, setÄrArbetsperiod] = useState(true); //starta med en arbetsperiod
  const [längdPåArbetsperiod, setLängdPåArbetsperiod] = useState(25 * 60); //25 min i sek
  const [längdPåPausperiod, setLängdPåPausperiod] = useState(5 * 60); // 5 min

  function toggleTimer() {
    if (!timerStatus) {
      setTimerStatus(true);
      if (ärArbetsperiod) {
        setTidKvar(längdPåArbetsperiod);
      } else {
        setPausKvar(längdPåPausperiod);
      }
    } else {
      setTimerStatus(false);
    }
  }

  function incrementArbetsperiod() {
    setLängdPåArbetsperiod((längd) => längd + 60); // öka med 60 sek per tryck.
  }

  function decrementArbetsperiod() {
    if (längdPåArbetsperiod > 0) {
      setLängdPåArbetsperiod((längd) => längd - 60); // minska med 60 sek per tryck
    }
  }

  function incrementPaus() {
    setLängdPåPausperiod((längd) => längd + 60); // öka pausen med 60 sek
  }

  function decrementPaus() {
    if (längdPåPausperiod > 0) {
      //kan ej ha negativa pauser
      setLängdPåPausperiod((längd) => längd - 60); // minska pausen med 60 sek
    }
  }

  function reset() {
    setÄrArbetsperiod(true);
    setPausKvar(längdPåPausperiod);
    setTimerStatus(false); // stoppa timer
    setTidKvar(längdPåArbetsperiod); // återställ tiden med längden på arbetsperido minuter
  }

  const startPaus = () => {
    setPausKvar(längdPåPausperiod); //längden på paus baseras på värdet av längdpåpaus staten
  };

  const startTimer = () => {
    if (!timerStatus) {
      // Kontrollera att timern inte redan är igång och att det finns tid kvar
      setTidKvar(längdPåArbetsperiod); //längden på timer baseras på värdet av längdPåAtbetsPeriod state
      setTimerStatus(true); // Sätt timerStatus till true för att indikera att timern är igång
    }
  };

  useEffect(() => {
    if (!timerStatus) {
      setPausKvar(längdPåPausperiod);
    }
  }, [längdPåPausperiod]);

  // denna koden kollar om timer inte är aktiv, då skall vi sätta längden på timern = längden på arbetsperioden som vi valt.
  useEffect(() => {
    if (!timerStatus) {
      setTidKvar(längdPåArbetsperiod);
    }
  }, [längdPåArbetsperiod]);

  useEffect(() => {
    let interval = null;

    if (timerStatus) {
      if (ärArbetsperiod) {
        // Tidräknare för arbetsperioden
        interval = setInterval(() => {
          setTidKvar((tid) => {
            if (tid > 0) return tid - 1; // fortsätt räkna ner om det finns tid kvar.
            setÄrArbetsperiod(false); // byt till pausperiod
            setTidKvar(längdPåArbetsperiod);
            return tid;
          });
        }, 1000);
      } else {
        // Tidräknare för pausperioden
        interval = setInterval(() => {
          setPausKvar((tid) => {
            if (tid > 0) return tid - 1; // fortsätt räkna ner om det finns tid kvar.
            setÄrArbetsperiod(true); // byt till arbetsperiod
            setPausKvar(längdPåPausperiod);
            setTidKvar(längdPåArbetsperiod); // återställ arbetsperiod till full längd
            return tid;
          });
        }, 1000);
      }
    }

    // Rensa intervallet när timerStatus ändras eller komponenten avmonteras
    return () => {
      clearInterval(interval);
    };
  }, [
    ärArbetsperiod,
    tidKvar,
    pausKvar,
    timerStatus,
    längdPåArbetsperiod,
    längdPåPausperiod,
  ]);

  return (
    <div className="App">
      <h1>25 + 5 Clock</h1>
      <h2 id="break-label">Break Length</h2>
      <h2 id="session-label">Session Length</h2>
      <button id="break-decrement" onClick={decrementPaus}>
        Break decrement
      </button>
      <button id="session-decrement" onClick={decrementArbetsperiod}>
        Session decrement
      </button>
      <button id="break-increment" onClick={incrementPaus}>
        Break increment
      </button>
      <button id="session-increment" onClick={incrementArbetsperiod}>
        Session increment
      </button>
      <div id="break-length">{Math.floor(längdPåPausperiod / 60)}</div>
      <div id="session-length">{Math.floor(längdPåArbetsperiod / 60)}</div>
      <h2 id="timer-label">Session</h2>

      <div id="paus-left">
        {" "}
        PAUS: {Math.floor(pausKvar / 60)}:{("0" + (pausKvar % 60)).slice(-2)}
      </div>

      <div id="time-left">
        WORK: {Math.floor(tidKvar / 60)}:{("0" + (tidKvar % 60)).slice(-2)}
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
