export let api_origin = "http://localhost:8100";

export async function post(url: string, body: object) {
  let res = await fetch(api_origin + url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  let json = await res.json();
  if (json.error) {
    throw new Error(json.error);
  }
  return json;
}
