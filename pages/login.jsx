import { Formik, Form ,Field} from 'formik';
import { Button, Box ,Container,Grid,Paper} from '@material-ui/core'
import { TextField } from 'formik-material-ui';
import LoginBox from '../components/LoginBox'
//import bgImg from url(${bgImg})
//import chatImg from '../assets/chat.png'

 
const styles =  {
    root: {
        height: '560px',
        width: '800px',
        backgroundImage: 'url("/assets/bg-img.png")',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        marginTop: '70px',
        display: 'flex'
    },
    box1:{
        height: '560px',
        width: '340px',
        backgroundImage: `linear-gradient(rgba(58,144,255,0.85),rgba(134,185,255,0.85))`,
        fontFamily: "'Open Sans', sans-serif",
        fontWeight: 400,
        textAlign: 'center',
        fontSize: '20px', 
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent:"center"
         
    },
    box2:{
        height: '560px',
        width: '460px',
        fontSize: '40px',
        
    }
    

};
 
 
export default function Login() {    
    
    return <>
         <Container maxWidth='md'>
            <Paper style = {styles.root}>                
                 
                    <Box style = {styles.box1} >  
                        <Box style={{ color: 'white', }}>...</Box>
                        <Box style={{ color: 'white', }}>Conversation with anyone</Box>
                        <Box style={{ color: 'white', }}>with any language</Box>
                   </Box>
                    <Box style = {styles.box2}>
                    <LoginBox /> 
                    </Box>
                 
            </Paper> 
               
       </Container>                
    </>
    
}
            