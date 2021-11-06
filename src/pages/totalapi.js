import React, { useEffect } from "react";

import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { Api } from "../components/api";

const client1 = new ApolloClient({
    uri: "https://api-us-east-1.graphcms.com/v2/ckso8s3um1hfq01y25hh4h6ri/master",
    cache: new InMemoryCache(),
  });  

export default function Totalapi(){
    
    return (
        <div>
            <ApolloProvider client={client1}>
                <Api/>
            </ApolloProvider>
        </div>
    )
}