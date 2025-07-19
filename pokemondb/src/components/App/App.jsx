import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Header from "../Header/Header";
import Home from "../Main/Main";
import Profile from "../Profile/Profile";
import LoginModal from "../LoginModal/LoginModal";
import RegisterModal from "../RegisterModal/RegisterModal";
import ConfirmModal from "../ReleaseModal/ReleaseModal";
import SaveModal from "../SaveModal/SaveModal";
import Footer from "../Footer/Footer";
import { fetchPokemonByName, getPokemonSpecies } from "../../utils/api";
import { fetchEvolutionChain } from "../../utils/api";
import { fetchPokemonWeaknesses } from "../../utils/api";
import { fetchPokemonStrengths } from "../../utils/api";
import { fetchAllPokemonNames } from "../../utils/api";
import { getPokemonData } from "../../utils/api";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import auth from "../../utils/auth";
import * as signup from "../../utils/signup";

import "./App.css";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [allPokemonNames, setAllPokemonNames] = useState([]);
  const [pokedexList, setPokedexList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [pokemon, setPokemon] = useState(null);
  const [pokemonData, setPokemonData] = useState(null);
  const [species, setSpecies] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeModal, setActiveModal] = useState("");
  const [lastSearch, setLastSearch] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [showEvolution, setShowEvolution] = useState(false);
  const [evolutionChain, setEvolutionChain] = useState([]);
  const [showAbilities, setShowAbilities] = useState(false);
  const [weaknesses, setWeaknesses] = useState([]);
  const [strengths, setStrengths] = useState([]);
  const [showShiny, setShowShiny] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showReleaseAllModal, setShowReleaseAllModal] = useState(false);
  const [scrollKey, setScrollKey] = useState(0);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [values, setValues] = useState({ email: "", password: "", name: "" });
  const [errors, setErrors] = useState({});

  const resetRegisterForm = () => {
    setValues({ email: "", password: "", name: "" });
  };

  const validateUserInput = ({ email, password }) => {
    const isEmailValid = email.includes("@");
    const isPasswordValid = password.length >= 2;
    setIsValid(isEmailValid && isPasswordValid);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
      if (pathname !== "/") {
        window.scrollTo(0, 0);
      }
    }, [pathname]);

    return null;
  }

  const resultsRef = useRef(null);

  useEffect(() => {
    if (shouldScroll && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
      setShouldScroll(false); // reset scroll flag
    }
  }, [shouldScroll]);

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevName = pokedexList[currentIndex - 1];
      setCurrentIndex(currentIndex - 1);
      handleSearch(prevName);
      setShouldScroll(true);
    }
  };

  const handleNext = () => {
    if (currentIndex < pokedexList.length - 1) {
      const nextName = pokedexList[currentIndex + 1];
      setCurrentIndex(currentIndex + 1);
      handleSearch(nextName);
      setShouldScroll(true);
    }
  };

  useEffect(() => {
    const getNames = async () => {
      const names = await fetchAllPokemonNames();
      setAllPokemonNames(names);
    };
    getNames();
  }, []);

  useEffect(() => {
    const fetchAllPokemonNames = async () => {
      try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1010");
        const data = await res.json();
        const names = data.results.map((p) => p.name.toLowerCase());
        setPokedexList(names);
      } catch (err) {
        console.error("Error fetching Pokédex list:", err);
      }
    };

    fetchAllPokemonNames();
  }, []);

  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      setLastSearch("");
      setPokemon(null);
      setHasSearched(false);
    }
  }, [location.pathname]);

  const handleInputChange = (value) => {
    setSearchTerm(value);
    if (value.trim() === "") {
      setSuggestions([]);
      return;
    }
    const filtered = allPokemonNames.filter((name) =>
      name.toLowerCase().startsWith(value.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 8));
  };

  const handleSearch = async (input) => {
    let searchTerm;
    let shouldResetInput = false;

    if (typeof input === "string") {
      searchTerm = input;
    } else {
      input.preventDefault();
      searchTerm = query;
      shouldResetInput = true;
    }

    if (!searchTerm) return;

    setShowEvolution(false);
    setEvolutionChain([]);
    setShowAbilities(false);
    setWeaknesses([]);
    setStrengths([]);
    setLoading(true);
    setLastSearch(searchTerm);
    setHasSearched(true);
    setSearchTerm("");

    try {
      const result = await fetchPokemonByName(searchTerm);
      setPokemon(result);
      setScrollKey((prev) => prev + 1);
      setQuery(searchTerm);

      const weaknessData = await fetchPokemonWeaknesses(searchTerm);
      setWeaknesses(weaknessData);

      const strengthData = await fetchPokemonStrengths(searchTerm);
      setStrengths(strengthData);
      setShouldScroll(true);
    } catch (error) {
      console.error("Search failed:", error);
      setPokemon(null);
      setWeaknesses([]);
      setStrengths([]);
    } finally {
      setLoading(false);
      if (shouldResetInput) {
        setQuery("");
      }
    }
  };

  useEffect(() => {
    if (pokemon?.name && pokedexList.length > 0) {
      const index = pokedexList.indexOf(pokemon.name.toLowerCase());
      setCurrentIndex(index !== -1 ? index : null);
    }
  }, [pokemon, pokedexList]);

  const pokemonName = pokemon?.name || "";

  useEffect(() => {
    getPokemonData(pokemonName).then((data) => {
      if (data) setPokemonData(data);
    });
  }, [pokemonName]);

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const result = await getPokemonSpecies(pokemonName);
        setSpecies(result);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSpecies();
  }, [pokemonName]);

  const handleShowEvolution = async () => {
    if (!pokemon) return;

    if (showEvolution) {
      setShowEvolution(false);
      return;
    }
    try {
      const evoChain = await fetchEvolutionChain(pokemon.name);
      setEvolutionChain(evoChain);
      setShowEvolution(true);
    } catch {
      setEvolutionChain([]);
      setShowEvolution(false);
    }
  };

  const handleSavePokemon = async (pokemonToSave) => {
    if (!currentUser || !pokemonToSave?.name) return;

    const simplifiedData = {
      name: pokemonToSave.name,
      image: pokemonToSave.sprites?.front_default || pokemonToSave.imageNormal,
      description: pokemonToSave.description || "No description available.",
      isLegendary: pokemonToSave.isLegendary || false,
      isMythical: pokemonToSave.isMythical || false,
    };
    try {
      const token = localStorage.getItem("jwt");
      const result = await signup.addPokemonCard(simplifiedData, token);

      const updatedCards = await signup.getMyPokemonCards(token);
      setFavorites(updatedCards);
      setShowSaveModal(true);
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save Pokémon.");
    }
  };

  const handleRelease = (cardId) => {
    console.log("Releasing card ID:", cardId);
    const token = localStorage.getItem("jwt");
    signup
      .deletePokemonCard(cardId, token)
      .then(() => {
        setFavorites((prev) => prev.filter((card) => card._id !== cardId));
      })
      .catch((err) => console.error("Failed to delete Pokémon:", err));
  };

  const handleReleaseAll = () => {
    const token = localStorage.getItem("jwt");
    Promise.all(
      favorites.map((card) => signup.deletePokemonCard(card._id, token))
    )
      .then(() => {
        setFavorites([]);
        setShowReleaseAllModal(false);
      })
      .catch((err) => {
        console.error("Failed to release all Pokémon:", err);
        alert("Something went wrong while releasing all Pokémon.");
      });
  };

  const suggestionRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target)
      ) {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setSuggestions]);

  const navigate = useNavigate();
  const handleLogin = ({ email, password }) => {
    auth
      .login({ email, password })
      .then((data) => {
        localStorage.setItem("jwt", data.token);
        setIsLoggedIn(true);
        fetchUserProfile(data.token);

        signup
          .getMyPokemonCards(data.token)
          .then((savedCards) => setFavorites(savedCards))
          .catch((err) => console.error("Failed to load Pokémon:", err));

        setPasswordError("");
        closeAllModals();
        navigate("/profile");
      })
      .catch((err) => {
        console.error("Login failed:", err);
        setPasswordError("Incorrect password");
      });
  };

  const fetchUserProfile = (token) => {
    signup
      .getUserInfo(token)
      .then((user) => setCurrentUser(user))
      .catch((err) => console.error("Failed to fetch profile:", err));
  };

  const loadSavedCards = (token) => {
    signup
      .getMyPokemonCards(token)
      .then((cards) => setFavorites(cards))
      .catch((err) => console.error("Failed to load Pokémon:", err));
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    auth
      .checkToken(token)
      .then((user) => {
        setIsLoggedIn(true);
        setCurrentUser(user);
        loadSavedCards(token);
      })
      .catch((err) => {
        console.error("Token invalid or expired:", err);
        localStorage.removeItem("jwt");
        setIsLoggedIn(false);
        setCurrentUser(null);
      });
  }, []);

  const handleRegister = ({ name, email, password }) => {
    auth
      .register({ name, email, password })
      .then((user) => {
        setCurrentUser(user);
        resetRegisterForm();
        return auth.login({ email, password });
      })
      .then((data) => {
        localStorage.setItem("jwt", data.token);
        setIsLoggedIn(true);
        closeAllModals();
        navigate("/profile");
      })
      .catch((err) => {
        console.error("Registration failed:", err);
      });
  };

  const handleSignOut = () => {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    setCurrentUser(null);
    setFavorites([]);
    navigate("/");
  };

  const closeAllModals = () => setActiveModal("");
  const handleLoginClick = () => setActiveModal("login");
  const handleSignUpClick = () => setActiveModal("register");

  return (
    <>
      <ScrollToTop />
      <div className="page">
        <div className="page__content page__content_type_profile">
          <Header
            onLoginClick={handleLoginClick}
            onSignupClick={handleSignUpClick}
            onSignOut={handleSignOut}
            isLoggedIn={isLoggedIn}
            currentUser={currentUser}
          />

          <main>
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    query={query}
                    setQuery={setQuery}
                    pokemon={pokemon}
                    loading={loading}
                    showShiny={showShiny}
                    setShowShiny={setShowShiny}
                    handleSearch={handleSearch}
                    evolutionChain={evolutionChain}
                    showEvolution={showEvolution}
                    handleShowEvolution={handleShowEvolution}
                    showAbilities={showAbilities}
                    setShowAbilities={setShowAbilities}
                    weaknesses={weaknesses}
                    strengths={strengths}
                    pokemonData={pokemonData}
                    species={species}
                    currentIndex={currentIndex}
                    setCurrentIndex={setCurrentIndex}
                    pokedexList={pokedexList}
                    handleSave={handleSavePokemon}
                    currentUser={currentUser}
                    lastSearch={lastSearch}
                    searchTerm={searchTerm}
                    handleInputChange={handleInputChange}
                    suggestions={suggestions}
                    setSuggestions={setSuggestions}
                    suggestionRef={suggestionRef}
                    scrollKey={scrollKey}
                    setScrollKey={setScrollKey}
                    handleNext={handleNext}
                    handlePrev={handlePrev}
                    resultsRef={resultsRef}
                    highlightedIndex={highlightedIndex}
                    setHighlightedIndex={setHighlightedIndex}
                    shouldScroll={shouldScroll}
                    setShouldScroll={setShouldScroll}
                    hasMounted={hasMounted}
                    setHasMounted={setHasMounted}
                  />
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <Profile
                      currentUser={currentUser}
                      isLoggedIn={isLoggedIn}
                      favorites={favorites}
                      setFavorites={setFavorites}
                      showConfirmModal={showConfirmModal}
                      selectedPokemon={selectedPokemon}
                      setShowConfirmModal={setShowConfirmModal}
                      setSelectedPokemon={setSelectedPokemon}
                      showReleaseAllModal={showReleaseAllModal}
                      setShowReleaseAllModal={setShowReleaseAllModal}
                      handleReleaseAll={handleReleaseAll}
                    />
                  </ProtectedRoute>
                }
              />
            </Routes>

            <RegisterModal
              isOpen={activeModal === "register"}
              onClose={closeAllModals}
              onRegister={handleRegister}
              onLoginClick={handleLoginClick}
              setCurrentUser={setCurrentUser}
              setIsLoggedIn={setIsLoggedIn}
              isValid={isValid}
              setIsValid={setIsValid}
              validateUserInput={validateUserInput}
              values={values}
              setValues={setValues}
              errors={errors}
              setErrors={setErrors}
            />
            <LoginModal
              isOpen={activeModal === "login"}
              onClose={closeAllModals}
              onLogin={handleLogin}
              passwordError={passwordError}
              setPasswordError={setPasswordError}
              onSignupClick={handleSignUpClick}
            />

            <ConfirmModal
              isOpen={showConfirmModal}
              onClose={() => setShowConfirmModal(false)}
              onConfirm={() => {
                handleRelease(selectedPokemon._id);
                setShowConfirmModal(false);
              }}
              message={`Are you sure you want to release ${selectedPokemon?.name}?`}
            />

            <SaveModal
              isOpen={showSaveModal}
              onClose={() => setShowSaveModal(false)}
            />
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default App;
