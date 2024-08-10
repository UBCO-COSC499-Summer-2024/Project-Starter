const getAllUsers = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await fetch(`http://localhost/api/users/get/all`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const users = await response.json();
          return Array.isArray(users) ? users : [];
        } else {
          return [];
        }
      } catch (error) {
        console.error("Error getting users:", error);
        return [];
      }
    } else {
      return [];
    }
  };
  
  export default getAllUsers;