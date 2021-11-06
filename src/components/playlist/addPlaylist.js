import React, { useEffect, useState } from "react";
import { gql, useMutation, useQuery } from '@apollo/client';

export function AddPlaylist({onClick}){
    return (
        <button onClick = { onClick()}>Add Entry</button>
    )
}