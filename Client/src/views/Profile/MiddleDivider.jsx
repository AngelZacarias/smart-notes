import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import Avatar from '@material-ui/core/Avatar';
import { gql, useQuery } from '@apollo/client';
import Button from '@material-ui/core/Button';
import ProfileForm from './ProfileForm';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: theme.palette.background.paper,
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: 'none',
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  section1: {
    margin: theme.spacing(3, 2),
  },
  section2: {
    margin: theme.spacing(2),
  },
  section3: {
    margin: theme.spacing(3, 1, 1),
  },
  large: {
    width: theme.spacing(24),
    height: theme.spacing(24),
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

const MiddleDividers = () => {
  const [profileFormShow, setProfileFormShow] = useState(false);

  //Get user's profile
  const { data: profile } = useQuery(GET_PROFILE, {
    context: {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("JWT_TOKEN"),
      }
    }
  });

  const [profileInfo, setProfileInfo] = useState({
    name: "",
    lastName: "",
    email: "",
    bio: "",
  });

  useEffect(() => {
    if (profile) {
      console.log(profile);
      setProfileInfo({
        name: profile.getUserProfile.user.name,
        lastName: profile.getUserProfile.user.lastName,
        email: profile.getUserProfile.user.email,
        bio: profile.getUserProfile.bio,
        carrer: profile.getUserProfile.carrer,
        facebookURL: profile.getUserProfile.facebookURL,
        linkedinURL: profile.getUserProfile.linkedinURL,
        twitterURL: profile.getUserProfile.twitterURL,
      });
    }
  }, [profile]);

  const handleClickProfileForm = () => {
    setProfileFormShow(!profileFormShow);
  }

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.section1}>
        <Grid container alignItems="center">
          <Grid item xs={12} sm={12} >
            <div className={classes.paper}>
              <Avatar alt="Remy Sharp" src="assets/img/faces/marc.jpg" className={classes.large} />
            </div>
          </Grid>
          <div className={classes.root}>
            <input
              accept="image/*"
              className={classes.input}
              id="contained-button-file"
              multiple
              type="file"
            />
            <label htmlFor="contained-button-file">
              <Button variant="contained" color="primary" component="span">
                Subir imagen
              </Button>
            </label>
            <input accept="image/*" className={classes.input} id="icon-button-file" type="file" />
            <label htmlFor="icon-button-file">
              <IconButton color="primary" aria-label="upload picture" component="span">
                <PhotoCamera />
              </IconButton>
            </label>
          </div>
          <Grid item xs>
            <Typography gutterBottom variant="h4">
              {profileInfo.name} { profileInfo.lastName}
            </Typography>
            <Typography gutterBottom variant="h5">
              {profileInfo.carrer}
            </Typography>
            <Typography gutterBottom variant="h5">
              {profileInfo.email}
            </Typography>
          </Grid>
        </Grid>
      </div>
      <Divider variant="middle" />
      <div className={classes.section2}>
        <Typography gutterBottom variant="body1">
          Descripción:
        </Typography>
        <Typography color="textSecondary" variant="body1" align="justify">
          {profileInfo.bio}
        </Typography>
      </div>
      <Divider variant="middle" />

      <div className={classes.section3}>
        <Grid item xs={6}>
          <FacebookIcon fontSize="large"/>
          <Typography color="textSecondary" variant="body1" align="justify">
            {profileInfo.facebookURL}
          </Typography>
        </Grid>
        <Grid item>
          <TwitterIcon fontSize="large"/>
          <Typography color="textSecondary" variant="body1" align="justify">
            {profileInfo.linkedinURL}
          </Typography>
        </Grid>
        <Grid item>
          <LinkedInIcon fontSize="large"/>
          <Typography color="textSecondary" variant="body1" align="justify">
            {profileInfo.twitterURL}
          </Typography>
        </Grid>
        <br />
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleClickProfileForm}
        >
          Editar perfil
        </Button>
        <ProfileForm
          showForm={profileFormShow}
          handleClose={setProfileFormShow}
        />
      </div>
    </div>
  );
}

export const GET_PROFILE = gql`
  query {
    getUserProfile {
      bio,
      carrer,
      facebookURL,
      linkedinURL,
      twitterURL,
      user {
        name,
        lastName,
        email
      }
    }
  }
`;

export default MiddleDividers;