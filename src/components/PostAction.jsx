// PostActions.js
import React, { useState, useRef, useEffect } from 'react';
import { FaEllipsisV, FaTrash, FaEdit, FaLink } from 'react-icons/fa';

function PostActions({ isAuthor, onDelete, onEdit, onShare }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleAction = (action) => {
        setIsMenuOpen(false);
        action();
    };

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={toggleMenu} className="focus:outline-none">
                <FaEllipsisV className="h-5 w-5 text-gray-500" />
            </button>
            {isMenuOpen && (
                <div className="absolute right-3 bottom-8 mt-2 w-40 bg-white dark:bg-grey-10 dark:text-white text-black rounded-md shadow-lg z-10 overflow-hidden">
                    <button 
                        onClick={() => handleAction(onShare)} 
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-grey-5 flex items-center"
                    >
                        <FaLink className="mr-2" /> Share
                    </button>
                    {isAuthor && (
                        <>
                            <button 
                                onClick={() => handleAction(onEdit)} 
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-grey-5 flex items-center"
                            >
                                <FaEdit className="mr-2" /> Edit Post
                            </button>
                            <button 
                                onClick={() => handleAction(onDelete)} 
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-grey-5 flex items-center text-red-500"
                            >
                                <FaTrash className="mr-2" /> Delete Post
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default PostActions;