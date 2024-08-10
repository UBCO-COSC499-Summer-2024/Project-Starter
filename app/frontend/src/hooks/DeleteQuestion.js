const deleteQuestion = async (id) => {
    try {
        const response = await fetch(`http://localhost/api/questions/delete/${id}`, {
            method: 'DELETE'
        });
        if(response.ok) {
            return true;
        }
        return null;
    } catch(error) {
        console.error('Error deleting question',id)
        return null;
    }
};

export default deleteQuestion;