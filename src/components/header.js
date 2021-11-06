import React, {Component} from "react";

import {header__container, header__logo__container, header_logo, header__button__row, header__nav__buttons, header__button, header__user__button, header__logout__dropdown, header__logout__dropdown__show} from './header.module.css';
import whiteLogo from '../images/white_logo.png';
import { Link, navigate } from "gatsby";
import {logout} from "../services/auth"

class Header extends Component{
    constructor(props){
        super(props);
        this.state = {
            showBtn: false,
        }
    }

    clickShowBtn = () =>{
        const {showBtn} = this.state;
        this.setState({ showBtn: !showBtn});
    }
    render(){
        const {showBtn} = this.state;
        let userButton;
        if (showBtn){
            userButton = <div className={header__logout__dropdown__show} onClick = {event => logout(()=> navigate('/login'))}>Log Out</div>
        }
        else{
            userButton = <div className={header__logout__dropdown}>Log Out</div>
        }
        return(
            <div className={header__container}>
                <div className= {header__logo__container}>
                    <div className={header_logo}>
                        <img src={whiteLogo} alt=""/>
                        <h3>cms system</h3>
                    </div>
                </div>

                <div className={header__button__row}>
                    <div className={header__nav__buttons}>
                        <Link className={header__button} to="/home">H o m e</Link>
                        <Link className={header__button} to = "/donorlist">D o n o r</Link>
                        <Link className={header__button} to = "/playlist">P l a y l i s t</Link>
                        <Link className={header__button} to = '/takeover'>T a k e o v e r</Link>
                        <Link className={header__button} to = "/user">U s e r s</Link>
                    </div>
                    <div className={header__user__button}>
                        <button onClick={() => {this.clickShowBtn()}}></button>
                        {userButton}
                    </div>
                </div>
            </div>
        )
    }
}

export default Header;