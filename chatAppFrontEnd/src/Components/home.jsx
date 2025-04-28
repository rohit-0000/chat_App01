import React, { useRef, useState, useEffect } from "react";
import { Navigate, NavLink, useNavigate } from "react-router";
import CreateImg from "../assets/createImg.svg";
import SearchImg from "../assets/searchImg.svg";
import JoinGroupImg from "../assets/joinGroupImg.svg";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import DefaultGroup from "../assets/defaultGroup.svg";
import GroupEditImg from "../assets/groupEditImg.svg";
import defaultUserImg from "../assets/DefaultUser.svg";
import BackImg from "../assets/backImg.svg";
import sendImg from "../assets/sendImg.svg";
import CreateGroup from "./createGroup";
import JoinGroup from "./joinGroup";
import GroupInfo from "./groupInfo";
import { sendMessage } from "../Utils/websocket";
const Home = () => {
  const leftBoxRef = useRef(null);
  const rightBoxRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.chatApp.user);
  const [roomCreateForm, setRoomCreateForm] = useState(false);
  const [roomJoinForm, setRoomJoinForm] = useState(false);
  const createRoomBtn = useRef(null);
  const joinRoomBtn = useRef(null);
  const addBtnRef = useRef(null);
  const groupInfoRef = useRef(null);
  const [groupNo, setGroupNo] = useState(null);
  const [addGroup, setAddGroup] = useState(false);
  const [OpenGroupInfo, setOpenGroupInfo] = useState(false);
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);

  const [sizes, setSizes] = useState(() => {
    const savedSizes = JSON.parse(localStorage.getItem("boxSizes"));
    return savedSizes || { left: 30, right: 70 };
  });

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem("boxSizes", JSON.stringify(sizes));
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [sizes]);

  const handleMouseDown = () => {
    setIsDragging(true); // Set dragging state to true
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener(
      "mouseup",
      () => {
        document.removeEventListener("mousemove", handleMouseMove);
        setIsDragging(false); // Reset dragging state
      },
      { once: true }
    );
  };

  const handleMouseMove = (e) => {
    setSizes({
      left: `${leftBoxRef.current.offsetWidth + e.movementX}vw`,
      right: `${rightBoxRef.current.offsetWidth - e.movementX}vw`,
    });
  };
  function handleSendMessage() {
    if (message === "" || message === null) return;
    const msg = {
      senderId: user.id,
      message: message,
      time: new Date().toISOString(),
      senderName: user.name,
      senderImg: user.userImageUrl,
    };
    sendMessage(groupNo, msg);
    setMessage("");
    textareaRef.current.style.height = "auto"; 
  }
  useEffect(() => {
    const handleClickOutside_CreateRoom = (event) => {
      if (
        roomCreateForm === true &&
        createRoomBtn.current &&
        !createRoomBtn.current.contains(event.target)
      ) {
        setRoomCreateForm(false);
      }
    };
    const handleClickOutside_JoinRoom = (event) => {
      if (
        roomJoinForm === true &&
        joinRoomBtn.current &&
        !joinRoomBtn.current.contains(event.target)
      ) {
        setRoomJoinForm(false);
      }
    };
    const handleClickOutside_addBtn = (event) => {
      if (
        addGroup === true &&
        addBtnRef.current &&
        !addBtnRef.current.contains(event.target)
      ) {
        setAddGroup(false);
      }
    };
    const handleClickOutside_GroupInfo = (event) => {
      if (
        OpenGroupInfo === true &&
        groupInfoRef.current &&
        !groupInfoRef.current.contains(event.target)
      ) {
        setOpenGroupInfo(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside_CreateRoom);
    document.addEventListener("mousedown", handleClickOutside_JoinRoom);
    document.addEventListener("mousedown", handleClickOutside_addBtn);
    document.addEventListener("mousedown", handleClickOutside_GroupInfo);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside_CreateRoom);
      document.removeEventListener("mousedown", handleClickOutside_JoinRoom);
      document.removeEventListener("mousedown", handleClickOutside_addBtn);
      document.removeEventListener("mousedown", handleClickOutside_GroupInfo);
    };
  }, [roomCreateForm, roomJoinForm, addGroup, OpenGroupInfo]);

  return (
    <div className="overflow-hidden h-screen max-w-screen p-2 flex gap-1 relative ">
      {/* Main Box */}
      <div className="flex rounded-2xl h-full w-fit overflow-hidden border-white pl-14 gap-0">
        {/* left Box */}
        <div
          ref={leftBoxRef}
          className={`h-full min-w-70 relative rounded-l-2xl bg-[#fff1d53a] ${
            groupNo !== null && "hidden md:flex"
          } flex flex-col justify-center gap-2 `}
          style={{ width: sizes.left }}
        >
          {/* left top */}
          <div className="flex flex-col gap-2">
            <div className="w-full h-18 rounded-tl-2xl flex justify-between items-center px-4 border-b-8 border-slate-950 relative">
              <h1 className="text-2xl font-bold">Chats</h1>
              {/* create or join group button */}
              <button
                className="cursor-pointer z-10 active:scale-90"
                onClick={() => setAddGroup(!addGroup)}
              >
                <img src={GroupEditImg} className="w-11" />
              </button>

              {/* enable create or join group button */}
              {addGroup && (
                <div
                  className="absolute -bottom-28 right-2 bg-[#00000040] w-fit h-fit px-4 py-2 rounded backdrop-blur-md flex flex-col gap-2"
                  ref={addBtnRef}
                >
                  <button
                    className="flex items-center gap-2 hover:border-1 px-2 py-1 rounded-md cursor-pointer"
                    onClick={() => {
                      setRoomJoinForm(true);
                    }}
                  >
                    <img src={JoinGroupImg} className="w-10 p-1 " />
                    <p className="font-bold">Join Group</p>
                  </button>
                  <button
                    className="flex items-center gap-2 hover:border-1 px-2 py-1 rounded-md cursor-pointer"
                    onClick={() => {
                      setRoomCreateForm(true);
                    }}
                  >
                    <img src={CreateImg} className="w-10" />
                    <p className="font-bold">Create Group</p>
                  </button>
                </div>
              )}
            </div>

            <div className="mx-3 bg-slate-950 rounded-xl flex items-center px-2">
              <img src={SearchImg} className="h-7" />
              <input
                className="w-full h-12 pl-2 text-xl outline-0 rounded-xl"
                placeholder="Search"
              ></input>
            </div>
          </div>

          {/* groups */}
          <div className="w-full h-full rounded-bl-2xl p-2 flex flex-col gap-1 ">
            {user?.group?.map((grp, index) => (
              <div
                key={index}
                className={`flex gap-1 items-center ${
                  grp.roomKey === groupNo && "bg-slate-900 rounded-xl"
                } p-1`}
                onClick={() => {
                  setGroupNo(grp?.roomKey);
                }}
              >
                <img
                  src={grp?.groupImageUrl || DefaultGroup}
                  className="w-12 h-12 object-cover rounded-full p-1 "
                />
                {grp.roomName}
              </div>
            ))}
          </div>

          {/* center line */}
          <div
            className={`h-full hidden md:block md:absolute right-[-0px] top-0 cursor-ew-resize border border-[#fff1d513] rounded ${
              isDragging
                ? "w-0.5 bg-blue-500"
                : "hover:w-1 hover: bg-neutral-400"
            } `}
            onMouseDown={handleMouseDown}
          ></div>
        </div>

        {/* Room Create Form */}
        {roomCreateForm && (
          <div className="absolute left-0 top-0 h-screen w-screen bg-[#0000005e] backdrop-blur-md z-50 flex justify-center items-center">
            <CreateGroup
              setRoomCreateForm={setRoomCreateForm}
              ref={createRoomBtn}
            />
          </div>
        )}
        {/* Room Join Form */}
        {roomJoinForm && (
          <div className="absolute left-0 top-0 h-screen w-screen bg-[#0000005e] backdrop-blur-md z-50 flex justify-center items-center">
            <JoinGroup setRoomJoinForm={setRoomJoinForm} ref={joinRoomBtn} />
          </div>
        )}

        {/* rightBox */}
        <div
          ref={rightBoxRef}
          className={`h-full  md:block  border-dotted rounded-l-2xl md:rounded-l-none rounded-r-2xl bg-[#ffffff2a] relative ${
            groupNo === null ? "hidden" : ""
          }`}
          style={{ width: sizes.right }}
        >
          {groupNo == null ? (
            ""
          ) : (
            <div className="flex flex-col justify-between h-full">
              {/* right top  */}
              <div className="flex bg-[#02061892] h-22 rounded-tr-2xl  cursor-pointer">
                {groupNo !== null && (
                  <button
                    onClick={() => {
                      setGroupNo(null);
                    }}
                    className="md:hidden"
                  >
                    <img src={BackImg} className="w-6 ml-2" />
                  </button>
                )}
                <div
                  className="w-full flex items-center gap-3 pl-3"
                  onClick={() => {
                    setOpenGroupInfo(!OpenGroupInfo);
                  }}
                >
                  <img
                    src={
                      user?.group?.find((group) => group.roomKey === groupNo)
                        ?.groupImageUrl || DefaultGroup
                    }
                    className="w-13 h-13 rounded-full object-cover"
                  />
                  <p>
                    {
                      user?.group?.find((group) => group.roomKey === groupNo)
                        ?.roomName
                    }
                  </p>
                </div>
              </div>

              {OpenGroupInfo === true && (
                <div className="absolute top-2 left-2 bg-[#02061892] backdrop-blur-xl rounded-lg z-90">
                  <GroupInfo
                    group={user?.group?.find(
                      (group) => group.roomKey === groupNo
                    )}
                    id={user.id}
                    ref={groupInfoRef}
                  />
                </div>
              )}

              {/* chat */}
              <div className="h-full px-3 py-2 flex flex-col-reverse gap-3 overflow-y-scroll  no-scrollbar w-full">
                {user?.group
                  ?.find((group) => group.roomKey === groupNo)
                  ?.chat?.slice()
                  .reverse()
                  .map((m, index) => (
                    <div
                      key={index}
                      className={`${
                        m?.senderId?.timestamp === user?.id.timestamp &&
                        user.id.date === m.senderId.date
                          ? "self-end flex-row-reverse"
                          : "self-start"
                      } w-[50%] text-white flex `}
                    >
                      {m?.senderId?.timestamp !== user?.id.timestamp &&
                        user.id.date !== m.senderId.date&&
                      <img
                        src={m.senderImg || defaultUserImg}
                        className="w-10 h-10 object-cover rounded-full bg-slate-950 mr-2"
                      />}
                      <div
                        className={`${
                          m?.senderId?.timestamp === user?.id.timestamp &&
                          user.id.date === m.senderId.date
                            ? "bg-gradient-to-r from-indigo-800  to-purple-800 rounded-tr-none"
                            : "bg-blue-950 rounded-tl-none"
                        } w-fit rounded-xl `}
                      >
                        <div className="">
                          <div className="text-xs italic text-amber-400 pl-2 pt-2">
                            ~{m?.senderName && m.senderName}
                          </div>

                          <div className="whitespace-pre-wrap w-fit px-5 py-2">
                            {m?.message}
                          </div>

                          
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* send message */}
              <div className="bg-slate-900 h-fit rounded-br-2xl flex justify-between ">
                <textarea
                  placeholder="Type a message "
                  className="w-full resize-none outline-0 px-2 my-2 max-h-50"
                  rows={2}
                  value={message}
                  onInput={(e) => {
                    e.target.style.height = `auto`;
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                  ref={textareaRef}
                  onChange={(e) => {
                    setMessage(e.target.value);
                  }}
                />
                <button onClick={handleSendMessage}>
                  <img src={sendImg} className="h-8  mr-2"></img>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
