import React, { useState, useEffect, useContext } from 'react';
import { styled, alpha } from '@mui/material/styles';
import { Link, useLocation } from 'react-router-dom'; // Importando o Link
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import "./SearchBar.css"

import { AuthContext } from '../../context/context'
import { toast } from 'react-hot-toast';
import MyButton from '../../components/button/button'

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  width: '200px', // Define uma largura fixa
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '200px', // Define uma largura fixa
      '&:focus': {
        width: '250px', // Aumenta a largura ao focar
      },
    },
  },
}));

const CepInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'transparent', // Remove a borda padrão
      borderRadius: theme.shape.borderRadius, // Usa o mesmo borderRadius da barra de pesquisa
    },
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover fieldset': {
      backgroundColor: alpha(theme.palette.common.white, 0.25), // Mesma cor de hover da barra de pesquisa
    },
    '&.Mui-focused fieldset': {
      backgroundColor: alpha(theme.palette.common.white, 0.35), // Cor de foco similar à barra de pesquisa
    },
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(1)})`, // Ajusta o padding interno
    },
  },
}));

export default function SearchAppBar({ onSearch }) {
  const { user, logout } = useContext(AuthContext);

  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [cep, setCep] = useState(''); // Estado para armazenar o CEP
  const [searchTerm, setSearchTerm] = useState('');

  const location = useLocation(); // Obtém a localização atual

  const handleLinkClick = () => {
    if (location.pathname === '/') {
      window.location.reload(); // Recarrega se estiver no Home
    }
  };

  const fetchAddress = async (cep) => {
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Erro ao buscar endereço: ', error);
        return null;
      }
    } else {
      console.warn('CEP inválido:', cep);
      return null;
    }
  };

  useEffect(() => {
  }, [cep]);

  const handleSearch = async () => {
    try {
      let address = null;
      if (cep) {
        address = await fetchAddress(cep);
      }

      const userLocation = address ? address.localidade : null;

      const searchDTO = {
        serviceName: searchTerm,
        userLocation: userLocation,
      };

      const token = localStorage.getItem('token');
      const response = await fetch('https://back-proj-j660.onrender.com/offered-service/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(searchDTO),
      });

      const results = await response.json();

      if (results.length === 0) {
        toast.error('Nenhum serviço encontrado');
        setTimeout(function () {
          window.location.reload();
        }, 1000);
      } else {
        onSearch(results);
        toast.success('Serviços encontrados');
      }

    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
    }
  };

  const handleCepChange = (event) => {
    setCep(event.target.value);
  };

  useEffect(() => {
    // Carrega o CEP do localStorage quando o componente é montado
    const storedCep = localStorage.getItem('cep');
    if (storedCep) {
      setCep(storedCep);
    }
  }, []);

  useEffect(() => {
    // Salva o CEP no localStorage sempre que o valor do CEP mudar
    localStorage.setItem('cep', cep);
  }, [cep]);

  useEffect(() => {
    // Função para buscar endereço pelo CEP
    const fetchAddress = async () => {
      if (cep.length === 8) { // Verifica se o CEP tem 8 dígitos
        try {
          const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
          const data = await response.json();
          // Aqui você pode usar os dados retornados pela API para
          // preencher outros campos do endereço, como:
          // data.logradouro, data.bairro, data.localidade, data.uf
          console.log(data);
        } catch (error) {
          console.error('Erro ao buscar endereço:', error);
        }
      }
    };

    fetchAddress();
  }, [cep]);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuClick = (action) => {
    setAnchorElUser(null); // Fecha o menu
    if (action === 'logout') {
      toast.success('Logout realizado!')
      logout(); // Realiza o logout usando o contexto
    }
  };

  const settings = [
    { name: 'Profile', path: '/profile' }, // Adicionando a rota
    { name: 'My Provider profile', path: '/my-provider-profile' },
    { name: 'Logout', action: 'logout' },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{
          width: '100%',
          backgroundColor: '#61C9A8',
          // #2D2A32 amarelo
          // #61C9A8 mint
          // #2D2A32 preto
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            {/* <MenuIcon />; */}
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            <Link
              to="/"
              style={{ textDecoration: 'none' }}
              className="link-main"

              onClick={handleLinkClick}
            >
              Marketplace do Job
            </Link>
          </Typography>

          <CepInput // Novo campo de CEP
            label="CEP"
            variant="outlined"
            size="small"
            value={cep}
            onChange={handleCepChange}
            sx={{
              width: '150px',
              marginRight: 2,
            }}
          />

          <Search sx={{ mx: 1 }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Procurar prestador"
              inputProps={{ 'aria-label': 'search' }}
              value={searchTerm} // Adicionar value
              onChange={(e) => setSearchTerm(e.target.value)} // Adicionar onChange
            />
          </Search>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch} // Adicionar onClick
            sx={{
              margin: 2,
              borderRadius: 2,
              backgroundColor: '#33CA7F',
              '&:hover': {
                backgroundColor: '#2CA568',
              }
            }}
          >
            <SearchIcon />
          </Button>

          {user ? (

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt={user?.name || 'User'}
                  src={user?.image ? `data:image/jpeg;base64,${user.image}` : null}
                  sx={{
                    bgcolor: user?.image ? 'transparent' : '#FCCA46', // Fundo colorido se não houver imagem
                    color: '#fff', // Cor do texto
                    width: 40,
                    height: 40,
                  }}
                >
                  {!user?.image && user?.name ? user.name[0] : ''}
                </Avatar>
              </IconButton>

              <Menu
                sx={{ mt: '15px' }}
                anchorEl={anchorElUser}
                keepMounted
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) =>
                  setting.path ? (
                    <MenuItem key={setting.name} onClick={handleCloseUserMenu}>
                      <Link to={setting.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Typography textAlign="center">{setting.name}</Typography>
                      </Link>
                    </MenuItem>
                  ) : (
                    <MenuItem key={setting.name} onClick={() => handleMenuClick(setting.action)}>
                      <Typography textAlign="center">{setting.name}</Typography>
                    </MenuItem>
                  )
                )}
              </Menu>
            </Box>

          ) : (
            <div className="div-button">
              <Link to="/login" style={{ textDecoration: 'none' }} className="link-search">
                <MyButton type="button" label="Login" onClick={() => console.log('Login button clicked')} />
              </Link>
              <Link to="/signup-user" style={{ textDecoration: 'none' }} className="link-search">
                <MyButton type="button" label="Register" onClick={() => console.log('Register button clicked')} />
              </Link>
            </div>
          )}

        </Toolbar>
      </AppBar>
    </Box>
  );
}
