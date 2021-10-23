import React, { useState, useEffect, useContext, Fragment } from 'react';
import {
  Grid,
  CssBaseline,
  List,
  ListItem,
  Divider,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  TextField,
} from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { Alert, AlertTitle } from '@material-ui/lab';
import { useQuery, useMutation, gql } from '@apollo/client';

import ChatsList from './Chat/ChatsList';
import ChatMsg from '@mui-treasury/components/chatMsg/ChatMsg';

import { UserContext } from './../../hooks/UserContext';

const useStyles = makeStyles((theme) => ({
  paper: {
      padding: theme.spacing(2),
      backgroundColor: theme.palette.background.paper,
  },
  button: {
      width: '100%',
      marginBottom: theme.spacing(2),
  },
  buttonTwo: {
      width: '100%',
      marginTop: theme.spacing(2),
  },
  leftList: {
      maxHeight: '100%',
      height: '80vh',
      overflowY: 'auto',
      overflowX: 'hidden',
  },
  rightList: {
    maxHeight: '70%',
    height: '60vh',
    overflowY: 'auto',
    overflowX: 'hidden',
    display: 'flex',
    flexDirection: 'column-reverse',
  },
  textbox: {
    maxWidth: '80%',
  }
}));

const Chat = () => {
    const classes = useStyles();
    
    const { userInformation } = useContext(UserContext);
    const [selectedChat,setSelectedChat] = useState({
      id: '',
      messages: [],
      user1: {
        id: '',
        name: '',
      },
      user2: {
        id: '',
        name: '',
      },
    });
    const [message, setMessage] = useState('');
    const [chatId, setChatId] = useState('');
    const [userContacted, setUserContacted] = useState({
      name: '',
      email: '',
    })

    //Lists all the chats
    const{data:myChats, loading:loadingMyChats, error: errorMyChats, called: calledMyChats, subscribeToMore} = useQuery(GET_CHATS, {
      context: {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("JWT_TOKEN"),
        }
      },
      fetchPolicy: "cache-and-network",
    });

    //Send the message
    const [sendChatMessage] = useMutation(SEND_MESSAGE, {
      context: {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("JWT_TOKEN"),
          }
      },
    });

    // Gets the first (latest) chat and shows it messages
    // Gets the messages when a different chat is selected
    useEffect(()=>{
      if(chatId !== ''){ 
        setSelectedChat(myChats.getChats.find(c => c.id === chatId));
        setUserContacted({
          name: (selectedChat.user1.id !== userInformation.id) ?selectedChat.user1.name : selectedChat.user2.name,
          email: (selectedChat.user1.id !== userInformation.id) ? selectedChat.user1.email : selectedChat.user2.email,
        });
      }
      else if(myChats && myChats.getChats && myChats.getChats.length > 0){
        setSelectedChat(myChats.getChats[0]);
        setChatId(myChats.getChats[0].id)
      }
    },[myChats,chatId]);

    const handleSendMessage = async (event) => {
      try{
        if(event.key === 'Enter'){
          // Copies the message
          const msg = message;
          // Clears the textBox
          setMessage('');
          // Sends the message - mutation
          await sendChatMessage({
            variables:{
              chatId: chatId,
              message: msg,
            }
          })
        }
      } 
      catch(err){
        console.log(err);
      }
    }
    useEffect(()=>{
      subscribeToNewChats()
    },[]);

    const subscribeToNewChats = () =>{
      subscribeToMore({
        document: SUBSCRIBE_NEW_CHAT,
        variables: { userId: userInformation.id },
        updateQuery: (prev, { subscriptionData }) => {
          console.log("prev",prev)
          console.log("subs",subscriptionData)

          if (!subscriptionData.data) return prev;
          const newFeedItem = subscriptionData.data.newChat;
          
          return Object.assign({}, prev, {
            data: {
              getChats: [newFeedItem, ...prev.getChats]
            }
          });
        }
      })
    }

    return (
        <Fragment>
            <Grid 
                container
                direction="row"
                justifyContent="space-around"
                alignItems="flex-start"
                spacing={1}
                className={classes.paper}
            >
                <CssBaseline />
                <Grid xs={6} sm={3}>
                    <Grid item className={classes.leftList}>
                        <ChatsList
                            chats={(myChats && myChats.getChats)? myChats.getChats : null}
                            setChatId={setChatId}
                            loadingChatsQry={loadingMyChats}
                            errorMessageQry={(errorMyChats && errorMyChats.message)? errorMyChats.message : ""}
                            calledQry={calledMyChats}
                        />
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={9}>
                  {
                    (selectedChat && chatId !== '')?
                      <Grid item>
                      <List className={classes.root} component="nav">
                        <ListItem 
                            alignItems="flex-start"
                        >
                          <ListItemAvatar>
                            <Avatar>
                              <AccountCircle/>
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText className={classes.chatContent}
                            primary={userContacted.name}
                            secondary={
                              <Typography
                                component="span"
                                variant="body2"
                                className={classes.inline}
                                color="textPrimary"
                              >
                                {userContacted.email}
                              </Typography>
                            }
                          />
                        </ListItem>
                        <Divider variant="middle" component="li" />
                      </List>
                      </Grid>
                    : 
                      <Alert severity="info">
                        <AlertTitle>Envía tu primer mensaje</AlertTitle>
                        ¡Comienza a intercambiar mensaje con tus amigos!
                      </Alert>  
                  }
                    <Grid item className={classes.rightList}>
                        {
                          (selectedChat.messages && selectedChat.messages.length > 0)?
                            (
                              selectedChat.messages.map(message =>
                                <ChatMsg
                                  key={message.id}
                                  messages={[message.message]}
                                  side={(message.userEmisor.id === userInformation.id)? 'right' : 'left'}
                                />
                              )
                            )
                          : null 
                        }
                    </Grid>
                    <Grid item>
                      <TextField 
                        fullWidth
                        id="new-message" 
                        margin='dense' 
                        placeholder="Escribe un mensaje" 
                        variant="outlined" 
                        name="message"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        onKeyPress={(e)=> handleSendMessage(e)}
                      />
                    </Grid>
                </Grid>
            </Grid>
        </Fragment>
    );
}

// DB Queries & Mutations
const GET_CHATS = gql `
query getChats{
  getChats{
    id,
    messages{
      message
      userEmisor{
        id
      }
      userReceptor{
        id
      }
    }
    user1{
      id
      name
      email
    }
    user2{
      id
      name
      email
    }
  }
}
`;
 

const SEND_MESSAGE = gql `
mutation sendMessage($chatId: ID!, $message: String!){
  sendMessage(chatId: $chatId, message: $message){
  	id,
    userEmisor{
      id,
      name,
      email,
    },
    userReceptor{
      id,
      name,
      email,
    },
    message,
    read,
  }
}
`;


const SUBSCRIBE_NEW_CHAT = gql `
  subscription newChat($userId: ID!){
  newChat(userId: $userId){
    id,
    messages{
      message
      userEmisor{
        id
      }
      userReceptor{
        id
      }
    }
    user1{
      id
      name
    }
    user2{
      id
      name
    }
  }
}
`;

export default Chat;