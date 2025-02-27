import React from 'react';
import './index.css';

const ContainerComponentTransparent = (props) => {
    const { children, className } = props;
    return (
        <div className={`custom-container-transfer ${className}`}>
            {children}
        </div>
    )
}

export default ContainerComponentTransparent;