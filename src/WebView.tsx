import React, { useEffect } from "react";
import './App.css'

export default function WebView({myRef, src}){


    return (
        <div id="w_id">
            <div>
                <webview ref={myRef} id="webview" src={src}>
        
                </webview>
            </div>    
        </div>
    )


}