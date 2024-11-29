export default async function userAPI(endpoint, method = 'GET', body = null) {
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

    // Verifica se a resposta está OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Se a resposta tiver corpo
    const contentType = response.headers.get("content-type");
    let data = null;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else if (response.status === 200 && response.statusText === "OK") {
      data = {}; // Retorna um objeto vazio quando não há corpo
    }

    return data;
  } catch (error) {
    console.error('There was an error making the request', error);
    throw error; // Lança o erro novamente para que o frontend possa tratá-lo
  }
}
