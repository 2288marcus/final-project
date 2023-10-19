import { Parser } from "cast.ts";
import forge from "node-forge";
import { toBase64 } from "../utils/crypto";

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

export async function postjob<T>(url: string, body: object, parser: Parser<T>) {
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
  let privateKeyBase64 = "";

  try {
    let text = localStorage.getItem("auth")!;
    privateKeyBase64 = JSON.parse(text).privateKeyBase64;
  } catch (error) {
    // invalid auth (not login?)
  }

  if (!privateKeyBase64) {
    return "";
  }

  let privateKey = forge.util.binary.base64.decode(privateKeyBase64);
  let publicKey = forge.pki.ed25519.publicKeyFromPrivateKey({ privateKey });
  let now = Date.now();

  let message = JSON.stringify({ now });

  let md = forge.sha512.create();
  md.update(message);
  let signature = forge.pki.ed25519.sign({ privateKey, md });

  let authorization = [now, toBase64(publicKey), toBase64(signature)].join(".");

  return authorization;
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

export async function handleFetch2(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE"
) {
  let res = await fetch(api_origin + url, {
    method,
    headers: {
      Accept: "application/json",
      Authorization: getAuthorization(),
    },
  });
  let json = await res.json();

  // Example: {message: 'todo', error: 'Not Implemented', statusCode: 501}
  // Example: {statusCode: 500, message: 'Internal server error'}
  if (json.message && json.statusCode) {
    return { error: json.message };
  }
  return json;
}
