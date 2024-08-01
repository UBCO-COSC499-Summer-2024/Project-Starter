import React, { useState, useEffect } from "react";
import { faBell, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NotificationBell = (props) => {
    const { userId, notifications, fetchNotifications  } = props;
    const [showNotifications, setShowNotifications] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [filteredNotifications, setFilteredNotifications] = useState(notifications);

    const handleBellClick = async () => {
        setShowNotifications((show) => !show);
    }

    const handleResolve = async (flagId) => {
        await fetch('http://localhost/api/flags/resolve', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "id": flagId
            }),
        });
        fetchNotifications();
    }

    useEffect(() => {
        setFilteredNotifications(
            notifications.filter(
                (flag) =>
                    (flag.question_num && flag.question_num.toString().includes(searchInput)) ||
                    (flag.user_id && flag.user_id.toString().includes(searchInput))
            )
        );
    }, [searchInput, notifications]);

    const handleSearchChange = (e) => {
        setSearchInput(e.target.value);
    };

    return (
        <div>
            <div className="flex m-4 cursor-pointer" onClick={handleBellClick}>
                <div className={(notifications.length > 0 ? 'bg-red-700 ' : '') + 'w-3 h-3 rounded-full translate-x-8'}></div>
                <FontAwesomeIcon icon={faBell} size="2xl" />
            </div>
            {showNotifications && (
                <div className="bg-gray-900 h-[600px] w-[480px] absolute -translate-x-[440px] rounded-lg drop-shadow overflow-hidden">
                    <div className="flex justify-evenly border-b-[0.5px] border-white">
                        <h1 className="text-xl w-1/2 p-4">Notifications</h1>
                        <input
                            type="text"
                            placeholder="Search by Question / Student ID"
                            value={searchInput}
                            onChange={handleSearchChange}
                            className="w-3/5 m-2 px-2 rounded bg-gray-800"
                        />
                    </div>
                    <div className="p-4 overflow-y-auto h-[calc(600px-72px)]">
                        {notifications.length > 0 ? (
                            notifications.map((flag, index) => (
                                <div key={index} className="mb-2 bg-gray-800 rounded-lg p-2">
                                    <h1><span className='font-semibold'>Exam: </span>{flag.course_dept && flag.course_code && flag.course_section ? (flag.course_dept + " " + flag.course_code + "-" + flag.course_section): "N/A"}</h1>
                                    <p><span className='font-semibold'>Question: </span>{flag.question_num ? flag.question_num : "N/A"}</p>
                                    <p><span className='font-semibold'>Student ID: </span>{flag.user_id ? flag.user_id : "N/A"}</p>
                                    <p><span className='font-semibold'>Issue: </span>{flag.issue}</p>
                                    <button className='flex rounded-lg mt-2 bg-white/10 p-1' onClick={() => {handleResolve(flag.id)}}>
                                        <FontAwesomeIcon icon={faCheck} className='translate-y-1 mx-1'/><p className="mx-1">Mark as resolved</p>
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No notifications</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default NotificationBell;
