import React, { useState, useEffect } from "react";
import { gql, useMutation, useQuery } from '@apollo/client';
import Header from "../../components/header";
import {main__view, part__screen__container, deleteBtn} from '../../pages/style.module.css';
import SidebarContent from "../../components/sidebarContent";

import {users__edit__add__donor, user__add__button , icon, users__edit__table__header, users__edit__table__item, users__edit__table__body, 
    users__edit__table__row, link__button, users__edit__table} from '../../pages/user.module.css';
import { DeleteUserItemModal } from "./deleteUserItemModal";
import { Link } from "gatsby";

import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';
import { Row, Col } from "reactstrap"

import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
const client1 = new ApolloClient({
    uri: "https://api-us-east-1.graphcms.com/v2/ckso8s3um1hfq01y25hh4h6ri/master",
    cache: new InMemoryCache(),
  });  

const UPDATE_USER = gql`
    mutation updateMutation($id: ID!, $firstName: String!, $lastName: String!, $email: String!){
        updateUserAPI(
            where: {id: $id}
            data: {firstName: $firstName, lastName: $lastName, email: $email})
        {
            firstName,
            lastName
        }
    }
`

const tableCols =
    [
        {
            dataField: 'id',
            text: 'ID'
        },
        {
            dataField: "firstName",
            text: "First Name",
            sort: true,
            searchable: true
        },
        {
            dataField: "lastName",
            text: "Last Name",
            sort: true,
            searchable: true
        },
        {
            dataField: "email",
            text: "Email",
            sort: true,
            search: true
        }
]

const pagination = paginationFactory({
    sizePerPageList:
        [{
            text: '5', value: 5
        }, {
            text: '10', value: 10
        }]
})

const GET_USER = gql`
query MyQuery {
    usersAPI {
      id,
      email,
      firstName,
      lastName
    }
}
`
const { ExportCSVButton } = CSVExport;
export default function UserPageComponent() {

    const {loading, error, data } = useQuery(GET_USER);

    const [firstLoad, setFirstLoad] = useState(true);
    const [userChanged, setUserChanged] = useState(false);
    const [userData, setUserData] = useState([])
    if (firstLoad){
        if (!loading){
            setFirstLoad(false);
        }
    }

    const [showDeleteItemModal, setShowDeleteItemModal] = useState(false);
    const [selectedItemIdToDelete, SetSeletectedItemIDToDelete] = useState('none');
    const [onUpdateHander] = useMutation(UPDATE_USER);
    useEffect (() =>{
        if (!loading){
            const newData = [];
            console.log(data);
            if ( data.length !== 0){
                let index = 1;
                data.usersAPI.map((item, key = item.id)=>{
                    let email, firstName, lastName;
                    email = item.email;
                    firstName = item.firstName;
                    lastName = item.lastName
                    const newItem = {id: index, userId:item.id, email: email, firstName: firstName, lastName: lastName, editable: false};
                    index ++;
                    newData.push(newItem);
                })
            }
            setUserData(newData); 
            setUserChanged(!userChanged);
        }
    }, [firstLoad])

    const onExitDeleteItemModalButton = () =>{
        setShowDeleteItemModal(false);
        SetSeletectedItemIDToDelete('none');
    }

    const onAfterSave = (oldValue, newValue, row) => {
        if ( oldValue != newValue){
            const data = userData;
            data.map((item, key) =>{
                if ( item.userId === row.userId){
                    try{

                    }
                    catch(e){

                    }
                }
            })
        }
    }

    const MySearch = (props) =>{
        let input;
        const handleClick = () => {
            props.onSearch(input.value);
        };
        return (
            <Row>
                <Col xs="9">
                    <input
                        className="form-control"
                        style={{ backgroundColor: '#FFFEF7' }}
                        ref={n => input = n}
                        type="text"
                    />
                </Col>
                <Col xs="3">
                    <button className="btn btn-primary" onClick={handleClick}>Search</button>
                </Col>
            </Row>
        );
    }
    const exportCSVSetting = {
        fileName:  "User.csv"
    }
    return(
        <div>
            <Header/>
            <div className={main__view}>
                <SidebarContent case = "users">
                </SidebarContent>
                <div className = {part__screen__container}>
                    <div className = {users__edit__add__donor}>
                        <div className = {user__add__button}>
                            <div className = {icon}/>
                            <Link to="/userregister" className= {link__button}><p style = {{marginBottom: "auto"}}>Add New User</p></Link>
                        </div>
                    </div>
                    <div className={users__edit__table}>
                        {
                            userData &&
                            <ToolkitProvider
                                keyField="id"
                                data={userData}
                                columns={tableCols}
                                exportCSV = { exportCSVSetting}
                                search >
                            {
                                props =>(
                                    <div>
                                        <hr/>
                                        <Row>
                                            <Col xs="10">
                                                <MySearch {...props.searchProps} />
                                            </Col>
                                            <Col xs="2">
                                                <ExportCSVButton {...props.csvProps} className="btn btn-success" >Export CSV</ExportCSVButton>
                                            </Col>
                                        </Row>
                                        <hr />
                                        <BootstrapTable
                                            pagination={pagination}
                                            {...props.baseProps}
                                            />
                                    </div>
                                )
                            }
                            </ToolkitProvider>
                        }
                    </div>
                </div>
                <ApolloProvider client={client1}>
                    <DeleteUserItemModal showModal = {showDeleteItemModal} onExitModal = {() => onExitDeleteItemModalButton.bind(this)} 
                            id = {selectedItemIdToDelete}></DeleteUserItemModal>
                </ApolloProvider>
            </div>
        </div>
    )
}