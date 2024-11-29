export const sendImageBlob = async (url, method, data, token) => {
    try {
      const response = await fetch(url, {
        method: method,
        body: data,
        headers: {
          Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); // Evita erro ao processar resposta vazia
        throw new Error(errorData.message || 'Erro ao fazer a requisição');
      }
  
      const responseData = await response.json().catch(() => null); // Verifica se há JSON na resposta
      return responseData;
    } catch (error) {
      console.error('Erro na função sendImageBlob:', error);
      throw error;
    }
  };
  