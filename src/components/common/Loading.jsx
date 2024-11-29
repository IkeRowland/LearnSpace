import React from 'react';

const Loading = ({ size = 'medium', color = '#09a407' }) => {
    const dimensions = {
        small: 20,
        medium: 30,
        large: 40
    };

    const spinnerSize = dimensions[size] || dimensions.medium;

    return (
        <div 
            className="loading-spinner"
            style={{
                width: spinnerSize,
                height: spinnerSize,
                border: `3px solid ${color}20`,
                borderTop: `3px solid ${color}`,
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
            }}
        />
    );
};

export default Loading;
