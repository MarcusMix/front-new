import React, { useEffect, useState } from "react";
import { Button } from "@mui/material"; // Importe o Button do Material-UI
import Input from "../../components/input/input";
import { sendImageBlob } from "../../api/image"; // Função específica para enviar blobs de imagem
import { toast } from "react-hot-toast"; // Importe o toast

const OfferedServiceForm = ({ providerId, onClose, serviceToEdit }) => {

    const [currentImageName, setCurrentImageName] = useState('');

    useEffect(() => {
        if (serviceToEdit) {
            setCurrentImageName(serviceToEdit.image ? 'nome_do_arquivo.jpg' : ''); // Extraia o nome do arquivo da imagem
        }
    }, [serviceToEdit]);

    const [serviceData, setServiceData] = useState({
        name: serviceToEdit?.name || '',
        description: serviceToEdit?.description || '',
        price: serviceToEdit?.price || 0,
        serviceProviderId: providerId,
        image: null // A imagem não será preenchida inicialmente
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setServiceData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setServiceData((prevData) => ({
            ...prevData,
            image: e.target.files[0],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !serviceData.name ||
            !serviceData.description ||
            serviceData.price <= 0 ||
            (!serviceToEdit && !serviceData.image) // Imagem obrigatória apenas na criação
        ) {
            toast.error("Todos os campos são obrigatórios.");
            return;
        }

        const token = localStorage.getItem('token'); // Obter o token do localStorage

        const formData = new FormData();
        formData.append('offeredServiceDTO', new Blob([JSON.stringify({
            name: serviceData.name,
            description: serviceData.description,
            price: serviceData.price,
            serviceProviderId: serviceData.serviceProviderId
        })], { type: 'application/json' }));
        if (serviceData.image && serviceData.image.name !== currentImageName) {
            formData.append('imageFile', serviceData.image);
        }

        try {
            let response;
            if (serviceToEdit) { // Modo de edição
                response = await sendImageBlob(
                    `https://back-proj-j660.onrender.com/offered-service/${serviceToEdit.id}`, // Endpoint para editar, incluindo o ID do serviço
                    'PUT', // Método PUT para editar
                    formData,
                    token
                );
            } else { // Modo de criação
                response = await sendImageBlob(
                    'https://back-proj-j660.onrender.com/offered-service',
                    'POST',
                    formData,
                    token
                );
            }

            if (response) {
                toast.success("Serviço criado com sucesso!"); // Sucesso
                onClose(); // Fecha o modal
                setTimeout(() => {
                    window.location.reload(); // Recarrega a página
                }, 1000); // Aguarda um segundo para exibir o toast antes de recarregar
            } else {
                toast.error("Erro ao criar serviço.");
            }
        } catch (error) {
            console.error("Erro ao criar serviço:", error);
            toast.error("Erro ao criar serviço. Tente novamente.");
        }
    };

    return (
        <form className="form" onSubmit={handleSubmit}>
            <Input
                type="text"
                name="name"
                placeholder="Nome do serviço"
                value={serviceData.name}
                onChange={handleChange}
            />
            <Input
                type="text"
                name="description"
                placeholder="Descrição do serviço"
                value={serviceData.description}
                onChange={handleChange}
            />
            <Input
                type="number"
                name="price"
                placeholder="Preço"
                value={serviceData.price}
                onChange={handleChange}
            />
            <Input type="file" name="image" onChange={handleFileChange} />
            <Button type="submit" variant="contained" color="primary">
                Salvar Serviço
            </Button>
            <Button type="button" variant="contained" color="error" onClick={onClose}>
                Cancelar
            </Button>
        </form>
    );
};

export default OfferedServiceForm;
