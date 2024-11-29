import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SearchAppBar from '../../components/search-bar/SearchBar';
import getDataFunction from '../../api/api';
import { Avatar, Card, CardContent, CardHeader, Grid, Typography } from '@mui/material';
import { red } from '@mui/material/colors';
import OfferedServiceCard from '../../components/offered-service-card/OfferedServiceCard'; // Importe o componente

function ServiceProviderProfile() {
    const { id } = useParams();
    const [providerData, setProviderData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProviderData = async () => {
            try {
                const data = await getDataFunction(`service-provider/${id}`);
                setProviderData(data);
            } catch (error) {
                console.error('Erro ao buscar dados do prestador:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProviderData();
    }, [id]);

    const handleSearch = (results) => {
        // Lógica para lidar com os resultados da busca
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (!providerData) {
        return <div>Prestador não encontrado.</div>;
    }

    return (
        <div>
            <SearchAppBar onSearch={handleSearch} />
            <div style={{ height: '80px' }} />

            <Grid container justifyContent="center">
                <Grid item xs={12} sm={8} md={6}>
                    <Card>
                        <CardHeader
                            avatar={
                                providerData.image ? (
                                    <Avatar alt={providerData.name} src={`data:image/jpeg;base64,${providerData.image}`} />
                                ) : (
                                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                        {providerData.name[0]}
                                    </Avatar>
                                )
                            }
                            title={providerData.name}
                            subheader={providerData.description}
                        />

                        <CardContent>
                            <Typography variant="body2" color="text.secondary">
                                Experiência: {providerData.experience}
                            </Typography>

                            <Grid container spacing={2}> {/* Adicione o Grid container */}
                                {providerData.offeredServices.map((service) => (
                                    <Grid item xs={12} sm={6} md={4} key={service.id}> {/* Defina o tamanho do item */}
                                        <OfferedServiceCard service={service} />
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
}

export default ServiceProviderProfile;