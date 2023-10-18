import { post } from "./config";
import { object, id, string } from "cast.ts";

export function login(user: {
  now: number;
  public_key: string;
  signature: string;
}) {
  return post("/user/login", user, object({ id: id(), username: string() }));
}

// TODO match the ERD
export function register(user: {
  username: string;
  password: string;
  email: string;
  tel: string;
}) {
  return post("/register", user, object({ id: id() }));
}
