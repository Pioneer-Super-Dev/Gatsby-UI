import React, {Component} from "react";

import {
    Container
} from "reactstrap";

import {home__container, home__buttons__container, home__button__row } from './home.module.css';
import Logo from '../components/logo';
import HomeButton from "../components/homeButton";
import Footer from "../components/footer";

import {isLoggedIn} from "../services/auth"
import {navigate} from 'gatsby'

class HomePage extends Component{

    toNaviage = (url) =>{
        window.location = "/" + url;
    }
    componentDidMount(){
        if(!isLoggedIn() ){
            navigate('/login')
        }
    }
    render(){
        
        return(
            <React.Fragment>
                <Container className={home__container} fluid>

                    <Logo/>

                    <div className={home__buttons__container}>
                        <div className={home__button__row}>
                            <HomeButton title="Donors" color="#0080c7" onClick= {()=>this.toNaviage('donorlist')}/>
                            <HomeButton title="playlist" color="#00b293" onClick= {()=>this.toNaviage('playlist')}/>
                        </div>
                        <div className={home__button__row}>
                            <HomeButton title="takeover" color="#e7ad47" onClick = {() =>this.toNaviage('takeover')}/>
                            <HomeButton title="users" color="#ff4343" onClick = {() =>this.toNaviage('user')}/>
                        </div>
                    </div>

                    <Footer/>
                </Container>
            </React.Fragment>
        )
    }
}
export default HomePage;