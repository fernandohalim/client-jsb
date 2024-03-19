import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import backgroundImage from 'tile-2822716.jpg';

//Components
import LoginCard from '../../components/loginCard';

function LoginPage() {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh', 
        margin: 'auto', 
        width: '100%',
        backgroundImage: `url(${process.env.PUBLIC_URL}/tile-2822716.jpg)`, // Set background image
        backgroundSize: 'cover', // Ensure the image covers the entire background
        backgroundPosition: 'center', // Center the image
      }}>
          <LoginCard/>
      </div>
    );
  }
  
  export default LoginPage;