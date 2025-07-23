import { request } from "./signup";
import { BACKEND_BASE_URL } from "../utils/config";

export function register({ name, email, password }) {
  return request(`${BACKEND_BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
}

export function login({ email, password }) {
  return request(`${BACKEND_BASE_URL}/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}
export function checkToken(token) {
  return request(`${BACKEND_BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

const auth = {
  register,
  login,
  checkToken,
};

export default auth;
