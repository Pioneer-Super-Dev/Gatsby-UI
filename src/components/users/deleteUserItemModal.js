import React from "react";
import {modal, modal__show, modal__content, modal__header, close, modal__button__container} from '../deleteModal.module.css';
import {playlist_save_entry } from '../../pages/style.module.css';
import { gql, useMutation } from '@apollo/client';

const DELELTE_USER = gql`
  mutation DeleteMutation($id: ID!) {
    deleteUserAPI  ( where: {id: $id}){
        id,
        email,
        firstName,
        lastName
    }
  }
`

export function DeleteUserItemModal ({showModal, onExitModal, id}){
    const [onDeleteHandler] = useMutation(DELELTE_USER, 
        {
            onCompleted(data){
                window.location.reload();
            }
        }
    );

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
                            <div className = {playlist_save_entry} onClick = {() =>onDeleteHandler({
                                variables : {id : id}
                            })}>Delete</div>
                            <div className = {playlist_save_entry} onClick = { onExitModal()}>Cancel</div>
                        </div>
                    </div>
                </div>
            }
            </div>
    );
}