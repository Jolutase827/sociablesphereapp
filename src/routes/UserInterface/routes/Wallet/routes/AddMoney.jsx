import { Button } from "@material-tailwind/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import comprobeFloat from "../../../../../functions/helpers/ComprobeFloat";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";

const AddMoney = ({ user, login }) => {
  const [money, setMoney] = useState(0.0);
  const [areInPayMent, setAreInPayment] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm();
  const goBack = () => navigate("/user-interface/wallet");
  const onSubmit = (dataInput, e) => {
    if (!comprobeFloat(dataInput.money)) {
      setMoney(parseFloat(String(dataInput.money).replace(",", ".")));
      setAreInPayment(true);
    } else setError(true);
  };

  const goToOperationCompleted = () => {
    navigate("/user-interface/wallet/operation-completed");
  };

  return (
    <>
      {!areInPayMent ? (
        <form
          className="col-12 flex flex-col items-center justify-around h-[70vh]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="text-[60px] col-11">Add money</div>
          <div className="relative col-4 col-md-3 col-lg-2 h-11">
            <input
              placeholder="Euros €*"
              className={`peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all border-b-2 placeholder-shown:border-blue-gray-200 text-[40px] pt-4 pb-4 ${
                error
                  ? "border-red-200 focus:border-red-900"
                  : "border-blue-gray-200 focus:border-gray-900"
              }`}
              {...register("money")}
              onChange={(e) => setError(false)}
            />
          </div>
          {error && (
            <div className="text-red-900 col-7 text-center">
              Please put a positive number with max 2 decimals
            </div>
          )}
          <div className="col-10 flex flex-md-row flex-column justify-end">
            <Button
              type="button"
              variant="text"
              className="me-md-5 me-0 col-12 col-md-2"
              onClick={goBack}
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="gradient"
              color="cyan"
              className="me-md-5 me-0 col-12 col-md-2"
            >
              Next
            </Button>
          </div>
        </form>
      ) : (
        <main className="col-12 flex flex-col items-center justify-around h-[70vh]">
          <div className="text-[50px] font-semibold">Payment</div>
          <div className="text-[50px] font-semibold">{money}€</div>
          <PayPalScriptProvider
            options={{
              clientId:
                "ARdwhJnv-8CAokLOTeNj5OTu_EeaKimJ8Tr3oXidVexNWCp3pLlH006Q33f6twgpijPqfDfGw4WUmFzB",
            }}
          >
            <PayPalButtons
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      description: `Add ${money}€ to ${user.user_name} wallet`,
                      amount: {
                        value: money,
                      },
                    },
                  ],
                });
              }}
              onApprove={async (data, actions) => {
                const order = await actions.order.capture();
                await axios
                  .get("https://apisociablesphere-production.up.railway.app/api/wallet/" + money, {
                    headers: {
                      "Content-Type": "multipart/form-data",
                      Authorization: `Bearer ${user.api_token}`,
                    },
                  })
                  .then((response) => {
                    const userAux = response.data;
                    if (localStorage.getItem("user") !== null&&localStorage.getItem("user") !== undefined)
                      localStorage.setItem("user", JSON.stringify(userAux));
                    sessionStorage.setItem("user", JSON.stringify(userAux));
                    login(userAux);
                  })
                  .catch((error) => alert(error.message));
                  goToOperationCompleted();
              }}
            />
          </PayPalScriptProvider>
          <div className="col-11 flex justify-end">
            <Button variant="gradient" color="red" onClick={goBack}>
              Cancel
            </Button>
          </div>
        </main>
      )}
    </>
  );
};

export default AddMoney;
