import { Button, Card, CardHeader, Input, Typography   } from '@material-tailwind/react';
import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';


function Dashboard() {
  const [balance, setBalance] = useState(10000);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedNumbers, setSelectedNumbers] = useState(Array(5).fill(null));
  const [betAmounts, setBetAmounts] = useState(Array(5).fill(''));
  const [gameResults, setGameResults] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(Array(5).fill(0));
  const [isSlotActive, setIsSlotActive] = useState(Array(5).fill(true));
  const [slotEndTimes, setSlotEndTimes] = useState([]);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [winningNumbers, setWinningNumbers] = useState(Array(5).fill(null));
  const [showBetPopup, setShowBetPopup] = useState(Array(5).fill(false));
  const betInputRefs = useRef(Array(5).fill(null));

  const predefinedBetAmounts = [20, 50, 100, 200, 300, 500, 1000, 5000, 10000];

  const getNextSlotTime = (slotIndex) => {
    const now = new Date();""
    const slotTime = new Date(now);
    slotTime.setHours(12 + slotIndex, 0, 0, 0);
    
    if (slotTime <= now) {
      slotTime.setDate(slotTime.getDate() + 1);
    }

    return slotTime.getTime();
  };


 // Assume updateSlotTimes doesn't depend on state or props
const updateSlotTimes = () => {
  const newSlotTimes = Array(5).fill(0).map((_, index) => getNextSlotTime(index));
  setSlotEndTimes(newSlotTimes);
};

useEffect(() => {
  updateSlotTimes();

  const intervalId = setInterval(() => {
    const now = new Date().getTime();
    const newTimeRemaining = slotEndTimes.map(slot => Math.max(0, slot - now));

    // **Directly Update State Without Triggering the Effect**
    if (newTimeRemaining.every(time => time === 0)) {
      updateSlotTimes(); // No effect trigger expected here
      setIsSlotActive(Array(5).fill(true));
      setWinningNumbers(Array(5).fill(null));
    } else {
      setTimeRemaining(newTimeRemaining); // Update time remaining
      setIsSlotActive(newTimeRemaining.map(time => time > 0));
    }
  }, 1000);

  return () => clearInterval(intervalId);
}, []); // **Empty Dependency Array**


  const generateResult = (slotIndex) => {
    const winningNumber = Math.floor(Math.random() * 10) + 1;
    setWinningNumbers(prev => {
      const newWinningNumbers = [...prev];
      newWinningNumbers[slotIndex] = winningNumber;
      return newWinningNumbers;
    });

    const userNumber = selectedNumbers[slotIndex];
    const betAmount = Number(betAmounts[slotIndex]);
    const resultTime = new Date(slotEndTimes[slotIndex]);
    
    const newResult = {
      date: resultTime.toLocaleDateString(),
      timeSlot: `${resultTime.getHours() - 1}:00 PM - ${resultTime.getHours()}:00 PM ` ,
      slotIndex: slotIndex + 1,
      winningNumber: winningNumber
    };
    
    setGameResults(prev => [newResult, ...prev]);
    
    if (userNumber === winningNumber) {
      const winAmount = betAmount * 9;
      setBalance(prev => prev + winAmount);
      addToTransactionHistory(`Won ₹${winAmount} on Slot ${slotIndex + 1}`);
    } else if (userNumber !== null) {
      addToTransactionHistory(`Lost ₹${betAmount} on Slot ${slotIndex + 1}`);
    }

    setBetAmounts(prev => {
      const newBetAmounts = [...prev];
      newBetAmounts[slotIndex] = '';
      return newBetAmounts;
    });
    setSelectedNumbers(prev => {
      const newSelectedNumbers = [...prev];
      newSelectedNumbers[slotIndex] = null;
      return newSelectedNumbers;
    });
  };

  const addToTransactionHistory = (message) => {
    setTransactionHistory(prev => [{message, date: new Date()}, ...prev]);
  };

  const handleDeposit = () => {
    const amount = Number(depositAmount);
    if (amount > 0) {
      setBalance(prevBalance => prevBalance + amount);
      addToTransactionHistory(`Deposited ₹${amount}`);
      setDepositAmount('');
    } else {
      alert('Please enter a valid deposit amount');
    }
  };

  const handleWithdraw = () => {
    const amount = Number(withdrawAmount);
    if (amount > 0 && amount <= balance) {
      setBalance(prevBalance => prevBalance - amount);
      addToTransactionHistory(`Withdrew ₹${amount}`);
      setWithdrawAmount('');
    } else {
      alert('Please enter a valid withdrawal amount');
    }
  };

  const handleNumberSelect = (slotIndex, number) => {
    if (!isSlotActive[slotIndex]) return;
    const newSelectedNumbers = [...selectedNumbers];
    newSelectedNumbers[slotIndex] = number;
    setSelectedNumbers(newSelectedNumbers);
  };

  const handleBetAmountChange = (slotIndex, amount) => {
    if (!isSlotActive[slotIndex]) return;
    const newBetAmounts = [...betAmounts];
    newBetAmounts[slotIndex] = amount;
    setBetAmounts(newBetAmounts);
  };

  const handlePlaceBet = (slotIndex) => {
    if (!isSlotActive[slotIndex]) {
      toast.error('This slot is no longer active');
      return;
    }

    if (!selectedNumbers[slotIndex]) {
      toast.error('Please select a number first');
      return;
    }

    const betAmount = Number(betAmounts[slotIndex]);
    if (!betAmount || betAmount < 20 || betAmount > 100000) {
      toast.error('Please enter a valid bet amount between ₹20 and ₹100,000');
      return;
    }

    if (betAmount > balance) {
      toast.error('Insufficient balance');
      return;
    }

    setBalance(prevBalance => prevBalance - betAmount);
    addToTransactionHistory(`Placed bet of ₹${betAmount} on Slot ${slotIndex + 1}`);
    toast.success(`Bet placed for Slot ${slotIndex + 1}: Number ${selectedNumbers[slotIndex]} with amount ₹${betAmount}`);
  };

  const formatTime = (milliseconds) => {
    if (milliseconds <= 0) return '00:00:00';
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getSlotTimeRange = (slotIndex) => {
    const startTime = new Date(slotEndTimes[slotIndex]);
    startTime.setHours(startTime.getHours() - 1);
    const endTime = new Date(slotEndTimes[slotIndex]);
    
    return {
      start: startTime.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
      end: endTime.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
      date: endTime.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    };
  };

  const toggleBetPopup = (index) => {
    const newShowBetPopup = [...showBetPopup];
    newShowBetPopup[index] = !newShowBetPopup[index];
    setShowBetPopup(newShowBetPopup);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Responsive header */}
      <header className="bg-primary p-4">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <h1 className="text-2xl sm:text-4xl font-bold text-primary-foreground">1to9games</h1>
          <div className="flex items-center">
            <div className="bg-green-500 px-3 sm:px-4 py-1 sm:py-2 rounded-full text-black font-semibold text-sm sm:text-base">
              Balance: ₹{balance.toFixed(2)}
            </div>
          </div>
        </div>
      </header>

      {/* Responsive navigation */}
      <nav className="bg-secondary p-2 sm:p-4 overflow-x-auto">
        <div className="container mx-auto">
          <div className="flex space-x-2 sm:space-x-4 min-w-max">
            {['home', 'results', 'transactions', 'contact'].map((tab) => (
              <Button
                key={tab}
                onClick={() => setActiveTab(tab)}
                variant={activeTab === tab ? "filled" : "text"}
                className="text-sm sm:text-base px-2 sm:px-4"
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </nav>

      {/* Responsive main content */}
      <div className="container mx-auto p-4 sm:p-8 flex flex-col lg:flex-row lg:space-x-8 space-y-8 lg:space-y-0">
        {/* Responsive sidebar */}
        <aside className="w-full lg:w-1/4 space-y-8">
          <Card>
            <CardHeader>
              <Typography className="text-lg sm:text-xl">Deposit</Typography>
            </CardHeader>
            <Typography className="p-4">
              <Input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Enter amount"
                className="mb-2"
              />
              <Button onClick={handleDeposit} className="w-full">
                Deposit
              </Button>
            </Typography>
          </Card>
          <Card>
            <CardHeader>
              <Typography className="text-lg sm:text-xl">Withdraw</Typography>
            </CardHeader>
            <Typography className="p-4">
              <Input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Enter amount"
                className="mb-2"
              />
              <Button onClick={handleWithdraw} variant="filled" className="w-full">
                Withdraw
              </Button>
            </Typography>
          </Card>
        </aside>

        {/* Responsive main content area */}
        <main className="w-full lg:w-3/4">
          {activeTab === 'home' && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-4">Game Slots</h2>
              <div className="space-y-4 sm:space-y-6">
                {Array(5).fill().map((_, index) => {
                  const { start, end, date } = getSlotTimeRange(index);
                  return (
                    <Card key={index}>
                      <Typography className="p-3 sm:p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
                          <div className="font-semibold text-base sm:text-lg">
                            Slot {index + 1} ({start} - {end}, {date})
                          </div>
                          <div className="font-bold text-lg sm:text-xl text-yellow-400">
                            Time: {formatTime(timeRemaining[index])}
                          </div>
                        </div>
                        <div className="grid grid-cols-5 sm:flex sm:space-x-2 gap-2 sm:gap-0 mb-4">
                          {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                            <Button
                              key={num}
                              onClick={() => handleNumberSelect(index, num)}
                              variant={selectedNumbers[index] === num ? "default" : "outlined"}
                              className="w-full sm:w-10 h-10 p-0 text-sm sm:text-base"
                            >
                              {num}
                            </Button>
                          ))}
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
                          <div className="relative w-full sm:w-40">
                            <Input
                              type="number"
                              ref={el => betInputRefs.current[index] = el}
                              value={betAmounts[index]}
                              onChange={(e) => handleBetAmountChange(index, e.target.value)}
                              onFocus={() => toggleBetPopup(index)}
                              onBlur={() => setTimeout(() => toggleBetPopup(index), 200)}
                              placeholder="Bet amount"
                              className="w-full"
                            />
                            {showBetPopup[index] && (
                              <Card className="absolute left-0 mt-1 z-10 w-full sm:w-auto">
                                <Typography className="grid grid-cols-3 gap-1 p-2">
                                  {predefinedBetAmounts.map((amount) => (
                                    <Button
                                      key={amount}
                                      onClick={() => {
                                        handleBetAmountChange(index, amount);
                                        betInputRefs.current[index].focus();
                                      }}
                                      variant="outlined"
                                      size="sm"
                                      className="text-xs sm:text-sm"
                                    >
                                      ₹{amount}
                                    </Button>
                                  ))}
                                </Typography>
                              </Card>
                            )}
                          </div>
                          <Button
                            onClick={() => handlePlaceBet(index)}
                            disabled={!isSlotActive[index]}
                            className="w-full sm:w-auto absolute left-[250px] "
                          >
                            Place Bet
                          </Button>
                        </div>
                        {winningNumbers[index] !== null && (
                          <div className="mt-4 text-xl sm:text-2xl font-bold text-green-400">
                            Winning Number: {winningNumbers[index]}
                          </div>
                        )}
                      </Typography>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'results' && (
            <div className="overflow-x-auto">
              <h2 className="text-xl sm:text-2xl font-bold mb-4">Game Results</h2>
              <Card>
                <div className="min-w-full overflow-hidden">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="p-2 sm:p-4 text-left">Date</th>
                        <th className="p-2 sm:p-4 text-left">Time Slot</th>
                        <th className="p-2 sm:p-4 text-left">Slot</th>
                        <th className="p-2 sm:p-4 text-left">Winning Number</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gameResults.map((result, index) => (
                        <tr key={index}>
                          <td className="p-2 sm:p-4">{result.date}</td>
                          <td className="p-2 sm:p-4">{result.timeSlot}</td>
                          <td className="p-2 sm:p-4">Slot {result.slotIndex}</td>
                          <td className="p-2 sm:p-4 font-bold text-yellow-400">{result.winningNumber}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-4">Transaction History</h2>
              <Card>
                <Typography className="p-4">
                  <ul className="space-y-2">
                    {transactionHistory.map((transaction, index) => (
                      <li key={index} className="p-2 sm:p-3 rounded border border-border text-sm sm:text-base">
                        {transaction.message} - {transaction.date.toLocaleString()}
                      </li>
                    ))}
                  </ul>
                </Typography>
              </Card>
            </div>
          )}

          {activeTab === 'contact' && (
            <Card>
              <CardHeader>
                <Typography className="text-lg sm:text-xl">Contact Us</Typography>
              </CardHeader>
              <Typography className="p-4 text-sm sm:text-base">
                <p>For any inquiries, please contact us at support@1to9games.com</p>
              </Typography>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;