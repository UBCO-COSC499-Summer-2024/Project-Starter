import React, { useState } from 'react';
import EditBubble from '../BubbleSheet/EditableBubbles';
import updateWeight from '../../hooks/UpdateWeight';
import deleteQuestion from '../../hooks/DeleteQuestion';

const Answer = ({ question, fetchData }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editableWeight, setEditableWeight] = useState(question.weight);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        updateWeight(question.question_id, editableWeight);
        setIsEditing(false);
    };

    const handleWeightChange = (e) => {
        const value = e.target.value;
        if (value >= 0 && value <= 99) {
            setEditableWeight(value);
        }
    };

    const handleDelete = async () => {
        await deleteQuestion(question.question_id);
        fetchData();
    };

    return (
        <tr className={isEditing ? 'bg-red-700/50' : ''}>
            <td className="px-6 py-2 whitespace-nowrap">{question.question_num}</td>
            <td className="px-6 py-2 whitespace-nowrap">
                <EditBubble question={question} isEditing={isEditing} />
            </td>
            <td className="px-6 py-2 whitespace-nowrap">
                {!isEditing ? (
                    editableWeight
                ) : (
                    <input
                        type="number"
                        value={editableWeight}
                        onChange={handleWeightChange}
                        min="0"
                        max="99"
                        className="w-10 text-center bg-gray-700 rounded"
                    />
                )}
            </td>
            <td className="px-6 py-2 whitespace-nowrap">
                {!isEditing ? (
                    <span
                        className="py-1 px-2 bg-gray-700 transition duration-200 hover:bg-yellow-600 cursor-pointer rounded mr-4"
                        onClick={handleEdit}
                    >
                        Edit Question
                    </span>
                ) : (
                    <span
                        className="py-1 px-2 bg-gray-700 transition duration-200 hover:bg-blue-600 cursor-pointer rounded mr-4"
                        onClick={handleSave}
                    >
                        Save Question
                    </span>
                )}
                <span
                    className="py-1 px-2 bg-gray-700 transition duration-200 hover:bg-red-600 cursor-pointer rounded mx-4"
                    onClick={handleDelete}
                >
                    Delete Question
                </span>
            </td>
        </tr>
    );
};

export default Answer;
