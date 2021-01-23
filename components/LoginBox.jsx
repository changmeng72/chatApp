import { Formik, Form, Field } from "formik";
import {
  Button,
  Box,
  Typography,
  IconButton,
  Collapse,
  makeStyles,
  withStyles,FormHelperText
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Alert, AlertTitle } from "@material-ui/lab";
import { TextField } from "formik-material-ui";
import * as Yup from "yup";
import { useState } from "react";
import postData from "../utils/postData";
import { useRouter } from "next/router";
import { blue, grey } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  inputProps: {
    fontSize: "12px",
    fontFamily: "'Open Sans', sans-serif",
    fontWeight: 600,
  },
  passwordProps: {
    fontSize: "15px",
    fontFamily: "'Open Sans', sans-serif",
    fontWeight: 600,
    letterSpacing: "2px",
  },
  inputLabelProps: {
    fontSize: "5px",
    fontFamily: "'Open Sans', sans-serif",
    fontWeight: 400,
    color: "primary",
  },

  inputStyle: {
    height: "85px",
  },
  formStyle: {
    display: "flex",
    displayDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "460px",
  },
  box1: {
    width: "460px",
    height: "100px",
  },
  box2: {
    marginTop: "40px",
    width: "60%",
    margin: "auto",
  },
  buttonLogin: {
    display: "block",
    color: "white",
    textTransform: "none",
    backgroundColor: 'rgb(58, 141, 255)',
    padding: "12px 30px 12px 30px",
    fontFamily: "'Open Sans', sans-serif",
    fontWeight: "600",
    fontSize: "13px",
    marginBottom: "30px",
    width: '120px'
    
  },
  topBar: {
    display: "flex",
    flexDirection: "row-reverse",
    alignItems: "center",
    height: "100px",
    fontFamily: "'Open Sans', sans-serif",
   
  },
  buttonSwitch: {
    color: 'rgb(58, 141, 255)',
    textTransform: "none",
    backgroundColor: "white",
    padding: "12px 30px 12px 30px",

    fontWeight: "600",
    fontSize: "13px",
    marginRight: "25px",
    color: blue[500],
  },
  formBox: {
     
  },
  hidden: {
    display: "none",
  },
  alertStyle: {
    position: "absolute",
    top: "50px",
    align:'center'
  },
  root: {
     position: "relative",
  }
}));

const loginUrl = "/api/login";
const signupUrl = "/api/signup";

const CssTextField = withStyles({
  root: {
    "& label.Mui-focused": {
      color: blue[500],
    },
    "& .MuiInput-underline:after": {
      borderWidth: "3px",
    
    },
     "& .MuiInput-underline:focus": {
      
      borderColor:'rgb(58, 141, 255)'
    },
  },
})(TextField);

export default function LoginBox() {
  const [login, setLogin] = useState(true);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertContent, setAlertContent] = useState("");
  const [severity, setupSeverity] = useState("success");
  const router = useRouter();
  const styles = useStyles();
  return (
    <Box className={styles.root}>
      <Box className={styles.topBar}>
        <Button
          variant="contained"
          onClick={() => setLogin((pre) => !pre)}
          className={styles.buttonSwitch}
        >
          {login ? "Create account" : "Login"}
        </Button>

        <span
          style={{
            fontFamily: "'Open Sans', sans-serif",
            fontWeight: "400",
            fontSize: "13px",
            marginRight: "30px",
            color: grey[300],
          }}
        >
          {login ? "Don't have an account?" : "Already have an account?"}
        </span>
      </Box>

      <Box className={styles.box2} align="center">
        <Box align="start">
          <Typography
            variant="h5"
            gutterBottom
            style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: "600" }}
          >
            {login ? "Welcome back!" : "Create an account."}
          </Typography>
        </Box>
        <Box align="center" className={styles.formBox}>
          <Formik
            initialValues={{
              username: "",
              email: "",
              passw: "",
            }}
            onSubmit={async (values, helper) => {
              const url = login ? loginUrl : signupUrl;

              const json = await postData(url, values);

              if (!!json) {
                if (json.result === "ok") {
                  setOpenAlert(true);
                  setAlertContent(
                    login
                      ? "You have logged in successfully . Wait a moment please, application is running...  "
                      : "Your acccount has been created successfully, and  you  have logged in . Wait a moment please, application is running...  "
                  );
                  setAlertTitle("Operation successful");
                  setupSeverity("success");
                  router.replace("/");
                } else {
                  setOpenAlert(true);
                  setAlertContent(json.description);
                  setAlertTitle("Your request failed");
                  setupSeverity("error");
                }
              } else {
                setOpenAlert(true);
                setAlertContent("The request is not sent...");
                setAlertTitle("Your requist failed");
                setupSeverity("error");
              }
            }}
            validationSchema={
              login
                ? Yup.object({
                    email: Yup.string()
                      .email("Invalid email address")
                      .required("No email address provided"),
                    passw: Yup.string()
                      .required("No password provided.")
                      .min(5, "The length of password should be 6 or more!"),
                  })
                : Yup.object({
                    username: Yup.string()
                      .required("No User name provided")
                      .max(100, "No more than 100 charaters!"),
                    email: Yup.string()
                      .email("Invalid email address")
                      .required("No email address provided"),
                    passw: Yup.string()
                      .required("No password provided.")
                    .min(5, "The length of password should be 6 or more!"),
                    confirmPassw: Yup.string()
                       .oneOf([Yup.ref('passw'), null], 'Passwords must match')
                  })
            }
          >
            <Form>
              <Field
                type="text"
                component={CssTextField}
                name="username"
                label="Username"
                inputProps={{ className: styles.inputProps }}
                className={login ? styles.hidden : styles.inputStyle}
                fullWidth
                hidden={login}
              />
              <Field
                type="text"
                component={CssTextField}
                name="email"
                label="E-mail address"
                inputProps={{ className: styles.inputProps ,errorStyle:{color: 'green'}}}
                className={styles.inputStyle}
                fullWidth
                 
              ></Field>
              <Field
                type="password"
                component={CssTextField}
                name="passw"
                label="Password"
                inputProps={{ className: styles.passwordProps }}
                className={styles.inputStyle}
                fullWidth
              ></Field>
              <Field
                type="password"
                component={CssTextField}
                name="confirmPassw"
                label="Reinput Password"
                inputProps={{ className: styles.passwordProps }}
                className={login ? styles.hidden : styles.inputStyle}
                fullWidth
                helperText="Please input your password again"
              ></Field>

              <Button
                type="submit"
                className={styles.buttonLogin}
                variant="contained"
              >
                {login ? "Login" : "Create"}
              </Button>
            </Form>
          </Formik>
        </Box>        
      </Box>
      <Collapse in={openAlert} className={styles.alertStyle}>
          <Alert
            severity={severity}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpenAlert(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            <AlertTitle>{alertTitle}</AlertTitle>
            {alertContent}
          </Alert>
        </Collapse>
    </Box>
  );
}
