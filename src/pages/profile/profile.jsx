import React, { useEffect, useState } from 'react';
import Button from '../../components/button/button';
import { Box, Container, CircularProgress, Typography, Card, CardContent, CardMedia, Avatar } from '@mui/material'; // Adicionado CardMedia e Avatar
import TitleNew from '../../components/title/Title';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Rating from '@mui/material/Rating'; // Importa o componente de estrelas
import { toast } from 'react-hot-toast';
import './profile.css'; // Certifique-se de criar ou editar este arquivo para incluir as classes de estilo
import SearchAppBar from "../../components/search-bar/SearchBar";

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [serviceOrders, setServiceOrders] = useState([]); // Armazena as service orders
  const [serviceProviders, setServiceProviders] = useState({}); // Armazena os prestadores de serviço
  const [offeredServices, setOfferedServices] = useState({}); // Armazena os serviços oferecidos
  const [loadingOrders, setLoadingOrders] = useState(true); // Controla o carregamento
  const [isServiceProvider, setIsServiceProvider] = useState(false); // Indica se o usuário já é um prestador

  const token = localStorage.getItem('token');

  const statusMap = {
    PENDING: 'PENDENTE',
    FINISHED: 'FINALIZADO',
    ACCEPTED: 'ACEITO',
  };

  let loggedInUsername = null;

  // Decodifica o token
  if (token) {
    try {
      const decoded = jwtDecode(token);
      loggedInUsername = decoded.sub;
    } catch (error) {
      console.error('Token inválido:', error);
    }
  }

  useEffect(() => {
    // Busca as informações do usuário
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(
          `https://back-proj-j660.onrender.com/user/by-email?email=${loggedInUsername}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`, // Token no cabeçalho
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status}`);
        }

        const data = await response.json();
        setUserInfo(data);
      } catch (error) {
        console.error('Erro ao buscar informações do usuário:', error);
      }
    };

    fetchUserInfo();
  }, [loggedInUsername, token]);

  useEffect(() => {
    // Verifica se o usuário já tem um perfil de prestador de serviço
    const checkIfServiceProvider = async () => {
      if (!userInfo || !userInfo.id) return;

      try {
        const response = await fetch(
          `https://back-proj-j660.onrender.com/service-provider/user/${userInfo.id}`, // Endpoint para buscar o prestador pelo ID do usuário
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          setIsServiceProvider(true); // Se o perfil existe, atualiza o estado
        } else if (response.status === 404) {
          setIsServiceProvider(false); // Se o perfil não existe, atualiza o estado para falso
        } else {
          throw new Error(`Erro ao verificar o perfil de prestador: ${response.status}`);
        }
      } catch (error) {
        console.error('Erro ao verificar se o usuário é prestador de serviço:', error);
      }
    };

    checkIfServiceProvider();
  }, [userInfo, token]);

  useEffect(() => {
    // Busca as ordens de serviço
    const fetchServiceOrders = async () => {
      if (!userInfo || !userInfo.id) return;

      try {
        const response = await fetch(
          `https://back-proj-j660.onrender.com/service-order/user/${userInfo.id}`,
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
        setServiceOrders(data);
      } catch (error) {
        console.error('Erro ao buscar as ordens de serviço:', error);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchServiceOrders();
  }, [userInfo, token]);

  useEffect(() => {
    // Busca os detalhes dos prestadores de serviço e dos serviços oferecidos
    const fetchDetails = async () => {
      const uniqueProviderIds = [...new Set(serviceOrders.map((order) => order.serviceProviderId))];
      const uniqueOfferedServiceIds = [...new Set(serviceOrders.map((order) => order.offeredServiceId))];

      for (const providerId of uniqueProviderIds) {
        if (!serviceProviders[providerId]) {
          try {
            const response = await fetch(
              `https://back-proj-j660.onrender.com/service-provider/${providerId}`,
              {
                method: 'GET',
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (!response.ok) {
              throw new Error(`Erro ao buscar o prestador de serviço: ${response.status}`);
            }

            const data = await response.json();
            setServiceProviders((prev) => ({ ...prev, [providerId]: data }));
          } catch (error) {
            console.error('Erro ao buscar o prestador de serviço:', error);
          }
        }
      }

      for (const serviceId of uniqueOfferedServiceIds) {
        if (!offeredServices[serviceId]) {
          try {
            const response = await fetch(
              `https://back-proj-j660.onrender.com/offered-service/${serviceId}`,
              {
                method: 'GET',
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (!response.ok) {
              throw new Error(`Erro ao buscar o serviço oferecido: ${response.status}`);
            }

            const data = await response.json();
            setOfferedServices((prev) => ({ ...prev, [serviceId]: data }));
          } catch (error) {
            console.error('Erro ao buscar o serviço oferecido:', error);
          }
        }
      }
    };

    if (serviceOrders.length > 0) {
      fetchDetails();
    }
  }, [serviceOrders, token]);

  const handleRatingChange = async (orderId, rating) => {
    try {
      const response = await fetch(`https://back-proj-j660.onrender.com/service-order/${orderId}/rating`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(rating),
      });

      if (!response.ok) {
        throw new Error(`Erro ao atualizar a avaliação: ${response.status}`);
      }

      toast.success('Avaliação atualizada com sucesso!');
      setTimeout(() => {

        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Erro ao atualizar a avaliação:', error);
      toast.error('Erro ao atualizar a avaliação. Tente novamente.');
    }
  };

  if (!userInfo) {
    return <CircularProgress />;
  }

  return (
    <Container maxWidth="sm">
      <SearchAppBar />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 2 }}>
        <TitleNew>Bem-vindo {userInfo.name}!</TitleNew>
        <p className='pr'>E-mail da conta: {userInfo.email}</p>
        <p className='pr'>Cidade: {userInfo.addressDTO.city}</p>
        <p className='pr'>Estado: {userInfo.addressDTO.state}</p>
        {!isServiceProvider && (
          <Link to="/signup-service">
            <Button label="Criar Perfil de Prestador" />
          </Link>
        )}

        <Box>
          <TitleNew>Serviços Contratados</TitleNew>
          {loadingOrders ? (
            <CircularProgress />
          ) : serviceOrders.length > 0 ? (
            serviceOrders.map((order) => {
              const serviceProvider = serviceProviders[order.serviceProviderId];
              const offeredService = offeredServices[order.offeredServiceId];
              const statusClass =
                order.status === 'PENDING'
                  ? 'status-pending'
                  : order.status === 'FINISHED'
                    ? 'status-finished'
                    : 'status-accepted';
              return (
                <Card key={order.id} sx={{ marginBottom: 2, display: 'flex', alignItems: 'center' }}>
                  <CardMedia
                    component="img"
                    sx={{ width: 100, height: 100, marginLeft: 2 }}
                    image={offeredService?.image ? `data:image/jpeg;base64,${offeredService.image}` : '/default-service.png'}
                    alt="Serviço"
                  />
                  <CardContent>
                    <Typography variant="h6">
                      {offeredService ? offeredService.name : 'Serviço não especificado'}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar
                        src={serviceProvider?.image ? `data:image/jpeg;base64,${serviceProvider.image}` : '/default-avatar.png'}
                        alt="Prestador"
                      />
                      <Typography>
                        {' '}
                        {serviceProvider ? (
                          <Link className="link-user" to={`/provider-profile/${order.serviceProviderId}`}>
                            {serviceProvider.name}
                          </Link>
                        ) : (
                          'Carregando...'
                        )}
                      </Typography>
                    </Box>
                    <Typography className={statusClass}>{statusMap[order.status] || order.status}</Typography>
                    {order.status === 'FINISHED' && (
                      <Rating
                        name={`rating-${order.id}`}
                        value={order.rating || 0}
                        readOnly={order.rating !== null} // Se já tiver avaliação, torna somente leitura
                        onChange={(event, newValue) => {
                          if (order.rating === null) { // Permite apenas se ainda não foi avaliado
                            handleRatingChange(order.id, newValue);
                          } else {
                            toast.error('Você já avaliou este serviço.');
                          }
                        }}
                      />
                    )}
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Typography>Nenhum serviço contratado encontrado.</Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Profile;
