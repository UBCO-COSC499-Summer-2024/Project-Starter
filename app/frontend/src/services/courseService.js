export async function fetchCourses() {
    // Replace with your actual API endpoint
    const response = await fetch('/api/courses');
    if (!response.ok) {
      throw new Error('Failed to fetch courses');
    }
    const data = await response.json();
    return data;
  }
  