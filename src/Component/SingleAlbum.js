import React, { useState, useEffect } from "react";
import { doc, updateDoc, onSnapshot, getDoc, deleteDoc, arrayRemove } from "firebase/firestore";
import { db } from "../firebaseInit";
import { AddImage } from "./AddImage";
import { ImageViewer } from "./ImageViewer";

// SingleAlbum component displays the details and images of a specific album
export const SingleAlbum = ({ album, onBack, handleTaskCompletion }) => {
    const [images, setImages] = useState([]); // State to store the album images
    const [filteredImage, setFilteredImage] = useState([]); // State to store the filtered images based on search
    const [showAddImage, setShowAddImage] = useState(false); // State to show/hide the add image form

    const [updateImg, setUpdateImg] = useState({}); // State to store the image to be updated
    const [showEditForm, setShowEditForm] = useState(false); // State to show/hide the image edit form

    const [selectedImageIndex, setSelectedImageIndex] = useState(null); // State to store the index of the selected image for viewing

    const [searchQuery, setSearchQuery] = useState(""); // State to store the search query input
    const [isSearchVisible, setIsSearchVisible] = useState(false); // State to toggle search input visibility

    // useEffect to listen for changes in the album document and update the images array accordingly
    useEffect(() => {
        if (album?.id) {
            const albumRef = doc(db, "albumList", album.id);

            // Subscribe to album document to get real-time updates
            const unsubscribeAlbum = onSnapshot(albumRef, (docSnap) => {
                if (docSnap.exists()) {
                    const updatedAlbum = docSnap.data();
                    const updatedImages = updatedAlbum.images || [];

                    // Fetch the details (title and url) of each image in the album
                    const fetchImageDetails = async () => {
                        const imageDetails = [];

                        for (const imageId of updatedImages) {
                            const imageRef = doc(db, "imageList", imageId);
                            const imageSnap = await getDoc(imageRef);

                            if (imageSnap.exists()) {
                                const imageData = imageSnap.data();
                                imageDetails.push({
                                    id: imageSnap.id,
                                    title: imageData.title,  // Image title
                                    url: imageData.url,      // Image URL
                                });
                            }
                        }

                        // Update the images state with the fetched title and url
                        setImages(imageDetails);
                    };

                    fetchImageDetails();
                }
            });

            return () => {
                unsubscribeAlbum(); // Clean up the subscription when component unmounts or album changes
            };
        }
    }, [album?.id]);  // Dependency on album ID to fetch images when the album changes

    // Toggle visibility of the Add Image form, and hide the edit form if visible
    const handleShowAddImageClick = () => {
        if (showEditForm) {
            setShowEditForm(false);
        } else {
            setShowAddImage(!showAddImage);
            setShowEditForm(false);
        }
    };

    // Function to delete an image from the album and Firestore
    const deleteImage = async (image) => {
        const albumRef = doc(db, "albumList", album.id);
        const imageRef = doc(db, "imageList", image.id);

        // Remove the image ID from the album's images array in Firestore
        await updateDoc(albumRef, {
            images: arrayRemove(image.id),
        });

        // Delete the image document from the imageList collection
        await deleteDoc(imageRef);
        handleTaskCompletion("Image Deleted SuccessFully"); // Notify the parent of the successful deletion
    };

    // Function to show the edit form for a specific image
    const updateImage = async (image) => {
        setUpdateImg(image); // Set the image to be updated
        setShowEditForm(true); // Show the edit form
    };

    // Function to handle clicking on an image to view it in a larger viewer
    const handleImageClick = (index) => {
        setSelectedImageIndex(index); // Set the index of the selected image
    };

    // Close the image viewer
    const closeImageViewer = () => {
        setSelectedImageIndex(null); // Reset the selected image index
    };

    // Show the next image in the image viewer
    const showNextImage = () => {
        setSelectedImageIndex((prevIndex) => (prevIndex + 1) % images.length); // Cycle to the next image
    };

    // Show the previous image in the image viewer
    const shoePrevImage = () => {
        setSelectedImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length); // Cycle to the previous image
    };

    // Toggle the search input visibility
    const toggleSearchInput = () => {
        setIsSearchVisible(!isSearchVisible);
        setSearchQuery(""); // Clear the search query when toggling
        setFilteredImage([]); // Reset filtered images
    };

    // Function to handle the search query and filter images based on the title
    const handleSearch = (e) => {
        const query = e.target.value.trim(); // Get the trimmed query input
        setSearchQuery(query); // Update the search query state

        // Filter images by title based on the search query
        if (query) {
            const filter = images.filter((img) => img.title.toLowerCase().includes(query.toLowerCase()));
            setFilteredImage(filter); // Set the filtered images state
        }else{
            setFilteredImage([])
        }
    };

    return (
        <div className="singleAlbum">
            {/* Album details header */}
            <div className="albumDetail">
                <button onClick={onBack} className="backButton">
                    {/* Back button to navigate to the previous screen */}
                    <img src="https://mellow-seahorse-fc9268.netlify.app/assets/back.png" alt="back" />
                </button>
                <h2>Images in {album.name}</h2>
                <div className="search">
                    <div className="searchInput">
                        {isSearchVisible && ( // Conditionally render the search input based on visibility
                            <input
                                type="text"
                                placeholder="Search images..."
                                value={searchQuery}
                                onChange={handleSearch} // Handle search query change
                            />
                        )}
                    </div>
                    <div className="searchIcon">
                        {/* Search icon */}
                        {images.length === 0 ? "" : <img src={isSearchVisible ? "https://icon2.cleanpng.com/20180425/eow/avtp9nu3q.webp" : "https://www.iconpacks.net/icons/2/free-search-icon-2911-thumb.png"} alt="search" onClick={toggleSearchInput} />}
                        <button
                            className={showAddImage || showEditForm ? "cancleImage" : "addImage"} // Toggle button class for Add Image or Cancel
                            onClick={handleShowAddImageClick}
                        >
                            {showAddImage || showEditForm ? "Cancel" : "Add Image"}
                        </button>
                    </div>
                </div>
            </div>
    
            {/* Add or Edit Image form */}
            {showAddImage && <AddImage album={album} setShowAddImage={setShowAddImage} handleTaskCompletion={handleTaskCompletion} />}
            {showEditForm && <AddImage updateImg={updateImg} setShowEditForm={setShowEditForm} setImages={setImages} album={album} handleTaskCompletion={handleTaskCompletion} />}
    
            {/* Image list display */}
            <div className="imagesContainer">
                {images.length === 0 ? (
                    <h1>No images found in the album.</h1> // Message when no images exist
                ) : !searchQuery && filteredImage.length === 0 ? (
                    // If no filter is applied, display all images
                    images.map((img, idx) => (
                        <div className="imageDetail" key={idx} onClick={() => handleImageClick(idx)}>
                            <div className="updateImage">
                                {/* Edit and Delete options */}
                                <img src="https://mellow-seahorse-fc9268.netlify.app/assets/edit.png" alt="update" onClick={(event) => {
                                    event.stopPropagation(); // Prevent event bubbling
                                    updateImage(img); // Trigger the update image function
                                }} />
                                <img
                                    src="https://mellow-seahorse-fc9268.netlify.app/assets/trash-bin.png"
                                    alt="delete"
                                    onClick={(event) => {
                                        event.stopPropagation(); // Prevent event bubbling
                                        deleteImage(img); // Trigger the delete image function
                                    }}
                                />
                            </div>
                            <img src={img.url} alt={`Album ${album.name}`} />
                            <span>{img.title}</span>
                        </div>
                    ))
                ) : (
                    // If search filter is applied, display filtered images
                    filteredImage.map((img, idx) => (
                        <div className="imageDetail" key={idx} onClick={() => handleImageClick(idx)}>
                            <div className="updateImage">
                                <img src="https://mellow-seahorse-fc9268.netlify.app/assets/edit.png" alt="update" onClick={() => updateImage(img)} />
                                <img
                                    src="https://mellow-seahorse-fc9268.netlify.app/assets/trash-bin.png"
                                    alt="delete"
                                    onClick={() => deleteImage(img)}
                                />
                            </div>
                            <img src={img.url} alt={`Album ${album.name}`} />
                            <span>{img.title}</span>
                        </div>
                    ))
                )}
            </div>
    
            {/* Overlay for the image viewer when an image is clicked */}
            {selectedImageIndex !== null && <div className="overlay" />}
    
            {/* ImageViewer component for displaying and navigating through the image */}
            {selectedImageIndex !== null && (
                <ImageViewer
                    images={images}  // Pass the list of images
                    currentIndex={selectedImageIndex}  // Pass the current image index
                    onClose={closeImageViewer}  // Callback to close the viewer
                    onNext={showNextImage}  // Callback to go to the next image
                    onPrev={shoePrevImage}  // Callback to go to the previous image
                />
            )}
        </div>
    );
    
};
