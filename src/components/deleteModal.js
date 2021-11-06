import React, { useEffect, useState} from "react";
import {modal, modal__show, modal__content, modal__header, close, modal__button__container} from './deleteModal.module.css';
import {playlist_save_entry } from '../pages/style.module.css';
import { gql, useMutation, useQuery } from '@apollo/client';

const GET_DONOR = gql`
query MyQuery {
    donors  {
      id,
      donorName,
      donorOrder,
      letter
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
      donorName,
      donorOrder,
      letter,
    }
  }
`

const DELETE_DONORCATEGORY = gql`
  mutation DeleteCategoryMutation ($donorKey: String!){
    deleteDonorCategory  (where :{donorKey: $donorKey}){
        author
    }
  }
`

export function DeleteModal ({ showModal, onExitModal, selectedDonorKey}) {

    const {loading, error, data } = useQuery(GET_DONOR);
    if (error) console.log('error:', error.message);

    const [donorData, setDonorData] = useState([]);
    const [firstLoad, setFirstLoad] = useState(true);
    if (firstLoad){
        if (!loading){
            setFirstLoad(false);
        }
    }

    const [onHandleDeleteDonor] = useMutation(DELELTE_DONOR) ;
    const [onHandleDeleteCategory] = useMutation(DELETE_DONORCATEGORY,
        {
            onCompleted(){
                window.location = "/donorlist";
            }
        }
    )
    
    useEffect(()=>{
        if ( !loading){
            const newData = [];
            if ( data.length !== 0){
                data.donors.map((item, key)=>{
                    if( item.donorKey[0].donorKey === selectedDonorKey){
                        const newItem = {id:item.id};
                        newData.push(newItem);
                    }
                    
                })
            }
            setDonorData(newData); 
        }
    }, [firstLoad])

    const onDeleteButton = () =>{
        donorData.map((item, key) => {
            onHandleDeleteDonor({
                variables: {id : item.id}
            })
        })

        onHandleDeleteCategory({
            variables:{ donorKey: selectedDonorKey}
        })
    }
    return(
        <div>
        { !showModal ?
            <div className={modal}>

            </div>:
            <div className={modal__show}>
                <div className={modal__content}>
                    <div className = {modal__header}>
                        <p>Do you want to delete this section?</p>
                        <span className={close} onClick = {onExitModal()}>&times;</span>
                    </div>
                    <div className = {modal__button__container}>
                        <div className = {playlist_save_entry} onClick = { () => onDeleteButton()} >Delete</div>
                        <div className = {playlist_save_entry} onClick = { onExitModal()}>Cancel</div>
                    </div>
                </div>
            </div>
        }
        </div>
    )
}
export default DeleteModal;