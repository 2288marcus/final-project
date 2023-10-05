// This file is generated automatically
// Don't edit this file directly

export let server_origin = "http://localhost:8100";

let api_origin = "http://localhost:8100/api";

let store = typeof window == "undefined" ? null : localStorage;

let token = store?.getItem("token");

export function getToken() {
  return token;
}

export function clearToken() {
  token = null;
  store?.removeItem("token");
}

function post(url: string, body: object, token_?: string) {
  return fetch(api_origin + url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + token_,
    },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .catch((err) => ({ error: String(err) }))
    .then((json) => {
      if (json.error) {
        return Promise.reject(json.error);
      }
      if (json.token) {
        token = json.token as string;
        store?.setItem("token", token);
      }
      return json;
    });
}

export type RegisterInput = {
  username: string;
  password: string;
};
export type RegisterOutput = {
  token: string;
};
export function register(
  input: RegisterInput
): Promise<RegisterOutput & { error?: string }> {
  return post("/register", input);
}

export type LoginInput = {
  username: string;
  password: string;
};
export type LoginOutput = {
  token: string;
};
export function login(
  input: LoginInput
): Promise<LoginOutput & { error?: string }> {
  return post("/login", input);
}

export type CreateRoomInput = {
  name: string;
};
export type CreateRoomOutput = {
  room_id: number;
};
export function createRoom(
  input: CreateRoomInput & { token: string }
): Promise<CreateRoomOutput & { error?: string }> {
  let { token, ...body } = input;
  return post("/createRoom", body, token);
}

export type GetRoomListInput = {};
export type GetRoomListOutput = {
  roomList: Array<{
    room_id: number;
    room_name: string;
    user_id: number;
    username: string;
  }>;
};
export function getRoomList(
  input: GetRoomListInput
): Promise<GetRoomListOutput & { error?: string }> {
  return post("/getRoomList", input);
}

export type GetRoomDetailInput = {
  room_id: number;
};
export type GetRoomDetailOutput = {
  self: {
    id: number;
  };
  room: {
    id: number;
    name: string;
  };
  creator: {
    id: number;
    username: string;
  };
  messages: Array<{
    id: number;
    sender: {
      id: number;
      username: string;
    };
    content: string;
    sent_time: number;
  }>;
};
export function getRoomDetail(
  input: GetRoomDetailInput & { token: string }
): Promise<GetRoomDetailOutput & { error?: string }> {
  let { token, ...body } = input;
  return post("/getRoomDetail", body, token);
}

export type SendTextMessageInput = {
  room_id: number;
  content: string;
  sent_time: number;
};
export type SendTextMessageOutput = {
  id: number;
};
export function sendTextMessage(
  input: SendTextMessageInput & { token: string }
): Promise<SendTextMessageOutput & { error?: string }> {
  let { token, ...body } = input;
  return post("/sendTextMessage", body, token);
}

export type DemoInput = {};
export type DemoOutput = {};
export function demo(
  input: DemoInput
): Promise<DemoOutput & { error?: string }> {
  return post("/demo", input);
}
