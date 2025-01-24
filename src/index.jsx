import * as React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';


const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

//process.dlopen(module, path.resolve(__dirname, './communication_test/build/Release/addon.node'));
root.render(
    <App/>
);