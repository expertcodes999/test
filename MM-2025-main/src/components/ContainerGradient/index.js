import React from 'react';
import './index.css';

const ContainerGradient = (props) => {
    const { children, className } = props;
    return (
        <div className={`custom-container-gradient ${className}`}>
            {children}
        </div>
    )
}

export default ContainerGradient;