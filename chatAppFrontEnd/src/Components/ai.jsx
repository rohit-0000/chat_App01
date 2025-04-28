import React, { useRef, useState} from "react";
import AddImg from "../assets/addImg.svg";
import SideBarImg from "../assets/sideBarImg.svg";
import SendImg from "../assets/sendImg.svg";
import { useDispatch, useSelector } from "react-redux";
import { ChatAi } from "../Reducer/chatSlice";
import ReactMarkdown from "react-markdown";
import DOMPurify from "dompurify";
const ai = () => {
  const dispatch = useDispatch();
  const [question, setQuestion] = useState("");
  const qna = useSelector((state) => state.chatApp.user)?.aiQna;
  const textareaRef = useRef(null);
  function handleSend(e) {
    e.preventDefault();
    const payload = { question: question };
    dispatch(ChatAi(payload));
    setQuestion("");
    textareaRef.current.style.height = "auto"; 
  }
  return (
    <div className="w-screen h-screen">
      <div className="pl-14 w-full h-full p-0 flex flex-col justify-between gap-2 ">
        {/* header */}
        <div className="flex justify-between w-full rounded-2xl px-5">
          <h1 className="w-fit text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-5xl font-bold">
            AI
          </h1>
          <img src={SideBarImg} className="w-15 p-1" />
        </div>

        {/* body  */}
        <div className="h-full overflow-x-hidden flex flex-col-reverse">
          {qna ? (
            Object.entries(qna).reverse().map(([question, answer], index) => (
              <div key={index}>
                <div className="mb-6 p-4 rounded shadow flex flex-col gap-2">
                  <h3
                    className="bg-gradient-to-r from-indigo-800  to-purple-800 rounded-tr-none
                 w-fit rounded-xl self-end px-5 py-2.5 "
                  >
                    {question}
                  </h3>
                  <div
                    className=" rounded-tl-none
                 rounded-xl self-start px-5 py-2.5 whitespace-pre-wrap w-full break-words overflow-x-scroll bg-[#ffffff18] "
                  >
                    <ReactMarkdown>{DOMPurify.sanitize(answer)}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="px-5">No AI QnA available.</p>
          )}
        </div>

        {/* Message Input */}
        <div className="w-full h-fit md:mb-5">
          <label className="w-full flex justify-center">
            <input type="file" className="hidden" />
            <div className="w-full md:w-[80%] bg-neutral-700 md:rounded-2xl flex items-center ">
              <img src={AddImg} className="h-12 p-1" />
              <textarea
                type="text"
                className="w-full outline-0 my-2 px-2 text-2xl resize-none h-auto max-h-50"
                placeholder="Type a message"
                value={question}
                onChange={(e) => {
                  setQuestion(e.target.value);
                }}
                onInput={(e) => {
                  e.target.style.height = `auto`;
                  e.target.style.height = `${e.target.scrollHeight}px`;
                  
                }}
                ref={textareaRef}
              />
              <button
                className=" h-14 active:scale-90 z-10 cursor-pointer"
                onClick={handleSend}
              >
                <img src={SendImg} className="h-full p-2 pt-2 " />
              </button>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ai;
