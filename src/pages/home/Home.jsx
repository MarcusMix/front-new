import { Typography, Grid } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa o useNavigate
import SearchAppBar from '../../components/search-bar/SearchBar';
import CardMaterial from '../../components/card/CardMaterial';
import getDataFunction from '../../api/api';

function Home() {
  const [offeredServices, setOfferedServiceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serviceProviders, setServiceProviders] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null); // Novo estado para armazenar erros
  const navigate = useNavigate(); // Para navegação

  async function fetchOfferedService() {
    try {
      // Aqui vamos manter 'offered-service' como o endpoint correto, de acordo com o que foi solicitado
      const offeredServiceData = await getDataFunction('offered-service');
      console.log('Dados retornados pela API:', offeredServiceData);
      setOfferedServiceData(offeredServiceData);

      // Para cada serviceProviderId, faça uma requisição para buscar os dados do prestador de serviço
      const providerDataPromises = offeredServiceData.map(async (service) => {
        if (service.serviceProviderId) {
          const providerData = await getDataFunction(`service-provider/${service.serviceProviderId}`);
          return { [service.serviceProviderId]: providerData };
        }
        return null; // Se não houver serviceProviderId, retorna null
      });

      const providers = await Promise.all(providerDataPromises);
      const providerMap = Object.assign({}, ...providers.filter(Boolean)); // Filtra valores nulos
      setServiceProviders(providerMap); // Armazena os dados dos prestadores por ID
    } catch (error) {
      console.error('Erro ao buscar dados do prestador de serviço:', error);
      setError('Erro nas requisições (front on)'); // Define a mensagem de erro
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOfferedService();
  }, []);

  const handleCardClick = (offeredServiceId) => {
    // Navega para a página de detalhes do serviço utilizando o ID correto
    navigate(`/service/${offeredServiceId}`);
  };

  const handleSearch = (results) => {
    setSearchResults(results);
  };

  if (loading) {
    return <Typography>Carregando...</Typography>;
  }

  if (error) {
    return <Typography>{error}</Typography>; // Exibe a mensagem de erro, se houver
  }

  return (
    <div>
      <SearchAppBar onSearch={handleSearch} />
      {/* Espaço para compensar a altura da AppBar */}
      <div style={{ height: '80px' }} />
      <Grid container spacing={4} justifyContent="center">
        {(searchResults.length > 0 ? searchResults : offeredServices).map((offeredService) => (
          <Grid
            item
            key={offeredService.id}
            onClick={() => handleCardClick(offeredService.id)} // Passa o ID do serviço
          >
            <div style={{ minWidth: '280px', maxWidth: '300px', cursor: 'pointer' }}>
              <CardMaterial
                title={offeredService.name}
                serviceProviderId={offeredService.serviceProviderId}
                avatarImage={`data:image/jpeg;base64,${serviceProviders[offeredService.serviceProviderId]?.image}`}
                image={`data:image/jpeg;base64,${offeredService.image}`}
                experience={serviceProviders[offeredService.serviceProviderId]?.experience}
                nameProvider={
                  serviceProviders[offeredService.serviceProviderId]?.name || 'Prestador não encontrado'
                }
              />
            </div>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Home;
