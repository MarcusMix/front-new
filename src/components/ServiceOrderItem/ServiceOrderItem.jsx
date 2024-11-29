import React from 'react';
import { ListItem, ListItemText, Button, Typography } from '@mui/material';

function ServiceOrderItem({ order, onStatusChange }) { // Recebe a ordem e a função para atualizar o status
    const { userName, offeredServiceName, status } = order; // Desestrutura os nomes diretamente do order

    return (
        <ListItem divider>
            <ListItemText
                primary={offeredServiceName ? offeredServiceName : 'Serviço não encontrado'}
                secondary={`Cliente: ${userName ? userName : 'Usuário não encontrado'} - Status: ${status}`}
            />
            {status === 'PENDING' && (
                <Button variant="contained" color="primary" onClick={() => onStatusChange(order.id, 'ACCEPTED')}>
                    Aceitar
                </Button>
            )}
            {status === 'ACCEPTED' && (
                <Button variant="contained" color="error" onClick={() => onStatusChange(order.id, 'FINISHED')}>
                    Finalizar
                </Button>
            )}
        </ListItem>
    );
}

export default ServiceOrderItem;