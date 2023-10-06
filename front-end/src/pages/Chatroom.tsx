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
  IonLabel,
  IonText,
  IonNote,
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
import io from "socket.io-client";
import { api_origin } from "../api/config";
import "./Chatroom.css";

const socket = io(api_origin);

interface Message {
  id: number;
  message: string;
  user: string;
  time: number;
}

function formatTime(time: number) {
  return new Date(time).toLocaleString("zh-CN");
}

const Chatroom: React.FC = () => {
  const title = "Chatroom";
  const username = "Username";
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, message: "Hi from Alice", user: "Alice", time: 1696578205825 },
    {
      id: 2,
      message: "Hi from Me",
      user: username,
      time: 1696578205825 + 90 * 1000,
    },
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
      user: "Username", // Replace with the actual username
      time: Date.now(),
    };
    setMessages([...messages, messageData]);

    // 滚动到底部
    if (contentRef.current) {
      contentRef.current.scrollToBottom();
    }
  };

  useEffect(() => {
    socket.on("received-message", (message: Message) => {
      setMessages([...messages, message]);
    });
  }, []);

  useEffect(() => {
    // 监听 messages 状态的变化
    if (contentRef.current) {
      contentRef.current.scrollToBottom();
    }
  }, [messages]); // 当 messages 状态发生变化时触发

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
                message.user === username ? "flex-end" : "flex-start",
            }}
          >
            <div
              className="chat-message-box"
              style={{
                backgroundColor:
                  message.user === username ? "#0089dfd5" : "#444444",
              }}
            >
              <small>{message.user}</small>
              <div>{message.message}</div>
              <small
                style={
                  {
                    // position: "absolute",
                    // display: "flex",
                    // right: "100px",
                    // bottom: 0,
                    // lineHeight: "160px",
                    // pointerEvents: "auto",
                  }
                }
              >
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
