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
  IonCard,
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
  id,
  array,
  date,
} from "cast.ts";
import "./Chatroom.css";
import { number } from "@beenotung/tslib";
import useGet from "../hooks/useGet";

// const socket = io(api_origin);
let getContentParser = object({
  content: array(
    object({
      id: id(),
      username: string(),
      content: string(),
      created_at: string(),
      user_id: id(),
    })
  ),
});
interface Message {
  id: number;
  content: string;
  username: string;
  created_at: string;
}

function formatTime(time: number) {
  return new Date(time).toLocaleString("zh-CN");
}

const Chatroom: React.FC = () => {
  const title = "Chatroom";
  const username = "john_doe";
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hi from Alice",
      username: "Alice",
      created_at: "1696578205825",
    },
    {
      id: 2,
      username: "104",
      content: "112",
      created_at: "2023-10-16T15:04:40.844Z",
    },
  ]);

  const getContentResult = useGet(
    "/chat/content2?contract_id=31",
    getContentParser
  );

  // function setContent() {

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
    // const messageData: Message = {
    //   id: Date.now(),
    //   message: newMessage,
    //   user: "Username", // Replace with the actual username
    //   time: Date.now(),
    // };
    // setMessages([...messages, messageData]);

    // 滚动到底部
    if (contentRef.current) {
      contentRef.current.scrollToBottom();
    }
  };

  useEffect(() => {
    // socket.on("received-message", (message: Message) => {
    //   setMessages([...messages, message]);
    // });
  }, []);

  useEffect(() => {
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
      id: 2,
      contract_id: 31,
      content: message.content,
      user_id: 104,
      // updated_at: Date.now(),
    };
    console.log(data);

    post("/chat/content", data, object({}))
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
        {getContentResult.render((json) => {
          console.log({ json });

          json.content?.map((message) => (
            <div
              key={message.id}
              className="chat-message-container"
              style={{
                justifyContent:
                  message.username === username ? "flex-end" : "flex-start",
              }}
            >
              <div
                className="chat-message-box"
                style={{
                  backgroundColor:
                    message.username === username ? "#0089dfd5" : "#444444",
                }}
              >
                <small>{message.username}</small>
                <div>{message.content}</div>
                <small>
                  {message.created_at}
                  <IonIcon icon={checkmark}></IonIcon>
                </small>
              </div>
            </div>
          ));
        })}
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
