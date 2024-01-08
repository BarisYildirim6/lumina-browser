import {useState, useEffect} from 'react'
import axios from 'axios'


import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Result } from 'antd';


export default function DownloadPage(){
    const [downloadItems, setDowloadItems] = useState([]);

    useEffect(() => {

        axios.get('http://localhost:7000/getDownloads').then((result) => {

            console.log(result)

        })

    }, [])


    return (

        <h1> DownloadPage </h1>


    )







}