// app/frontend/src/hooks/validateUser.js

/**
 * Helper function to validate the user.
 * Validates the user by checking if the token exists and authenticating it with the server.
 * @returns {Promise<boolean>} A promise that resolves to true if the user is valid, false otherwise.
 */
const validateUser = async () => {
  const token = await localStorage.getItem("token");
  if (!token) {
    return false;
  }

  try {
    const response = await fetch(`http://localhost:80/api/auth/authenticate/${token}`);

    if (response.ok) {
      const user = await response.json();
      return user ? true : false;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error during user validation:", error);
    return false;
  }
};

export default validateUser;
