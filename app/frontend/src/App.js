import React, { useEffect, useState } from 'react';
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
import StudentList from './components/Instructor/StudentList';
import Navbar from './components/Navbar';
import getUserInfo from './hooks/getUserInfo';
import { ConfigProvider, theme } from 'antd';

function App() {

  return (
    <ConfigProvider
    theme= {{
      algorithm: theme.darkAlgorithm,
      token: {
        colorBgContainer: 'transparent',
      }
    }}>
      <Router>
        <AppRoutes />
      </Router>
    </ConfigProvider>
  );
}

function AppRoutes() {
  const [role, setRole] = useState('');
  const [userId, setUserId] = useState('')
  const location = useLocation();
  const hideNavbarPaths = ['/login'];

  useEffect(() => {
      const fetchData = async () => {
        const user = await getUserInfo();
        if(user) {
        setRole(user.role);
        setUserId(user.userId);
        console.log(user.role);
        console.log(user.userId);
      };
    };
    fetchData();
  }, [location]);


  return (
    <div className="flex min-h-screen bg-black text-white">
      {!hideNavbarPaths.includes(location.pathname) && <Navbar id={userId} />}
      <div className="flex-grow flex flex-col ml-64">
        <div className="flex-grow p-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            {role === 1 && <Route path="/student/courses" element={<CourseDetails />} />}
            {role === 1 && <Route path="/student/dashboard" element={<StudentDashboard />} />}
            {role === 2 && <Route path="/instructor/courses" element={<CourseDetails />} />}
            {role === 2 && <Route path="/instructor/dashboard" element={<InstructorDashboard />} />}
            <Route path="/contact" element={<Contact />} />
            {role === 1 && <Route path="/student" element={<StudentHome />} />}
            {/* {role === 2 && <Route path="/instructor" element={<InstructorHome />} />} */}
            <Route path="/course/:courseId" element={<CourseDetails />} />
            <Route path="/recent" element={<RecentTests id={userId} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
