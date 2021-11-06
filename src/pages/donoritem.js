import React, { useEffect } from "react";
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { DonorItemPageComponent } from "../components/DonorItem/donorItemPageComponent";

import {isLoggedIn} from "../services/auth"
import {navigate} from 'gatsby'
const client1 = new ApolloClient({
    uri: "https://api-us-east-1.graphcms.com/v2/ckso8s3um1hfq01y25hh4h6ri/master",
    cache: new InMemoryCache(),
  });  

export default function DonoritemPage ({location}) {
    let donorKey = location.search;
    donorKey = donorKey.substring(1);
    useEffect(()=>{
        if(!isLoggedIn() ){
            navigate('/login')
        }
    })
    
    return(
        <React.Fragment>
            <ApolloProvider client={client1}>
                <DonorItemPageComponent selectedDonorKey = {donorKey}/>    
            </ApolloProvider>
        </React.Fragment>
        
        )
}
