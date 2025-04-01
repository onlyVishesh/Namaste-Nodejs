import { useEffect, useState } from "react";
import { FiMessageSquare, FiSearch, FiSend } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";

// Mock chat data
const chats = [
  {
    userId: "vishesh1",
    name: "Vishesh 1",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    lastMessage: "Hey, how are you doing?",
    time: "10:30 AM",
    unread: 3,
  },
  {
    userId: "vishesh2",
    name: "Vishesh 2",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    lastMessage: "Meeting atvishesh3 PM",
    time: "Yesterday",
    unread: 0,
  },
  {
    userId: "vishesh3",
    name: "Vishesh 3",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    lastMessage: "Please review the documents",
    time: "2 days ago",
    unread: 1,
  },
];

// Mock messages for each chat
let messages = {
  vishesh1: [
    {
      userId: "vishesh1",
      sender: "them",
      text: "Hey there!",
      time: "10:00 AM",
    },
    {
      userId: "vishesh2",
      sender: "me",
      text: "Hi! How are you?",
      time: "10:05 AM",
    },
    {
      userId: "vishesh3",
      sender: "them",
      text: "Hey, how are you doing? Hey, how are you doing? Hey, how are you doing? Hey, how are you doing? Hey, how are you doing? Hey, how are you doing? Hey, how are you doing? Hey, how are you doing?Hey, how are you doing?",
      time: "10:10 AM",
    },
  ],
  vishesh2: [
    {
      userId: "vishesh1",
      sender: "them",
      text: "Don't forget our meeting",
      time: "9:00 AM",
    },
    {
      userId: "vishesh2",
      sender: "me",
      text: "I'll be there",
      time: "9:05 AM",
    },
  ],
  vishesh3: [
    {
      userId: "vishesh1",
      sender: "them",
      text: "Here are the documents",
      time: "2:00 PM",
    },
    {
      userId: "vishesh2",
      sender: "me",
      text: "Got them, thanks",
      time: "2:30 PM",
    },
    {
      userId: "vishesh3",
      sender: "them",
      text: "Can you review by tomorrow?",
      time: "2:31 PM",
    },
  ],
};

const ChatHistory = ({
  selectedChat,
  messages,
  message,
  setMessage,
  handleSendMessage,
  userId,
}) => {
  const navigate = useNavigate();
  const loggedInUser = useSelector((store) => store.user);
  const loggedInUsername = loggedInUser?.username;
  const [chatMessages, setChatMessages] = useState(messages);

  useEffect(() => {
    const socket = createSocketConnection();
    socket.emit("joinChat", { loggedInUsername, userId });

    const handleNewMessage = ({ newMessage }) => {
      // Only add if not already in messages (prevent duplicates)
      setChatMessages((prev) => {
        const exists = prev.some(
          (msg) =>
            msg.userId === newMessage.userId &&
            msg.text === newMessage.text &&
            msg.time === newMessage.time,
        );
        return exists ? prev : [...prev, newMessage];
      });
    };
  

    socket.on("messageReceived", handleNewMessage);

    return () => {
      socket.off("messageReceived", handleNewMessage);
      socket.disconnect();
    };
  }, [loggedInUser, userId]);

  // Update local messages when prop changes
  useEffect(() => {
    setChatMessages(messages);
  }, [messages]);

  return (
    <>
      {/* Chat header */}
      <div className="flex items-center rounded-tl-lg rounded-tr-md border-b border-border bg-bgSecondary p-4 lg:rounded-tl-none">
        <button
          className="text-text-muted mr-4 md:hidden"
          onClick={() => navigate("/chat")}
        >
          <IoMdClose size={20} />
        </button>
        {selectedChat && (
          <>
            <img
              src={selectedChat.avatar}
              alt={selectedChat.name}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="ml-3">
              <h3 className="font-medium text-text">{selectedChat.name}</h3>
              <p className="text-xs text-textMuted">Online</p>
            </div>
          </>
        )}
      </div>
      <div className="flex h-[calc(100vh-12rem)] flex-col justify-between">
        {/* Messages area */}
        <div className="flex flex-1 flex-col justify-end overflow-y-auto bg-cardBg p-4">
          {chatMessages?.map((msg) => {
            const isSender = msg.sender === loggedInUsername;

            return (
              <div
                key={`${msg.userId}-${msg.time}`}
                className={`mb-4 flex ${isSender ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`relative max-w-xs rounded-lg px-4 py-2 text-sm sm:max-w-md lg:max-w-xl ${
                    isSender
                      ? "sender-bubble bg-primary text-text"
                      : "receiver-bubble bg-bgSecondary text-text"
                  } `}
                >
                  <p>{msg.text}</p>
                  <p
                    className={`mt-1 text-xs ${isSender ? "text-primaryTint" : "text-textMuted"}`}
                  >
                    {msg.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Message input */}
        <div className="bg-card-bg border-t border-border p-4">
          <div className="flex items-stretch">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 rounded-l-lg border border-border bg-cardBg px-4 py-2 text-text focus:outline-none focus:ring-1 focus:ring-primary"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button
              className="rounded-r-lg bg-primary px-4 py-2 text-text hover:bg-hover"
              onClick={handleSendMessage}
            >
              <FiSend />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const Chat = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const loggedInUser = useSelector((store) => store.user);
  const loggedInUsername = loggedInUser?.username;

  useEffect(() => {
    if (userId) {
      // In a real app, you would fetch messages for this user
      setMessages(messages[userId] || []);
      setSelectedChat(chats.find((chat) => chat.userId === userId));
    }
  }, [userId]);

  const handleSendMessage = () => {
    if (message.trim() === "") return;

    const newMessage = {
      userId,
      sender: loggedInUser?.username,
      text: message,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    const socket = createSocketConnection();

    socket.emit("sendMessage", { loggedInUsername, userId, newMessage });

    setMessage("");
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-[calc(100vh-10rem)] py-5">
      <div className="flex h-full rounded-lg border-2 border-border bg-bgSecondary">
        {/* Left sidebar - Chat list */}
        <div
          className={`${userId ? "hidden md:block" : "block"} w-full rounded-l-lg rounded-r-lg border-r border-border bg-bgSecondary md:w-1/3 md:rounded-r-none lg:w-1/4`}
        >
          <div className="border-b border-border p-4">
            <h2 className="text-xl font-semibold text-text">Chats</h2>
            <div className="relative mt-4">
              <FiSearch className="absolute left-3 top-3 text-textMuted" />
              <input
                type="text"
                placeholder="Search chats..."
                className="w-full rounded-lg bg-cardBg py-2 pl-10 pr-4 text-text focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="h-[calc(100vh-20rem)] overflow-y-auto">
            {filteredChats.map((chat) => (
              <div
                key={chat.userId}
                className={`flex cursor-pointer items-center border-b border-border p-4 hover:bg-bg ${userId === chat.userId ? "bg-bg" : "bg-bgSecondary"}`}
                onClick={() => navigate(`/chat/${chat.userId}`)}
              >
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-text">{chat.name}</h3>
                    <span className="text-xs text-textMuted">{chat.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-text-muted truncate text-sm">
                      {chat.lastMessage}
                    </p>
                    {chat.unread > 0 && (
                      <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent1 text-xs font-bold text-text">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right section - Chat interface or welcome message */}
        <div
          className={`${userId ? "block" : "hidden md:flex"} flex-1 flex-col`}
        >
          {userId ? (
            <ChatHistory
              selectedChat={selectedChat}
              messages={messages}
              message={message}
              setMessage={setMessage}
              handleSendMessage={handleSendMessage}
              userId={userId}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center rounded-l-md rounded-r-md bg-cardBg lg:rounded-l-none">
              <div className="max-w-md rounded-lg bg-bgSecondary p-6 text-center shadow-sm">
                <FiMessageSquare
                  size={48}
                  className="mx-auto mb-4 text-textMuted"
                />
                <h3 className="mb-2 text-xl font-semibold text-text">
                  Select a chat to start messaging
                </h3>
                <p className="text-textMuted">
                  Choose a conversation from the sidebar or search for someone
                  to chat with
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
