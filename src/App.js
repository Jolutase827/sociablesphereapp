import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./routes/Login/Login";
import Register from "./routes/Register/Register";
import Footer from "./components/Footer";
import { useState } from "react";
import userStart from "./functions/initialice/UserStart";
import ProtectedRoute from "./components/ProtectedRoute";
import UserInterface from "./routes/UserInterface/UserInterface";
import Dashboard from "./routes/UserInterface/routes/Dashboard/Dashboard";
import CreatePost from "./routes/UserInterface/routes/CreatePost/CreatePost";
import Profile from "./routes/UserInterface/routes/Profile/Profile";
import Search from "./routes/UserInterface/routes/Search/Search";
import Chats from "./routes/UserInterface/routes/Chats/Chats";
import Chat from "./routes/UserInterface/routes/Chats/routes/Chat";
import Wallet from "./routes/UserInterface/routes/Wallet/Wallet";
import AddMoney from "./routes/UserInterface/routes/Wallet/routes/AddMoney";
import WithdrawMoney from "./routes/UserInterface/routes/Wallet/routes/WithdrawMoney";
import OperationCompleted from "./routes/UserInterface/routes/Wallet/routes/OperationCompleted";
import comprobeActiveAdds from "./functions/helpers/ComprobeActiveAdds.jsx";
function App() {
  const [user, setUser] = useState(userStart());
  const [activeAdds, setActiveAdds] =useState(comprobeActiveAdds());
  const activeDesactiveAdds=()=>{
    localStorage.setItem("adds",!activeAdds);
    setActiveAdds(!activeAdds);
  }
  const logout = ()=>{
    setUser(null)
    localStorage.setItem("user",null);
    sessionStorage.setItem("user",null)
  };
  const login = (user) => setUser(user);
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user == null ? (
              <Navigate to="/login" />
            ) : (
              <Navigate to="/user-interface" />
            )
          }
        />
        <Route
          path="/login"
          element={
            <ProtectedRoute isAllowed={user === null} redirectTo="/user-interface">
              <Login user={user} login={login} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute isAllowed={user === null} redirectTo="/user-interface">
              <Register user={user} login={login} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-interface/*"
          element={
            <ProtectedRoute isAllowed={!!user} redirectTo="/login">
              <UserInterface user={user} logout={logout} activeDesactiveAdds={activeDesactiveAdds} activeAdds={activeAdds} />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<Navigate to="dashboard" />} />
          <Route
            path="dashboard/:nuevo?"
            element={<Dashboard user={user} login={login} activeAdds={activeAdds} />}
          />
          <Route
            path="chats"
            element={<Chats user={user}/>}
          />
          <Route
            path="chats/chat/:chat_id"
            element={<Chat user={user} />}
          />
          <Route
            path="search"
            element={<Search user={user} />}
          />
          <Route
            path="create-post"
            element={<CreatePost user={user} login={login} />}
          />
          <Route
            path="profile/:user_profile"
            element={<Profile user={user} login={login} />}
          />
          <Route
            path="wallet"
            element={<Wallet user={user} />}
          />
          <Route
            path="wallet/addmoney"
            element={<AddMoney user={user} login={login} />}
          />
          <Route
            path="wallet/withdrawmoney"
            element={<WithdrawMoney user={user} login={login} />}
          />
          <Route
            path="wallet/operation-completed"
            element={<OperationCompleted user={user} />}
          />
        </Route>
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
