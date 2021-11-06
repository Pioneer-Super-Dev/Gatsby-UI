import React, { useState, useEffect } from "react";

import {
    donors__CSV__upload, donors__CSV__button, icon, donors__list,
    donors__list__item, donors__list__item__header, donors__list__item__title, donors__list__item__info, linkbutton, deleteButton
} from '../../pages/donorlist.module.css';

import Header from "../../components/header";
import { main__view, part__screen__container, error__message } from '../../pages/style.module.css';
import SidebarContent from "../../components/sidebarContent";
import Papa from 'papaparse';

import { gql, useQuery, useMutation } from '@apollo/client';
import { Link } from "gatsby";

import { AddDonorListModal } from "./addDonorListModal";
import { Alert, Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { DeleteDonorCategoryModal } from "./deleteDonorCategoryModal";
const GET_DONOR_CATEGORY = gql`
query Myquery{
    donorCategories{
      id,
      donorKey,
      donorCategoryTitle,
      author,
      updatedAt
    }
  }
`
const ADD_DONOR_CATEGORY = gql`
  mutation createMutation($title: String!, $donorKey: String!, $date: Date!, $user: String!){
    createDonorCategory( data: { donorCategoryTitle: $title, author: $user, donorKey: $donorKey, date: $date}){
        donorKey
    }
  }
`
const PUBLISH_DONOR_CATEGORY = gql`
  mutation publishMutation($donorKey: String!){
      publishDonorCategory(where: {donorKey: $donorKey}){
          donorKey
      }
  }
`



export function DonorListPageComponent() {
    const { loading, error, data } = useQuery(GET_DONOR_CATEGORY);
    
    const [donorData, setDonorData] = useState([]);
    const [donorChanged, setDonorChanged] = useState(true);
    const [firstLoad, setFirstLoad] = useState(true);
    const [createError, setCreateError] = useState(false);
    const [createErrorMessage, setCreateErrorMessage] = useState('');
    const [newData, setNewData] = useState([])
    const [showModal, setShowModal] = useState(false);
    const inputFileRef = React.useRef();
    const [deleteCategoryModal, setDeleteCategoryModal ] = useState(false);
    const [deleteCategoryKey, setdeleteCategoryKey] = useState();
    const [statusMessage, setStatusMessage] = useState("");

    const onFilechange = (e) => {
        /*Selected files data can be collected here.*/
        const reader = new FileReader()
        reader.onload = async (e) => { 
            const text = (e.target.result)
            const result = Papa.parse(text);
            if ( result.data[0][1]=== 'donorKey' && result.data[0][2] === 'donorName' && result.data[0][3] === 'letter'){
                const newData = [];
                let index = 0;
                for ( var i = 1 ; i< result.data.length-1; i++){
                    const newItem = {id: index,  donorKey: result.data[i][1], donorName: result.data[i][2], letter: result.data[i][3], editable: false}
                    newData.push(newItem);
                    index++;
                }
                setNewData(newData);
                setShowModal(true);
            }
        };
       reader.readAsBinaryString(e.target.files[0])
       
    }
    const [onCreateHandler] = useMutation(ADD_DONOR_CATEGORY,{
        onCompleted(data){
            console.log("hh", data.createDonorCategory);
            onPublishHander({
                variables: { donorKey: data.createDonorCategory.donorKey}
            })
        },
    })
    const [onPublishHander] = useMutation(PUBLISH_DONOR_CATEGORY, {
        onCompleted(data){
            reloadPage();
        }
    })
    
    useEffect(() => {
        if (!loading) {
            const newData = []
            data.donorCategories.map((item, key) => {
                const date = item.updatedAt.split("T")[0];
                const newItem = {
                    id: item.id, 
                    donorKey: item.donorKey,
                    donorCategoryTitle: item.donorCategoryTitle, 
                    author: item.author, 
                    date: date + "  " +  item.updatedAt.split("T")[1].split(".")[0] 
                }
                newData.push(newItem);
            })
            setDonorData(newData);
            setDonorChanged(!donorChanged);
        }
    }, [firstLoad])

    if (firstLoad) {
        if (!loading) {
            setFirstLoad(false);
        }
    }
    function onPClick() {
        inputFileRef.current.click();
    }
    const reloadPage = () =>{
        window.location.reload();
    }
    const onExitModalButton = () =>{
        setShowModal(false);
        setNewData([]);
    }

    const closeDeleteCategoryModal = ()=>{
        setDeleteCategoryModal(false);
    }

    const onDeleteCategory = (key) =>{
        setdeleteCategoryKey(key);
        setDeleteCategoryModal(true);
    }

    return (
        <div>
            <Header />
            <div className={main__view}>
                <SidebarContent case="donors-list">
                </SidebarContent>
                <div className={part__screen__container}>
                    <div className={donors__CSV__upload}>
                        <div className={donors__CSV__button}>
                            <div className={icon}></div>
                            <p>Download a CSV file</p>
                        </div>
                        <div className={donors__CSV__button}>
                            <div className={icon}></div>
                            <p onClick={() => onPClick()}> <input type="file" ref={inputFileRef} onChange={onFilechange} style={{ display: 'none' }} accept = ".csv"/>Upload a CSV file</p>
                        </div>
                    </div>
                    {
                        createError&&(
                            <div className = {error__message} >{createErrorMessage}</div>
                        )
                    }
                    {
                        statusMessage !==""&&(
                            <Alert color="success">{statusMessage}</Alert>
                        )
                    }
                    <div className={donors__list}>
                        
                        {
                            donorData && (
                                donorData.map((item, key = item.id) =>
                                    <div key={key} className={donors__list__item}>
                                        <div className={donors__list__item__header}>
                                            <p className={donors__list__item__title}>{item.donorCategoryTitle}</p>
                                            <Link className={linkbutton} to={"/donoritem?" + item.donorKey} >   </Link>
                                            <div className = {deleteButton} onClick = {()=>onDeleteCategory(item.donorKey)}/>
                                        </div>

                                        <div className={donors__list__item__info}>
                                            <p># of Entries: </p>
                                            <p>Last edited: {item.date}</p>
                                            <p>Edited By: {item.author}</p>
                                        </div>
                                    </div>
                                )
                            )
                        }
                        {
                            donorData.length ==0 &&(
                                <Alert color = "info">There is no DonorCategory yet !</Alert>
                            )
                        }
                    </div>
                </div>
                <AddDonorListModal showModal = {showModal} onExitModal = {() =>onExitModalButton.bind(this)} newData = {newData} 
                    donorCategory = {donorData} mode= "main"/>
            </div>
            <DeleteDonorCategoryModal showModal = {deleteCategoryModal} onExitModal = {closeDeleteCategoryModal } donorKey = {deleteCategoryKey} />
        </div>
    )
}