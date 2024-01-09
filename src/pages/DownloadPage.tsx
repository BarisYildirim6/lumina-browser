import {useState, useEffect} from 'react'
import axios from 'axios'
import Box from '@mui/material/Box';



// import {} from '@mui/base';

import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';



export default function DownloadPage(){
    const [downloadItems, setDowloadItems] = useState([]);

    const containerStyle = {

        display : 'flex',
        justifyContent : 'center',
        alignItems : 'flex-start',
        minHeight : '100vh',
        padding : '20px'

    } 


    const columns : GridColDef[] = [

        { field : 'id', headerName : 'ID', width : 90},

        {
            field : 'fileName',
            headerName : 'File Name',
            editable : false,
            width : 300,
            resizable : true
        },

        {
            field : 'url',
            headerName : "Url",
            editable : false,
            width : 300,
            resizable : true
        },

        {
            field : 'location',
            headerName : 'File Location',
            editable : false,
            resizable : true,
            width : 300,
        },

        {
            field : 'date',
            headerName : 'Date',
            editable : false,
            width : 300,
            
        },

        {
            field : 'showInFolder',
            headerName : "Show In Folder"
        }

    ]    


    useEffect(() => {

        let temp : any = []

        axios.get('http://localhost:7000/getDownloads').then((result) => {
            
            console.log(result)

            let data = result.data

            data.map((element : any, index : number) => {
                let obj = {
                    id : index,
                    fileName : element.fileName,
                    url : element.url,
                    location : element.location,
                    date : element.date,
                }

                temp.push(obj)
            })

            setDowloadItems(temp)
            console.log(downloadItems)
        })

    }, [])


    return (

        <div style={containerStyle}>
            <Box sx={{height : '100%', width: '100%'}}>

                <DataGrid
                    rows={downloadItems}
                    columns={columns}
                    initialState = {{
                        pagination: {
                            paginationModel: {
                                pageSize : 5
                            },
                        },
                    }}
                    pageSizeOptions={[5]}
                    checkboxSelection
                    onCellClick={(params) => console.log(params)}
                >
                </DataGrid>
            </Box>
        </div>        

    )







}