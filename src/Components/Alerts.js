// src/components/Alert.js
import React from 'react';

const Alert = ({ type, message, onClose }) => {
    let alertClass = '';

    switch (type) {
        case 'success':
            alertClass = 'alert-success';
            break;
        case 'warning':
            alertClass = 'alert-warning';
            break;
        case 'error':
            alertClass = 'alert-error';
            break;
        default:
            alertClass = '';
    }

    return (
        <div className={`alert ${alertClass}`}>
            <span>{message}</span>
            <button onClick={onClose} className="close-btn">&times;</button>
        </div>
    );
};

export default Alert;
