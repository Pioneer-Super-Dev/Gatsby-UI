import React, { useState, useEffect } from "react";
import { gql, useMutation, useQuery } from '@apollo/client';
import {apiData} from "./api.module.css";

const GET_DONOR = gql`
    query MyQuery {
        donors (first: 10000)  {
        id,
        donorName,
        donorOrder,
        letter
        donorKey{
            id,
            donorKey,
            donorCategoryTitle,
            author,
            createdAt
        }
    }
}
`

export function Api() {
    const { loading, error, data } = useQuery(GET_DONOR);
    if (error) console.log('error:', error.message);

    const [showData, setShowData] = useState("");
    const [firstLoad, setFirstLoad] = useState(true);
    if (firstLoad) {
        if (!loading) {
            setFirstLoad(false);
        }
    }

    useEffect(() => {
        if (!loading) {
            const categories = [];
            // console.log("Data: ", data);
            if (data.length !== 0) {
                data.donors.map((item, key) => {
                    const date = item.donorKey[0].createdAt.split("T")[0]+ " " +item.donorKey[0].createdAt.split("T")[1].split(".")[0]
                    const donorCategory = {id: item.donorKey[0].id, key: item.donorKey[0].donorKey, title: item.donorKey[0].donorCategoryTitle, 
                        author:item.donorKey[0].author, date: date, donors:[]}
                    categories.push(donorCategory);
                })
                data.donors.map((item,key) =>{
                    categories.map((category, key) => {
                        if ( item.donorKey[0].donorKey == category.key){
                            const newItem = { id: item.id, name: item.donorName, letter: item.letter};
                            category.donors.push(newItem);
                        }
                    })
                })
            }
            // setShowData(categories);
            setShowData(JSON.stringify(categories))
        }
    }, [firstLoad])

    return(
        <div>
            {showData&&
            <div className = {apiData}>
                {showData}
            </div>
            }
        </div>
        
    )
}