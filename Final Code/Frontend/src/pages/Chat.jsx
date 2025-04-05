import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { FiMessageSquare, FiSearch, FiSend } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";

const ChatHistory = ({
  selectedChat,
  messages,
  message,
  setMessage,
  handleSendMessage,
  userId,
  loadingMessages,
  noHistory,
  chatBlocked,
  onlineStatus,
  fetchOlderMessages,
  hasMore,
  onSocketMessage,
}) => {
  const navigate = useNavigate();
  const loggedInUser = useSelector((store) => store.user);
  const loggedInUsername = loggedInUser?.username;
  const [isOnline, setIsOnline] = useState(selectedChat?.online || false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const chatAreaRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const typingTimeout = useRef(null);
  const socketRef = useRef(null);
  const previousScrollHeight = useRef(0);

  useEffect(() => {
    const socket = createSocketConnection();
    socketRef.current = socket;
    socket.emit("joinChat", { loggedInUsername, userId });

    const handleNewMessage = ({ newMessage }) => {
      if (onSocketMessage) onSocketMessage(newMessage);
    };
    const handleOnlineStatus = ({ username, online }) => {
      if (username === userId) setIsOnline(online);
    };
    const handleTyping = ({ username }) => {
      if (username === userId) setShowTyping(true);
    };
    const handleStopTyping = ({ username }) => {
      if (username === userId) setShowTyping(false);
    };
    socket.on("messageReceived", handleNewMessage);
    socket.on("userOnlineStatus", handleOnlineStatus);
    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);
    return () => {
      socket.off("messageReceived", handleNewMessage);
      socket.off("userOnlineStatus", handleOnlineStatus);
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
      socket.disconnect();
    };
  }, [loggedInUsername, userId, onSocketMessage]);

  useEffect(() => {
    // Scroll to bottom on new message (unless fetching more)
    if (chatAreaRef.current && !isFetchingMore) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages, isFetchingMore]);

  // Handle scroll position after fetching older messages
  useEffect(() => {
    if (isFetchingMore && chatAreaRef.current) {
      const currentScrollHeight = chatAreaRef.current.scrollHeight;
      const scrollDifference =
        currentScrollHeight - previousScrollHeight.current;
      chatAreaRef.current.scrollTop = scrollDifference;
    }
  }, [messages, isFetchingMore]);

  // Infinite scroll: fetch older messages when scrolled to top
  const handleScroll = async () => {
    if (!hasMore || isFetchingMore || !chatAreaRef.current) return;
    const { scrollTop, scrollHeight } = chatAreaRef.current;
    if (scrollTop <= 100) {
      setIsFetchingMore(true);
      previousScrollHeight.current = scrollHeight;
      await fetchOlderMessages();
      setIsFetchingMore(false);
    }
  };

  // Typing indicator logic
  const handleInputChange = (e) => {
    setMessage(e.target.value);
    if (!isTyping) {
      setIsTyping(true);
      socketRef.current.emit("typing", { loggedInUsername, userId });
    }
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      setIsTyping(false);
      socketRef.current.emit("stopTyping", { loggedInUsername, userId });
    }, 1000);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Chat header - Fixed height */}
      <Link to={"/profile/" + userId}>
        <div className="flex flex-shrink-0 items-center rounded-tl-lg rounded-tr-md border-b border-border bg-bgSecondary p-4 hover:cursor-pointer lg:rounded-tl-none">
          <button
            className="mr-4 text-textMuted md:hidden"
            onClick={() => navigate("/chat")}
          >
            <IoMdClose size={20} />
          </button>
          {(selectedChat || onlineStatus) && (
            <>
              <img
                src={(selectedChat || onlineStatus)?.avatar}
                alt={(selectedChat || onlineStatus)?.name}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className="ml-3">
                <h3 className="font-medium text-text">
                  {(selectedChat || onlineStatus)?.name}
                </h3>
                <p className="text-xs text-textMuted">
                  {isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </>
          )}
        </div>
      </Link>
      {/* Chat messages area - Flexible height with scroll */}
      <div
        ref={chatAreaRef}
        className={`flex-1 overflow-y-auto bg-cardBg p-4`}
        onScroll={handleScroll}
        style={{
          maxHeight: "calc(100vh - 200px)",
          overflowY: "auto",
        }}
      >
        {isFetchingMore && (
          <div className="mb-2 flex items-center justify-center py-2 text-textMuted">
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-primary"></div>
            Loading more messages...
          </div>
        )}
        {chatBlocked ? (
          <div className="flex h-full flex-col items-center justify-center text-textMuted">
            <p>You are not connected with this user. Chat is blocked.</p>
          </div>
        ) : loadingMessages ? (
          <div className="flex h-full items-center justify-center text-textMuted">
            <div className="mr-2 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            Loading chat history...
          </div>
        ) : noHistory ? (
          <div className="flex h-full flex-col items-center justify-center text-textMuted">
            <p>No chat history. Start the conversation now!</p>
          </div>
        ) : (
          <>
            {messages?.map((msg, idx) => {
              const isSender = msg.sender === loggedInUsername;
              return (
                <div
                  key={msg._id || idx}
                  className={`mb-4 flex ${isSender ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`relative max-w-xs break-words rounded-lg px-4 py-2 text-sm sm:max-w-md lg:max-w-xl ${
                      isSender
                        ? "sender-bubble bg-primary text-text"
                        : "receiver-bubble bg-bgSecondary text-text"
                    }`}
                    style={{
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <p
                      className={`mt-1 text-xs ${isSender ? "text-primaryTint" : "text-textMuted"}`}
                    >
                      {msg.time}
                    </p>
                  </div>
                </div>
              );
            })}
            {showTyping && (
              <div className="flex justify-start">
                <div className="receiver-bubble relative -mt-3 rounded-lg bg-bgSecondary px-4 py-2 text-xs text-textMuted">
                  <div className="flex items-center space-x-1">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-textMuted"></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-textMuted"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-textMuted"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="ml-2"></span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {/* Message input - Fixed at bottom */}
      <div className="flex-shrink-0 border-t border-border bg-cardBg p-4">
        <div className="flex items-stretch">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 resize-none rounded-l-lg border border-border bg-cardBg px-4 py-2 text-text focus:outline-none focus:ring-1 focus:ring-primary"
            value={message}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (!chatBlocked && e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={chatBlocked}
          />
          <button
            className="rounded-r-lg bg-primary px-4 py-2 text-text transition-colors hover:bg-hover disabled:cursor-not-allowed disabled:opacity-50"
            onClick={chatBlocked ? undefined : handleSendMessage}
            disabled={chatBlocked || !message.trim()}
          >
            <FiSend />
          </button>
        </div>
      </div>
    </div>
  );
};

ChatHistory.propTypes = {
  selectedChat: PropTypes.object,
  messages: PropTypes.array.isRequired,
  message: PropTypes.string.isRequired,
  setMessage: PropTypes.func.isRequired,
  handleSendMessage: PropTypes.func.isRequired,
  userId: PropTypes.string,
  loadingMessages: PropTypes.bool,
  noHistory: PropTypes.bool,
  chatBlocked: PropTypes.bool,
  onlineStatus: PropTypes.object,
  fetchOlderMessages: PropTypes.func,
  hasMore: PropTypes.bool,
  onSocketMessage: PropTypes.func,
};

const Chat = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [noChats, setNoChats] = useState(false);
  const [noHistory, setNoHistory] = useState(false);
  const [chatHeader, setChatHeader] = useState(null);
  const [chatBlocked, setChatBlocked] = useState(false);
  const loggedInUser = useSelector((store) => store.user);
  const loggedInUsername = loggedInUser?.username;
  const [hasMore, setHasMore] = useState(true);

  // Fetch chat list for sidebar
  useEffect(() => {
    const fetchChats = async () => {
      setLoadingChats(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BackendURL}/chats`,
          { withCredentials: true },
        );
        if (res.data.success && res.data.chats.length > 0) {
          setChats(res.data.chats);
          setNoChats(false);
        } else {
          setChats([]);
          setNoChats(true);
        }
      } catch {
        setChats([]);
        setNoChats(true);
      } finally {
        setLoadingChats(false);
      }
    };
    fetchChats();

    // Listen for unread updates
    const socket = createSocketConnection();
    const handleUnreadUpdate = () => {
      fetchChats();
    };
    socket.on("unreadUpdated", handleUnreadUpdate);
    return () => {
      socket.off("unreadUpdated", handleUnreadUpdate);
      socket.disconnect();
    };
  }, []);

  // Fetch chat history for selected user
  const fetchMessages = async () => {
    if (!userId) {
      setMessages([]);
      setSelectedChat(null);
      setNoHistory(false);
      setChatHeader(null);
      setChatBlocked(false);
      setHasMore(true);
      return;
    }
    setLoadingMessages(true);
    setNoHistory(false);
    setChatBlocked(false);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BackendURL}/chats/${userId}/messages`,
        { withCredentials: true },
      );
      if (res.data.success) {
        setMessages(res.data.messages);
        setNoHistory(res.data.messages.length === 0);
        setChatHeader(res.data.header || null);
        setHasMore(res.data.hasMore !== false);
      } else {
        setMessages([]);
        setNoHistory(true);
        setChatHeader(res.data.header || null);
        setHasMore(false);
      }
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setChatBlocked(true);
        setMessages([]);
        setNoHistory(true);
        setChatHeader(err.response.data.header || null);
      } else if (
        err.response &&
        err.response.data &&
        err.response.data.header
      ) {
        setMessages([]);
        setNoHistory(true);
        setChatHeader(err.response.data.header);
      } else {
        setMessages([]);
        setNoHistory(true);
        setChatHeader(null);
      }
      setHasMore(false);
    } finally {
      setLoadingMessages(false);
    }
    // Set selected chat info from chat list
    const chat = chats.find((c) => c.userId === userId);
    setSelectedChat(chat || null);
  };

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line
  }, [userId, chats]);

  const handleSendMessage = () => {
    if (message.trim() === "" || chatBlocked) return;

    const newMessage = {
      userId,
      sender: loggedInUsername,
      text: message.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const socket = createSocketConnection();
    socket.emit("sendMessage", { loggedInUsername, userId, newMessage });

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
    setNoHistory(false);
  };

  // Infinite scroll: fetch older messages
  const fetchOlderMessages = async () => {
    if (messages.length === 0 || !hasMore) return;
    const oldest = messages[0];
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BackendURL}/chats/${userId}/messages?limit=20&before=${oldest.createdAt}`,
        { withCredentials: true },
      );
      if (res.data.success && res.data.messages.length > 0) {
        setMessages((prev) => [...res.data.messages, ...prev]);
        setHasMore(res.data.hasMore !== false);
      } else {
        setHasMore(false);
      }
    } catch {
      setHasMore(false);
    }
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Add this function to handle socket messages
  const handleSocketMessage = (newMessage) => {
    setMessages((prev) => {
      const exists = prev.some(
        (msg) =>
          msg.sender === newMessage.sender &&
          msg.text === newMessage.text &&
          msg.time === newMessage.time,
      );
      return exists ? prev : [...prev, newMessage];
    });
  };

  return (
    <div className="h-[calc(100vh-5rem)] py-5">
      <div className="flex h-full rounded-lg border-2 border-border bg-bgSecondary">
        {/* Chat list sidebar */}
        <div
          className={`${userId ? "hidden md:block" : "block"} flex w-full flex-col rounded-l-lg rounded-r-lg border-r border-border bg-bgSecondary md:w-1/3 md:rounded-r-none lg:w-1/4`}
        >
          <div className="flex-shrink-0 border-b border-border p-4">
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

          <div className="min-h-0 flex-1 overflow-y-auto">
            {loadingChats ? (
              <div className="flex h-full items-center justify-center text-textMuted">
                <div className="mr-2 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                Loading chats...
              </div>
            ) : noChats ? (
              <div className="flex h-full items-center justify-center p-4 text-center text-textMuted">
                You haven&apos;t chatted with anyone. Start a new chat now!
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="flex h-full items-center justify-center text-textMuted">
                No chats found.
              </div>
            ) : (
              filteredChats.map((chat) => (
                <div
                  key={chat.userId}
                  className={`flex cursor-pointer items-center border-b border-border p-4 transition-colors hover:bg-bg ${userId === chat.userId ? "bg-bg" : "bg-bgSecondary"}`}
                  onClick={() => navigate(`/chat/${chat.userId}`)}
                >
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
                  />
                  <div className="ml-3 min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="truncate font-medium text-text">
                        {chat.name}
                      </h3>
                      <span className="ml-2 flex-shrink-0 text-xs text-textMuted">
                        {chat.time}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="flex-1 truncate text-sm text-textMuted">
                        {chat.lastMessage}
                      </p>
                      {chat.unread > 0 && (
                        <span className="ml-2 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent1 text-xs font-bold text-text">
                          {chat.unread > 99 ? "99+" : chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat area */}
        <div
          className={`${userId ? "block" : "hidden md:flex"} flex min-w-0 flex-1 flex-col`}
        >
          {userId ? (
            <ChatHistory
              selectedChat={selectedChat || chatHeader}
              messages={messages}
              message={message}
              setMessage={setMessage}
              handleSendMessage={handleSendMessage}
              userId={userId}
              loadingMessages={loadingMessages}
              noHistory={noHistory}
              chatBlocked={chatBlocked}
              onlineStatus={chatHeader}
              fetchOlderMessages={fetchOlderMessages}
              hasMore={hasMore}
              onSocketMessage={handleSocketMessage}
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
