const addUser = async (studentId, firstName, lastName, email, role) => {
    const response = await fetch('http://localhost/api/users/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ studentId, firstName, lastName, email, role })
    });
    if(response.ok) {
        return true;
    }
    return false;
}

export default addUser;