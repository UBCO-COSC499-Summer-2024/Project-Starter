const getRecentTests = async (user_id) => {
    try {
      const response = await fetch(`http://localhost/api/tests/recent/${user_id}`);
      if(response.ok) {
        const tests = await response.json();
        return tests;
      }
      else {
        console.error('POST Error',response.status, response.statusText);
        return;
      }
    } catch(error) {
      console.error('Failure fetching data: ',error);
      return;
    };
  };

  export default getRecentTests;