import { BACKEND_BASE_URL } from "./config";

function checkResponse(res) {
  if (res.ok) {
    return res.json();
  }
  // Try to parse the error JSON and reject with backend message
  return res
    .json()
    .then((errorData) => {
      const errorMessage = errorData.message || `Error: ${res.status}`;
      return Promise.reject(errorMessage);
    })
    .catch(() => {
      return Promise.reject(`Error: ${res.status}`);
    });
}

function request(url, options) {
  return fetch(url, options).then(checkResponse);
}

function getUserInfo(token) {
  return request(`${BACKEND_BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

function addPokemonCard(
  { name, description, image, isLegendary, isMythical },
  token
) {
  return request(`${BACKEND_BASE_URL}/pokemon`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, description, image, isLegendary, isMythical }),
  }).then((pokemon) => {
    return pokemon;
  });
}

function deletePokemonCard(cardId, token) {
  return request(`${BACKEND_BASE_URL}/pokemon/${cardId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

function getMyPokemonCards(token) {
  return request(`${BACKEND_BASE_URL}/pokemon`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

export {
  checkResponse,
  addPokemonCard,
  deletePokemonCard,
  getUserInfo,
  getMyPokemonCards,
  request,
};
