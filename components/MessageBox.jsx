 
import { makeStyles } from '@material-ui/core/styles';
import {Box,List,ListItem,ListItemAvatar,ListItemText,Avatar,Typography} from '@material-ui/core'
import React,{useRef,useEffect, useCallback} from 'react'
import { Autocomplete } from '@material-ui/lab';
 

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%', 
        backgroundColor: theme.palette.background.paper,
        overflow: 'auto',
        scrollbarWidth: 'none',
        fontFamily: "'Open Sans', sans-serif",
        fontWeight: 400,
        marginTop:'5px',
    },
    self: {  
        clear:'both',
        maxWidth:'75%'  ,
        display: 'flex',
        flexDirection: 'row-reverse',
        alignItems: 'flex-start',
        float:'right'  

    },
    other: {
        maxWidth:'75%'  ,
        display: 'flex',
        flexDirection: 'row',
        alignItems:'flex-start',        
    },
    dateLine: {
        display: 'flex',
        justifyContent: 'center',
        fontSize: '10px',
        color: 'gray',
    },
    
     
     textLeftP: {
        display: 'inline',
        clear: 'both',
        float: 'left',
        fontSize: '10px',
        color: 'gray',
        fontFamily: "'Open Sans', sans-serif",
         
    },
    textLeftS: {
         
        backgroundImage: `linear-gradient(rgba(58,144,255,0.85),rgba(134,185,255,0.85))`,        
        padding: "6px 5px 6px 5px", 
        border: '0px solid black ',         
        borderRadius: '12px',
        borderTopLeftRadius:'0px',
        fontSize: '16px',
        color:'white',
        display: 'inline',
        clear: 'both',
        float: 'left',
        fontFamily: "'Open Sans', sans-serif",
        wordWrap: 'break-word',
        padding: '10px 20px 10px 20px',
        maxWidth: '100%',
        wordBreak: 'break-word',
        
    },
    textRightP: {
        display: 'inline',
        clear: 'both',
        float: 'right',
        fontSize: '12px',
        color: 'gray',
        margin: "0 15px 0 0",
        fontFamily: "'Open Sans', sans-serif",
        
    },
    textRighS: {
        backgroundColor: 'hsl(220, 37%, 97%)',
        padding: '6px 5px 6px 5px', 
        border: '0px solid black ',
        margin:"0 15px 0 0",
        borderRadius: '12px',
        borderBottomRightRadius:'0px',
        fontSize: '16px',
        fontWeight : 500,
        color:'hsl(221, 39%, 70%)',
        display: 'inline',
        clear: 'both',
        float: 'right',
        maxWidth: '100%',
        
        fontFamily: "'Open Sans', sans-serif",
        padding: '10px 20px 10px 20px',
        wordBreak: 'break-word',
        
    },
     
    text: {
        
     },
     empty: {
         width:'40%'
    },
    messageList: {         
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
    let todayDate = new Date();
    const todayDateString = todayDate.toLocaleDateString();
    let lastDateString = '';
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
        const timeString =  timeStamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
        const dateString = timeStamp.toLocaleDateString();
        
        return { timeString, dateString :dateString== todayDateString? 'Today':dateString };
        
    }
    


     useEffect(
         () => {
             if(ref && ref.current)
                 ref.current.scrollIntoView();
             
      } 
    );

    return (
        <> 
        <Box className={styles.root}  >    
                <List >
                             
                {users?.map((u) => {
                    if (peer?._id === u._id) {
                        return u.messages.map((m, index) => {      
                            let showDate = false;
                            const { timeString, dateString } = localTimeStamp(m.datetime);
                            if (dateString != lastDateString) {
                                showDate = true;
                                lastDateString = dateString;
                            }

                            return (
                                <>
                                {showDate ? <ListItem className={styles.dateLine}> -------{dateString}------ </ListItem> : ''}
                                <ListItem className={m.sender == 0 ? styles.self : styles.other} key={index} ref={ index===u.messages.length-1? ref:null} >
                                    <ListItemAvatar hidden={m.sender == 0}>
                                        {u.avatar?
                                            <Avatar className={styles.smallavatar} alt={u.username} src={u.avatar} /> :
                                            <Avatar className={styles.smallavatar} alt={u.username}  /> 
                                    }
                                    </ListItemAvatar>
                                    <ListItemText
                                        
                                        primary={<span className={m.sender == 0 ? styles.textRightP : styles.textLeftP}>
                                            {m.sender == 0 ? timeString : u.username + '   ' + timeString}
                                        </span>
                                             
                                        }
                                        secondary={<span  className={m.sender==0?styles.textRighS:styles.textLeftS}>{ m.text}</span>
                                             
                                        }
                                    />
                                </ListItem>
                                </>
                                                       
                            );
                           
                        });
                          
                    }
                })}
             
            </List>
        </Box>
            

     
        </>
    );
}

   
 