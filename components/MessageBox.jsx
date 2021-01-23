 
import { makeStyles } from '@material-ui/core/styles';
import {Box,List,ListItem,ListItemAvatar,ListItemText,Avatar,Typography} from '@material-ui/core'
import React,{useRef,useEffect, useCallback} from 'react'
 

const useStyles = makeStyles((theme) => ({
    self: {  
        clear:'both',
        maxWidth:'60%'  ,
        display: 'flex',
        flexDirection: 'row-reverse',
        alignItems: 'flex-start',
        float:'right'  

    },
    other: {
        maxWidth:'60%'  ,
        display: 'flex',
        flexDirection: 'row',
         alignItems:'flex-start',
        
        
    },
    messageBox: {
        width: '100%', 
        backgroundColor: theme.palette.background.paper,
        overflow: 'auto',
        scrollbarWidth: 'none',
        fontFamily: "'Open Sans', sans-serif",
        fontWeight: 400,
        marginTop:'5px',
    },
    messageList: {
          position:'absolute',
          width: '100%',
          maxHeight: '100%',
          padding: 0,
          marginBottom: '10px',
               
          backgroundColor: theme.palette.background.paper,
    },
     textLeftP: {
        display: 'inline',
        clear: 'both',
        float: 'left',
        fontSize: '10px',
        color: 'gray',
         
    },
    textLeftS: {
         
        backgroundImage: `linear-gradient(rgba(58,144,255,0.85),rgba(134,185,255,0.85))`,        
        padding: "6px 5px 6px 5px", 
        border: '0px solid black ',         
        borderRadius: '8px',
        borderTopLeftRadius:'0px',
        fontSize: '14px',
        color:'white',
        display: 'inline',
        clear: 'both',
        float:'left'
    },
    textRightP: {
        display: 'inline',
        clear: 'both',
        float: 'right',
        fontSize: '10px',
        color: 'gray',
        margin: "0 15px 0 0",
        
    },
    textRighS: {
        backgroundColor: 'rgba(180,180,180,0.2)',
        padding: '6px 5px 6px 5px', 
        border: '0px solid black ',
        margin:"0 15px 0 0",
        borderRadius: '8px',
        borderTopRightRadius:'0px',
        fontSize: '14px',
        color:'black',
        display: 'inline',
        clear: 'both',
        float: 'right',
        maxWidth: '300px',
        wordWrap:'break-word'
        
    },
     
    text: {
        
     },
     empty: {
         width:'40%'
    },
    root: {
         
    width: '100%',
    maxWidth: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
    },
    smallavatar: {
      marginTop:'8px',
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
    
}));
/*
<ListItemText className={styles.empty}></ListItemText>
                                <ListItemAvatar>
                                     <Avatar alt="Remy Sharp" src={u.avatar} />
                                </ListItemAvatar>  
                                <ListItemText primary={m?.sender} secondary={m.text} className={styles.text}/>    */
export default function MessageBox({ peer, users }) {
    const styles = useStyles();
     const ref = useRef(null);
    /*
    useEffect(
        () => {
            if(ref && ref.current)
            ref.current.addEventListener('DOMNodeInserted', event => {
            const { currentTarget: target } = event;
             target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
      });
            
        },[]
    );*/
    function localTimeStamp(dt) {

        const timeStamp = new Date(dt);
        return timeStamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
        
        
    }


     useEffect(
         () => {
             if(ref && ref.current)
                 ref.current.scrollIntoView();
             
      } 
    );

    return (
        <> 
        <Box className={styles.messageBox}  >    
            <List className={styles.root} >            
                {users?.map((u) => {
                    if (peer?._id === u._id) {
                        return u.messages.map((m,index) => {                            
                            return (
                                <ListItem className={m.sender == 0 ? styles.self : styles.other} key={index} ref={ index===u.messages.length-1? ref:null} >
                                    <ListItemAvatar hidden={m.sender == 0}>
                                        {u.avatar?
                                            <Avatar className={styles.smallavatar} alt={u.username} src={u.avatar} /> :
                                            <Avatar className={styles.smallavatar} alt={u.username}  /> 
                                    }
                                    </ListItemAvatar>
                                    <ListItemText
                                        
                                        primary={<span className={m.sender == 0 ? styles.textRightP : styles.textLeftP}>
                                            {m.sender == 0 ? localTimeStamp(m.datetime) : u.username + '   ' + localTimeStamp(m.datetime)}
                                        </span>
                                             
                                        }
                                        secondary={<span  className={m.sender==0?styles.textRighS:styles.textLeftS}>{ m.text}</span>
                                             
                                        }
                                    />
                                </ListItem>
                                
                                                       
                            );
                           
                        });
                          
                    }
                })}
             
            </List>
        </Box>
            

     
        </>
    );
}