import React, { useEffect, useState } from "react";
import {
  Connection,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  getAssociatedTokenAddress,
  createBurnInstruction,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import Leaderboard from "./Leaderboard";

const CONTRACT_ADDRESS = new PublicKey(
  "6d2Wze1KMUxQ28sFLrH9DKfgBXpUJSJYZaRbufucvBLV"
);
const connection = new Connection("https://api.mainnet-beta.solana.com");

const sprites = {
  happy: "/pets/pet_happy.png",
  hungry: "/pets/pet_hungry.png",
  sad: "/pets/pet_sad.png",
  sleep: "/pets/pet_sleep.png",
  clean: "/pets/pet_clean.png",
  dead: "/pets/pet_dead.png",
};
const skull = "/pets/warning_skull.png";

const fees = {
  adopt: 2,
  name: 1,
  feed: 1,
  play: 0.5,
  clean: 0.5,
  nap: 0.25,
  revive: 5,
};

export default function TamagotchiGame() {
  const { publicKey, sendTransaction } = useWallet();

  const [adopted, setAdopted] = useState(false);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("idle");
  const [mood, setMood] = useState("hungry");
  const [hunger, setHunger] = useState(100);
  const [lastCare, setLastCare] = useState(null);
  const [balance, setBalance] = useState(0);
  const [hoursSinceCare, setHoursSinceCare] = useState(0);

  const storageKey = publicKey ? `tamagotchi-${publicKey.toBase58()}` : null;

  // Load saved pet state
  useEffect(() => {
    if (!publicKey) return;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const data = JSON.parse(saved);
      setAdopted(data.adopted);
      setName(data.name);
      setStatus(data.status);
      setMood(data.mood);
      setHunger(data.hunger);
      setLastCare(data.lastCare);
    }
  }, [publicKey]);

  // Save pet state
  useEffect(() => {
    if (!publicKey) return;
    const data = { adopted, name, status, mood, hunger, lastCare };
    localStorage.setItem(storageKey, JSON.stringify(data));
  }, [adopted, name, status, mood, hunger, lastCare, publicKey]);

  // Time-based decay
  useEffect(() => {
    if (!lastCare) return;
    const checkDecay = () => {
      const now = Date.now();
      const elapsed = (now - new Date(lastCare).getTime()) / 1000 / 3600;
      setHoursSinceCare(elapsed);

      if (elapsed > 24) {
        setMood("dead");
        setHunger(0);
        setStatus("dead");
      } else if (elapsed > 20) {
        setMood("sad");
        setStatus("neglected");
        setHunger(10);
      } else if (elapsed > 12) {
        setMood("hungry");
        setHunger(40);
      } else {
        setMood("happy");
      }
    };
    checkDecay();
    const interval = setInterval(checkDecay, 60000);
    return () => clearInterval(interval);
  }, [lastCare]);

  // Fetch balance
  useEffect(() => {
    if (!publicKey) return;
    (async () => {
      try {
        const ata = await getAssociatedTokenAddress(CONTRACT_ADDRESS, publicKey);
        const info = await connection.getTokenAccountBalance(ata);
        setBalance(info.value.uiAmount || 0);
      } catch {
        setBalance(0);
      }
    })();
  }, [publicKey, status]);

  const burnAction = async (amount, newStatus, newMood, updateCare = true) => {
    if (!publicKey) return alert("Connect wallet first!");
    if (balance < amount) return alert("Not enough LOS balance!");

    const ata = await getAssociatedTokenAddress(CONTRACT_ADDRESS, publicKey);
    const burnIx = createBurnInstruction(
      ata,
      CONTRACT_ADDRESS,
      publicKey,
      Math.floor(amount * 1e6),
      [],
      TOKEN_PROGRAM_ID
    );
    const tx = new Transaction().add(burnIx);

    try {
      await sendTransaction(tx, connection);
      setStatus(newStatus);
      setMood(newMood);
      if (updateCare) setLastCare(new Date().toISOString());
    } catch (err) {
      console.error(err);
      alert("Transaction failed");
    }
  };

  const adoptPet = () => {
    if (window.confirm(`Adopt your Dino for ${fees.adopt} LOS?`)) {
      burnAction(fees.adopt, "happy", "happy");
      setAdopted(true);
      setHunger(100);
      setLastCare(new Date().toISOString());
    }
  };

  const namePet = () => {
    const newName = prompt("Enter a name for your Dino:");
    if (!newName) return;
    if (window.confirm(`Name your Dino for ${fees.name} LOS?`)) {
      burnAction(fees.name, "named", mood, false);
      setName(newName);
    }
  };

  const revivePet = () => {
    if (window.confirm(`Revive your Dino for ${fees.revive} LOS?`)) {
      burnAction(fees.revive, "happy", "happy");
      setHunger(100);
      setLastCare(new Date().toISOString());
    }
  };

  const formatTime = (ts) => {
    if (!ts) return "Never";
    return new Date(ts).toLocaleString();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      {/* Shell container */}
      <div className="relative w-[420px] sm:w-[560px] md:w-[760px] mx-auto">
        {/* Tamagotchi shell image */}
        <img
          src="/tamagotchi_shell.png"
          alt="Tamagotchi shell"
          className="w-full h-auto pixelated"
        />

        {/* LCD screen overlay */}
        <div className="absolute top-[24%] left-[31%] w-[38%] h-[44%]
                        bg-black border-2 border-green-400
                        flex flex-col items-center justify-start
                        text-green-400 font-mono p-2 text-xs sm:text-sm">
          <h2 className="text-sm mb-1">
            {name ? `Dino: ${name}` : "Unnamed Dino"}
          </h2>
          <img src={sprites[mood]} alt="pet" className="w-16 h-16 mb-1 pixelated" />
          <p className="mb-1">Status: {status}</p>

          {/* Hunger meter */}
          <div className="w-full bg-gray-700 h-2 rounded mb-1">
            <div
              className="bg-green-500 h-2 rounded"
              style={{ width: `${hunger}%` }}
            ></div>
          </div>

          <p className="mb-1 flex items-center gap-1">
            Last Care: {formatTime(lastCare)}
            {hoursSinceCare > 20 && hoursSinceCare < 24 && (
              <img src={skull} alt="skull" className="w-3 h-3 pixelated" />
            )}
          </p>

          <p className="mb-2">Balance: {balance} LOS</p>

          {/* Buttons */}
          {!adopted ? (
            <button className="bg-green-700 px-2 py-1 rounded" onClick={adoptPet}>
              Adopt (2 LOS)
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-1 text-xs w-full">
              <button
                className="bg-green-700 px-1 py-1 rounded"
                onClick={() => burnAction(fees.feed, "eating", "happy")}
              >
                Feed (1)
              </button>
              <button
                className="bg-green-700 px-1 py-1 rounded"
                onClick={() => burnAction(fees.play, "playing", "happy")}
              >
                Play (0.5)
              </button>
              <button
                className="bg-green-700 px-1 py-1 rounded"
                onClick={() => burnAction(fees.clean, "clean", "clean")}
              >
                Clean (0.5)
              </button>
              <button
                className="bg-green-700 px-1 py-1 rounded"
                onClick={() => burnAction(fees.nap, "sleeping", "sleep")}
              >
                Nap (0.25)
              </button>
              <button
                className="bg-blue-700 col-span-2 px-2 py-1 rounded"
                onClick={namePet}
              >
                Name (1)
              </button>
              <button
                className={`col-span-2 px-2 py-1 rounded ${
                  mood === "dead" ? "bg-red-700" : "bg-gray-700 opacity-50"
                }`}
                onClick={revivePet}
                disabled={mood !== "dead"}
              >
                Revive (5)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Wallet connect */}
      <div className="mt-6">
        <WalletMultiButton />
      </div>

      {/* Leaderboard */}
      <Leaderboard
        publicKey={publicKey}
        name={name}
        hoursSinceCare={hoursSinceCare}
      />
    </div>
  );
}
