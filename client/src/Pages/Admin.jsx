import React from 'react'
import WithdrawalReq from '../Components/WithdrawalReq'
import GameControls from '../Components/GameControls'
import Scoreboard from '../Components/ScoreBoard'
import { Button } from "@material-tailwind/react";



const Admin = () => {

    const scores = [
        { player: "Alice", betAmount: 100, result: "win", amountChange: 50 },
        { player: "Bob", betAmount: 75, result: "loss", amountChange: 75 },
        { player: "Charlie", betAmount: 50, result: "win", amountChange:100},
        
        { player: "Alice", betAmount: 100, result: "win", amountChange: 50 },
        { player: "Bob", betAmount: 75, result: "loss", amountChange: 75 },
        { player: "Charlie", betAmount: 50, result: "win", amountChange:100},
        { player: "Alice", betAmount: 100, result: "win", amountChange: 50 },
        { player: "Bob", betAmount: 75, result: "loss", amountChange: 75 },
        { player: "Charlie", betAmount: 50, result: "win", amountChange:100},
        { player: "Alice", betAmount: 100, result: "win", amountChange: 50 },
        { player: "Bob", betAmount: 75, result: "loss", amountChange: 75 },
        { player: "Charlie", betAmount: 50, result: "win", amountChange:100},

      ];
  return (
   <div className="">
    <div className="">
        <WithdrawalReq/>
        <Button >click me</Button>
        
    </div>
    <div className="">
        <GameControls/>
    </div>
    <div className="">
        <Scoreboard scores={scores}/>
    </div>
   </div>
  )
}

export default Admin