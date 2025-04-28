import React, { useEffect, useRef, useState } from "react";
import DefaultRoomImg from "../assets/defaultGroup.svg";
import EditImg from "../assets/editTextImg.svg";
import { useDispatch } from "react-redux";
import {
  deleteGroup,
  deleteGroupImg,
  leaveGroup,
  setGroupImg,
  updateGroup,
} from "../Reducer/chatSlice";
import toast from "react-hot-toast";
const groupInfo = (props) => {
  const group = props.group;
  const [description, setDescription] = useState(false);
  const [descriptionInput, setDescriptionInput] = useState("");
  const [name, setName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const dispatch = useDispatch();
  const [hoverImg, setImgHover] = useState(false);
  const [ImgClick, setImgClick] = useState(false);
  const imgBtnRef = useRef(null);
  const [fullImg, setFullImg] = useState(false);
  const admin = group?.admin?.find(
    (admin) => admin.timestamp === props.id.timestamp
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (imgBtnRef.current && !imgBtnRef.current.contains(event.target)) {
        setImgClick(false);
      }
      if (imgBtnRef.current && !imgBtnRef.current.contains(event.target)) {
        setFullImg(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  function handleImgInput(e) {
    const img = e.target.files[0];
    if (img && img.type.startsWith("image/")) {
      const formData = new FormData();
      formData.append("image", img);
      dispatch(setGroupImg({ ImageData: formData, groupId: group.roomKey }));
    } else {
      toast.error("Invalid file type");
    }
  }
  function handleSaveDescription() {
    if (descriptionInput === "") {
      toast.error("Description can not be empty");
      setDescription(false);
      return;
    }
    const chatRoom = {
      roomKey: group?.roomKey,
      description: descriptionInput,
    };
    dispatch(updateGroup(chatRoom));
    setDescription(() => !description);
  }
  function handleSaveName() {
    if (nameInput === "") {
      toast.error("Name can not be empty");
      setName(false);
      return;
    }
    const chatRoom = {
      roomKey: group?.roomKey,
      roomName: nameInput,
    };
    dispatch(updateGroup(chatRoom));
    setName(() => !name);
  }
  function handleDeleteGroupImg() {
    dispatch(deleteGroupImg(group.roomKey));
  }
  return (
    <div className={`w-full h-full flex flex-col  gap-1  px-5 py-10`} 
    ref={props.ref}
    >
      <img
        src={group?.groupImageUrl ? group?.groupImageUrl : DefaultRoomImg}
        className={`${
          fullImg
            ? " absolute left-0 top-0 w-[80vw] h-[80vw]  md:w-[45vw] md:h-[45vw] "
            : "  w-30 h-30 "
        }  self-center  rounded-xl object-cover`}
        onMouseEnter={() => {
          setImgHover(true);
        }}
        onMouseLeave={() => {
          setImgHover(false);
        }}
      />
      {hoverImg && !fullImg && (
        <img
          src={EditImg}
          className="absolute w-30 h-30 bg-[#000000a7] p-6 rounded-xl self-center cursor-pointer"
          // onClick={handleImgClick}
          onMouseEnter={() => {
            setImgHover(true);
          }}
          onMouseLeave={() => {
            setImgHover(false);
          }}
          onClick={() => setImgClick(true)}
        />
      )}
      {ImgClick && (
        <div
          className="absolute self-center top-32.5 bg-slate-700 flex flex-col gap-1 px-4 py-2 rounded-xl z-10"
          ref={imgBtnRef}
        >
          <button
            className="hover:border px-2 py-1 cursor-pointer rounded z-10"
            onClick={() => {
              setImgClick(false);
              setFullImg(true);
            }}
          >
            View
          </button>
          {admin && (
            <label onChange={handleImgInput}>
              <input type="file" accept="image" className="hidden" />
              <div className="hover:border px-2 py-1 cursor-pointer rounded z-10">
                Change
              </div>
            </label>
          )}
          {admin && (
            <button
              className="hover:border px-2 py-1 cursor-pointer rounded z-10"
              onClick={handleDeleteGroupImg}
            >
              Remove
            </button>
          )}
        </div>
      )}

      {!fullImg && (
        <div>
          {/* room name ----------------------------- */}
          <div>
            <h3 className="font-bold">Name</h3>

            <div className="relative w-[90%]">
              <input
                type="text"
                placeholder="Enter group description"
                className={`${
                  name && "border-b-4 border-green-600"
                } text-white pl-3 w-full py-2 text-xl rounded-md outline-0 pr-10`}
                defaultValue={group?.roomName}
                disabled={!name}
                onChange={(e) => {
                  setNameInput(e.target.value);
                }}
              />
              {admin && (
                <img
                  src={!name && EditImg}
                  className="absolute right-0 top-1 w-9 cursor-pointer active:scale-85"
                  onClick={() => {
                    setName(!name);
                  }}
                />
              )}
              {name && (
                <button
                  className="absolute right-0 bottom-1 px-3 py-1 rounded cursor-pointer active:scale-85 bg-green-600"
                  onClick={handleSaveName}
                >
                  Save
                </button>
              )}
            </div>
          </div>

          {/* Description------------------------------ */}
          <div>
            <h3 className="font-bold">Description</h3>

            <div className="relative w-[90%]">
              <input
                type="text"
                placeholder="Enter group description"
                className={`${
                  description && "border-b-4 border-green-600"
                } text-white pl-3 w-full py-2 text-xl rounded-md outline-0 pr-10`}
                defaultValue={group?.description}
                disabled={!description}
                onChange={(e) => {
                  setDescriptionInput(e.target.value);
                }}
              />
              {description && (
                <button
                  className="absolute right-0 bottom-1 px-3 py-1 rounded cursor-pointer active:scale-85 bg-green-600"
                  onClick={handleSaveDescription}
                >
                  Save
                </button>
              )}
              {admin && (
                <img
                  src={!description && EditImg}
                  className="absolute right-0 top-1 w-9 cursor-pointer active:scale-85"
                  onClick={() => {
                    setDescription(!description);
                  }}
                />
              )}
            </div>
          </div>

          {/* room Key */}
          {admin && (
            <div>
              <h3 className="font-bold">Room Key</h3>
              <p className="text-white pl-3 w-full py-2 text-xl rounded-md outline-0 pr-10">
                {group?.roomKey}
              </p>
            </div>
          )}

          {/* Danger button  */}
          <div className="flex gap-5 justify-center">
            <button
              className="px-2 py-1 bg-red-400 rounded hover:bg-red-600 active:scale-90"
              onClick={() => {
                dispatch(leaveGroup(group.roomKey));
              }}
            >
              Leave Group
            </button>

            {group?.admin?.find(
              (admin) => admin.timestamp === props.id.timestamp
            ) && (
              <button
                className="px-2 py-1 bg-red-400 rounded hover:bg-red-600 active:scale-90"
                onClick={() => {
                  dispatch(deleteGroup(group?.roomKey));
                }}
              >
                Delete Group
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default groupInfo;


