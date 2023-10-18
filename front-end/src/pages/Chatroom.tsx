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
} from "ionicons/icons";
import React, { useState, useEffect, useRef } from "react";
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

// const socket = io(api_origin);
let getContentParser = object({
  content: array(
    object({
      id: number(),
      username: string(),
      message: string(),
      time: string(),
    })
  ),
});

interface Message {
  id: number;
  message: string;
  username: string;
  time: string;
}

function formatTime(time: string) {
  return new Date(time).toLocaleString("zh-CN");
}

const Chatroom: React.FC = () => {
  const auth = useAuth();
  const title = "Chatroom";
  const username = auth.state?.username || "unknown";
  const [messages, setMessages] = useState<Message[]>([
    // {
    //   id: 1,
    //   message: "Hi from Alice",
    //   username: "Alice",
    //   time: String(new Date(1696578205825)),
    // },
    // {
    //   id: 2,
    //   message: "Hi from Me",
    //   username,
    //   time: String(new Date(1696578205825 + 90 * 1000)),
    // },
  ]);

  const contentRef = useRef<HTMLIonContentElement>(null);

  const sendMessage = (newMessage: string) => {
    if (newMessage == "") {
      alert("empty?");
      return;
    }
    const currentDate = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      hour12: false, // 将时间设置为24小时制
    };
    const messageData: Message = {
      id: Date.now(),
      message: newMessage,
      username: username, // Replace with the actual username
      time: String(new Date(Date.now())),
    };
    setMessages([...messages, messageData]);

    // 滚动到底部
    if (contentRef.current) {
      contentRef.current.scrollToBottom();
    }
  };

  const { data } = useGet("/chat/content2?contract_id=", getContentParser);

  useEffect(() => {
    // socket.on("received-message", (message: Message) => {
    //   setMessages([...messages, message]);
    // });
  }, []);

  useEffect(() => {
    if (data) {
      // const newData = data.content.map((message)=>{
      //   return { id: message.id, message: message.content, username: message.username, time:message.created_at }
      // })

      console.log(data);
      setMessages(data.content as Message[]);
    }
    // const newData: Message[] = data ? data.content: [];
    // setMessages(newData);
  }, [data]);

  useEffect(() => {
    console.log({ messages });
    // 监听 messages 状态的变化
    if (contentRef.current) {
      contentRef.current.scrollToBottom();
    }
  }, [messages]); // 当 messages 状态发生变化时触发

  //當submit時，觸發sendMessage給database
  const submit = () => {
    const message = messages[messages.length - 1];
    // console.log(message);
    let data = {
      contract_id: 31,
      content: message.message,
      user_id: 104,
      // updated_at: Date.now(),
    };
    console.log(data);

    post("/chat/content", data, object({ id: number() }))
      .then((res) => {
        console.log("POST result:", res);
        // 根据需要执行其他操作
      })
      .catch((err) => {
        console.log("POST failed:", err);
        // 根据需要处理错误
      });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/ChatroomList"></IonBackButton>
          </IonButtons>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent ref={contentRef}>
        {messages.map((message) => (
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
              <div>{message.message}</div>
              <small>
                {formatTime(message.time)} <IonIcon icon={checkmark}></IonIcon>
              </small>
            </div>
          </div>
        ))}
      </IonContent>
      <IonFooter>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            let form = e.target as HTMLFormElement;
            let newMessage = form.newMessage.value.trim();
            sendMessage(newMessage);
            form.newMessage.value = "";
            form.newMessage.parentElement.dataset.replicatedValue = "";
          }}
        >
          <IonItem>
            <IonButtons>
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
                onClick={submit}
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
