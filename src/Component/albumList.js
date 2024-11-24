import React, { useEffect, useState } from "react";
import { db } from "../firebaseInit"; // Import the Firestore database instance
import { collection, onSnapshot } from "firebase/firestore"; // Import necessary Firestore functions

// AlbumsList component displays a list of albums and handles clicks on them
export const AlbumsList = ({ onAlbumClick }) => {
    const [albums, setAlbums] = useState([]); // State to hold the list of albums

    // useEffect to fetch albums from Firestore when the component mounts
    useEffect(() => {
        // Subscribe to the Firestore collection and listen for real-time updates
        const unsubscribe = onSnapshot(collection(db, "albumList"), (snapshot) => {
            // Map through the snapshot documents and extract data
            const albumData = snapshot.docs.map(doc => ({
                id: doc.id, // Get the document ID
                ...doc.data() // Spread the document data
            }));
            setAlbums(albumData); // Update the state with the fetched album data
        });

        // Cleanup function to unsubscribe from the listener when the component unmounts
        return () => unsubscribe();
    }, []); // Empty dependency array means this runs once on mount

    return (
        <div className="albumContainer">
            {/* Map through the albums and render each one */}
            {albums.map((album) => (
                <div key={album.id} className="albums" onClick={() => onAlbumClick(album)}>
                    <div className="album-icon">
                        {/* Placeholder image for the album icon */}
                        <img src="https://mellow-seahorse-fc9268.netlify.app/assets/photos.png" alt="albums" />
                    </div>
                    <span className="album-name">{album.name}</span> {/* Display the album name */}
                </div>
            ))}
        </div>
    )
}