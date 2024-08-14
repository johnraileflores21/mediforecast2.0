import React, { useState, useEffect } from "react";
import { IoIosArrowDropupCircle } from "react-icons/io";
import { FaArrowUp } from "react-icons/fa";

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    const handleScroll = () => {
        if (window.scrollY > 100) {
            // Adjust the scroll position as needed
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        isVisible && (
            <button
                onClick={() => window.scrollTo(0, 0)}
                className="!fixed end-5 bottom-5 bg-teal-700 hover:bg-teal-900 p-1 rounded-full shadow-lg hover:shadow-scroll-to-top transition-shadow duration-300"
            >
                <FaArrowUp className="w-7 h-7 text-white" />
            </button>
        )
    );
};

export default ScrollToTop;
