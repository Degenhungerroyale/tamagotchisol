import React, { useEffect, useState } from "react";

export default function Leaderboard({ publicKey, name, hoursSinceCare }) {
  const [scores, setScores] = useState([]);

  const storageKey = "tamagotchi-leaderboard";

  // load scores
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setScores(JSON.parse(saved));
  }, []);

  // update scores when pet is alive
  useEffect(() => {
    if (!publicKey || !name) return;
    if (hoursSinceCare >= 24) return; // dead, don’t log

    const entry = {
      wallet: publicKey.toBase58(),
      name,
      time: hoursSinceCare.toFixed(1),
    };

    let updated = scores.filter((s) => s.wallet !== entry.wallet);
    updated.push(entry);
    updated.sort((a, b) => b.time - a.time);
    updated = updated.slice(0, 10);

    setScores(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  }, [hoursSinceCare, name, publicKey]);

  return (
    <div className="mt-6 bg-black border-4 border-green-400 rounded p-4 w-72 text-green-400 font-mono">
      <h3 className="text-lg mb-2">🏆 Leaderboard</h3>
      {scores.length === 0 ? (
        <p>No dinos yet.</p>
      ) : (
        <ul className="text-sm">
          {scores.map((s, i) => (
            <li key={i}>
              {i + 1}. {s.name || "Unnamed"} ({s.wallet.slice(0, 4)}...
              {s.wallet.slice(-4)}) — {s.time}h
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
