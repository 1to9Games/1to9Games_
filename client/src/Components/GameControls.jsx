import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Alert,
  List,
  ListItem,
  Select,
  Option
} from "@material-tailwind/react";

const GameControls = () => {
  const [bets] = useState([
    { id: 1, username: "user1", number: 7, coins: 100, timeSlot: "12PM" },
    { id: 2, username: "user2", number: 3, coins: 50, timeSlot: "12PM" },
    { id: 3, username: "user3", number: 7, coins: 200, timeSlot: "1PM" },
    { id: 4, username: "user4", number: 5, coins: 75, timeSlot: "2PM" },
  ]);

  const [winningNumber, setWinningNumber] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("12PM");

  const timeSlots = ["12PM", "1PM", "2PM", "3PM", "4PM"];

  const calculateStats = (timeSlot) => {
    const stats = {};
    for (let i = 1; i <= 10; i++) {
      stats[i] = {
        number: i,
        totalBets: 0,
        totalCoins: 0,
        users: new Set(),
        timeSlot: timeSlot
      };
    }
    
    bets.filter(bet => bet.timeSlot === timeSlot)
      .forEach(bet => {
        if (bet.number >= 1 && bet.number <= 10) {
          stats[bet.number].totalBets += 1;
          stats[bet.number].totalCoins += bet.coins;
          stats[bet.number].users.add(bet.username);
        }
      });

    return Object.values(stats).sort((a, b) => b.totalCoins - a.totalCoins);
  };

  const handleDrawNumber = (number, timeSlot) => {
    setWinningNumber({ number, timeSlot });
    setShowAlert(true);
  };

  return (
    <div className="p-2 md:p-4 lg:p-6 max-w-[95%] md:max-w-3xl lg:max-w-5xl mx-auto space-y-4 md:space-y-6">
      <Card className="w-full">
        <CardHeader color="blue" className="p-4 md:p-6">
          <Typography variant="h4" className="text-xl md:text-2xl lg:text-3xl">
            Betting Game Admin Panel
          </Typography>
        </CardHeader>
        
        <CardBody className="space-y-4 md:space-y-6">
          {/* Current Bets Section */}
          <div>
            <Typography variant="h5" className="mb-2 md:mb-4 text-lg md:text-xl">
              Current Bets
            </Typography>
            <Card className="w-full overflow-hidden">
              <List>
                {bets.map((bet) => (
                  <ListItem key={bet.id} className="py-2 px-4">
                    <div className="flex flex-col sm:flex-row justify-between w-full gap-2 sm:gap-0">
                      <Typography className="font-medium">
                        {bet.username}
                      </Typography>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                        <Typography color="gray" className="font-medium">
                          {bet.timeSlot}
                        </Typography>
                        <Typography color="blue" className="font-medium">
                          Number: {bet.number}
                        </Typography>
                        <Typography color="green" className="font-medium">
                          {bet.coins} coins
                        </Typography>
                      </div>
                    </div>
                  </ListItem>
                ))}
              </List>
            </Card>
          </div>

          {/* Statistics Section */}
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
              <Typography variant="h5" className="text-lg md:text-xl">
                Number Statistics By Time Slot
              </Typography>
              <div className="w-full md:w-48">
                <Select
                  value={selectedTimeSlot}
                  onChange={(value) => setSelectedTimeSlot(value)}
                  label="Select Time Slot"
                  className="w-full"
                >
                  {timeSlots.map((time) => (
                    <Option key={time} value={time}>
                      {time}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {calculateStats(selectedTimeSlot).map((data) => (
                <Card key={data.number} className="p-3 md:p-4">
                  <CardBody className="p-0">
                    <Typography variant="h6" color="blue" className="mb-2">
                      Number {data.number}
                    </Typography>
                    <List className="p-0">
                      <ListItem className="py-1">
                        <Typography variant="small" className="text-sm md:text-base">
                          Total Bets: {data.totalBets}
                        </Typography>
                      </ListItem>
                      <ListItem className="py-1">
                        <Typography variant="small" className="text-sm md:text-base">
                          Total Coins: {data.totalCoins}
                        </Typography>
                      </ListItem>
                      <ListItem className="py-1">
                        <Typography variant="small" className="text-sm md:text-base">
                          Unique Users: {data.users.size}
                        </Typography>
                      </ListItem>
                    </List>
                    <div className="mt-3">
                      <Button
                        color="blue"
                        size="sm"
                        fullWidth
                        onClick={() => handleDrawNumber(data.number, selectedTimeSlot)}
                        className="text-sm md:text-base py-2 md:py-3"
                      >
                        Draw Number {data.number}
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>

      {showAlert && (
        <Alert
          color="green"
          open={showAlert}
          onClose={() => setShowAlert(false)}
          className="mt-4 fixed bottom-4 right-4 left-4 md:left-auto md:w-96 z-50"
          animate={{
            mount: { y: 0 },
            unmount: { y: 100 },
          }}
        >
          <Typography variant="h6" color="white" className="text-sm md:text-base">
            Winning number drawn: {winningNumber.number} for {winningNumber.timeSlot}
          </Typography>
        </Alert>
      )}
    </div>
  );
};

export default GameControls;