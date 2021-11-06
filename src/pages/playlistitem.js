import React, { useEffect } from "react";
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

import {isLoggedIn} from "../services/auth"
import {navigate} from 'gatsby'
import { PlaylistitemPageComponent } from "../components/playlist/playlistitemPageComponent";

const client1 = new ApolloClient({
    uri: "https://api-us-east-1.graphcms.com/v2/ckso8s3um1hfq01y25hh4h6ri/master",
    cache: new InMemoryCache(),
  });  


export default function PlaylistitemPage({location}) {
    let playlistkey = location.search.substring(1);
    useEffect(()=>{
        if(!isLoggedIn() ){
            navigate('/login')
        }
    })
    return(
        <React.Fragment>
            <ApolloProvider client={client1}>
                <PlaylistitemPageComponent selectPlaylistkey = {playlistkey}/>
            </ApolloProvider>
        </React.Fragment>
    )
}