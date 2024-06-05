import { Button, Input } from "@material-tailwind/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import comprobeFloat from "../../../../../functions/helpers/ComprobeFloat";
import axios from "axios";

const WithdrawMoney = ({ user, login }) => {
  const [money, setMoney] = useState(0.0);
  const [error, setError] = useState(false);
  const [loading,setLoading] = useState(false);
  const [areInPayMent, setAreInPayment] = useState(false);
  const navigate = useNavigate();
  const [errorNotMoney, setErrorMoney] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const { register, handleSubmit } = useForm();
  const goBack = () => navigate("/user-interface/wallet");
  const goToOperationCompleted = () => {
    navigate("/user-interface/wallet/operation-completed");
  };
  const onSubmit = (dataInput, e) => {
    if (!comprobeFloat(dataInput.money)) {
      if (
        parseFloat(String(dataInput.money).replace(",", ".")) <= user.wallet
      ) {
        setMoney(parseFloat(String(dataInput.money).replace(",", ".")));
        setAreInPayment(true);
      } else setErrorMoney(true);
    } else setError(true);
  };

  const extractMoney = async (dataInput, e) => {
    setLoading(true);
    await axios
      .post(
        "https://apisociablesphere-production.up.railway.app/api/withdraw",
        {
          amount: money,
          recipientEmail: dataInput.email,
        },
        {
          headers: {
            Authorization: `Bearer ${user.api_token}`,
          },
        }
      )
      .then(async (response) => {
        await axios
          .get("https://apisociablesphere-production.up.railway.app/api/wallet/-" + money, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${user.api_token}`,
            },
          })
          .then((response) => {
            const userAux = response.data;
            if (
              localStorage.getItem("user") !== null &&
              localStorage.getItem("user") !== undefined
            )
              localStorage.setItem("user", JSON.stringify(userAux));
            sessionStorage.setItem("user", JSON.stringify(userAux));
            login(userAux);
            goToOperationCompleted();
          })
          .catch((error) => alert(error.message));
      })
      .catch((error) => {
        setErrorEmail(true);
      });
    setLoading(false);
  };
  return (
    <>
      {!areInPayMent ? (
        <form
          className="col-12 flex flex-col items-center justify-around h-[70vh]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="text-[60px] col-11">Withdraw money</div>
          <div className="relative col-4 col-md-3 col-lg-2 h-11">
            <input
              placeholder="Euros €*"
              className={`peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all border-b-2 placeholder-shown:border-blue-gray-200 text-[40px] pt-4 pb-4 ${
                error || errorNotMoney
                  ? "border-red-200 focus:border-red-900"
                  : "border-blue-gray-200 focus:border-gray-900"
              }`}
              {...register("money")}
              onChange={(e) => {
                setError(false);
                setErrorMoney(false);
              }}
            />
          </div>
          {error && (
            <div className="text-red-900 col-7 text-center">
              Please put a positive number with max 2 decimals
            </div>
          )}
          {errorNotMoney && (
            <div className="text-red-900 col-7 text-center">
              You don't have enough money
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
              Withdraw
            </Button>
          </div>
        </form>
      ) : (
        <form
          className="col-12 flex flex-col items-center justify-around h-[70vh]"
          onSubmit={handleSubmit(extractMoney)}
        >
          <div className="text-[50px] font-semibold">Payment</div>
          <div className="text-[50px] font-semibold">{money}€</div>
          <div className="col-4">
            <Input
              variant="standard"
              label="Email of Paypal acount*"
              placeholder="Email of Paypal acount*"
              onChange={(e) => setErrorEmail(false)}
              {...register("email")}
              {...(errorEmail? {error: true}:{})}
            />
          </div>
          {errorEmail && (
            <div className="text-red-900 col-7 text-center">
              This email is not in PayPal
            </div>
          )}
          <Button
            variant="gradient"
            type="submit"
            color="cyan"
            className="text-[35px]"
            {...(loading ? { loading: true } : {})}
          >
            Withdraw
          </Button>
        </form>
      )}
    </>
  );
};

export default WithdrawMoney;
