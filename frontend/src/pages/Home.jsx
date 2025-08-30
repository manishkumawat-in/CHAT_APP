import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MoreVertical, Search } from "lucide-react";
import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router";

function ChatPanel() {
  const [file, setFile] = useState(null);
  const [draft, setDraft] = useState("");
  const listRef = useRef(null);
  const navigate = useNavigate();

  const { messages, sendMessage, selectedChat } = useContext(ChatContext);
  const { userData } = useContext(UserContext);
  
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const send = () => {
    if (!draft.trim() && !file) return;
    const formData = new FormData();
    if (draft.trim()) formData.append("text", draft.trim());
    if (file) formData.append("file", file);
    sendMessage(formData);
    setDraft("");
    setFile(null);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  if (selectedChat.length === 0) {
    return (
      <div className="flex justify-center mt-5 text-gray-500">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="grid grid-rows-[auto_1fr_auto] w-full h-full min-h-0 bg-white">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-b from-gray-50 to-white">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9">
            {selectedChat.image ? (
              <div className="rounded-full w-9 h-9 overflow-hidden">
                <img
                  src={selectedChat.image}
                  alt="profile"
                  className="rounded-full w-9 h-9 object-cover"
                />
              </div>
            ) : (
              <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center text-[18px] ">
                <span>{selectedChat.name.charAt(0).toUpperCase()}</span>
              </div>
            )}
          </div>
          <div>
            <div className="font-semibold leading-tight">
              {selectedChat.name}
            </div>
            <div className="text-xs text-gray-500">{selectedChat.email}</div>
          </div>
        </div>
        <button
          className="p-2 rounded-xl hover:bg-gray-100 active:scale-[.98]"
          onClick={() => {
            navigate("/profile", { state: selectedChat });
          }}
        >
          <MoreVertical size={18} />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={listRef}
        className="min-h-0 overflow-y-auto px-4 py-3 space-y-4 bg-gray-50"
      >
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className={`flex ${
                m.senderId == userData._id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 shadow-sm leading-relaxed break-words bg-white ${
                  m.senderId == userData._id
                    ? "bg-blue-50 border border-blue-100"
                    : "border"
                }`}
              >
                {m.senderId !== userData._id && (
                  <div className="text-[10px] text-gray-500 mb-1">
                    {selectedChat.name}
                  </div>
                )}
                <div className="text-[15px]">{m.text}</div>
                <div className="">
                  {m.image && (
                    <img
                      src={m.image}
                      alt="message-attachment"
                      className="max-w-[300px] rounded-md"
                    />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="border-t bg-white px-3 py-2">
        <div className="flex items-end gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            placeholder="Type a message…"
            className="flex-1 resize-none rounded-2xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 max-h-32"
          />
          <div className="w-10 flex items-center justify-center">
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <input
              type="text"
              value={file ? file.name : ""}
              placeholder="📁"
              readOnly
              onClick={() => document.getElementById("fileInput").click()}
              className="w-10 h-10 overflow-scroll cursor-pointer border-none text-center outline-none text-gray-700 rounded hover: transition"
            />
          </div>
          <button
            onClick={send}
            className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 border shadow-sm active:scale-[.98] hover:bg-gray-50"
          >
            <Send size={16} />
            <span className="text-sm">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();

  const { users, selectedChat, setSelectedChat, getUsers, unseenMessages } =
    useContext(ChatContext);
  const { userData } = useContext(UserContext);

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="h-screen w-full flex flex-col">
      {/* Global Header */}
      <header className="h-14 flex items-center justify-between px-10 border-b bg-white shadow-sm">
        <h1 className="font-semibold text-2xl   ">Buddy</h1>
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-gray-200">
            <button
              onClick={() => {
                navigate("/profile", { state: userData });
              }}
            >
              {userData.image ? (
                <div className="rounded-full w-10 h-10 overflow-hidden">
                  <img
                    src={userData.image}
                    alt="profile"
                    className="rounded-full w-10 h-10 object-cover"
                  />
                </div>
              ) : (
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-[18px] ">
                  <span>{userData.name.charAt(0).toUpperCase()}</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout below header */}
      <div className="flex-1 grid grid-cols-[280px_1fr] bg-gray-100 overflow-hidden h-full min-h-0">
        {/* Sidebar */}
        <div className="border-r bg-white flex flex-col flex-1 min-h-0">
          {/* Search */}
          <div className="p-3 border-b flex items-center gap-2 bg-gray-50">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search chats"
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>

          {/* Chats list */}
          <div className="flex-1 overflow-y-auto ">
            {users.map((user) => (
              <button
                key={user._id}
                onClick={() => setSelectedChat(user)}
                className={`w-full flex items-center gap-3 px-4 py-3 border-b hover:bg-gray-50 text-left ${
                  selectedChat._id === user._id ? "bg-blue-50" : ""
                }`}
              >
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-[18px] ">
                  {user.image ? (
                    <div className="rounded-full w-10 h-10 overflow-hidden">
                      <img
                        src={user.image}
                        alt="profile"
                        className="rounded-full w-10 h-10 object-cover"
                      />
                    </div>
                  ) : (
                    <span>{user.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-medium truncate">
                    {user.name} {unseenMessages > 0 && `(${unseenMessages})`}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {user.email}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Panel */}
        <div className="min-h-0">
          <ChatPanel chat={selectedChat} />
        </div>
      </div>
    </div>
  );
}
