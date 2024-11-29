import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  Card, CardHeader, CardMedia, CardContent, CardActions, Avatar, Typography
} from '@mui/material';
import { red } from '@mui/material/colors';

export default function CardMaterial({ title, subheader, avatarImage, image, experience, nameProvider, serviceProviderId }) { // Adicione serviceProviderId aqui
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={
          avatarImage ? (
            <Link to={`/provider-profile/${serviceProviderId}`}>
              <Avatar alt={nameProvider} src={avatarImage} onClick={(e) => e.stopPropagation()} />
            </Link>
          ) : (
            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
              {title[0]}
            </Avatar>
          )
        }
        title={title}
        subheader={subheader}
      />
      <CardMedia
        component="img"
        height="194"
        image={image}
        alt={title}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          Experiência: {experience}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Prestador: {nameProvider}
        </Typography>
      </CardContent>
    </Card>
  );
}