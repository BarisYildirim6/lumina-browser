import ReactDOM from 'react-dom/client';
import React, { useEffect } from 'react';
import './index.css';
import App from './App';

const MainApp = () => {
  useEffect(() => {
    const handleMouseWheel = (event: WheelEvent) => {
      // Check if Ctrl key is pressed
      if (event.ctrlKey) {
        //console.log('Ctrl + Mouse Wheel:', event);
      }
    };

    document.addEventListener('wheel', handleMouseWheel);

    return () => {
      document.removeEventListener('wheel', handleMouseWheel);
    };
  }, []);

  return (
    <div>
		<App></App>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<MainApp />);

// Remove Preload scripts loading
postMessage({ payload: 'removeLoading' }, '*');

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message);
});

window.ipcRenderer.send('zoom');
