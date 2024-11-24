import React, { useRef } from "react"; // Import React and useRef hook
import { db } from "../firebaseInit"; // Import the Firestore database instance
import { addDoc, collection } from "firebase/firestore"; // Import necessary Firestore functions

// Form component allows users to create a new album
export const Form = ({ handleTaskCompletion }) => {
    const inputRef = useRef(null); // Create a ref to access the input field

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        const inputValue = inputRef.current.value.trim(); // Get the trimmed input value

        // Proceed only if input is not empty
        if (inputValue) {
            // Add a new album document to Firestore
            await addDoc(collection(db, "albumList"), {
                name: inputValue, // Set the album name
                images: [] // Initialize with an empty images array
            });
            handleTaskCompletion("Album Added Successfully!"); // Notify success

            // Clear the input field after submission
            inputRef.current.value = "";
        }
    }

    // Function to clear the input field
    const clearText = () => {
        inputRef.current.value = ""; // Reset the input field value to empty
    }

    return (
        <div className="newAlbum">
            <h2>Create an album</h2>
            <form onSubmit={handleSubmit}> {/* Attach handleSubmit to the form's onSubmit event */}
                <input type="text" placeholder="Album Name" ref={inputRef} /> {/* Input for album name */}
                <button onClick={clearText} className="clearInput">Clear</button> {/* Button to clear input */}
                <button type="submit" className="submit">Create</button> {/* Submit button to create album */}
            </form>
        </div>
    )
}