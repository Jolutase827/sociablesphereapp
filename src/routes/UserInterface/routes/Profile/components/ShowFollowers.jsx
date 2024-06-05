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
const ShowFollowers = ({
  openFollowers,
  handleOpenFollowers,
  userToShow,
  setUserToShow,
}) => {
  const [followers, setFollowers] = useState([]);
  const [followersToSearch, setFollowersToSearch] = useState([]);
  const [loading, setLoading] = useState(false);
  const { register, watch } = useForm();

  const getFollowers = async () => {
    setLoading(true);
    await axios
      .get("https://apisociablesphere-production.up.railway.app/api/followed/" + userToShow.id, {
        headers: {
          Authorization: `Bearer ${userToShow.api_token}`,
        },
      })
      .then((response) => {
        setFollowers(response.data);
        setFollowersToSearch(response.data);
      })
      .catch((error) => console.error(error));
    setLoading(false);
  };
  useEffect(() => {
    setFollowersToSearch(
      followers.filter(
        (follow) =>
          follow.followed.user_name.includes(watch("user")) ||
          follow.followed.name.includes(watch("user"))
      )
    );
  }, [watch("user")]);

  useEffect(() => {
    getFollowers();
  }, [userToShow]);

  return (
    <Dialog open={openFollowers} handler={handleOpenFollowers}>
      <DialogHeader className="logo-font flex justify-between">
        <div>Followers</div>
        <i
          className="bi bi-x-lg text-[25px] cursor-pointer"
          onClick={() => handleOpenFollowers(false)}
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
            onClick={handleOpenFollowers}
          >
            {followers.length === 0 ? (
              <div className="col-12 flex h-[60vh] items-center justify-center">
                There are no followers
              </div>
            ) : followersToSearch.length === 0 ? (
              <div className="col-12 flex h-[60vh] items-center justify-center">
                There are no followers with this name
              </div>
            ) : (
              followersToSearch.map((follower, index) => (
                <ShowUserAsList userToShow={follower.followed} key={index} />
              ))
            )}
          </div>
        </div>
      </DialogBody>
    </Dialog>
  );
};

export default ShowFollowers;
