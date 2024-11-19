
// components/WithdrawalDrawer.jsx
import React, { useState, useEffect } from "react";
import {
  Drawer,
  Typography,
  Button,
  Card,
  CardBody,
  Badge,
  IconButton,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import ApprovalDialog from "./ApprovalDialog";
import LoadingOverlay from "./LoadingOverlay";
import ErrorAlert from "./ErrorAlert";
import { fetchWithdrawalRequests, approveWithdrawal } from "../api/withdrawalService";

const WithdrawalDrawer = () => {
  const [open, setOpen] = useState(false);
  const [approvalDialog, setApprovalDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      loadWithdrawals();
    }
  }, [open]);

  const loadWithdrawals = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithdrawalRequests();
      setWithdrawals(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => setOpen(!open);
  const handleApprovalDialog = () => setApprovalDialog(!approvalDialog);

  const handleApproveClick = (request) => {
    setSelectedRequest(request);
    setApprovalDialog(true);
  };

  const handleConfirmApproval = async (requestId, approvalData) => {
    try {
      await approveWithdrawal(requestId, approvalData);
      await loadWithdrawals(); // Refresh the list
      return true;
    } catch (error) {
      throw error;
    }
  };

  return  (
    <>
      <button onClick={handleOpen} >
      Withdrawal Requests
      </button>

      <Drawer
        open={open}
        onClose={handleOpen}
        className={open?  `p-4 ` : `hidden`}
        size={480}
        placement="right"
      >
        <div className="relative h-full">
          {loading && <LoadingOverlay />}
          
          <div className="mb-6 flex items-center justify-between">
            <Typography variant="h5" color="blue-gray">
              Withdrawal Requests
            </Typography>
            <IconButton
              variant="text"
              color="blue-gray"
              onClick={handleOpen}
            >
              <XMarkIcon className="h-5 w-5" />
            </IconButton>
          </div>

          {error && (
            <ErrorAlert 
              message={error} 
              onClose={() => setError(null)}
            />
          )}

          <div className="flex flex-col gap-3">
          {withdrawals.map((request) => (
          <Card key={request.id} className="w-full">
            <CardBody>
              <Typography variant="h6" color="blue-gray">
                {request.user}
              </Typography>
              <Typography variant="small" color="gray">
                Account No: {request.accountNo} - {request.bankName}
              </Typography>
              <Typography variant="small" color="gray">
                Requested Amount: ${request.amount}
              </Typography>
              <Typography variant="small" color="gray">
                Status: <Badge color={request.status === "pending" ? "yellow" : "green"}>{request.status}</Badge>
              </Typography>
              <Typography variant="small" color="gray">
                Date: {request.date}
              </Typography>
              <Typography variant="small" color="gray">
                Reason: {request.withdrawalReason}
              </Typography>

              <Button
                onClick={() => handleApproveClick(request)}
                size="sm"
                variant="outlined"
                className="mt-2"
              >
                Approve
              </Button>
            </CardBody>
          </Card>
          ))}

          </div>
        </div>
      </Drawer>

      <ApprovalDialog
        open={approvalDialog}
        handleDialog={handleApprovalDialog}
        selectedRequest={selectedRequest}
        onApprove={handleConfirmApproval}
      />
    </>
  );
};

export default WithdrawalDrawer;