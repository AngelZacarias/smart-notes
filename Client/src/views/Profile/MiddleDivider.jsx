import { gql, useQuery, useMutation } from '@apollo/client';
// import PhotoCamera from '@material-ui/icons/PhotoCamera';
import { Snackbar } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Slide from "@material-ui/core/Slide";
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
// import Icon from '@material-ui/core/Icon';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import CloseIcon from "@material-ui/icons/Close";
import FacebookIcon from '@material-ui/icons/Facebook';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import TwitterIcon from '@material-ui/icons/Twitter';
import React, { useEffect, useState } from 'react';
import ProfileForm from './ProfileForm';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

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

export const getIdParameter = () => {
  const userId = location.pathname.split("/")[3]
  if (userId) return userId;
  else return 0;
}

const MiddleDividers = () => {
  const [profileFormShow, setProfileFormShow] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [showEditableActions, setEditable] = useState(false);
  const [newFollow, setFollow] = useState(false);
  const [sendMutationFollow, { data: followResponse }] = useMutation(FOLLOW_USER, {
    refetchQueries: [{
      query: GET_FOLLOW,
      variables: { followedId: getIdParameter() },
      context: {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("JWT_TOKEN"),
        }
      }
    }]
  });
  const [followButtonAble, setFollowButton] = useState(true);

  const { data: profile, error } = useQuery(GET_PROFILE_BY_ID, {
    variables: { userId: getIdParameter() },
    context: {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("JWT_TOKEN"),
      }
    }
  });

  const { data: followInfo, errorFollowInfo } = useQuery(GET_FOLLOW, {
    variables: { followedId: getIdParameter() },
    context: {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("JWT_TOKEN"),
      }
    }
  })

  const [profileInfo, setProfileInfo] = useState({
    name: "",
    lastName: "",
    email: "",
    bio: "",
  });

  //Get profile
  useEffect(() => {
    if (profile) {
      // console.log(profile);
      setProfileInfo({
        name: profile.getProfileById.user.name,
        lastName: profile.getProfileById.user.lastName,
        email: profile.getProfileById.user.email,
        bio: profile.getProfileById.bio,
        carrer: profile.getProfileById.carrer,
        facebookURL: profile.getProfileById.facebookURL,
        linkedinURL: profile.getProfileById.linkedinURL,
        twitterURL: profile.getProfileById.twitterURL,
      });
      getIdParameter() == "0" ? setEditable(true) : null;
    }
    if (error) {
      // console.log(error);
      setMessage(error.graphQLErrors[0].message);
      setShowMessage(true);
    }
  }, [profile, error]);

  //Follow / unfollow user
  useEffect(() => {
    if (newFollow) {
      let followed = profile;
      if (followed == undefined) 
        followed = "-1";
      else 
        followed = profile.getProfileById.user.id
      sendMutationFollow({
        variables: {
          followed
        },
        context: {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("JWT_TOKEN"),
          }
        }
      }).catch(err => {
        // console.log(JSON.stringify(err, null, 2));
        setMessage(err.graphQLErrors[0].message);
        setShowMessage(true);
      });
      setFollow(false);
    }
  }, [newFollow]);

  useEffect(() => {
    if (followResponse){
      // console.log(followResponse);
      if (!followResponse.followUser) {
        setFollowButton(true);
        setMessage("Ya no sigues a esta persona");
        setShowMessage(true);
      } else {
        setFollowButton(false);
        setMessage("Ahora sigues a esta persona");
        setShowMessage(true);
      }
    }
  }, [followResponse])

  useEffect(() => {
    if (followInfo) {
      // console.log(followInfo);
      if (!followInfo.getFollow) {
        setFollowButton(true);
      }
      if (followInfo.getFollow) {
        setFollowButton(false);
      }
    }

    if (errorFollowInfo) {
      // console.log(errorFollowInfo);
      setMessage(errorFollowInfo.graphQLErrors[0].message);
      setShowMessage(true);
    }
  }, [followInfo, errorFollowInfo])

  const handleClickProfileForm = () => {
    setProfileFormShow(!profileFormShow);
  }

  const handleCloseMessage = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setShowMessage(false);
  }
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.section1}>
        <Grid container alignItems="center">
          <Grid item xs={12} sm={12} >
            <div className={classes.paper}>
              {
                //TODO: use images for users
                //<Avatar alt="Remy Sharp" src="assets/img/faces/marc.jpg" className={classes.large} />
              }
              <Avatar alt="Remy Sharp" src="https://source.unsplash.com/random" className={classes.large} />
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
            {
              showEditableActions ?
                <label htmlFor="contained-button-file">         
                  <Button 
                    variant="contained" 
                    color="primary" 
                    component="span"
                    endIcon={<AddAPhotoIcon>upload</AddAPhotoIcon>}
                    >
                    Subir imagen
                  </Button>
                </label>
              : followButtonAble ?
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  endIcon={<PersonAddIcon>follow</PersonAddIcon>}
                  onClick={() => {
                    setFollow(true);
                    setFollowButton(true);
                  }}
                >
                  Seguir
                </Button>
                :
                  <Button
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    endIcon={<HighlightOffIcon>unfollow</HighlightOffIcon>}
                    onClick={() => {
                      setFollow(true);
                      setFollowButton(false);
                    }}
                  >
                    Dejar de seguir
                  </Button>
            }

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
        {
          showEditableActions ?
          <Button 
          variant="contained" 
          color="primary"
          onClick={handleClickProfileForm}
          >
            Editar perfil
          </Button>
          :
          null
        }
        <ProfileForm
          showForm={profileFormShow}
          handleClose={setProfileFormShow}
        />
      </div>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        TransitionComponent={Slide}
        open={showMessage}
        autoHideDuration={3000}
        onClose={handleCloseMessage}
        message={message}
        action={
          <React.Fragment>
            <IconButton onClick={handleCloseMessage}>
              <CloseIcon />
            </IconButton>
          </React.Fragment>
        } 
        />
    </div>
  );
}

export const GET_PROFILE_BY_ID = gql`
  query getProfileById($userId: ID!){
    getProfileById(userId: $userId) {
      bio,
      carrer,
      facebookURL,
      linkedinURL,
      twitterURL,
      user {
        id,
        name,
        lastName,
        email
      }
    }
  }
`;

const FOLLOW_USER = gql`
  mutation followUser($followed: String!) {
    followUser(followed: $followed) {
      follower {
      	id
      },
      followed {
      	id
      },
      followerAble,
      followedAble,
    }
  }
`;

const GET_FOLLOW = gql`
  query getFollow($followedId: String!) {
    getFollow(followedId: $followedId) {
      follower {
        id
      },
      followed {
        id
      },
      followerAble,
      followedAble,
    }  
  }
`;

export default MiddleDividers;