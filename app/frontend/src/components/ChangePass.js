// app/frontend/src/components/ChangePass.js
import React, { useState } from 'react';
import ChangePassword from '../hooks/ChangePassword';

const ChangePass = (props) => {
    const userId = props.id;
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await ChangePassword(userId, oldPass, newPass);
    };
    
    return (
        <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto mt-10">
            <h2 className="text-lg font-bold mb-4">Change Password</h2>
            <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="oldPass">Old Password</label>
                <input id="oldPass" name="oldPass" type="password" onChange={(e) => setOldPass(e.target.value)} className="w-full p-2 border rounded"/>
            </div>
            <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="newPass">New Password</label>
                <input id="newPass" name="newPass" type="password" onChange={(e) => setNewPass(e.target.value)} className="w-full p-2 border rounded"/>
            </div>
            <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700">Submit</button>
        </form>
    );
};

export default ChangePass;
