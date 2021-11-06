import React, {useState, useEffect} from "react";

import {
    Container
} from "reactstrap";

import {login__container, login__credentials__container, error__message,
    login__form, login__input__row, login__icon__user,  login__icon__password, login__login__button} from '../../pages/login.module.css';
import Logo from '../../components/logo';
import Footer from "../../components/footer";

import { gql, useQuery } from '@apollo/client';
import { handleLogin, isLoggedIn } from "../../services/auth";
import { navigate } from "gatsby"

const GET_USER = gql`
    query MyQuery {
        usersAPI {
        id,
        email,
        password,
        firstName
        }
    }
`

export default function LoginPageComponent() {

    const {loading, error, data } = useQuery(GET_USER);

    const [firstLoad, setFirstLoad] = useState(true);
    const [userChanged, setUserChanged] = useState(false);
    const [userData, setUserData] = useState([]);
    const [errorLogin, setErrorLogin] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    if (firstLoad){
        if (!loading){
            setFirstLoad(false);
        }
    }

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleChangeEmail = (event) =>{
        setEmail(event.target.value);
    }

    const handleChangePassword = (event) =>{
        setPassword(event.target.value);
    }

    useEffect (() =>{
        if (!loading){
            const newData = [];
            console.log(data);
            if ( data.length !== 0){
                data.usersAPI.map((item, key = item.id)=>{
                    let email, password, firstName;
                    email = item.email;
                    password = item.password;
                    firstName = item.firstName;
                    const newItem = {id:item.id, email: email, password: password, firstName: firstName};
                    newData.push(newItem);
                })
            }
            setUserData(newData); 
            setUserChanged(!userChanged);
        }
    }, [firstLoad])

    const handleLoginClick = () =>{
        console.log(email, password);
        if (email === '' || password ===''){
            setErrorLogin(true);
            setErrorMessage('Input Email and Password');
        }
        else{
            let logged = false;
            userData.map((item, key) =>{
                console.log(item);
                if( item.email === email && item.password === password){
                    var firstName = item.firstName;
                    console.log("here", item)
                    handleLogin({email, firstName});
                    logged = true;
                    // navigate('/home')
                    setUserChanged(!userChanged);
                }
            })
            if (!logged){
                setErrorLogin(true);
                setErrorMessage('There is no user with that email and password');
            }
        }
        
    }

    if(isLoggedIn() ){
        navigate('/home')
    }
    return(
        <div>
            <Container className={login__container} fluid>
                    <Logo></Logo>

                    <div className={login__credentials__container}>
                        {
                            errorLogin&&(
                                <div className = {error__message}>{errorMessage}</div>
                            )
                        }
                        <div className={login__form}>
                            <div className={login__input__row}>
                                <div className={login__icon__user}></div>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Email Address" 
                                    onChange = {handleChangeEmail.bind(this)}>
                                </input>
                            </div>
                            <div className={login__input__row}>
                                <div className={login__icon__password}></div>
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    placeholder="Password" 
                                    onChange = {handleChangePassword.bind(this)}>
                                </input>
                            </div>
                        </div>
                        <button className={login__login__button} type="submit" onClick = {() => handleLoginClick()}>Login</button>
                    </div>
                    <Footer/>
                </Container>
        </div>
    )
}