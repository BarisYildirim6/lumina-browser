import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import Incognito from './Incognito.tsx';
import './index.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function MainApp(){

	return (

		<BrowserRouter>

			<Routes>
				<Route path='/' element = {<App></App>}></Route>
				<Route path='Incognito' element = {<Incognito></Incognito>}></Route>
			</Routes>


		</BrowserRouter>
	
	)

}


ReactDOM.createRoot(document.getElementById('root')!).render(<MainApp />);



// Remove Preload scripts loading
postMessage({ payload: 'removeLoading' }, '*');

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
	console.log(message);
});


