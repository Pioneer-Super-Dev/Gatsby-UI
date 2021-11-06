import React, { useState, useEffect } from "react";
import {modal, modal__show, modal__content__60, modal__header, close, modal__button__container__row, modal__body, form__row
    } from '../deleteModal.module.css';
import {newdonorlist_save_entry, newdonorlist_save_entry_disabled , full__width} from '../../pages/style.module.css'; 
import { gql, useMutation, useQuery } from '@apollo/client';
import delay from "delay"

import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import { Row , Col, Alert, Jumbotron, FormGroup, Label, Input} from "reactstrap";
import { getUser } from "../../services/auth";
import cellEditFactory from 'react-bootstrap-table2-editor';

const ADD_DONOR = gql`
mutation createMutation( $donorKey: String!, $donorName: String!, $donorOrder: Int!, $letter: String!){
    createDonor( 
        data: { donorName: $donorName, donorOrder: $donorOrder , letter: $letter ,
            donorKey:{ connect: {donorKey: $donorKey}}} 
    )
    {
        id,
        donorName,
        donorOrder,
        letter,
        donorKey{
            donorKey
        }
    }
}
`
const ADD_DONORCATEGORY = gql`
    mutation createKeyMutation ($donorCategoryTitle: String!, $author: String!, $donorKey: String!){
        createDonorCategory(
            data:{ donorCategoryTitle: $donorCategoryTitle, author:$author, donorKey: $donorKey}
        )
        {
            id
        }
    }
`
const UPDATE_CATEGORYTOTAL = gql`
    mutation updateCategoryTotal ($donorKey: String!, $count: Number){
        updateDonorCategory(
            where: {donorKey: $donorKey},
            data: {totalCount: $count}
        )
        {
            donorKey,
        }
    }
`


const PUBLISH_DONOR = gql`
mutation publishMutation($id: ID!) {
    publishDonor (where: {id : $id}){
        id,
        donorKey{
            donorKey
        }
    }
}
`

const PUBLISH_CATEGORY = gql`
    mutation publishCategoryMutation($id: ID!){
        publishDonorCategory( where : {id: $id}){
            id
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
        dataField: "name",
        text: "Donor Name",
        sort: true,
        searchable: true
    },
    {
        dataField: "letter",
        text: "Donor Letter",
        sort: true,
        searchable: true
    },
    {
        dataField:"key",
        text:"Donor Key",
        sort: true,
        searchable: true
    }
]

const pagination = paginationFactory({
    sizePerPageList :
    [  {
        text: '10', value: 10
      }, {
        text: '15', value: 15
      }
      , {
        text: '20', value: 20
      }
      , {
        text: '25', value: 25
      }]
})

const GET_DONOR = gql`
query MyQuery {
    donors (first: 10000){
      id,
      donorName, 
      letter,
      donorKey{
          donorKey,
          donorCategoryTitle
      }
    }
}
`
const DELELTE_DONOR = gql`
  mutation DeleteMutation($id: ID!) {
    deleteDonor  ( where: {id: $id}){
      id,
    }
  }
`
export function AddDonorListModal({showModal, onExitModal, newData, donorCategory, mode, selectedDonorKey}) {
    const [dataChanged, setDataChanged] = useState(true);
    const [showData, setShowData] = useState([])
    const [firstLoad, setFirstLoad] = useState(true);
    const [publishID, setPublishID] = useState([]);
    const [onCreate, setOnCreate] = useState(false);
    const [onPublish, setOnPublish] = useState(false);

    const [createSuccess, setCreateSuccess] = useState(false)
    const [createNum, setCreateNum] = useState(0);
    const [publishNum, setPublishNum] = useState(0);

    const [createCategoryNum, setCreateCategoryNum] = useState(0);
    const [publishCategoryNum, setPublishCategoryNum] = useState(0);
    const [method, setMethod] = useState("default");

    const [onCreateHandler] =  useMutation(ADD_DONOR,
    {
        onCompleted(data){
            
            const id = data.createDonor.id
            setCreateNum(createNum + 1);
            onPublishHandler({
                variables:{id:id}
            })
        }
    });

    const [onCreateCategoryHandler] = useMutation(ADD_DONORCATEGORY,
    {
        onCompleted(data){
            const id = data.createDonorCategory.id
            setCreateCategoryNum(createCategoryNum + 1);
            onPublishCategoryHandler({
                variables: {id: id}
            })
        }
    })
    
    const [onPublishHandler] =  useMutation(PUBLISH_DONOR,
    {
        onCompleted(data){
            console.log("after create:", data.publishDonor.donorKey.donorKey);
            // if (publishNum === createNum)
            //     setCreateSuccess(true);
            setPublishNum( publishNum + 1);
        }
    })

    const [onPublishCategoryHandler] = useMutation(PUBLISH_CATEGORY,
        {
            onCompleted(data){
                setPublishCategoryNum( publishCategoryNum + 1);
            }
        }    
    )

    const [onUpdateCategoryCountHandler] = useMutation(UPDATE_CATEGORYTOTAL);
    if (firstLoad && showModal){
        setFirstLoad(false);
    }
    if (!firstLoad && !showModal){
        setFirstLoad(true);
    }
    useEffect(()=>{
        console.log(firstLoad, showModal);
        if (!firstLoad){
            const tempData = [];
            if ( newData.length !== 0){
                newData.map((item, key)=>{
                        const newItem = {id:item.id, name:item.donorName,key: item.donorKey, letter:item.letter, editable: false};
                        tempData.push(newItem);
                })
            }
            setShowData(tempData);
            setDataChanged(!dataChanged);
        }
            
    }, [firstLoad])

    const { loading, error, data } = useQuery(GET_DONOR);
    if (error) console.log('error:', error.message);

    const [donorData, setDonorData] = useState([]);
    const [donorChanged, setDonorChanged] = useState(true);
    const [donorLoad, setDonorLoad] = useState(true);

    if (donorLoad) {
        if (!loading) {
            setDonorLoad(false);
        }
    }

    useEffect(() => {
        if (!loading) {
            console.log("Initial Donor: ", data);
            const newData = [];
            if (data.length !== 0) {
                data.donors.map((item, key) => {
                    // console.log(item);
                    const newItem = { id: item.id, key : item.donorKey[0].donorKey, name: item.donorName, letter: item.letter};
                    newData.push(newItem);
                })
            }
            if ( mode ==="item")
                setMethod("reject");
            setDonorData(newData);
            setDonorChanged(!donorChanged);
        }
    }, [donorLoad])

    const [onDeleteHandler] = useMutation(DELELTE_DONOR);

    const onSaveButton = async function (){
        setOnCreate(true);
        const user = getUser().firstName;
        const newDonorCategory = [... new Set(showData.map(data => data.key))]
        for (var i =0 ; i< newDonorCategory.length; i++){
            let creatable = true;
            for ( var j = 0 ; j< donorCategory.length ; j++){
                if ( newDonorCategory[i] === donorCategory[j].donorKey){
                    creatable = false;
                    continue;
                }
            }
            console.log("DonorKey:", newDonorCategory[i], creatable)
            if (mode === "main" || (mode === "item" && method === "upload"))
            {
                try{
                    if (creatable)
                        onCreateCategoryHandler({
                            variables: {donorCategoryTitle: newDonorCategory[i], author: user, donorKey: newDonorCategory[i] }
                        })
                }
                catch(e){
                    console.log(e);
                }
            }
            await delay(100)
        }
        for ( var i = 0 ; i< showData.length ; i++){
            let donorItemExit = false
            for ( var j = 0 ; j< donorData.length; j++){
                if ( showData[i].key === donorData[j].key && showData[i].name === donorData[j].name && showData[i].letter === donorData[j].letter ){
                    donorItemExit = true;
                    continue;
                }
            }
            if ( !donorItemExit){
                if (mode === "main" || (mode === "item" && method === "upload")){
                    onCreateHandler({
                        variables: {donorKey : showData[i].key, donorName: showData[i].name, donorOrder: 1, letter: showData[i].letter}
                    })
                    await delay(300)
                }
                if (mode === "item" && method === "reject" && showData[i].key ===selectedDonorKey){
                    
                    onCreateHandler({
                        variables: {donorKey : showData[i].key, donorName: showData[i].name, donorOrder: 1, letter: showData[i].letter}
                    })
                    await delay(300)
                }
            }
        }
        setOnCreate(false);
        setCreateSuccess(true);
        // publishDonors();
    }
    const publishDonors = async function(){
        console.log("Here:", publishID);
        setOnPublish(true);
        for ( var i = 0 ; i<publishID.length; i++){
            console.log(publishID[i]);
            onPublishHandler({
                variables: {id: publishID[i].id} 
            })
            await delay(100)
        }
        
        setOnPublish(false);
        setCreateSuccess(true);
    }

    const MySearch = (props) => {
        let input;
        const handleClick = () => {
            props.onSearch(input.value);
        };
        return (
            <Row>
                <Col xs="9">
                    <input
                        className="form-control"
                        style={{ backgroundColor: '#FFFEF7'}}
                        ref={n => input = n}
                        type="text"
                    />
                </Col>
                <Col xs="3">
                    <button className="btn btn-primary" onClick={handleClick}>Search</button>
                </Col>
            </Row>
        );
      };

    const reloadPage = () => {
        window.location.reload();
    }

    const changeMethod = (e) =>{
        const value = e.target.value;
        setMethod(value);
        console.log("-", value);
    }

    const onAfterSave= (oldValue, newValue, row) => {
        // if ( oldValue != newValue){
        //     const data = showData;
        //     data.map((item, key) => {
        //         if (item.donorId === row.donorId) {

        //         }
        //     })
        // }
        console.log("--", showData);
    }

    return(
        <div>
            {
                !showModal?
                    <div className={modal}>
                    </div>:
                    <div className={modal__show}>
                        <div className={modal__content__60}>
                            {
                                mode=="item" &&
                                (
                                    <div>
                                        <Jumbotron fluid>
                                        <h5>Please choose how to handle the donor items with different donor key?</h5>
                                        <FormGroup>
                                            <Label for="exampleSelect">Method:</Label>
                                            <Input type="select" name="select" value = {method} onChange = {changeMethod}>
                                                <option value= "reject">Reject the donor items with different donor key.</option>
                                                <option value = "upload">Upload the donor items to the following group.</option>
                                            </Input>
                                        </FormGroup>
                                        <hr/>
                                        </Jumbotron> 
                                    </div>
                                    
                                )
                            }
                            <div className = {modal__header}>
                                
                                {
                                    onCreate &&
                                    (<div  className = {full__width}><Alert color = "primary">Please wait ! Creating Donors......{createNum}</Alert></div>)
                                    
                                }
                                {
                                    onPublish &&
                                    (<div  className = {full__width}><Alert color = "info">Please wait ! Publishing Donors......{publishNum}</Alert></div>)
                                }
                                {
                                    !onCreate && !onPublish&& !createSuccess &&(
                                        <Alert color = "secondary" className = {full__width}>This is New Donor List!</Alert>
                                    )
                                }
                                {
                                    createSuccess &&(
                                        <Alert color = "success"  className = {full__width}>{createNum} new donor items are inserted!  {createCategoryNum} new category are created!</Alert>
                                    )
                                }
                            </div>
                            
                            <div className= {modal__body}>
                                <Row>
                                    {
                                        onCreate || onPublish &&(
                                            <Row>
                                                <Col xs="6" className = {newdonorlist_save_entry_disabled}>Save</Col>
                                                <Col xs="6" className = {newdonorlist_save_entry_disabled}>Cancel</Col>
                                            </Row>
                                        )
                                    }
                                    {
                                        !onPublish && !onCreate && !createSuccess &&(
                                            <Row>
                                                <Col xs="6" className = {newdonorlist_save_entry} onClick = {()=>onSaveButton()}>Save</Col>
                                                <Col xs="6" className = {newdonorlist_save_entry} onClick = {onExitModal()}>Cancel</Col>
                                            </Row>
                                        )
                                    }
                                    {
                                        createSuccess &&(
                                            <Row>
                                                <Col xs="12" className = {newdonorlist_save_entry} onClick = {()=>reloadPage()}>Reload</Col>
                                            </Row>
                                        )
                                    }
                                    </Row>
                                {
                                    showData&&
                                    <ToolkitProvider keyField = "id" data= {showData} columns = {tableCols} search >
                                        {
                                            props => (
                                            <div>
                                                <hr />
                                                <Row>
                                                    <MySearch { ...props.searchProps } />
                                                </Row>
                                                <hr />
                                                <BootstrapTable
                                                    pagination = {pagination}
                                                    cellEdit={cellEditFactory({
                                                        mode: 'dbclick',
                                                        blurToSave: true,
                                                        afterSaveCell: (oldValue, newValue, row, column) => onAfterSave(oldValue, newValue, row, column)
                                                    })}
                                                    { ...props.baseProps }
                                                />
                                            </div>
                                            )
                                        }
                                    </ToolkitProvider>
                                }
                            </div>
                        </div>
                    </div>
            }
        </div>
    )
}