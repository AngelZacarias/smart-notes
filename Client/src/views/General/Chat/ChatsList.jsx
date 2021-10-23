import React, { Fragment, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  List,
  ListItem,
  Divider,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Avatar,
  Typography,
  LinearProgress,
  IconButton,
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Chat, MoreVert } from '@material-ui/icons';
//Context for the user
import { UserContext } from './../../../hooks/UserContext';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: '10px',
        marginTop: '10px',
        alignContent: 'center',
        alignItems: 'center',
        borderRadius: '5px',
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    },
    chatContent: {
      width: '100%',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      padding: '20px',
      margin: '0',
    }
}));

const ChatsList = ({ chats, setChatId, loadingChatsQry, errorMessageQry, calledQry }) => {
  const classes = useStyles();
  const { userInformation } = useContext(UserContext);

  const handleClickOpenChat = (id) =>{
    setChatId(id);
  }

  return ( 
    <Fragment>
    {
      loadingChatsQry ?
        <LinearProgress />
      : errorMessageQry !== '' ?
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          <strong>Ocurrio un error al obtener tus chats</strong> - {errorMessageQry}
        </Alert>
      : !loadingChatsQry && calledQry && chats.length < 1 ?
        <Alert severity="info">
          <AlertTitle>Info</AlertTitle>
          No existen chats... ¡Contacta a tu primer amigo!
        </Alert>
      : 
      <List className={classes.root} component="nav">
      { chats ? 
          <Fragment>
          {
            chats.filter(c => c.messages.length>0).map(chat => (
              <Fragment 
                  key={chat.id}
              >
                <ListItem 
                    alignItems="flex-start"
                    button
                    onClick={() => handleClickOpenChat(chat.id)}
                >
                  <ListItemAvatar>
                    <Avatar>
                      <Chat/>
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText className={classes.chatContent}
                    primary={
                      (userInformation && userInformation.id && userInformation.id !== chat.user1.id)? chat.user1.name : chat.user2.name 
                    }
                    secondary={
                      <Typography
                        component="span"
                        variant="body2"
                        className={classes.inline}
                        color="textPrimary"
                      >
                        {
                          (chat && chat.messages && chat.messages.length>0)?
                          chat.messages[0].message
                          : ""
                        }
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      aria-label="delete"
                      onClick={()=>setChatId(chat.id)}
                    >
                      <MoreVert/>
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider variant="middle" component="li" />
              </Fragment>
            ))
          }
          </Fragment>
        : null
      }
    </List>
    }
    </Fragment>
  );
}

export default ChatsList;