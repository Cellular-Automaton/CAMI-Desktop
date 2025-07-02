import * as React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { UserProvider } from './contexts/UserContext.jsx';
import { APIProvider } from './contexts/APIContext.jsx';


const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
    <APIProvider>
        <UserProvider>
            <App/>
        </UserProvider>
    </APIProvider>
);