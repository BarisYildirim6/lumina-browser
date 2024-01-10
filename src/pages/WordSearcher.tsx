import { TextField } from "@mui/material";
import react, { useEffect } from "react";
import { useState } from "react";


export default function WordSearcher(){
    
    const [searchValue, setSearchValue] = useState("")
    const [spanName, setSpanName] = useState()



    window.ipcRenderer.on("focusText", () => {
        console.log("Focus Text Works")
        let obj = document.getElementById('wordSearcher')

        console.log(obj)

        obj?.focus()
    })
    
    function handleChange(e){
        setSearchValue(e.target.value)
    }

    function handleKeyboard(e){

        if(e.code === 'Enter'){
            window.ipcRenderer.send("search-text", searchValue)
        }

    }

    function removeSpans(){
        
    }

    function addSpans(){

        
    }

    


    return (
        <TextField onKeyDown={handleKeyboard} id="wordSearcher" onChange={handleChange}> </TextField>
    )

}