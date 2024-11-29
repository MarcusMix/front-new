import React, { useState } from 'react';
import './signup-user.css';
import Input from '../../components/input/input';
import MyButton from '../../components/button/button';
import Title from '../../components/title/Title';
import FormBox from '../../components/form-box/FormBox';
import FormContainer from '../../components/form-container/FormContainer';
import getDataFunction from '../../api/register_user';
import Subtitle from '../../components/subtitle/Subtitle';
import { toast } from 'react-hot-toast';
import userAPI from '../../api/user';
import registerUser from '../../api/register_user';

const SignUpUser = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    address: {
      id: null,
    },
  });

  const [addressData, setAddressData] = useState({
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
  });

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({ ...prevUserData, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prevAddressData) => ({ ...prevAddressData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!addressData.street || !addressData.number || !addressData.neighborhood || !addressData.city || !addressData.state) {
      toast.error('Todos os campos de endereço devem ser preenchidos.');
      return;
    }

    try {
      const addressResponse = await registerUser('address', 'POST', addressData);

      if (addressResponse && addressResponse.id) {
        console.log('Address data saved successfully:', addressResponse);

        const userDataWithAddress = {
          ...userData,
          address: {
            id: addressResponse.id,
          },
        };

        console.log('User Data With Address:', userDataWithAddress);

        const userResponse = await userAPI('auth/register', 'POST', userDataWithAddress);
        console.log('User Response:', userResponse);

        if (userResponse == undefined) {
          toast.success('Usuário cadastrado com sucesso!');
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        } else {
          toast.error('Usuário cadastrado, mas a resposta não foi recebida corretamente.');
        }

      } else {
        toast.error('Houve um erro ao salvar os dados do endereço.');
        throw new Error('Failed to save address data.');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error('Houve um erro ao salvar os dados. Verifique os campos e tente novamente.');
    }
  };


  return (
    <FormBox>
      <form className="form" onSubmit={handleSubmit}>
        <Title>Crie uma conta grátis.</Title>
        <FormContainer>
          <Input
            type="text"
            name="name"
            placeholder="Nome"
            value={userData.name}
            onChange={handleUserChange}
            required
          />
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={userData.email}
            onChange={handleUserChange}
            required
          />
          <Input
            type="password"
            name="password"
            placeholder="Senha"
            value={userData.password}
            onChange={handleUserChange}
            required
          />
        </FormContainer>
        <Subtitle>Endereço</Subtitle>
        <FormContainer>
          <Input
            type="text"
            name="street"
            placeholder="Rua"
            value={addressData.street}
            onChange={handleAddressChange}
            required
          />
          <Input
            type="text"
            name="number"
            placeholder="Número"
            value={addressData.number}
            onChange={handleAddressChange}
            required
          />
          <Input
            type="text"
            name="neighborhood"
            placeholder="Bairro"
            value={addressData.neighborhood}
            onChange={handleAddressChange}
            required
          />
          <Input
            type="text"
            name="city"
            placeholder="Cidade"
            value={addressData.city}
            onChange={handleAddressChange}
            required
          />
          <Input
            type="text"
            name="state"
            placeholder="Estado"
            value={addressData.state}
            onChange={handleAddressChange}
            required
          />
        </FormContainer>
        <MyButton type="submit" label="Cadastrar-se" />
      </form>
      <div className="form-section">
        <p>Já tem uma conta? <a href="/login">Fazer login</a></p>
      </div>
    </FormBox>
  );
};

export default SignUpUser;
