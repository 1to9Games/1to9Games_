import React from 'react'
import Scoreboard from '../Components/ScoreBoard'
import { AdminNavbar } from '../Components/Navbar';
import GameControls from '../Components/GameControls';



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
   <div className="relative ">
    <div className="w-full z-10 absolute pt-4">
        <AdminNavbar/>
    </div>
    <div className=" pt-[100px]">
        <GameControls/>
    </div>
    <div className="">
        <Scoreboard scores={scores}/>
    </div>
   </div>
  )
}

export default Admin