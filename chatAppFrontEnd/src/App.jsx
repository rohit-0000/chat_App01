import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Login from "./Components/login";
import Signup from "./Components/signup";
import Forgot_pass from "./Components/forgot_pass";
import Otp_verify from "./Components/otp_verify";
import Home from "./Components/home";
import Change_password from "./Components/change_password";
import Profile from "./Components/profile";
import AI from "./Components/ai";
import NavBar from "./Components/NavBar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { connectToAllRooms } from "./Utils/websocket";
import { addMessageToGroup, removeMessageFromGroup,removeChatRoom } from "./Reducer/chatSlice";
import OAuth2RedirectHandler from "./Components/OAuth2RedirectHandler ";

function App() {
  const token = localStorage.getItem("chatAppToken");
  const router = createBrowserRouter([
    {
      path: "/",
      element: token ? (
        <Navigate to="/home" />
      ) : (
        <div>
          <Login />
        </div>
      ),
    },
    {
      path: "/signup",
      element: token ? (
        <Navigate to="/home" />
      ) : (
        <div>
          <Signup />
        </div>
      ),
    },
    {
      path: "/oauth2/redirect",
      element: <OAuth2RedirectHandler />,
    },  
    {
      path: "/forgot-password",
      element: (
        <div>
          <Forgot_pass />
        </div>
      ),
    },
    {
      path: "/verify-otp",
      element: (
        <div>
          <Otp_verify />
        </div>
      ),
    },
    {
      path: "/change-pass",
      element: token ? (
        <Navigate to="/home" />
      ) : (
        <div>
          <Change_password />
        </div>
      ),
    },
    {
      path: "/home",
      element: token ? (
        <div>
          <NavBar />
          <Home />
        </div>
      ) : (
        <Navigate to={"/"} />
      ),
      // element: <Home/> ,
    },
    {
      path: "/profile",
      element: token ? (
        <div>
          <NavBar />
          <Profile />
        </div>
      ) : (
        <Navigate to={"/"} />
      ),
    },
    {
      path: "/ai",
      element: token ? (
        <div>
          <NavBar />
          <AI />
        </div>
      ) : (
        <Navigate to={"/"} />
      ),
    },
  ]);
  const dispatch = useDispatch();
  const roomIds = useSelector((state) =>
    state.chatApp.user?.group?.map((g) => g?.roomKey)
  );

  useEffect(() => {
    if (roomIds == null || roomIds === "") return;
    const client = connectToAllRooms(
      roomIds,
      (roomId, message) => {
        dispatch(addMessageToGroup({ roomId, message }));
      },
      (roomId, deletedMessageId) => { // Pass the onMessageDeleted function
        dispatch(
          removeMessageFromGroup({ roomKey:roomId, id: deletedMessageId })
        );
      },
      (roomKey)=>{
        dispatch(removeChatRoom(roomKey))
      }
    );
    return () => {
      if (client && client.connected) {
        client.disconnect();
      }
    };
  }, [roomIds]);

  return (
    <div className="text-white">
      <RouterProvider router={router} />
      {/* <Otp_verify/> */}
    </div>
  );
}

export default App;
