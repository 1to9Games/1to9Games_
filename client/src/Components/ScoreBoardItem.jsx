import React from 'react'

const ScoreboardItem = ({ player, betAmount, result, amountChange }) => {
    const isWin = result === 'win';
    const resultColor = isWin ? 'text-green-500' : 'text-red-500';
    const changePrefix = isWin ? '+' : '-';
  
    return (
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{player}</h3>
          <p className="text-sm text-gray-600">Bet: {betAmount} coins</p>
        </div>
        <div className="flex-1 text-right">
          <p className={`text-lg font-bold ${resultColor}`}>
            {result.toUpperCase()}
          </p>
          <p className={`text-sm ${resultColor}`}>
            {changePrefix}{Math.abs(amountChange)} coins
          </p>
        </div>
      </div>
    );
  };

export default ScoreboardItem;