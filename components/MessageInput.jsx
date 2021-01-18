import { Formik, Field, Form } from "formik";
import { TextField } from "formik-material-ui";
import { Button, Box, TextareaAutosize } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useState, useRef } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",

    display: "flex",
    flexDirection: "row",
  },
  input: {
    width: "100%",
    fontSize: "14px",
    padding: "15px 25px 15px 25px",
    border: "none",
    backgroundColor: "rgba(225,225,225,0.2)",
    borderRadius: "3px",
    resize: "none",
    scrollbarWidth: "none",
    marginTop: "10px",
      marginBottom: "10px",
    marginRight: "5px",
    "&:focus": {
      outline: "none",
      fontFamily: "'Open Sans', sans-serif",
      fontWeight: 400,
    },
  },
}));

export default function MessageInput({ sendMessage, peer }) {
  const styles = useStyles();
  const [text, setText] = useState("");

  return (
    <Box className={styles.root}>
      <input
        type="text"
        disabled={peer===null}
        aria-label="Typing something,press Enter to send"
        placeholder="Typing something ,press Enter to send"
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
        className={styles.input}
      />
    </Box>
  );
}
