import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import { UserContextProvider } from "./context/UserContext.jsx";
import { ChatProvider } from "./context/ChatContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <UserContextProvider>
      <ChatProvider>
        <App />
      </ChatProvider>
   </UserContextProvider>
  </BrowserRouter>
);
