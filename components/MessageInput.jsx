import {
  IconButton,
  Box,
  Paper,
  TextField,
  InputAdornment,
  InputBase,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useState, useRef } from "react";
import SearchIcon from "@material-ui/icons/Search";
import PhotoLibraryOutlinedIcon from "@material-ui/icons/PhotoLibraryOutlined";
import SentimentSatisfiedOutlinedIcon from "@material-ui/icons/SentimentSatisfiedOutlined";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    backgroundColor: 'hsl(220, 37%, 97%)',
    borderRadius:"10px",
    marginTop: "10px",
    marginBottom: "10px",
    marginRight: "15px",
    fontFamily: "'Open Sans', sans-serif",
    padding:"20px 0 20px 25px"
    
  },
  input: {
     flex:1,
    fontSize: "18px",
    fontFamily: "'Open Sans', sans-serif",
    border: "none",     
    "&:focus": {
      outline: "none",      
      fontWeight: 400,
    },
  },

}));

export default function MessageInput({ sendMessage, peer }) {
  const styles = useStyles();
  const [text, setText] = useState("");

  return (
    <>
       
      <Paper className={styles.root} elevation={0}>
        <InputBase
          className={styles.input}
          disabled={peer===null}
          placeholder="Typing something,press Enter to send"
          inputProps={{ "aria-label": "search google maps" }}
          onChange={(e) => setText(() => e.target.value)}
          onKeyUp={(e) => {
            const keyCode = e.keyCode;
            if (keyCode === 13) {
              if (text?.length > 0) {
                sendMessage(text);
                setText(() => "");
                e.target.value = "";
              }
            }
          }}
        />
        <IconButton disabled={peer===null}  >
          <SentimentSatisfiedOutlinedIcon style={{ color: 'hsl(217, 29%, 88%)' }} fontSize="large"/>
        </IconButton>
        <IconButton disabled={peer===null}>
          <PhotoLibraryOutlinedIcon style={{ color: 'hsl(217, 29%, 88%)' }} fontSize="large" />
        </IconButton>
      </Paper>
    </>
  );
}
