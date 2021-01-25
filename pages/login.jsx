import { Formik, Form, Field } from "formik";
import {
  Button,
  Box,
  Container,
  Grid,
  Paper,
  useMediaQuery,
  makeStyles,
} from "@material-ui/core";
import { TextField } from "formik-material-ui";
import LoginBox from "../components/LoginBox";
import { useEffect } from "react";
//import bgImg from url(${bgImg})
//import chatImg from '../assets/chat.png'

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: "10px",
    display: "flex",
     
  },
  box1: {
    width: "41.5%",
    position: "relative",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  box3: {
    height: "100%",
    width: "100%",
    fontFamily: "'Open Sans', sans-serif",
    fontWeight: 400,
    textAlign: "center",
    fontSize: "30px",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",

    zIndex: 1,
    top: 0,
    left: 0,
    position: "absolute",
    backgroundImage: `linear-gradient(rgba(58,144,255,0.85),rgba(134,185,255,0.85))`,
  },
  box2: {
    width: "58.5%",
    fontSize: "40px",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  sideImage: {
    width: "100%",
    height: "100%",
    },
  logoImage: {
    width: "100px",
     
  },
}));

export default function Login() {
  const matches = useMediaQuery("(max-width:960px)");
  const styles = useStyles();
  console.log();
  return (
    <>
      <Container maxWidth="lg">
        <Paper className={styles.root} elevation={matches?0:1}>
          <Box className={styles.box1}>
            <img src="/assets/bg-img.png" className={styles.sideImage}></img>
            <Box className={styles.box3}>
              <Box  >
                              <img src="/assets/wb.png"  className={styles.logoImage}></img>
              </Box>
               
              
              <Box style={{ color: "white" }}>Converse with anyone</Box>
              <Box style={{ color: "white" }}>with any language</Box>
              <br></br>
                          <br></br>
                          <br></br>
            </Box>
          </Box>
          <Box className={styles.box2}>
            <LoginBox />
          </Box>
        </Paper>
      </Container>
    </>
  );
}
