export default async function registerUser(endpoint, method = 'GET', body = null) {
  const url = `https://back-proj-j660.onrender.com/${endpoint}`;
  const options = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('There was an error making the request', error);
  }
}

