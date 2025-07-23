import "./main.css";
import notFoundIcon from "../../images/not-found.svg";
import Preloader from "../Preloader/Preloader";
import SearchForm from "../SearchForm/SearchForm";

const Home = ({
  pokemon,
  loading,
  showShiny,
  setShowShiny,
  handleSearch,
  evolutionChain,
  showEvolution,
  handleShowEvolution,
  weaknesses = [],
  strengths = [],
  pokemonData,
  species,
  currentIndex,
  pokedexList,
  handleSave,
  currentUser,
  lastSearch,
  searchTerm,
  handleInputChange,
  suggestions,
  setSuggestions,
  suggestionRef,
  handleNext,
  handlePrev,
  resultsRef,
  highlightedIndex,
  setHighlightedIndex,
  shouldScroll,
  setShouldScroll,
  hasMounted,
  setHasMounted,
}) => {
  return (
    <main className="home">
      <div className="home__intro">
        <h1 className="home__welcome">
          <span className="home__welcome-to">Welcome to </span>
          <div className="home__container-main">
            <span className="home__bungee">POKÉMON</span>
            <span className="home__db">DB</span>
          </div>
        </h1>
        <p className="home__description">
          Explore your favorite Pokémon with ease!
        </p>
        <SearchForm
          searchTerm={searchTerm}
          handleInputChange={handleInputChange}
          handleSearch={handleSearch}
          suggestions={suggestions}
          setSuggestions={setSuggestions}
          suggestionRef={suggestionRef}
          highlightedIndex={highlightedIndex}
          setHighlightedIndex={setHighlightedIndex}
        />
      </div>
      <section className="home__results" ref={resultsRef}>
        {loading && <Preloader />}

        {!loading && !pokemon && lastSearch.trim() !== "" && (
          <div className="not-found__wrapper">
            <img
              src={notFoundIcon}
              alt="Pokémon not found"
              className="not-found__icon"
            />
            <p className="not-found__text">Pokémon not found</p>
          </div>
        )}

        {!loading && pokemon && (
          <div className="card__wrapper">
            <div className="card">
              <div className="card__heading">
                <h2 className="pokemon__name">{pokemon.name}</h2>
                <button
                  className="shiny-toggle"
                  type="button"
                  onClick={() => setShowShiny(!showShiny)}
                >
                  {showShiny} ✨
                </button>
                <p className="pokemon__species">{species}</p>
                <p className="pokemon__type">
                  Type: {pokemon.types?.join(", ") || "Unknown"}
                </p>

                <div
                  className={`pokemon-image-wrapper ${
                    pokemon.isLegendary || pokemon.isMythical
                      ? "special-image"
                      : "regular-image"
                  }`}
                >
                  {(pokemon.isLegendary || pokemon.isMythical) && (
                    <div className="twinkle-layer">
                      {[...Array(20)].map((_, i) => (
                        <div
                          key={i}
                          className="star"
                          style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                          }}
                        />
                      ))}
                    </div>
                  )}

                  <img
                    className="pokemon__image"
                    src={showShiny ? pokemon.imageShiny : pokemon.imageNormal}
                    alt={pokemon.name}
                  />
                </div>

                {currentUser && pokemon && (
                  <button
                    className="pokemon__save-btn"
                    onClick={() => handleSave(pokemon)}
                  >
                    Save Pokémon
                  </button>
                )}
                <p className="pokemon-description">{pokemon.description}</p>

                {pokemonData?.stats.map((stat) => (
                  <div key={stat.stat.name} className="stat-line">
                    <strong>{stat.stat.name.toUpperCase()}:</strong>{" "}
                    {stat.base_stat}
                  </div>
                ))}
                <div>
                  {weaknesses.length > 0 && (
                    <div className="pokemon-weaknesses">
                      <h3>Weaknesses</h3>
                      <ul className="weakness">
                        {weaknesses.map(({ type }) => (
                          <li className="strenght-list" key={type}>
                            {type}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {strengths.length > 0 && (
                    <div className="pokemon-strengths">
                      <h3>Strengths</h3>
                      <ul className="strength">
                        {strengths.map((type) => (
                          <li className="strenght-list" key={type}>
                            {type}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                {pokemon && (
                  <button
                    className="pokemon__evo-btn"
                    type="button"
                    onClick={handleShowEvolution}
                  >
                    {showEvolution
                      ? "Hide Evolution Chain"
                      : "Show Evolution Chain"}
                  </button>
                )}

                {showEvolution && (
                  <div className="evolution-chain">
                    <div className="evolution-images">
                      {evolutionChain.map((stage, index) => {
                        if (!stage || !stage.name) {
                          console.warn(
                            "Skipping corrupted evolution entry:",
                            stage
                          );
                          return null;
                        }

                        return (
                          <div
                            key={index}
                            className="evolution-stage"
                            onClick={() => {
                              handleSearch(stage.name);
                              resultsRef?.current?.scrollIntoView({
                                behavior: "smooth",
                              });
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            <img src={stage.image} alt={stage.name} />
                            <p>{stage.name}</p>
                            <p className="evolution-condition">
                              {stage.condition && stage.condition !== "—"
                                ? stage.condition
                                : "Does not evolve"}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="pokedex-nav">
                <button
                  className="prev-btn"
                  onClick={handlePrev}
                  disabled={currentIndex <= 0}
                >
                  ⬅️ Previous
                </button>
                <span className="current-name">{pokemon?.name}</span>
                <button
                  className="next-btn"
                  onClick={handleNext}
                  disabled={currentIndex >= pokedexList.length - 1}
                >
                  Next ➡️
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default Home;
