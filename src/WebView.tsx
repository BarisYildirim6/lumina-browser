import React from "react";
import './App.css'

export default function WebView({myRef, src}){

    function handleMouseOver(){
        console.log("Mouse is over")
    }

    function handleMouseWheel(){
        console.log("AAAA")
    }

    const handleKeyPress = (e) => {
        console.log('Key press:', e.type);
        // Add your custom logic here
      };

    return (
        <div id="w_id">
            <div>
                <webview ref={myRef} id="webview" src={src}>
        
                </webview>
            </div>    
        </div>
    )


}