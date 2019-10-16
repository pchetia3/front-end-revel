import App from "../pages/App";
import React from "react";
import ReactDOM from "react-dom";
import GoogleLogin from "react-google-login";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { clientIDGoogle, testName } from "../constants";
import { send } from "../utils/snackbar";
import { withSnackbar } from "notistack";
import styled from "styled-components";
import { ReactComponent as AssureSVG } from "../icons/assureV2.svg";
import Typography from "@material-ui/core/Typography";
import { GlobalStyles } from "./globalStyles";

const StyledPaper = styled(Paper)`
  background: linear-gradient(75deg, #6dd5ed 30%, #2193b0 90%);
  height: 100vh;
`;

class Login extends React.Component {
  state = {
    profile: {
      schema: testName,
      google: null
    }
  };

  onSuccessSignIn = response => {
    this.setState({
      profile: { schema: testName, google: response.profileObj }
    });

    window.localStorage.setItem("login", JSON.stringify(this.state.profile));
    ReactDOM.unmountComponentAtNode(document.getElementById("root"));

    ReactDOM.render(
      <App profile={this.state.profile} />,
      document.getElementById("root")
    );
  };

  onFailureSignIn = response => {
    send(this.props, "Sign-In Failure", "error");
  };

  render() {
    const centeredLogin = {
      margin: 57,
      position: "absolute",

      marginTop: 400
    };

    const style = () => ({
      logoStyle: {
        display: "flex",
        verticalAlign: "middle",
        justifyContent: "center"
      }
    });

    return (
      <React.Fragment>
        <Grid container spacing={0}>
          <Grid item alignItems="center" xs={7}>
            <GlobalStyles />
            <StyledPaper>
              <div
                style={{
                  display: "flex",
                  verticalAlign: "middle",
                  justifyContent: "center"
                }}
              >
                <AssureSVG style={{ width: 150, height: 200, marginTop: 40 }} />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center"
                }}
              >
                <Typography
                  style={{
                    color: "white",
                    fontWeight: 100,
                    fontSize: 50
                  }}
                >
                  {" "}
                  ASSURE <br />
                </Typography>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  align: "center"
                }}
              >
                <Typography
                  style={{
                    color: "white",
                    fontWeight: 100,
                    fontSize: 20,
                    marginRight: 15
                  }}
                >
                  By Revel Systems
                </Typography>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 60
                }}
              >
                <Typography
                  style={{
                    color: "white",
                    fontWeight: 500,
                    fontSize: 30
                  }}
                >
                  "Stay on top of all potential <br />
                  fraudulent activity threats."
                </Typography>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 200
                }}
              >
                {" "}
                <Typography
                  style={{
                    color: "white",
                    fontWeight: 100,
                    fontSize: 20
                  }}
                >
                  Fraudulent Activity/ Exception based reporting service
                </Typography>
              </div>
            </StyledPaper>
          </Grid>
          <Grid item xs={5}>
            <Paper
              style={{
                backgroundColor: "white",
                height: "100vh"
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center"
                }}
              >
                {" "}
                <Typography
                  style={{
                    color: "black",
                    fontWeight: 500,
                    fontSize: 30,
                    marginTop: 100
                  }}
                >
                  Log In
                </Typography>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "65vh"
                }}
              >
                <GoogleLogin
                  className={style}
                  align="center"
                  clientId={clientIDGoogle}
                  class="g-signin2"
                  onSuccess={this.onSuccessSignIn}
                  onFailure={this.onFailureSignIn}
                  cookiePolicy={"single_host_origin"}
                />
              </div>
            </Paper>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default withSnackbar(Login);
