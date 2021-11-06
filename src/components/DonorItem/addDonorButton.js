import React from "react";
import { gql, useMutation } from '@apollo/client';

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

  const PUBLISH_DONOR = gql`
    mutation publishMutation($id: ID!) {
        publishDonor (where: {id : $id}){
            id,
            donorName,
            donorOrder,
            letter,
        }
    }
  `

export function AddDonorButton({donorName, letter, createSuccess, createFinish, selectedDonorKey}){

    const [onCreateHandler] = useMutation(ADD_DONOR,
        {
            onCompleted(data){
                const id = data.createDonor.id
                onPublish({
                    variables: {id: id}
                });
            }
        });
    
    const [onPublish] = useMutation(PUBLISH_DONOR,
        {
            onCompleted(data){
                window.location.reload();
            }
        })

    function onClickCreateButton (){
        if (donorName !== '' && letter !==''){
            onCreateHandler(
            { 
                variables: {donorKey:selectedDonorKey, donorName:donorName, donorOrder:1, letter:letter},
            },
        );
        }
        
    }

    return(
        <button onClick = {()=>onClickCreateButton()}>Add New Donor</button>
    );
}