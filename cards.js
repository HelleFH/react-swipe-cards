import React, { useState, useMemo, useRef, useEffect } from 'react';
import SwipeCard from '../react-swipe-card';
import profiles from '../profiles';
import { FaTimes, FaHeart, FaUndo, FaStar, FaInfoCircle } from 'react-icons/fa';

function FindMatches() {
  // Store favorited profiles
  const [favoritedProfiles, setFavoritedProfiles] = useState([]);
  const [showFavoriteMessage, setShowFavoriteMessage] = useState(false);
  const [showSwipedMessage, setShowSwipedMessage] = useState(false);

  // Load favorited profiles from local storage
  useEffect(() => {
    const storedFavoritedProfiles = JSON.parse(localStorage.getItem('favoritedProfiles'));
    if (storedFavoritedProfiles) {
      setFavoritedProfiles(storedFavoritedProfiles);
    }
  }, []);

  // Function to add a profile to favorites
  const handleFavoriteClick = (profileToFavorite) => {
    if (favoritedProfiles.some((profile) => profile.name === profileToFavorite.name)) {
      setShowFavoriteMessage('Already in favorites');
    } else {
      setFavoritedProfiles([...favoritedProfiles, profileToFavorite]);
      setShowFavoriteMessage('Added to favorites');
    }

    setTimeout(() => {
      setShowFavoriteMessage('');
    }, 1000);
  };


  useEffect(() => {
    localStorage.setItem('favoritedProfiles', JSON.stringify(favoritedProfiles));
  }, [favoritedProfiles]);

  const [currentIndex, setCurrentIndex] = useState(profiles.length - 1);
  const [lastDirection, setLastDirection] = useState();
  const currentIndexRef = useRef(currentIndex);

  const childRefs = useMemo(
    () =>
      Array(profiles.length)
        .fill(0)
        .map((i) => React.createRef()),
    []
  );

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < profiles.length - 1;
  const canSwipe = currentIndex >= 0;

  const swiped = (direction, _nameToDelete, index) => {
    setLastDirection(direction);
    updateCurrentIndex(index - 1);
    setShowSwipedMessage(true);

    setTimeout(() => {
      setShowSwipedMessage(false);
    }, 1000);
  };

  // Function called when a card goes out of the card container
  const outOfFrame = (_name, idx) => {
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard();
  };

  // Function to swipe a card
  const swipe = async (dir) => {
    if (canSwipe && currentIndex < profiles.length) {
      await childRefs[currentIndex].current.swipe(dir);
    }
  };

  // Function to go back to the previous card
  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    await childRefs[newIndex].current.restoreCard();
  };

    
    const handleViewProfileClick = (profile) => {
      // Store the selected profile temporarily in state
      setSelectedProfile(profile);
      // Store the selected profile in localStorage
      localStorage.setItem("selectedProfile", JSON.stringify(profile));
    };
    
 
    
    useEffect(() => {
      // Retrieve the selected profile from localStorage on initial load
      const storedProfileString = localStorage.getItem("selectedProfile");
      if (storedProfileString) {
        const storedProfile = JSON.parse(storedProfileString);
        setStoredProfile(storedProfile);
        setSelectedProfile(storedProfile); // Set the selected profile from localStorage
      }
    }, []);

  return (


    <div className="find-matches-content">

      <h2>Swipe left or right or add to your favorites!</h2>
      {showFavoriteMessage && (
        <h3 className="infoText"></h3>
      )}
      {showFavoriteMessage && (
        <h3 className="infoText">{showFavoriteMessage}</h3>
      )}

      {showSwipedMessage ? (
        <h3 className="infoText">You swiped {lastDirection}</h3>
      ) : (
        <h3 className="infoText"></h3>
      )}

      

      <div className="card-container">
        {profiles.map((character, index) => (

          <SwipeCard
            ref={childRefs[index]}
            className="swipe"
            key={character.name}
            onSwipe={(dir) => swiped(dir, character.name, index)}
            onCardLeftScreen={() => outOfFrame(character.name, index)}
          >
            <div className="card">
              <div className='card-image-container '> <img src={character.image} draggable="false" alt={`${character.name}'s profile`} />
                <div className="card-information">
                  <p>
                    {character.name}, {character.age}
                  </p>

                  <p>
                    {character.occupation}, {character.location}
                  </p>
             <div className="info-button">
  <a href="#" onClick={(event) => { 
    event.preventDefault();
  }}>
    <FaInfoCircle />
  </a>
</div>
                </div>
              </div>
              <div className="card-buttons">
                <a onClick={(e) => { e.preventDefault(); swipe('left') }}>
                  <FaTimes />
                </a>
                <a onClick={() => goBack()}>
                  <FaUndo />
                </a>
                <a onClick={() => handleFavoriteClick(character)}>
                  <FaStar />
                </a>
                <a href="#" onClick={(e) => { e.preventDefault(); swipe('right') }}>
                  <FaHeart />
                </a>


              </div>
            </div>
          </SwipeCard>
        ))}
      </div>
    </div>
  );
}

export default FindMatches;
