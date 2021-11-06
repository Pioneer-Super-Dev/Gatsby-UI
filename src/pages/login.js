import React, {Component} from "react";
import LoginPageComponent from "../components/login/loginPage";

import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

const client1 = new ApolloClient({
    uri: "https://api-us-east-1.graphcms.com/v2/ckso8s3um1hfq01y25hh4h6ri/master",
    cache: new InMemoryCache(),
  });  

class LoginPage extends Component{

    render() {
        return(
            <React.Fragment>
                <ApolloProvider client={client1}>
                    <LoginPageComponent/>
                </ApolloProvider>
            </React.Fragment>
        )
    }
}

export default LoginPage