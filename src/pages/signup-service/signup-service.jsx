import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import './signup-service.css';
import FormBox from '../../components/form-box/FormBox';
import FormContainer from '../../components/form-container/FormContainer';
import Button from '../../components/button/button';
import Input from '../../components/input/input';
import Subtitle from '../../components/subtitle/Subtitle';
import TitleNew from '../../components/title/Title';
import { toast } from 'react-hot-toast';
import { sendImageBlob } from '../../api/image';

const SignUpService = () => {
  const [serviceProviderData, setServiceProviderData] = useState({
    name: '',
    description: '',
    experience: '',
    userId: '', // Será preenchido após buscar o userId
  });
  const [imageFile, setImageFile] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!token) {
        toast.error('Usuário não autenticado.');
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const loggedInUsername = decoded.sub;

        const response = await fetch(
          `https://back-proj-j660.onrender.com/user/by-email?email=${loggedInUsername}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status}`);
        }

        const data = await response.json();
        setUserInfo(data);
        setServiceProviderData((prevData) => ({
          ...prevData,
          userId: data.id, // Preenche o userId no estado do formulário
        }));
      } catch (error) {
        console.error('Erro ao buscar informações do usuário:', error);
        toast.error('Erro ao carregar informações do usuário.');
      }
    };

    fetchUserInfo();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setServiceProviderData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!serviceProviderData.name || !serviceProviderData.description || !serviceProviderData.experience || !imageFile || !serviceProviderData.userId) {
      toast.error('Todos os campos são obrigatórios.');
      return;
    }

    const formData = new FormData();
    formData.append('serviceProviderDTO', new Blob([JSON.stringify(serviceProviderData)], { type: 'application/json' }));
    formData.append('imageFile', imageFile);

    try {
      const response = await sendImageBlob('https://back-proj-j660.onrender.com/service-provider', 'POST', formData, token);

      if (response) {
        toast.success('Prestador de serviço cadastrado com sucesso!');
        setServiceProviderData({
          name: '',
          description: '',
          experience: '',
          userId: userInfo?.id || '', // Restaura o userId do usuário logado
        });
        setImageFile(null);
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      }
    } catch (error) {
      console.error('Erro ao cadastrar o prestador de serviço:', error);
      toast.error('Erro ao cadastrar o prestador de serviço. Tente novamente.');
    }
  };

  return (
    <div className="fix">
      <FormBox>
        <form className="form" onSubmit={handleSubmit}>
          <TitleNew>Conta de Prestador de Serviço.</TitleNew>
          <Subtitle>Dados pessoais</Subtitle>
          <FormContainer>
            <Input
              type="text"
              name="name"
              placeholder="Nome completo"
              value={serviceProviderData.name}
              onChange={handleChange}
            />
            <Input
              type="text"
              name="description"
              placeholder="Descrição do perfil"
              value={serviceProviderData.description}
              onChange={handleChange}
            />
            <Input
              type="text"
              name="experience"
              placeholder="Experiência"
              value={serviceProviderData.experience}
              onChange={handleChange}
            />
            <Input
              type="file"
              name="imageFile"
              onChange={handleFileChange}
            />
          </FormContainer>
          <Button type="submit" label="Cadastrar Perfil de Prestador" />
        </form>
      </FormBox>
    </div>
  );
};

export default SignUpService;
