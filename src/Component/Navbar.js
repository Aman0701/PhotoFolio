import React from "react"; // Import React

// Navbar component displays the navigation bar for the application
export const Navbar = () => {
    return (
        <div className="nav"> {/* Container for the navigation bar */}
            <a href="/"> {/* Link that redirects to the home page */}
                <img 
                    src="https://mellow-seahorse-fc9268.netlify.app/assets/logo.png" // Source of the logo image
                    alt="icon" // Alt text for the logo image
                />
                <h2> PhotoFolio</h2> {/* Title of the application */}
            </a>
        </div>
    )
}