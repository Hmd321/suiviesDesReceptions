import React from 'react';

const SearchBar = ({ onSearch }) => {
    const handleSearch = (e) => {
        const value = e.target.value;
        onSearch(value); // Trigger the search function passed as a prop
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Search by code, designation..."
                onChange={handleSearch}
            />
        </div>
    );
};

export default SearchBar;
