import React, { useEffect, useState } from "react"; // Import React and necessary hooks

// Notification component displays a message with a progress bar for a specified duration
export const Notification = ({ message, duration = 5000 }) => {
    const [visible, setVisible] = useState(false); // State to manage the visibility of the notification
    const [progress, setProgress] = useState(100); // State to manage the progress of the progress bar

    useEffect(() => {
        setVisible(true); // Set the notification to visible when the component mounts

        let timer = duration; // Store the duration for later use

        // Set up an interval to update the progress bar
        const interval = setInterval(() => {
            setProgress((prevProgress) => {
                // Calculate the new progress value
                const newProgress = prevProgress - (100 / duration) * 1000; // Decrease progress based on duration

                return newProgress > 0 ? newProgress : 0; // Ensure progress does not go below 0
            });
        }, 1000); // Update progress every second

        // Set a timeout to hide the notification after the specified duration
        setTimeout(() => {
            clearInterval(interval); // Clear the interval to stop updating progress
            setVisible(false); // Hide the notification
        }, duration);

        // Cleanup function to clear the timeout if the component unmounts
        return () => clearTimeout(timer);
    }, [duration]); // Effect runs when duration changes

    return (
        <div className={`popup ${visible ? 'popup-visible' : ""}`}> {/* Conditional class for visibility */}
            <div className="popup-message">{message}</div> {/* Display the notification message */}
            <div className="popup-progress-bar"> {/* Container for the progress bar */}
                <div className="popup-progress" style={{ width: `${progress}%` }}></div> {/* Progress bar width based on progress state */}
            </div>
        </div>
    );
}