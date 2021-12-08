import React from 'react';
import App from './components/backEnd/app';
import ReactDOM from 'react-dom';
import { BrowserRoute } from 'react-router-dom';

ReactDOM.render(
    <BrowserRoute>
        <App />
    </BrowserRoute>,
    document.getElementById('createFormProduct')
);


