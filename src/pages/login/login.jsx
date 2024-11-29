import React, { useContext, useState } from 'react';
import './login.css';
import Input from '../../components/input/input';
import MyButton from '../../components/button/button';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import loginUser from '../../api/login';
import { AuthContext } from '../../context/context';


const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLoginUser = async (event) => {
    event.preventDefault();

    try {
      const response = await loginUser("auth/login", "POST", JSON.stringify({ email, password }));

      if (response) {
        //login auth context
        login(response)

        localStorage.setItem("token", response);
        toast.success('Login realizado com sucesso!');
        navigate('/');
      } else {
        toast.error('Falha no login. Verifique suas credenciais.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Erro de conexão com o servidor.');
    }
  }

  return (
    <div className="form-box">
      <form className="form" onSubmit={handleLoginUser}>
        <span className="title" color="#FFF">Faça login</span>
        <span className="subtitle">Crie uma conta grátis.</span>
        <div className="form-container">
          <Input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="Senha" onChange={(e) => setPassword(e.target.value)} />
        </div>
        <MyButton type="submit" label="Realizar login" />
      </form>
      <div className="form-section">
        <p>Não tem uma conta? <a href="/cadastrar">Cadastrar-se</a></p>
      </div>
    </div>
  );
};

export default Login;
