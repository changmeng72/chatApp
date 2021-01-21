import { Formik, Form, Field } from "formik";
import { Button, Box, Typography, IconButton, Collapse } from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import { Alert, AlertTitle } from "@material-ui/lab";
import { TextField } from "formik-material-ui";
import * as Yup from "yup";
import { useState } from "react";
import postData from "../utils/postData";
import { useRouter } from "next/router";
import { blue } from '@material-ui/core/colors'

const styles = {
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
    fontSize: "40px",
    fontFamily: "'Open Sans', sans-serif",
    fontWeight: 400,
    color: "primary",
  },

  inputStyle: {
    width: "250px",
    height: "80px",
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
    width: "460px",
  },
  buttonLogin: {
    display: "block",
    color:  'white',
    textTransform: "none",
    backgroundColor: blue[700],
    height: "35px",
    width: "75px",
    fontFamily: "'Open Sans', sans-serif",
    fontWeight: "400",
    fontSize: "10px",
  },
};

const loginUrl = "/api/login";
const signupUrl = "/api/signup";
export default function LoginBox() {
  const [login, setLogin] = useState(true);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertContent, setAlertContent] = useState("");
  const [severity, setupSeverity] = useState('success');
  const router = useRouter();

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row-reverse",
          alignItems: "center",
          height: "100px",
        }}
      >
        <Button
          variant="contained"
          
          onClick={() => setLogin((pre) => !pre)}
          style={{
            color: "rgba(23,45,122,0.3)",
            textTransform: "none",
            backgroundColor: "white",
            height: "35px",
            width: "75px",
            fontFamily: "'Open Sans', sans-serif",
            fontWeight: "400",
            fontSize: "10px",
            marginRight: "30px",
          }}
        >
          {login ? "SignUp" : "Login"}
        </Button>

        <div
          style={{
            fontFamily: "'Open Sans', sans-serif",
            fontWeight: "400",
            fontSize: "10px",
            marginRight: "10px",
          }}
        >
          {login ? "Not have an account?" : "Already have an account?"}
        </div>
      </div>

      <Box style={styles.box2}   align="center">
        <Box style={{ width: "250px" }} align="start">
          <Typography
            variant="h5"
            gutterBottom
            style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: "600" }}
          >
            {login ? "Login" : "Create an account"}
          </Typography>
        </Box>
        <Box style={{ width: "250px" }} align="center">
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
                  setAlertContent(login? 'You have logged in successfully . Wait a moment please, application is running...  ' : 'Your acccount has been created successfully, and  you  have logged in . Wait a moment please, application is running...  ');
                  setAlertTitle( "Operation successful");
                  setupSeverity('success');
                  router.replace("/");
                } else {
                  
                  setOpenAlert(true);
                  setAlertContent(json.description);
                  setAlertTitle("Your request failed");
                  setupSeverity('error');
                }
              } else {
          
                setOpenAlert(true);
                setAlertContent("The request is not sent...");
                setAlertTitle("Your requist failed");
                setupSeverity('error');
              }
            }}
            validationSchema={
              login
                ? Yup.object({
                    email: Yup.string()
                      .email("Invalid email address")
                      .required("No email address provided"),
                    passw: Yup.string().required("No password provided.").min(5,"The length of password should be 6 or more!"),
                  })
                : Yup.object({
                    username: Yup.string()
                      .required("No User name provided")
                      .max(100, "No more than 100 charaters!"),
                    email: Yup.string()
                      .email("Invalid email address")
                      .required("No email address provided"),
                    passw: Yup.string().required("No password provided.").min(5,"The length of password should be 6 or more!"),
                  })
            }
          >
            <Form>
              <Field
                type="text"
                component={TextField}
                name="username"
                label="Username"
                inputProps={{ style: styles.inputProps }}
                style={login ? { display: "none" } : styles.inputStyle}
              />
              <Field
                type="text"
                component={TextField}
                name="email"
                label="E-mail address"
                inputProps={{ style: styles.inputProps }}
                style={styles.inputStyle}
              ></Field>
              <Field
                type="password"
                component={TextField}
                name="passw"
                label="Password"
                inputProps={{ style: styles.passwordProps }}
                style={styles.inputStyle}
              ></Field>

              <Button
                type="submit"
                style={styles.buttonLogin}
                variant="contained"                 
              >
                {login ? "Login" : "Create"}
              </Button>
            </Form>
          </Formik>
        </Box>
      </Box>

      <Collapse in={openAlert}>
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
    </>
  );
}
