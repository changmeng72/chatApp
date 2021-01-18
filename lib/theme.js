import { createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import grey from '@material-ui/core/colors/grey';
import green from '@material-ui/core/colors/green';
import { palette } from '@material-ui/system';
const theme = createMuiTheme({
  palette: {  
    primary: { main: blue[700] },
    secondary: { main: grey[700] },   
    type: 'light',
  },
  
});


export { theme};
