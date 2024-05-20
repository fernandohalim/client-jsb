import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

function LoadingSpinner() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: "1050",
    }}>
      <Spinner animation="border" variant='primary' />
    </div>
  );
}

export default LoadingSpinner;