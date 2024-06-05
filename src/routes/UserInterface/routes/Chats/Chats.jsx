import React, { useEffect, useState } from "react";
import LoadingPage from "../../../../components/LoadingPage";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Input } from "@material-tailwind/react";
import ShowUserAsList from "../../../../components/ShowUserAsList";
import ShowChatAsList from "../../../../components/ShowChatAsList";

const Chats = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [chatsToSearch, setChatsToSearch] = useState([]);
  const [chatsSuggested, setChatSuggested] = useState([]);
  const [suggestionsToSearch, setSuggestionsToSearch] = useState([]);
  const { register, watch } = useForm();
  const getChats = async () => {
    setLoading(true);
    await axios
      .get("https://apisociablesphere-production.up.railway.app/api/chats", {
        headers: {
          Authorization: `Bearer ${user.api_token}`,
        },
      })
      .then((response) => {
        setChats(response.data);
        setChatsToSearch(response.data);
      })
      .catch((error) => console.error(error));
  };
  
  const getChatsSuggested = async () => {
    await axios
      .get("https://apisociablesphere-production.up.railway.app/api/follows/" + user.id, {
        headers: {
          Authorization: `Bearer ${user.api_token}`,
        },
      })
      .then((response) => {
        let follows = response.data;
        let sugested = follows.filter((follow) => chats.find(
          (chat) =>
            chat.user_1.id === follow.followers.id ||
            chat.user_2.id === follow.followers.id
        ) === undefined);
        setChatSuggested(sugested);
        setSuggestionsToSearch(sugested);
      })
      .catch((error) => console.error(error));
    setLoading(false);
  };

  useEffect(() => {
    setChatsToSearch(
      chats.filter((chat) => {
        if (chat.user_1.id !== user.id) {
          chat.user_1.user_name.includes(watch("user")) ||
            chat.user_1.name.includes(watch("user"));
        }
        return (
          chat.user_2.user_name.includes(watch("user")) ||
          chat.user_2.name.includes(watch("user"))
        );
      })
    );
    setSuggestionsToSearch(
      chatsSuggested.filter(
        (chat) =>
          chat.followers.user_name.includes(watch("user")) ||
          chat.followers.name.includes(watch("user"))
      )
    );
  }, [watch("user")]);

  useEffect(() => {
    getChats();
  }, [user]);
  useEffect(() => {
    getChatsSuggested();
  }, [chats]);

  return (
    <main className="min-h-[70vh] flex flex-col items-center">
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          <div className="col-6 mt-3">
            <Input
              variant="standard"
              label="Search"
              placeholder="Search"
              color="cyan"
              {...register("user")}
            />
          </div>
          <div className="col-11 col-md-6 mt-2 overflow-y-scroll max-h-[65vh]">
            <div className="text-[30px] font-semibold mt-2">Your chats</div>
            {chats.length === 0 ? (
              <div className="text-center text-gray-500 ">
                You don't have any chat
              </div>
            ) : chatsToSearch.length === 0 ? (
              <div className="text-center text-gray-500 ">
                You don't have any chat with this user
              </div>
            ) : (
              <>
                {chatsToSearch.map((chat, index) => (
                  <ShowChatAsList
                    userToShow={
                      parseInt(chat.user1_id) === parseInt(user.id) ? chat.user_2 : chat.user_1
                    }
                    chat={chat}
                    key={index}
                    setLoading={setLoading}
                    user={user}
                  />
                ))}
              </>
            )}
            <div className="text-[30px] font-semibold mt-2">Suggestions</div>
            {chatsSuggested.length === 0 ? (
              <div className="text-center text-gray-500 ">
                You don't have any suggestions
              </div>
            ) : suggestionsToSearch.length === 0 ? (
              <div className="text-center text-gray-500 ">
                You don't have any suggestions with this user
              </div>
            ) : (
              <>
                {suggestionsToSearch.map((suggestions, index) => (
                  <ShowChatAsList
                    userToShow={suggestions.followers}
                    key={index}
                    setLoading={setLoading}
                    user={user}
                  />
                ))}
              </>
            )}
          </div>
        </>
      )}
    </main>
  );
};

export default Chats;
