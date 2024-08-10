const changeUserRole = async(userId,newRole) => {
    const token = localStorage.getItem("token");
  if (token) {
    try {
      const response = await fetch(`http://localhost:80/api/users/changerole/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      if (response.ok) {
        const result = await response.json();
        console.log('Role update result:', result);
        return true;
      } else {
        console.error('Failed to update role:', response.statusText);
        return false;
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      return false;
    }
  } else {
    console.error('No token found');
    return false;
  }
};

      
    export default changeUserRole;
    

