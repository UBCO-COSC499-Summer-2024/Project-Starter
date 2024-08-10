const updateWeight = async (id, weight) => {
    try {
      const response = await fetch(`http://localhost/api/questions/edit/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ weight: weight })
      });
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error('Error updating answer:', error);
    }
};

export default updateWeight