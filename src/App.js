import React, { useState } from "react";
import axios from "axios";
import "./index.css";
import DiceCard from "./components/DiceCard.js";

const login = async (user, setUser) => {
  const res = await axios.post("http://localhost:3256/login", { user: user });
  setUser(res.data);
};

const buy = async (user) => {
  const res = await axios.post("http://localhost:3256/buy", { user: user });
};

const pick = async () => {
  const res = await axios.get("http://localhost:3256/pick");
  return res.data;
};

export default function App() {
  const [input, setInput] = useState("");
  const [user, setUser] = useState("");
  const [pickText, setPick] = useState("");

  return (
    <div className="container">
      <h1>Lottery!</h1>
      {!!!user && (
        <div className="login">
          <input
            type="text"
            placeholder="user"
            onChange={(e) => setInput(e.target.value)}
          ></input>
          <button
            onClick={async (e) => {
              e.preventDefault();
              await login(input, setUser);
              setInput("");
            }}
          >
            Login
          </button>
        </div>
      )}
      {user && (
        <div className="login">
          <button
            onClick={async (e) => {
              e.preventDefault();
              await buy(user);
            }}
          >
            Buy
          </button>
          <button
            onClick={async (e) => {
              e.preventDefault();
              const p = await pick();
              if (p === "<ERROR>") {
                setPick("Please buy at least one ticket");
              } else {
                setPick(`Winner: ${p}`);
              }
            }}
          >
            Pick
          </button>
        </div>
      )}
      {pickText && <h3 className="winner">{pickText}</h3>}
    </div>
  );
}
