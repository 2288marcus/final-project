import { Parser } from "cast.ts";

export let api_origin = "http://localhost:3000";

export async function post<T>(url: string, body: object, parser: Parser<T>) {
  return handleFetch(
    url,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: getAuthorization(),
      },
      body: JSON.stringify(body),
    },
    parser
  );
}

export async function get<T>(url: string, parser: Parser<T>) {
  return handleFetch(
    url,
    {
      headers: {
        Accept: "application/json",
        Authorization: getAuthorization(),
      },
    },
    parser
  );
}

function getAuthorization() {
  return "TODO";
}

async function handleFetch<T>(
  url: string,
  init: RequestInit,
  parser: Parser<T>
) {
  let res = await fetch(api_origin + url, init);
  let json = await res.json();

  // Example: {message: 'todo', error: 'Not Implemented', statusCode: 501}
  // Example: {statusCode: 500, message: 'Internal server error'}
  if (json.message && json.statusCode) {
    throw new Error(json.message);
  }
  return parser.parse(json);
}
