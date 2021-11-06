import React, {createContext, useState} from "react";

import Header from "../../components/header";
import {main__view, textInput} from '../../pages/style.module.css';
import SidebarContent from "../../components/sidebarContent";
import {users__registration__container, playlist__add__entry, error__message, success__message} from "../../pages/userregister.module.css"

import { FormGroup, Input, Label, Button, Alert  } from 'reactstrap';
import { gql, useMutation } from '@apollo/client';

const ADD_USER = gql`
    mutation createMutation($email: String! , $password: String! , $firstName: String!, $lastName: String!, $admin: Int!){
        createUserAPI( data: {email: $email, password: $password, firstName: $firstName, lastName: $lastName, admin: $admin}){
            id,
            email,
            password,
            firstName,
            lastName,
        }
    }
`

const PUBLISH_USER = gql`
    mutation publishMutation($id: ID!){
        publishUserAPI( where: {id: $id}){
            firstName,
            lastName
        }
    }
`

export function UserRegisterPageComponent (){

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');
    const [admin, setAdmin] = useState(0);

    const [inputError, setInputError] = useState(false);
    const [inputErrorMessage, setInputErrorMessage] = useState('');
    const [createSuccess, setCreateSuccess] = useState(false);
    const [createSuccessMessage, setCreateSuccessMessage] = useState('');

    const handleChangeFirstName = (e) =>{
        setFirstName(e.target.value);
    }

    const handleChangeLastName = (e) => {
        setLastName(e.target.value);
    }

    const handleChangeEmail = (e) => {
        setEmail(e.target.value);
    }

    const handleChangePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleChangeRepassword = (e) => {
        setRepassword(e.target.value);
    }

    const handleChangeAdmin = (e) =>{
        setAdmin(e.target.value);
    }

    const [onPublishHandler] = useMutation(PUBLISH_USER, 
        {
            onCompleted(data){
                console.log(data.publishUserAPI);
                setCreateSuccess(true);
                const message = 'User'+ data.publishUserAPI.firstName + data.publishUserAPI.lastName + ' has been created successfully.'
                setCreateSuccessMessage(message)
            }
        })
    const [onCreateHandler] = useMutation(ADD_USER,
        {
            onCompleted(data){
                console.log(data.createUserAPI.id);
                onPublishHandler({
                    variables: {id: data.createUserAPI.id}
                })
            }
        });

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
      }

    function onClickAdd(){
        if (firstName ===''){
            setInputError(true);
            setInputErrorMessage('FirstName can not be empty');
        }
        else if (lastName === ''){
            setInputError(true);
            setInputErrorMessage('LastName can not be empty');
        }
        else if (email ===''){
            setInputError(true);
            setInputErrorMessage('Email can not be empty');
        }
        else if (!validateEmail(email)){
            setInputError(true);
            setInputErrorMessage('Email format is not correct')
        }
        else if (password ===''){
            setInputError(true);
            setInputErrorMessage('Password can not be empty');
        }
        else if (password !==repassword){
            setInputError(true);
            setInputErrorMessage('Password is not matched');
        }
        else{
            onCreateHandler(
                {
                    variables: {email: email, password: password, firstName: firstName, lastName: lastName, admin: 0}
                }
            );
        }
    }
    return(
        <div>
            <Header/>
            <div className={main__view}>
                <SidebarContent case = "users">
                </SidebarContent>
                <div className = {users__registration__container}>
                    
                    {
                        inputError &&(
                            <Alert color="danger" className = {error__message}>{inputErrorMessage}</Alert>
                        )
                    }
                    {
                        createSuccess&&(
                            <Alert color="success" className = {success__message}>{createSuccessMessage}</Alert>
                        )
                    }
                    {
                        !inputError && !createSuccess &&(
                            <Alert color="success" className = {success__message}>
                                Please insert the information for the new user.!
                            </Alert>
                        )
                    }
                    <FormGroup className = {textInput} >
                        <Label>First Name</Label>
                        <Input type= "text" placeholder = "First Name" value = {firstName} onChange = {handleChangeFirstName.bind(this)}/>
                    </FormGroup>
                    <FormGroup className = {textInput} >
                        <Label>Last Name</Label>
                        <Input type= "text" placeholder = "Last Name"value = {lastName} onChange = {handleChangeLastName.bind(this)}/>
                    </FormGroup>
                    <FormGroup className = {textInput} >
                        <Label>Email Address</Label>
                        <Input type= "text" placeholder = "Email Address"value = {email} onChange = {handleChangeEmail.bind(this)}/>
                    </FormGroup>
                    <FormGroup className = {textInput} >
                        <Label>Password</Label>
                        <Input type= "password" placeholder = "Password" value = {password} onChange = {handleChangePassword.bind(this)}/>
                    </FormGroup>
                    <FormGroup className = {textInput} >
                        <Label>Confirm password</Label>
                        <Input type= "password" placeholder = "Conform Password" value = {repassword} onChange = {handleChangeRepassword.bind(this)}/>
                    </FormGroup>
                    <FormGroup className = {textInput} >
                        <Label>Admin </Label>
                        <Input type="checkbox" id="admin" name="admin" value="admin" value = {admin} onChange = {handleChangeAdmin.bind(this)}/>
                    </FormGroup>
                    <Button color="primary" className = {playlist__add__entry} onClick = {() =>onClickAdd()} >Save</Button>
                </div>
            </div>
        </div>
    )
}