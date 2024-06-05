import { Button } from "@material-tailwind/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import LoadingPage from "../../../../components/LoadingPage";
import ShowUserAsList from "../../../../components/ShowUserAsList";
import { useForm } from "react-hook-form";

const Search = ({ user }) => {
  const [usersToShow, setUsersToShow] = useState([]);
  const [loadingSearching, setLoadingSearching] = useState(false);

  const getFirstUsers = async () => {
    setLoadingSearching(true);
    await axios
      .get("https://apisociablesphere-production.up.railway.app/api/new_users/" + user.id, {
        headers: {
          Authorization: `Bearer ${user.api_token}`,
        },
      })
      .then((response) => {
        setUsersToShow(response.data);
      })
      .catch((error) => console.error(error));
    setLoadingSearching(false);
  };

  const onSubmit = async (dataInput, e) => {
    if (dataInput.user_name === "") getFirstUsers();
    else {
      setLoadingSearching(true);
      await axios
        .post(
          "https://apisociablesphere-production.up.railway.app/api/find_users_like/" + user.id,
          { user_name: dataInput.user_name },
          {
            headers: {
              Authorization: `Bearer ${user.api_token}`,
            },
          }
        )
        .then((response) => {
          setUsersToShow(response.data);
        })
        .catch((error) => console.error(error));
      setLoadingSearching(false);
    }
  };

  const { register, handleSubmit } = useForm();

  useEffect(() => {
    getFirstUsers();
  }, [user]);

  return (
    <main className="min-h-[70vh] col-12 flex justify-center">
      <div className=" col-12 col-md-7 mb-3 flex flex-col items-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="col-12 flex justify-center items-center mt-2"
        >
          <input
            type="text"
            placeholder="Search"
            className=" py-2 px-2 col-6 rounded-s-lg text-[15px] bg-gray-100 shadow-lg"
            {...register("user_name")}
          />
          <Button
            variant="gradient"
            color="cyan"
            className="py-2 px-4 rounded-s-none  text-[15px]"
            type="submit"
          >
            <i className="bi bi-search "></i>
          </Button>
        </form>
        {loadingSearching ? (
          <div className="flex flex-col col-12 items-center">
            <LoadingPage />
          </div>
        ) : usersToShow.length === 0 ? (
          <div className="text-center text-[20px] text-gray-500">
            Don't found users with this name
          </div>
        ) : (
          <div className="col-12 col-sm-8 flex flex-col justify-center items-center">
            {usersToShow.map((userToShow, index) => (
              <ShowUserAsList userToShow={userToShow} key={index} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Search;
