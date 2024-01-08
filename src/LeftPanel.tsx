import { useState } from "react"

import {
	Box,
	Divider,
	IconButton,
	MenuItem,
	MenuList,
	Popover,
	TextField,
	Typography,
    FormLabel
} from '@mui/material';
import { Button } from "antd";



export const LeftPanel = () => {

    const [panelItems, setPanelItems] = useState<string[]>([""])
    
    function addLeftPanelItem(){
        let temp = [... panelItems, "Google.com"]
        setPanelItems(temp);
    }

    return(

        <div className="LeftPanel">

            {
                panelItems.map((item, index) => (
                    <LeftPanelItem key = {index} url = {item} > </LeftPanelItem> 
                )
            )}    
            
            <Button onClick={() => addLeftPanelItem()}> + </Button>

        </div>

    )




}

const LeftPanelItem = (props : any ) => {

    const [url , setUrl] = useState(props.url)
    
    return (
        <div draggable>
            <FormLabel> {url}  </FormLabel>

        </div>
    )


}