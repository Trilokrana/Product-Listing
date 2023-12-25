// src/App.js
import React, { useEffect, useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import './App.css';

const App = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedData, setSearchedData] = useState([]);
  const [isSearchBarClicked, setIsSearchBarClicked] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [hoveredProductId, setHoveredProductId] = useState(null);

  const getUsers = () => {
    fetch('https://fakestoreapi.com/products')
      .then((response) => response.json())
      .then((result) => setUsers(result));
  };

  useEffect(() => {
    // Fetch users on component mount
    getUsers();
  }, []);

  useEffect(() => {
    if (isSearchBarClicked) {
      if (searchQuery) {
        setSearchedData(
          users.filter((user) =>
            user.category.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      } else {
        setSearchedData(users);
      }
    }
  }, [searchQuery, users, isSearchBarClicked]);

  const handleSearchBarClick = () => {
    setIsSearchBarClicked(true);
    setSearchedData(users.sort(() => Math.random() - 0.5));
  };

  const handleHeartClick = (id) => {
    setWishlistItems((prevWishlist) => {
      if (prevWishlist.includes(id)) {
        return prevWishlist.filter((item) => item !== id);
      } else {
        return [...prevWishlist, id];
      }
    });
  };

  const trimText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className={`App ${isSearchBarClicked ? 'search-bar-clicked' : ''}`}>
      <input
        className="Search"
        type="text"
        name="name"
        placeholder="Search by Category....."
        onClick={handleSearchBarClick}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {isSearchBarClicked && (
        <div className="Card">
          {searchedData.map((product) => (
            <div
              className="card-inner"
              key={product.id}
              onMouseEnter={() => setHoveredProductId(product.id)}
              onMouseLeave={() => setHoveredProductId(null)}
            >
              <div className="card-header">
                <img className="card__img" src={product.image} alt="Product" />
                {hoveredProductId === product.id && (
                  <button className={`view-product-button`}>
                    View Product
                  </button>
                )}
              </div>
              <div className="card-body">
                <h2>{trimText(product.category, 15)}</h2>
                <p>{trimText(product.title, 50)}</p>
                <p>{trimText(product.description, 100)}</p>
              </div>
              <div className="card-footer">
                <p className="price">${product.price}</p>
                <button
                  className={`heart-icon ${wishlistItems.includes(product.id) ? 'heart-active' : ''
                    }`}
                  onClick={() => handleHeartClick(product.id)}
                >
                  <FaHeart />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
