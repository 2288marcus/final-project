import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFooter,
  IonTextarea,
  IonBackButton,
  IonAlert,
  useIonToast,
  IonLabel,
  IonCardSubtitle,
  IonCardTitle,
} from "@ionic/react";
import {
  add,
  document,
  camera,
  image,
  mic,
  paperPlane,
  videocam,
  checkmark,
  checkmarkDone,
  addCircle,
} from "ionicons/icons";
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
// import io from "socket.io-client";
import { get, post } from "../api/config";
import {
  ParseResult,
  boolean,
  nullable,
  object,
  string,
  number,
  array,
} from "cast.ts";
import "./Chatroom.css";
// import { number } from "@beenotung/tslib";
import useGet from "../hooks/useGet";
import useAuth from "../hooks/useAuth";
import { useParams } from "react-router";
import { id } from "@beenotung/tslib";

// const socket = io(api_origin);
let getContentParser = object({
  content: array(
    object({
      id: number(),
      username: string(),
      content: string(),
      time: string(),
    })
  ),
});

interface Message {
  id: number;
  content: string;
  username: string;
  time: string;
}

function formatTime(time: string) {
  return new Date(time).toLocaleString("zh-CN");
}

const Chatroom: React.FC = () => {
  const auth = useAuth();
  let getChatroomParser = object({
    chatroomList: array(
      object({
        id: number(),
        supplier_username: string(),
        demander_username: string(),
        created_at: string(),
        supplier_id: number(),
        demander_id: number(),
        title: string(),
      })
    ),
  });
  let chatroomList = useGet("/chat/chatroom", getChatroomParser);
  // console.log("chatroomList:", chatroomList.data?.chatroomList[0].id);
  // const title = `Chatroom`;
  // if (params} === chatroomList[0].id) {
  // }
  // const chatroom_id = params["id"]
  // const title = `${chatroomList.data?.chatroomList[chatroom_id].id}`;
  const username = auth.state?.username || "unknown";

  const contentRef = useRef<HTMLElement>(null);

  const [present, dismiss] = useIonToast();

  //當submit時，觸發sendMessage給database
  const sendMessage = (form: HTMLFormElement) => {
    let newMessage = form.newMessage.value.trim();

    if (newMessage == "") {
      return;
    }

    const currentDate = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      hour12: false, // 将时间设置为24小时制
    };

    // console.log(message);
    let data = {
      chatroom_id: params.id,
      content: newMessage,
    };
    console.log("send message", data);

    post(`/chat/${params.id}/messages`, data, object({ id: number() }))
      .then((json) => {
        console.log("POST result:", json);
        let id = json.id;
        // 根据需要执行其他操作
        form.newMessage.value = "";
        form.newMessage.parentElement.dataset.replicatedValue = "";
        roomData.setData((json) => {
          if (!json?.content) return json;
          return {
            content: [
              ...json.content,
              {
                id,
                content: newMessage,
                username: username, // Replace with the actual username
                time: String(new Date(Date.now())),
              },
            ],
          };
        });
        setError("");
      })
      .catch((err) => {
        let message = String(err)
          .replace("Error: ", "")
          .replace("Invalid object, ", "");
        console.log("POST failed:", message);
        // 根据需要处理错误
        // present({
        //   message,
        //   duration: 5000,
        //   color: "danger",
        //   position: "top",
        // });
        setError(message);
      });

    // 滚动到底部
    contentRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const params = useParams<{ id: string }>();
  // console.log("params:", params["id"]);
  const chatroom_id = +params["id"] - 1;
  // console.log(chatroom_id);
  const chatroom_title = `${
    chatroomList.data?.chatroomList[+chatroom_id].title
  }`;
  const chatroom_created_at = `${chatroomList.data?.chatroomList[
    +chatroom_id
  ].created_at
    .replace("T", " ")
    .replace("Z", "")}`;
  const roomData = useGet(`/chat/${params.id}/messages`, getContentParser);
  // console.log("roomData:", roomData);

  const [error, setError] = useState("");

  useEffect(() => {
    // socket.on("received-message", (message: Message) => {
    //   setMessages([...messages, message]);
    // });
  }, []);

  useLayoutEffect(() => {
    // console.log("messages", { messages });
    // 监听 messages 状态的变化
    contentRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [roomData.data?.content]); // 当 messages 状态发生变化时触发

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/ChatroomList"></IonBackButton>
          </IonButtons>

          <IonCardTitle>{chatroom_title}</IonCardTitle>
          <IonCardSubtitle>{chatroom_created_at}</IonCardSubtitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div>
          {roomData.render((json) =>
            json.content.map((message) => (
              <div
                key={message.id}
                className="chat-message-container"
                style={{
                  justifyContent:
                    message.username == username ? "flex-end" : "flex-start",
                }}
              >
                <div
                  className="chat-message-box"
                  style={{
                    backgroundColor:
                      message.username == username ? "#0089dfd5" : "#444444",
                  }}
                >
                  <small>{message.username}</small>
                  <div>{message.content}</div>
                  <small>
                    {formatTime(message.time)}{" "}
                    <IonIcon icon={checkmark}></IonIcon>
                  </small>
                </div>
              </div>
            ))
          )}
          <div ref={contentRef}></div>
        </div>
      </IonContent>
      <IonFooter>
        {error ? (
          <IonItem color="danger">
            <IonLabel>{error}</IonLabel>
            <IonButtons slot="end">
              <IonButton onClick={() => setError("")}>Dismiss</IonButton>
            </IonButtons>
          </IonItem>
        ) : null}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            let form = e.target as HTMLFormElement;
            sendMessage(form);
          }}
        >
          <IonItem>
            <IonButtons>
              <IonButton id="present-chatroom-info">
                <IonIcon style={{ color: "white" }} icon={addCircle}></IonIcon>
              </IonButton>
              <IonAlert
                trigger="present-chatroom-info"
                header="Contact Info"
                buttons={["OK"]}
                inputs={[
                  { type: "textarea", placeholder: "job description" },
                  // {
                  //   placeholder: "Nickname (max 8 characters)",
                  //   attributes: {
                  //     maxlength: 8,
                  //   },
                  // },
                  {
                    type: "number",
                    placeholder: "price",
                    attributes: {
                      min: 1,
                      // max: 100,
                    },
                  },
                  {
                    type: "date",
                  },
                  {
                    type: "time",
                  },
                ]}
              ></IonAlert>
              <IonButton>
                <IonIcon style={{ color: "white" }} icon={document}></IonIcon>
              </IonButton>
              <IonButton>
                <IonIcon style={{ color: "white" }} icon={image}></IonIcon>
              </IonButton>
              <IonButton>
                <IonIcon style={{ color: "white" }} icon={videocam}></IonIcon>
              </IonButton>
              <IonButton>
                <IonIcon style={{ color: "white" }} icon={camera}></IonIcon>
              </IonButton>
            </IonButtons>
            <IonTextarea
              autoGrow
              placeholder="Message"
              style={{ marginTop: "16px" }}
              name="newMessage"
            />
            <IonButtons>
              <IonButton
                type="submit"
                style={{
                  background: "#1DA1F2",
                  color: "white",
                  borderRadius: "33%",
                }}
              >
                <IonIcon icon={paperPlane} />
              </IonButton>
            </IonButtons>
          </IonItem>
        </form>
      </IonFooter>
    </IonPage>
  );
};

export default Chatroom;
