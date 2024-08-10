// app/frontend/src/App.js

import React, { useEffect, useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import CourseDetails from './components/CourseDetails';
import RecentTests from './components/RecentTests';
import StudentHome from './components/StudentHome';
import StudentDashboard from './components/StudentDashboard';
import Login from './components/Login';
import { UserProvider, useUser } from './contexts/UserContext';
import InstructorDashboard from './components/Instructor/InstructorDashboard';
import InstructorCourseList from './components/Instructor/InstructorCourseList';
import InstructorCourseDetails from './components/Instructor/InstructorCourseDetails';
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminNavbar from './components/Admin/AdminNavbar';
import UserList from './components/Admin/UserList';
import RecentChanges from './components/Admin/RecentChanges';
import Header from './components/Header';
import SiteStatistics from './components/Admin/SiteStatistics';
import StudentList from './components/Instructor/StudentList';
import Navbar from './components/Navbar';
import InstNavbar from './components/Instructor/InstNavbar';
import getUserInfo from './hooks/getUserInfo';
import { ConfigProvider, theme as antdTheme } from 'antd';
import ExamDetails from './components/ExamDetails';
import TestDescription from './components/Instructor/TestDescription';
import TestCorrectAnswers from './components/Instructor/TestCorrectAnswers';
import GenerateSheetModal from './components/Instructor/GenerateSheetModal';
import OMRSheetGenerator from './components/Instructor/OMRSheetGenerator';
import './index.css';
import ChangePass from './components/ChangePass';
import NotificationBell from './components/Instructor/NotificationBell';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ConfigProvider
        theme={{
          algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
          token: {
            colorBgContainer: theme === 'dark' ? '#000000' : '#ffffff',
          },
        }}
      >
        <Router>
          <AppRoutes />
        </Router>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}

function AppRoutes() {
  const [role, setRole] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const hideNavbarPaths = ['/login'];
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const user = await getUserInfo();
      if (user) {
        setRole(user.role);
        setUserId(user.userId);
        console.log(user.role);
        console.log(user.userId);
      }
      setLoading(false);
    };
    fetchData();
  }, [location]);

  useEffect(() => {
    if (userId && role === 2) {
      fetchNotifications();
    }
  }, [userId]);

  const fetchNotifications = async () => {
    const response = await fetch(`http://localhost/api/flags/get/${userId}`);
    const notifications = await response.json();
    setNotifications(notifications);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const showNavbar = !hideNavbarPaths.includes(location.pathname);
  const isInstructor = role === 2;
  const isAdmin = role === 3;

  return (
    <div className={`flex min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {showNavbar && (
        isAdmin ? (
          <AdminNavbar id={userId} />
        ) : isInstructor ? (
          <InstNavbar id={userId} />
        ) : (
          <Navbar id={userId} />
        )
      )}
      <div className={`flex-grow flex flex-col ${showNavbar ? 'ml-64' : ''}`}>
        <div className="flex">
          {showNavbar && <Header userId={userId} fetchNotifications={fetchNotifications} notifications={notifications} role={role} />}
        </div>
        <div className="flex-grow px-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            {role === 1 && <Route path="/student/course/:courseId" element={<CourseDetails />} />}
            {role === 1 && <Route path="/student/exam/:examId" element={<ExamDetails id={userId} />} />}
            {role === 1 && <Route path="/student/dashboard" element={<StudentDashboard />} />}
            {role === 2 && <Route path="/instructor/course" element={<InstructorCourseList />} />}
            {role === 2 && <Route path="/instructor/dashboard" element={<InstructorDashboard />} />}
            {role === 2 && <Route path="/instructor/course/:courseId/*" element={<InstructorCourseDetails />} />}
            <Route path="/contact" element={<Contact />} />
            {role === 1 && <Route path="/student" element={<StudentHome />} />}
            <Route path="/recent" element={<RecentTests id={userId} />} />
            <Route path="/instructor/course/:courseId/test/:testId" element={<TestDescription />} />
            <Route path="/instructor/course/:courseId/test/:testId/correct-answers" element={<TestCorrectAnswers id={userId} />} />
            <Route path="/instructor/omr-sheet-generator/:type" element={<OMRSheetGenerator />} />
            <Route path="/change-password" element={<ChangePass id={userId} />} />
            <Route path="/course/:courseId" element={<CourseDetails />} />
            {role === 3 && <Route path="/admin/dashboard" element={<AdminDashboard />} />}
            {role === 3 && <Route path="/admin/user" element={<UserList />} />}
            {role === 3 && <Route path="/admin/recentchanges" element={<RecentChanges />} />}
            {role === 3 && <Route path="/admin/sitestatistics" element={<SiteStatistics />} />}
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
