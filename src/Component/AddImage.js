import React, { useRef, useEffect } from "react";
import { addDoc, collection, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebaseInit";

// The AddImage component allows users to add or update images in an album
export const AddImage = ({ album = null, updateImg = null, setShowAddImage, setShowEditForm, setImages, handleTaskCompletion }) => {
    // Create refs for title and URL input fields
    const titleRef = useRef();
    const urlRef = useRef();

    // Effect to populate the input fields if an image is being updated
    useEffect(() => {
        if (updateImg) {
            titleRef.current.value = updateImg.title || ""; // Set title input to existing title
            urlRef.current.value = updateImg.url || ""; // Set URL input to existing URL
        } else {
            titleRef.current.value = ""; // Clear title input
            urlRef.current.value = ""; // Clear URL input
        }
    }, [updateImg]); // Dependency array: runs when updateImg changes

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        const titleValue = titleRef.current.value.trim(); // Get trimmed title value
        const urlValue = urlRef.current.value.trim(); // Get trimmed URL value

        // Proceed only if both title and URL are provided
        if (titleValue && urlValue) {
            if (!updateImg) {
                // If not updating, add a new image document
                const imageDocRef = await addDoc(collection(db, "imageList"), {
                    title: titleValue,
                    url: urlValue
                });

                // Reference to the album document
                const albumRef = doc(db, 'albumList', album.id);

                // Update the album document to include the new image ID
                await updateDoc(albumRef, {
                    images: arrayUnion(imageDocRef.id) // Add new image ID to the images array
                });

                // Clear input fields and close the add image form
                titleRef.current.value = "";
                urlRef.current.value = "";
                setShowAddImage(false);
                handleTaskCompletion("Image Added Successfully!"); // Notify success
            } else {
                // If updating an existing image
                const imageRef = doc(db, "imageList", updateImg.id);
                await updateDoc(imageRef, {
                    title: titleValue,
                    url: urlValue,
                });

                // Reference to the album document
                const albumRef = doc(db, 'albumList', album.id);
                console.log(updateImg.id); // Log the ID of the updated image

                // Update the album document to include the updated image ID
                await updateDoc(albumRef, {
                    images: arrayUnion(updateImg.id) // Ensure the updated image ID is still in the images array
                });

                // Update the local images state to reflect the changes
                setImages(prevImages =>
                    prevImages.map(image =>
                        image.id === updateImg.id
                            ? { ...image, title: titleValue, url: urlValue } // Update the specific image
                            : image
                    )
                );

                // Clear input fields and close the edit form
                titleRef.current.value = "";
                urlRef.current.value = "";
                setShowEditForm(false);
                handleTaskCompletion("Image Updated Successfully!"); // Notify success
            }
        }
    }

    // Function to clear the input fields
    const clearInput = () => {
        titleRef.current.value = ""; // Clear title input
        urlRef.current.value = ""; // Clear URL input
    }

    return (
        <div className="newImage">
            <h1>{updateImg ? 'Update image' : "Add image to"} {updateImg ? updateImg.title : album.name}</h1>
            <input type="text" placeholder="Title" ref={titleRef} />
            <input type="text" placeholder="Image URL" ref={urlRef} />
            <button className="clearInput" onClick={clearInput}>Clear</button>
            <button onClick={handleSubmit} className="submit">{!updateImg ? "Add" : "Update"}</button>
        </div>
    )
}