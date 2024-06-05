import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
const Wallet = ({ user }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <div className="text-[50px] font-semibold">Wallet</div>
      <div className="text-[70px] font-semibold">{user.wallet}€</div>
      <div className="col-12 flex flex-column flex-sm-row justify-around items-center">
        <Button variant="gradient" color="green" className="text-[20px] col-11 col-sm-4 mt-3" onClick={()=>navigate("/user-interface/wallet/addmoney")}>Add money</Button>
        <Button variant="gradient" color="cyan" className="text-[20px] col-11 col-sm-4 mt-3" onClick={()=>navigate("/user-interface/wallet/withdrawmoney")}>Withdraw money</Button>
      </div>
    </div>
  );
};

export default Wallet;
