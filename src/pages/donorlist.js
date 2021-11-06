import React, {Component} from "react";
import { DonorListPageComponent } from "../components/DonorItem/donorListPageComponent";

import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

import {isLoggedIn} from "../services/auth"
import {navigate} from 'gatsby'

const client1 = new ApolloClient({
    uri: "https://api-us-east-1.graphcms.com/v2/ckso8s3um1hfq01y25hh4h6ri/master",
    cache: new InMemoryCache(),
  });  
class DonorListPage extends Component{
    componentDidMount(){
        if(!isLoggedIn() ){
            navigate('/login')
        }
    }

    render(){
        return(
            <React.Fragment>
                <ApolloProvider client={client1}>
                    <DonorListPageComponent/>
                </ApolloProvider>
                
            </React.Fragment>
        )
    }
}

export default DonorListPage;