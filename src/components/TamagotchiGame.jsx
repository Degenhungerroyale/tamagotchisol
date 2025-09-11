import React from "react";

const TamagotchiGame = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      {/* Tamagotchi frame container */}
      <div className="relative w-[320px] h-[420px] bg-[url('/tamagotchi.png')] bg-contain bg-no-repeat">
        
        {/* Game screen (inside frame) */}
        <div className="absolute top-[25%] left-[20%] w-[60%] h-[40%] overflow-hidden flex flex-col items-center justify-center bg-black border-2 border-green-500 rounded">
          <h2 className="text-green-400 text-lg font-bold">Unnamed Dino</h2>
          <img
            src="/dino.png"
            alt="Dino"
            className="w-16 h-16 my-2"
          />
          <p className="text-green-400">Status: idle</p>
          <div className="w-full h-2 bg-green-700 my-2">
            <div className="w-1/2 h-full bg-green-400"></div>
          </div>
          <p className="text-red-500 text-xs">Rotate back to portrait to continue</p>
          <button className="mt-2 px-3 py-1 bg-green-600 text-black rounded">
            Adopt (2 LOS)
          </button>
        </div>
      </div>

      {/* Connect button */}
      <button className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700">
        Connect
      </button>
    </div>
  );
};

export default TamagotchiGame;
