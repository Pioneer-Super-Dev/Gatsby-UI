import React, {Component} from "react";

import white_logo from '../images/white_logo.png';
import {login__logo__container, login__logo} from './logo.module.css';

class Logo extends Component{

    render(){
        return(
            <div className={login__logo__container}>
                <div className={login__logo}>
                    <img src={white_logo} alt=""/>
                    <h3>cms system</h3>
                </div>
            </div>
        )
    }
}

export default Logo;