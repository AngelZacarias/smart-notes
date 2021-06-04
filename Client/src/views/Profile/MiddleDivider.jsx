import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: theme.palette.background.paper,
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
          <Grid item xs>
            <Typography gutterBottom variant="h4">
              UserName
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
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam laoreet eget ipsum vitae cursus. Sed dictum varius finibus. Proin mi ante, tristique sit amet finibus a, fermentum nec libero. Maecenas in efficitur diam, in pulvinar diam. Nullam augue purus, aliquet a viverra eget, mollis ut metus. Proin luctus risus at.
        </Typography>
      </div>
      <Divider variant="middle" />

      <div className={classes.section3}>
        <Grid item>
          <FacebookIcon fontSize="large"/>
        </Grid>
        <Grid item>
          <TwitterIcon fontSize="large"/>
        </Grid>
        <Grid item>
          <LinkedInIcon fontSize="large"/>
        </Grid>
      </div>
    </div>
  );
}

export default MiddleDividers;