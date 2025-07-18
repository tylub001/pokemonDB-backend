import "./Profile.css";
import ConfirmModal from "../ReleaseModal/ReleaseModal";

const Profile = ({
  currentUser,
  favorites,
  handleClearFavorites,
  setShowConfirmModal,
  setSelectedPokemon,
  showReleaseAllModal,
  setShowReleaseAllModal,
  handleReleaseAll,
}) => {
  return (
    <div className="profile">
      <h1 className="profile__name">
        Hello,&nbsp;
        <span className="profile__username">
          {currentUser?.name || "Trainer"}
        </span>
        !
      </h1>
      <p className="profile__description">Welcome to your Pokédex portal</p>

      <section>
        <h2 className="profile__info">
          You have{" "}
          <span className="profile__highlight">{favorites.length}</span> caught
          Pokémon!
        </h2>

        {favorites.length === 0 ? (
          <p className="profile__message">You haven't saved any Pokémon yet</p>
        ) : (
          <div className="favorites-container">
            <ul
              className={`favorites__list ${
                favorites.length > 1 ? "favorites__spaced" : "favorites__single"
              }`}
            >
              {favorites.map((poke, index) => {
                if (!poke || !poke.name || !poke.image || !poke.description) {
                  console.warn(
                    "Skipping broken favorite at index:",
                    index,
                    poke
                  );
                  return null;
                }

                return (
                  <li
                    key={`${poke.name}-${index}`}
                    className={`profile__card ${
                      poke.isLegendary
                        ? "legendary-card"
                        : poke.isMythical
                        ? "mythical-card"
                        : ""
                    }`}
                  >
                    <div
                      className={`pokemon-image-wrapper ${
                        poke.isLegendary || poke.isMythical
                          ? "special-image special-image_type_profile"
                          : "regular-image regular-image_type_profile"
                      }`}
                    >
                      {(poke.isLegendary || poke.isMythical) && (
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
                        src={poke.image}
                        alt={poke.name}
                      />
                    </div>

                    <h3 className="card__name">{poke.name}</h3>
                    <p className="card__description">{poke.description}</p>
                    <button
                      className="release-button"
                      onClick={() => {
                        setSelectedPokemon(poke);
                        setShowConfirmModal(true);
                      }}
                    >
                      Release
                    </button>
                  </li>
                );
              })}
            </ul>
            <button
              className="profile__releaseAll-btn"
              onClick={() => setShowReleaseAllModal(true)}
            >
              Release all Pokémon
            </button>
            <ConfirmModal
              isOpen={showReleaseAllModal}
              onClose={() => setShowReleaseAllModal(false)}
              onConfirm={handleReleaseAll}
              message="Are you sure you want to release all your saved Pokémon?"
            />
            <p className="profile__warning">
              Clicking this will release ALL pokemon back into the wild!
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Profile;
