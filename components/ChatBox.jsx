
import { Paper ,Box,List} from '@material-ui/core';
import MessageBox from './MessageBox';
import MessageInput from './MessageInput';

import { makeStyles } from '@material-ui/core/styles';
import  UserCardWithOutAvatar  from './UserCardWithOutAvatar';
 

const useStyles = makeStyles((theme) => ({
  root: {         
        height: '100%',
        width: '100%',     
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        flexDirection:'column'
    },
    userBox: {
        width:'100%',
        height: '72px',
        minHeight:'72px',
        display: 'flex',
        flexDirection: 'row',  
        alignItems: 'center',
        boxShadow: '-2px 5px 3px 0 rgba(180, 180,180, 0.2),-2px 5px 3px 0 rgba(100, 100, 100, 0.1)',
        marginBottom: '6px',
        paddingLeft: '16px'
        
    },
    chatarea: {
        width: '100%',
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',  
    },

    chatpad: {
        flexGrow: 1,
        width: '100%',        
        display: 'flex',  
        
        overflow: 'auto',  
        flexDirection:'column'
    },
   
     
}));




export default function ChatBox({user,peer,messages,sendMessage,users}) {
    const styles = useStyles();
    
    
    return (<>
       
        <Box className={styles.root}>
            <Box className={styles.userBox}>
                 
                    <UserCardWithOutAvatar user={peer} />
                 
            </Box>
            <Box className={styles.chatarea}>
                <Box className={styles.chatpad}>
                    <MessageBox peer={peer} users={users}/>
                </Box>
                <Box>
                    <MessageInput sendMessage={sendMessage} peer={peer}/>
                </Box>
            </Box>
        </Box>
    </>);
         
}