import React, { useState, useRef, useEffect } from 'react';
import { PostFeed } from '../components';
import './Feed.css';
import { BiChevronRight, BiChevronLeft } from 'react-icons/bi';

function Feed() {
    const [category, setCategory] = useState('All');
    const [showLeftButton, setShowLeftButton] = useState(false);
    const [showRightButton, setShowRightButton] = useState(false);
    const scrollContainerRef = useRef(null);

    const categories = [
        { name: 'All', value: 'All' },
        { name: 'Technology', value: 'Technology' },
        { name: 'Health and Wellness', value: 'Health and Wellness' },
        { name: 'Entertainment', value: 'Entertainment' },
        { name: 'Education', value: 'Education' },
        { name: 'Travel', value: 'Travel' },
        { name: 'Sports', value: 'Sports' },
        { name: 'Food', value: 'Food' },
        { name: 'Fashion', value: 'Fashion' },
        { name: 'Business and Finance', value: 'Business and Finance' }
    ];

    const handleScrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft += 300;
        }
    };

    const handleScrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft -= 300;
        }
    };

    const checkScrollPosition = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setShowLeftButton(scrollLeft > 0);
            setShowRightButton(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 1);
        }
    };

    useEffect(() => {
        checkScrollPosition();
        
        const handleResize = () => {
            checkScrollPosition();
        };

        if (scrollContainerRef.current) {
            scrollContainerRef.current.addEventListener('scroll', checkScrollPosition);
        }
        window.addEventListener('resize', handleResize);

        return () => {
            if (scrollContainerRef.current) {
                scrollContainerRef.current.removeEventListener('scroll', checkScrollPosition);
            }
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <>
            <div className={`relative px-4 max-w-[600px] mx-auto mt-4 -mb-4`}>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide" ref={scrollContainerRef}>
                    {categories.map(cat => (
                        <button
                            key={cat.value}
                            onClick={() => setCategory(cat.value)}
                            className={`px-2 text-sm sm:text-base py-1 rounded-md whitespace-nowrap ${
                                category === cat.value 
                                    ? "bg-black text-white dark:bg-white dark:text-black" 
                                    : "text-black dark:text-white bg-grey-90 dark:bg-grey-25 hover:bg-grey-75 dark:hover:bg-grey-45"
                            }`}>
                            {cat.name}
                        </button>
                    ))}
                </div>
                {showLeftButton && (
                    <div className="absolute left-4 top-0 h-full pr-5 bg-gradient-to-r from-60% from-white dark:from-black">
                        <button
                            onClick={handleScrollLeft}
                            className="px-2 py-2 text-black dark:text-white rounded-full hover:bg-grey-75 dark:hover:bg-grey-45 ">
                            <BiChevronLeft />
                        </button>
                    </div>
                )}
                {showRightButton && (
                    <div className="absolute right-4 top-0 h-full pl-5 bg-gradient-to-l from-60% from-[#fffcff] dark:from-[#000300]">
                        <button
                            onClick={handleScrollRight}
                            className="px-2 py-2 text-black dark:text-white rounded-full hover:bg-grey-75 dark:hover:bg-grey-45 ">
                            <BiChevronRight />
                        </button>
                    </div>
                )}
            </div>
            <PostFeed category={category === 'All' ? null : category} />
        </>
    );
}

export default Feed;