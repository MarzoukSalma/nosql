import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Messages from "./pages/messages/Messages";
import Profile from "./pages/profile/Profile";
import Layout from "./components/shared/Layout";
import FeedPage from "./pages/feed/FeedPage";
import NetworkPage from "./pages/network/NetworkPage";
import LibraryPage from "./pages/library/LibraryPage";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes publiques - sans Layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Routes protégées - avec Layout (Sidebar + Navbar) */}
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Navigate to="/feed" />} />
          <Route path="feed" element={<FeedPage />} />
          <Route path="network" element={<NetworkPage />} />
          <Route path="library" element={<LibraryPage />} />
          <Route path="messages" element={<Messages />} />
          <Route path="profile/:id" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;