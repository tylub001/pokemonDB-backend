export const API_BASE_URL = "https://pokeapi.co/api/v2";

//export const BACKEND_BASE_URL = "http://localhost:3000";

export const BACKEND_BASE_URL =
 process.env.NODE_ENV === "production"
 ? "https://api.pokefinal.jumpingcrab.com"
: "http://localhost:3000";
