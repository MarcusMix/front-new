import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Button, Typography } from '@mui/material'; // Importe os componentes do Material-UI
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import ServiceOrderItem from '../ServiceOrderItem/ServiceOrderItem';
import SearchAppBar from '../search-bar/SearchBar';
import './ServiceOrders.css';

function ServiceOrders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchServiceOrders = async () => {
            try {
                const decodedToken = jwtDecode(token);
                const providerId = decodedToken.userId; // Obtém o ID do provedor do token

                const response = await fetch(`https://back-proj-j660.onrender.com/service-order/provider/${providerId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Erro ao buscar ordens de serviço');
                }

                const data = await response.json();
                setOrders(data);
            } catch (error) {
                console.error(error);
                // Aqui você pode adicionar uma lógica para lidar com o erro, como exibir uma mensagem para o usuário
            } finally {
                setIsLoading(false);
            }
        };

        fetchServiceOrders();
    }, []); // O array de dependências vazio garante que isso seja executado apenas uma vez

    // Função para lidar com a mudança de status da ordem de serviço
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await fetch(`https://back-proj-j660.onrender.com/service-order/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newStatus),
            });
            // Atualiza a lista de ordens após a mudança de status
            setOrders(orders.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            ));

        } catch (error) {
            console.error('Erro ao atualizar status da ordem de serviço:', error);
            // Aqui você pode adicionar uma lógica para lidar com o erro, como exibir uma mensagem para o usuário
        }
    };

    if (isLoading) {
        return <Typography variant="h5">Carregando ordens de serviço...</Typography>;
    }

    const handleSearch = (results) => {
        // Lógica para lidar com os resultados da busca
    };

    return (

        <div>

            <SearchAppBar onSearch={handleSearch} />
            <div className="service-orders-container">

                <Typography variant="h4" gutterBottom>
                    Ordens de Serviço
                </Typography>
                {orders.length === 0 ? (
                    <Typography variant="body1">Nenhuma ordem de serviço encontrada.</Typography>
                ) : (
                    <List>
                        {orders.map(order => (
                            <ServiceOrderItem
                                key={order.id}
                                order={order}
                                onStatusChange={handleStatusChange} // Passa a função para atualizar o status
                            />
                        ))}
                    </List>
                )}
            </div>
        </div>
    );
}

export default ServiceOrders;