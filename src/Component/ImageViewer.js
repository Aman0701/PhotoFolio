import React, { useState, useEffect } from "react"; // Import React and necessary hooks

// ImageViewer component displays an image and allows navigation between images
export const ImageViewer = ({ images, currentIndex, onClose, onNext, onPrev }) => {
    const [index, setIndex] = useState(currentIndex); // State to track the current image index
    const [isSliding, setIsSliding] = useState(false); // State to manage sliding animation
    const [slideDirection, setSlideDirection] = useState(""); // State to track the direction of the slide

    // Effect to update the index when currentIndex prop changes
    useEffect(() => {
        setIndex(currentIndex); // Update local index state
    }, [currentIndex]);

    // Function to handle the next image navigation
    const handleNext = () => {
        setSlideDirection("next"); // Set the slide direction to 'next'
        setIsSliding(true); // Trigger sliding animation
        onNext(); // Call the onNext function passed as a prop
        setTimeout(() => {
            setIsSliding(false); // Reset sliding state after animation duration
        }, 400); // Match with CSS animation duration
    };

    // Function to handle the previous image navigation
    const handlePrev = () => {
        setSlideDirection("prev"); // Set the slide direction to 'prev'
        setIsSliding(true); // Trigger sliding animation
        onPrev(); // Call the onPrev function passed as a prop
        setTimeout(() => {
            setIsSliding(false); // Reset sliding state after animation duration
        }, 400); // Match with CSS animation duration
    };

    return (
        <div className="imageViewer">
            {/* Button to close the image viewer */}
            <button className="closeButton" onClick={onClose}>{"x"}</button>
            <div className="imageContainer">
                {/* Button to navigate to the previous image */}
                <button onClick={handlePrev} className="navButton">{"<"}</button>
                
                {/* Wrapper for the image with sliding animation */}
                <div className={`imageWrapper ${isSliding ? slideDirection : ""}`}>
                    <img
                        src={images[index].url} // Source of the current image
                        alt={images[index].title} // Alt text for the current image
                        className="image"
                    />
                </div>
                
                {/* Button to navigate to the next image */}
                <button onClick={handleNext} className="navButton">{">"}</button>
            </div>
        </div>
    );
};