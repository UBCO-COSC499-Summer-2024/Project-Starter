const ChangePassword = async (userId, oldPass, newPass) => {
    try {
      const response = await fetch('http://localhost/api/auth/change', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, oldPass, newPass })
      });

      if (!response.ok) {
        console.log("Change password unsuccessful");
      } else {
        console.log("Password changed successfully");

      }
    } catch (error) {
      console.error('Change password failed:', error);
    }
};

export default ChangePassword;