import React from 'react';

function Star({ selected = false, userRated, onSelect = f => f, fraction = 1 }) {
    return (
        <span className={selected ? "star-icon" :"star-icon-inactive"} onClick={onSelect}>
            <span style={{ 
                display: 'inline-block',
                overflow: 'hidden',
                opacity:userRated ? 1 : fraction,
                //color: userRated ? : '#b4ecee',
                WebkitTextStroke: userRated? '1px gold': `1px rgba(0,122,122,${fraction})`,
                fontSize: userRated ? '1.1em':'1em',
            }}>
                ★
            </span>
        </span>
    );
}

export default Star;
