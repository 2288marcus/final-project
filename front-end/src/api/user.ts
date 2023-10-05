import { post } from "./config";

export function login(user: { username: string; password: string }) {
  return post("/login", user);
}

// TODO match the ERD
export function register(user: {
  username: string;
  password: string;
  email: string;
  tel: string;
}) {
  return post("/register", user);
}
