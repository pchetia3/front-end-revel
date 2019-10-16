import React from "react";
import Login from "../components/Login";
import { SnackbarProvider } from "notistack";

function LoginPage(props) {
  return (
    <div className="App">
      <SnackbarProvider
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        maxSnack={3}
        autoHideDuration={4000}
        preventDuplicate={true}
      >
        <Login />
      </SnackbarProvider>
    </div>
  );
}

export default LoginPage;
