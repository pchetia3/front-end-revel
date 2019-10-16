import axios from "axios";
import { baseUrl } from "../constants";
import { send } from "./snackbar";

export const sendRequest = (component, requestHandler) => {
  // assume component has this.props.profile
  const link = baseUrl + requestHandler.path;

  axios
    .get(link, { params: requestHandler.config })
    .then(response => {
      component.setState({ isLoading: false });
      requestHandler.onSuccess(response.data);
    })
    .catch(error => {
      console.log(error);
      component.setState({ isLoading: false });
      send(component.props, error + ". " + requestHandler.error, "error");
    });
};

export const sendPostRequest = (component, requestHandler) => {
  // assume component has this.props.profile
  const link = baseUrl + requestHandler.path;

  axios
    .post(link, requestHandler.config)
    .then(response => {
      if (requestHandler.onSuccess) {
        requestHandler.onSuccess();
      }
    })
    .catch(error => {
      console.log(error);
      send(component.props, error + ". " + requestHandler.error, "error");
    });
};
