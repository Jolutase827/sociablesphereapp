import React, { useEffect, useState } from "react";
import {
  DialogHeader,
  Dialog,
  DialogBody,
  Button,
  DialogFooter,
  Input,
  Textarea,
} from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import ShowUserAsList from "../../../../../components/ShowUserAsList";
import axios from "axios";
const ShowFollows = ({
  openFollows,
  handleOpenFollows,
  userToShow,
  setUserToShow,
}) => {
  const [follows, setFollows] = useState([]);
  const [followsToSearch, setFollowsToSearch] = useState([]);
  const [loading, setLoading] = useState(false);
  const { register, watch } = useForm();

  const getFollows = async () => {
    setLoading(true);
    await axios
      .get("https://apisociablesphere-production.up.railway.app/api/follows/" + userToShow.id, {
        headers: {
          Authorization: `Bearer ${userToShow.api_token}`,
        },
      })
      .then((response) => {
        setFollows(response.data);
        setFollowsToSearch(response.data);
      })
      .catch((error) => console.error(error));
    setLoading(false);
  };

  useEffect(() => {
    setFollowsToSearch(
      follows.filter(
        (follow) =>
          follow.followers.user_name.includes(watch("user")) ||
          follow.followers.name.includes(watch("user"))
      )
    );
  }, [watch("user")]);

  useEffect(() => {
    getFollows();
  }, [userToShow]);

  return (
    <Dialog open={openFollows} handler={handleOpenFollows}>
      <DialogHeader className="logo-font flex justify-between">
        <div>Follows</div>
        <i
          className="bi bi-x-lg text-[25px] cursor-pointer"
          onClick={() => handleOpenFollows(false)}
        ></i>
      </DialogHeader>
      <DialogBody className="col-12">
        <div className="col-12 flex flex-col items-center">
          <div className="col-11">
            <Input
              variant="standard"
              label="Search"
              placeholder="Search"
              color="cyan"
              {...register("user")}
            />
          </div>
          <div
            className="col-11 mt-1 max-h-[60vh] min-h-[60vh] overflow-y-scroll"
            onClick={handleOpenFollows} 
          >
            {follows.length === 0 ? (
              <div className="col-12 flex h-[60vh] items-center justify-center">
                Without follows
              </div>
            ) : followsToSearch.length === 0 ? (
              <div className="col-12 flex h-[60vh] items-center justify-center">
                There are no follows with this name
              </div>
            ) : (
              followsToSearch.map((follower, index) => (
                <ShowUserAsList userToShow={follower.followers} key={index} />
              ))
            )}
          </div>
        </div>
      </DialogBody>
    </Dialog>
  );
};

export default ShowFollows;
