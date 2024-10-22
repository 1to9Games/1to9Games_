import React from 'react';
import ScoreboardItem from './ScoreBoardItem';



const Scoreboard = ({ scores = [] }) => {
  if (!Array.isArray(scores) || scores.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg overflow-hidden p-4">
        <p className="text-center text-gray-500">No scores to display</p>
      </div>
    );
  }

  return (
    <div className="bg-white w-[1000px] mx-auto shadow-md rounded-lg overflow-hidden">
      <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
        <h2 className="text-xl font-bold">Scoreboard</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {scores.map((score, index) => (
          <ScoreboardItem key={index} {...score} />
        ))}
      </div>
    </div>
  );
};

export default Scoreboard;