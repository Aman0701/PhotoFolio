import React from 'react'; // Import the React library
import ReactDOM from 'react-dom/client'; // Import ReactDOM for rendering React components to the DOM
import './index.css'; // Import the main CSS file for styling
import App from './App'; // Import the main App component

// Create a root element for rendering the React application
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component inside the root element
root.render(
  <React.StrictMode> {/* Enables additional checks and warnings for the application */}
    <App /> {/* The main application component */}
  </React.StrictMode>
);