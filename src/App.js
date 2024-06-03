import logo from "./logo.svg";
import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import Navbar from "./Components/Navbar";
import CreatePost from "./Components/CreatePost";
import Links from "./Components/Links";
import Logout from "./Components/Logout";
import Login from "./Components/Login";
import { useState } from "react";
import SignUpForm from "./Components/SignUpForm";
import Slide1 from "./Components/Slide1";
import MemberCreate from "./Components/MemberCreate";
import MemberList from "./Components/MemberList";
import EventForm from "./Components/EventForm";
import EventEdit from "./Components/EventEdit";
import EventList from "./Components/EventList";
import Eventcan from "./Components/Eventcan";
import EmailLoginForm from "./Components/EmailLoginForm";
import ResetPassword from "./Components/ResetPassword";
import Schedule from "./Components/Schedule";
import TennisOff from "./Components/TennisOff";
// テスト用のものです
import Test from "./Components/Test";
import Confirmation from "./Components/Confirmation";
function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));
  const [accountName, setAccountName] = useState(localStorage.getItem("accountName"));

  return (
    <Router>
      <Navbar isAuth={isAuth} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/createpost" element={<CreatePost isAuth={isAuth} />} />
        <Route path="/link" element={<Links />} />
        <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
        <Route path="/logout" element={<Logout setIsAuth={setIsAuth} />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/tennisoff" element={<TennisOff />} />
        {/* Test用のものです */}
        <Route path="/test" element={<Test />} />

        <Route
          path="/signupform"
          element={<SignUpForm setIsAuth={setIsAuth} />}
        />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/slide1" element={<Slide1 />} />
        <Route path="/member" element={<MemberCreate isAuth={isAuth} />} />
        <Route path="/memberlist" element={<MemberList isAuth={isAuth} />} />
        <Route path="/eventform" element={<EventForm isAuth={isAuth} />} />
        <Route path="/eventedit" element={<EventEdit isAuth={isAuth} />} />
        <Route path="/eventedit/:id" element={<EventEdit isAuth={isAuth} />} />
        <Route path="/eventlist" element={<EventList isAuth={isAuth} accountName={accountName} />} />
        <Route path="/eventcancel/:id" element={<Eventcan isAuth={isAuth} />} />
        <Route path="/confirmation" element={<Confirmation isAuth={isAuth} />} />
        <Route
          path="/emaillogin"
          element={<EmailLoginForm setIsAuth={setIsAuth} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
