const getUserInfo = async () => {
  const token = localStorage.getItem("token");
    if(token) {
      try {
        const response = await fetch(`http://localhost:80/api/auth/authenticate/${token}`);
      
        if (response.ok) {
          const user = await response.json();
          return user
        } else {
          return null;
        };
      } catch (error) {
        console.error("Error getting role:", error);
        return null;
      };
    };
}
  
  export default getUserInfo;