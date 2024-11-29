//login
export default async function loginUser(endpoint, method = 'GET', body = null) {
  const url = `https://back-proj-j660.onrender.com/${endpoint}`;
  const options = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = body; // body já é uma string JSON
  }

  try {
    const response = await fetch(url, options);

    // Verifica se a resposta é bem-sucedida
    if (!response.ok) {
      console.log("erro")
      // Tenta ler o erro como texto para debugar
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    console.log("passou")
    // Tenta parsear o JSON se o conteúdo existir
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return data;
    } else {
      // Retorna a resposta em texto se não for JSON
      return await response.text();
    }
  } catch (error) {
    console.error('There was an error making the request:', error.message);
    return null; // Retorna null caso ocorra um erro
  }
}



//   const response = await makeRequest(`service-provider/${id}`, 'PUT', updatedServiceProvider);
//   console.log(response);

// async function deleteServiceProvider(id) {
//     const response = await makeRequest(`service-provider/${id}`, 'DELETE');
//     console.log(`Service provider with ID ${id} deleted successfully`);
//   }


// const createdServiceProvider = await makeRequest('service-provider', 'POST', newServiceProvider);
// console.log(createdServiceProvider);