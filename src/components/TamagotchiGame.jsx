import React, { useState } from "react";

const TamagotchiGame = () => {
  const [status, setStatus] = useState("idle");

  // Map statuses to sprite filenames
  const spriteMap = {
    idle: "/pets/pet_idle.png",
    clean: "/pets/pet_clean.png",
    happy: "/pets/pet_happy.png",
    hungry: "/pets/pet_hungry.png",
    sleep: "/pets/pet_sleep.png",
    sick: "/pets/pet_sick.png",
    play: "/pets/pet_play.png",
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      {/* Tamagotchi frame (responsive) */}
      <div
        className="
          relative 
          w-[320px] h-[420px] 
          sm:w-[280px] sm:h-[360px] 
          xs:w-[240px] xs:h-[300px]
          bg-contain bg-no-repeat
        "
        style={{ backgroundImage: "url(/pets/tamagotchi.png)" }}
      >
        {/* Game screen inside shell */}
        <div className="absolute top-[25%] left-[20%] w-[60%] h-[40%] overflow-hidden flex flex-col items-center justify-center bg-black border-2 border-green-500 rounded">
          <h2 className="text-green-400 text-lg font-bold">Unnamed Pet</h2>

          {/* Pet sprite */}
          <img
            src={spriteMap[status]}
            alt={status}
            className="w-16 h-16 my-2"
          />

          <p className="text-green-400">Status: {status}</p>

          {/* Progress bar */}
          <div className="w-full h-2 bg-green-700 my-2">
            <div className="w-1/2 h-full bg-green-400"></div>
          </div>

          <button className="mt-2 px-3 py-1 bg-green-600 text-black rounded">
            Adopt (2 LOS)
          </button>
        </div>
      </div>

      {/* Connect button */}
      <button className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700">
        Connect
      </button>

      {/* Debug buttons (to test sprites) */}
      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        {Object.keys(spriteMap).map((key) => (
          <button
            key={key}
            className="px-2 py-1 text-xs bg-gray-700 text-white rounded"
            onClick={() => setStatus(key)}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TamagotchiGame;
