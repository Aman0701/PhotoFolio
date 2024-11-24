import React, { useState } from "react"; // Import React and useState hook
import { Form } from "./Form"; // Import the Form component for adding new albums
import { AlbumsList } from "./albumList"; // Import the AlbumsList component to display existing albums

// Home component serves as the main view for managing albums
export const Home = ({ onAlbumClick, handleTaskCompletion }) => {
    const [showAddAlbums, setShowAddAlbums] = useState(false); // State to manage visibility of the album creation form

    // Function to toggle the visibility of the album creation form
    const handleAddAlbumClick = () => {
        setShowAddAlbums(!showAddAlbums); // Toggle the state between true and false
    }

    return (
        <div className="container">
            {/* Conditionally render the Form component if showAddAlbums is true */}
            {showAddAlbums && <Form handleTaskCompletion={handleTaskCompletion} />}
            
            <div className="heading">
                <h1>Your Albums</h1>
                {/* Button to add a new album, toggles between "Add album" and "Cancel" */}
                <button onClick={handleAddAlbumClick} className={showAddAlbums ? "cancle" : "addAlbums"}>
                    {showAddAlbums ? "Cancel" : "Add album"}
                </button>
            </div>

            {/* Render the AlbumsList component and pass onAlbumClick as a prop */}
            <AlbumsList onAlbumClick={onAlbumClick} />
        </div>
    )
}