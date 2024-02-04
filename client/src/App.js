import "./App.css";
import React from "react";
import Navbar from "./components/Navbar";
import Topbar from "./components/Topbar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClientProvider, QueryClient } from "react-query";
// import { ReactQueryDevtools } from "react-query/devtools";
import AllPosts from "./pages/AllPosts";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useSelector } from "react-redux";
import UserProfile from "./pages/UserProfile";
import RandomPosts from "./pages/RandomPosts";
import RandomPost from "./pages/RandomPost";
import Notification from "./pages/Notification";
import Chats from "./pages/Chats";

const queryClient = new QueryClient();

function App() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <React.Fragment>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="bg-black text-white min-h-screen relative max-w-2xl mx-auto">
            <Topbar />

            <Routes>
              <Route
                exact
                path="/"
                element={currentUser ? <AllPosts /> : <Navigate to="/login" />}
              />
              <Route
                path="/profile"
                element={currentUser ? <Profile /> : <Navigate to="/login" />}
              />

              <Route path="/pro/:id" element={<UserProfile />} />
              <Route path="/random" element={<RandomPosts />} />
              <Route path="/random/:id" element={<RandomPost />} />
              <Route path="/notifications" element={<Notification />} />

              <Route path="/chats" element={<Chats />} />

              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>

            <Navbar />
          </div>
        </Router>
        {/* <ReactQueryDevtools initialIsOpen={false} position="top-right" /> */}
      </QueryClientProvider>
    </React.Fragment>
  );
}

export default App;
