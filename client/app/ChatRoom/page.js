"use client";
import { useState, useEffect, useRef } from "react";
import Header from "@/app/components/Header";
import Nav from "@/app/components/Nav";
import { useUser } from "@clerk/clerk-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import MrMean from "@/app/media/MrMean.jpg";
import Teach from "@/app/media/Teach.jpg";
import GeoGoat from "@/app/media/GeoGoat.jpg";

export default function ChatRoom() {
  const searchParams = useSearchParams();
  const className = searchParams.get("class");
  const diflevel = searchParams.get("diflevel");
  const { isSignedIn, user, isLoaded } = useUser();
  const [inputMsg, setInputMsg] = useState("");
  const [conversation, setConversation] = useState([]);
  const [numConversation, setNumConversation] = useState(0);
  const chatContainerRef = useRef(null);
  const [canQuiz, setCanQuiz] = useState(false);

  useEffect(() => {
    if (isLoaded && user && className) {
      fetch(`http://localhost:8888/conversations/${className}/${user.primaryEmailAddress}`)
        .then((res) => res.json())
        .then((data) => {
          setConversation(data);
          setNumConversation(data.length);
        });
    }
  }, [isLoaded, user, className]);

  useEffect(() => {
    if (numConversation >= 5) {
      setCanQuiz(true);
    }
  }, [conversation]);

  useEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [conversation]);

  function getMessage() {
    if (inputMsg.trim() !== "" && isLoaded && className && diflevel && user) {
      setNumConversation(numConversation + 1);
      fetch(`http://localhost:8888/message/${className}/${diflevel}/${user.primaryEmailAddress}/${inputMsg}`)
        .then((res) => res.json())
        .then((data) => {
          setConversation((prevConversation) => [...prevConversation, data]);
          setInputMsg("");
        });
    }
  }

  return (
    <main className="h-full">
      <Header />
      <div className="p-4 pt-16 mx-10 mb-32 text-white bg-gray-700 rounded-lg min-h-[88%] chat-container" ref={chatContainerRef}>
        <div className="chat relative chat-start grid-rows-[1fr_20px] grid-cols-[70px_auto]">
          <div className="avatar absolute bottom-8">
            <div className="w-16 rounded-full">
              <Image src={className == "History" ? Teach : className == "Geography" ? GeoGoat : MrMean} alt="Teacher" />
            </div>
          </div>
          <div className="p-4 my-3 chat-bubble max-w-[50%]">
            Hello, I am your {className} Teacher. Ask me anything about {className}!
          </div>
        </div>

        {conversation.map((item, index) => (
          <div key={index}>
            <div className="chat relative chat-end grid-rows-[1fr_20px] grid-cols-[auto_70px]">
              <div className="avatar col-span-2 justify-items-end absolute bottom-8">
                <div className="w-16 rounded-full">
                  <Image src={user.imageUrl} width={100} height={100} alt="Student" />
                </div>
              </div>
              <div className="p-4 my-3 chat-bubble max-w-[50%]">{item.input}</div>
              <div className="col-span-2 row-span-2 text-sm">{item.messageDate}</div>
            </div>

            <div className="chat relative chat-start grid-rows-[1fr_20px] grid-cols-[70px_auto]">
              <div className="avatar absolute bottom-8">
                <div className="w-16 rounded-full">
                  <Image src={className == "History" ? Teach : className == "Geography" ? GeoGoat : MrMean} alt="Teacher" />
                </div>
              </div>
              <div className="p-4 my-3 chat-bubble max-w-[50%]">{item.output}</div>
              <div className="col-span-2 row-span-2 text-sm">{item.messageDate}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="fixed flex items-center justify-center w-full p-4 bottom-4">
        {canQuiz ? (
          <Link href={`/Quizzes?class=${className}`}>
            <button className="w-32 shadow-md btn btn-secondary">Start Test</button>
          </Link>
        ) : (
          <button className="w-32 shadow-md btn btn-secondary" disabled>
            Start Test
          </button>
        )}
        <input
          type="text"
          className="input input-bordered input-primary w-[50%] m-3"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              getMessage();
            }
          }}
        />
        <button className="btn btn-primary" onClick={getMessage}>
          Send
        </button>
      </div>
    </main>
  );
}
