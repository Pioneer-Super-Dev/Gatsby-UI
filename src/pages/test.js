import React, {Component} from "react";

import Header from "../components/header";
import {main__view, part__screen__container} from './style.module.css';
import SidebarContent from "../components/sidebarContent";

// import CreateLink from './CreateLink'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
const client1 = new ApolloClient({
    uri: "https://api-us-east-1.graphcms.com/v2/ckso8s3um1hfq01y25hh4h6ri/master",
    cache: new InMemoryCache()
  });  

class TestPage extends Component{
    render(){
        return(
            <React.Fragment>
                <Header/>
                <div className={main__view}>
                    <SidebarContent case = "playlist">
                    </SidebarContent>

                    <div className={part__screen__container}>
                        {/* <CreateLink/> */}
                        <ApolloProvider client={client1}>
                        </ApolloProvider>
                        
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default TestPage;