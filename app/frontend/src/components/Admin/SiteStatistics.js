import React, { useEffect, useState } from "react";
import { useTheme } from "../../App";
import useTotalCourses from "../../hooks/useTotalCourses";
import useActiveCourses from "../../hooks/useActiveCourses";
import useAverageStudentsPerCourse from "../../hooks/useAverageStudentsPerCourse";

const SiteStatistics = () => {
  const [statistics, setStatistics] = useState([]);
  const [error, setError] = useState("");
  const { theme } = useTheme();

  const { totalCourses, error: totalCoursesError } = useTotalCourses();
  const { activeCourses, error: activeCoursesError } = useActiveCourses();
  const { averageStudents, error: averageStudentsError } =  useAverageStudentsPerCourse();



  const fetchStatistics = async () => {
    try {
      const response = await fetch(
        "http://localhost:80/api/users/get/sitestatistics",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched data:", data);

      const statsArray = Object.keys(data).map((key) => ({
        role: key,
        count: data[key],
      }));

      setStatistics(statsArray);
      console.log("Statistics state updated:", statsArray);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  const displayError = (error) => {
    return error ? String(error.message || error) : null;
  };

  const combinedError =
    displayError(error) ||
    displayError(totalCoursesError) ||
    displayError(activeCoursesError) ||
    displayError(averageStudentsError);

  if (combinedError) {
    return (
      <div className="p-4 flex flex-col min-h-screen">
        Error: {combinedError}
      </div>
    );
  }

  const roleNames = {
    1: "Student",
    2: "Instructor",
    3: "Admin",
  };

  return (
    <div
      className={`p-4 flex flex-col min-h-screen ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-200 text-black"
      }`}
    >
      <h1 className="text-2xl font-bold mb-4">Site Statistics</h1>
      {statistics.length === 0 ? (
        <div>No statistics available.</div>
      ) : (
        <table
          className="w-full text-left border-separate"
          style={{ borderSpacing: "0 10px" }}
        >
          <thead>
            <tr>
              <th
                className={`p-4 ${
                  theme === "dark"
                    ? "bg-gray-700 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                Role
              </th>
              <th
                className={`p-4 ${
                  theme === "dark"
                    ? "bg-gray-700 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                Count
              </th>
            </tr>
          </thead>
          <tbody>
            {statistics.map((stat, index) => (
              <tr
                key={index}
                className={`rounded-lg ${
                  theme === "dark"
                    ? "bg-gray-700 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                <td className="p-4">{roleNames[stat.role] || "Unknown"}</td>
                <td className="p-4">{stat.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Additional Metrics</h2>
        <p>Total Courses: {totalCourses?.total_courses || "N/A"}</p>
        <p>Active Courses: {activeCourses?.active_courses || "N/A"}</p>
        <p>Average Students Per Course: {Math.round(averageStudents?.avgstudents) || "N/A"}</p>
      </div>
    </div>
  );
};

export default SiteStatistics;
