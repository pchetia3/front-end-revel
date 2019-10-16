# Assure by Revel Systems 
### Frontend



## Setup

Install all the dependencies 
```
npm install
```
Start the server, which will run on `localhost:3000`
```
npm start
```

Refer to the [backend](https://gitlab.com/revelsystems/intern-2019/back-end) repository for starting the backend server. Once started, it will be running on `localhost:5000`. 

## Configuration

### Backend
If you are connecting to a remote backend (AWS, etc), the react server must have this new IP address to connect to the server. The URL is stored within `constants.js`, which you can change to be any IP address and all requests will be forwarded to that one.

```
export const baseUrl = "http://localhost:5000";
```

## Structure

We developed a folder structure for placing each JavaScript file to organize our environment. Here is a brief overview of what each folder is  to help navigation.

`src/components` - Resuable compnents that are used within each page (ex: DateRangePicker for choosing the date shown on multiple pages)

`src/icons` - list of icons we used throughout the app in SVG format (ex: Revel Assure's logo)

`src/models` - the backing structures that makes up much of our UI (ex: OrderCategory stores text the UI can pull, so adding a new OrderCategory would be as simple as adding a variable and putting it in a list)

`src/pages` - large components that are not resuable and pull together other resuable components to make a single view page (ex Settings creates the settings page)

`src/utils` - wrappers for other compoents and utility functions (ex: snackbar/axios wrapper to make sending requests/snackbars easier and tailored to our usage)

## Testing

To run tests use

`./node_modules/.bin/cypress run`

To add a test, edit cypress/integration/login.spec.js or create a new .spec.js file with your new tests. 

## Deploying

You can create a Docker image using 

`docker build -t revel-assure .`

To test locally:

`docker run -it --rm -p 5000:5000 revel-assure`

## More information

View the [Team Interns Confluence](https://revelup.atlassian.net/wiki/spaces/Revi/pages/1377828973/Frontend) for more technical details about design decisions, architecture, and components we created. 
