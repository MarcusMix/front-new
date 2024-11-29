import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Card, Grid, Avatar, Box, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import getDataFunction from '../../api/api';
import Button from '../../components/button/button';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-hot-toast';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: '600px',
  margin: 'auto',
  marginTop: theme.spacing(8),
  padding: theme.spacing(3),
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
}));

const AvatarContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
}));

const ServiceProviderName = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
}));

function ServiceDetails() {
  const { id } = useParams(); // Obter o ID da URL
  const [serviceProvider, setServiceProvider] = useState(null);
  const [offeredService, setOfferedService] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch dos detalhes do prestador e serviço oferecido
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const serviceData = await getDataFunction(`offered-service/${id}`);
        setOfferedService(serviceData);

        const providerData = await getDataFunction(`service-provider/${serviceData.serviceProviderId}`);
        setServiceProvider(providerData);
      } catch (error) {
        console.error('Erro ao buscar os detalhes do serviço ou prestador:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const handleHireService = async () => {
    try {
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId; // Obtém o ID do usuário do token

      const serviceOrderDTO = {
        userId: userId,
        serviceProviderId: serviceProvider.id,
        offeredServiceId: offeredService.id,
        status: 'PENDING',
      };

      await axios.post('https://back-proj-j660.onrender.com/service-order', serviceOrderDTO, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Serviço contratado com sucesso!')
    } catch (error) {
      console.error('Erro ao contratar serviço:', error);
      toast.error('Erro ao contratar serviço. Por favor, tente novamente.')
    }
  };

  if (loading) {
    return (
      <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
        <CircularProgress />
      </Grid>
    );
  }

  if (!serviceProvider || !offeredService) {
    return (
      <Typography variant="h6" align="center" color="error">
        Prestador ou serviço oferecido não encontrado.
      </Typography>
    );
  }

  return (
    <Container>
      <StyledCard>
        <AvatarContainer>
          <Avatar
            sx={{ width: 80, height: 80 }}
            src={serviceProvider.image ? `data:image/jpeg;base64,${serviceProvider.image}` : '/default-avatar.png'}
            alt={serviceProvider.name}
          />
        </AvatarContainer>
        <ServiceProviderName variant="h4">{serviceProvider.name}</ServiceProviderName>
        <Typography variant="body1" align="center" color="textSecondary" paragraph>
          Experiência: {serviceProvider.experience} anos
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary" paragraph>
          Descrição: {serviceProvider.description || 'Nenhuma descrição disponível.'}
        </Typography>

        {/* Informações do serviço oferecido */}
        <Typography
          variant="h4"
          align="center"
          color="black"
          sx={{ fontWeight: 'bold', marginBottom: 2 }}
        >
          {offeredService.name}
        </Typography>

        <Typography variant="body1" align="center" color="textSecondary" paragraph>
          {offeredService.description}
        </Typography>

        <img
          src={offeredService.image ? `data:image/jpeg;base64,${offeredService.image}` : '/default-avatar.png'}
          alt=""
          style={{
            display: 'block',
            margin: '0 auto',
            width: '250px',
            height: '250px',
            objectFit: 'cover',
            borderRadius: '8px',
          }}
        />
        <Typography variant="h6" align="center" color="grey">
          Preço: R$ {offeredService.price.toFixed(2)}
        </Typography>

        <Box display="flex" justifyContent="center" marginTop={2}>
          <Button type="submit" label="Contratar Serviço" onClick={handleHireService} />
        </Box>
      </StyledCard>
    </Container>
  );
}

export default ServiceDetails;
