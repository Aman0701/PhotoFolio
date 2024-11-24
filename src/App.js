import React, { useState } from "react";
import { Navbar } from "./Component/Navbar"; // Importing Navbar component
import { Home } from "./Component/Home"; // Importing Home component
import { SingleAlbum } from "./Component/SingleAlbum"; // Importing SingleAlbum component
import { Notification } from "./Component/Notification"; // Importing Notification component

function App() {
  // State variables to manage selected album, popup visibility, and notification message
  const [selectedAlbums, setSelectedAlbums] = useState(null); // Stores the currently selected album
  const [popup, setPopup] = useState(false); // Controls visibility of the notification popup
  const [message, setMessage] = useState(""); // Stores the notification message

  // Function to handle task completion and show notification
  const handleTaskCompletion = (message) => {
    setPopup(true); // Show the popup
    setMessage(message); // Set the notification message

    // Automatically hide the popup after a specified duration
    setTimeout(() => {
      setPopup(false);
    }, 5000); // Duration of the popup (5 seconds)
  };

  return (
    <div className="App">
      <Navbar /> {/* Render the Navbar component */}
      {selectedAlbums ? (
        // If an album is selected, render the SingleAlbum component
        <SingleAlbum 
          album={selectedAlbums} 
          onBack={() => setSelectedAlbums(null)} // Function to go back to Home
          handleTaskCompletion={handleTaskCompletion} // Pass the task completion handler
        />
      ) : (
        // If no album is selected, render the Home component
        <Home 
          onAlbumClick={setSelectedAlbums} // Function to set the selected album
          handleTaskCompletion={handleTaskCompletion} // Pass the task completion handler
        />
      )}
      {popup && <Notification message={message} duration={5000} />} {/* Render notification if popup is true */}
    </div>
  );
}

export default App; // Export the App component