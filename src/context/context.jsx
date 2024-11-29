import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Estado do usuário logado

  // Função para buscar detalhes do usuário
  const fetchUserDetails = async (email, token) => {
    try {
      const response = await fetch(`https://back-proj-j660.onrender.com/user/by-email?email=${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Erro ao buscar detalhes do usuário: ${response.status}`);
      }
      const userData = await response.json();
      setUser(userData); // Atualiza o estado com os detalhes completos
    } catch (error) {
      console.error('Erro ao buscar detalhes do usuário:', error);
      setUser(null);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decodifica o token
        fetchUserDetails(decodedToken.sub, token); // Busca os detalhes do usuário
      } catch (error) {
        console.error('Erro ao decodificar token:', error);
        setUser(null);
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decodifica o token
      fetchUserDetails(decodedToken.sub, token); // Busca os detalhes do usuário
    } catch (error) {
      console.error('Erro ao decodificar token durante login:', error);
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
