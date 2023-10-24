import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonPage,
  IonToolbar,
  IonFooter,
  IonTextarea,
  IonBackButton,
  useIonToast,
  IonLabel,
  IonCardSubtitle,
  IonCardTitle,
  IonModal,
  IonInput,
} from "@ionic/react";
import {
  document,
  camera,
  image,
  paperPlane,
  videocam,
  checkmarkDone,
  addCircle,
} from "ionicons/icons";
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { post } from "../api/config";
import { object, string, number, array } from "cast.ts";
import "./Chatroom.css";
import useGet from "../hooks/useGet";
import useAuth from "../hooks/useAuth";
import { useParams } from "react-router";

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
  const title = "Chatroom List";
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

  const username = auth.state?.username || "unknown";
  const user_id = auth.state?.id || "unknown";
  // console.log("登入的user id:", user_id);

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

  // const chatroom_user_id = chatroomList.data?.chatroomList.map(
  //   (chatroom) => chatroom.id
  // );
  // // const params = useParams<{ id: string }>();
  // if (chatroom_user_id && chatroom_user_id.length > 0) {
  //   const isUserInChatroom = chatroom_user_id.includes(+user_id);

  //   if (isUserInChatroom) {
  //     // user_id 在 chatroom_user_id 中
  //     console.log("User is in the chatroom.");
  //   } else {
  //     // user_id 不在 chatroom_user_id 中
  //     console.log("User is not in the chatroom.");
  //   }
  // } else {
  //   // chatroom_user_id 未定义或为空数组
  //   console.log("No chatroom user IDs available.");
  // }

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    price: 0,
    date: "",
    time: "",
  });

  const handleFormSubmit = () => {
    // 在这里执行表单提交操作
    console.log(formData);
    // 重置表单数据
    setFormData({
      description: "",
      price: 0,
      date: "",
      time: "",
    });
    // 关闭模态框
    setShowModal(false);

    post(`/chat/${params.id}/contract`, formData, object({ id: number() }))
      .then((res) => {
        console.log("post contract result:", res);
      })
      .catch((err) => {
        console.log("post contract fail:", err);
      });
  };

  const handleDateChange = (e: CustomEvent) => {
    const selectedDate = e.detail.value;
    const currentDate = new Date().toISOString().split("T")[0];

    if (selectedDate < currentDate) {
      // 处理日期早于当前日期的情况
      // 这里可以显示错误消息或执行其他逻辑
      console.log("日期不能早于当前日期");
    } else {
      setFormData({ ...formData, date: selectedDate! });
    }
  };

  const handleTimeChange = (e: CustomEvent) => {
    const selectedTime = e.detail.value;
    const currentTime = new Date().toISOString().split("T")[1];

    if (selectedTime < currentTime) {
      // 处理时间早于当前时间的情况
      // 这里可以显示错误消息或执行其他逻辑
      console.log("时间不能早于当前时间");
    } else {
      setFormData({ ...formData, time: selectedTime! });
    }
  };

  const chatroom_created_at = `${chatroomList.data?.chatroomList[
    +chatroom_id
  ].created_at
    .replace("T", ", ")
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

  // const date = "2023-10-19";
  // const time = "19:01";

  // function formatDateTime(date: any, time: any) {
  //   const [year, month, day] = date.split("-");
  //   const [hours, minutes] = time.split(":");

  //   const formattedDateTime = new Date(
  //     parseInt(year),
  //     parseInt(month) - 1, // 月份在 JavaScript 中是从 0 开始的，所以要减去 1
  //     parseInt(day),
  //     parseInt(hours),
  //     parseInt(minutes)
  //   ).toISOString();

  //   return formattedDateTime;
  // }

  // const formattedDateTime = formatDateTime(date, time);
  // console.log(formattedDateTime);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/ChatroomList"></IonBackButton>
          </IonButtons>

          <IonCardTitle>{chatroom_title}</IonCardTitle>
          <IonCardSubtitle>Created at: {chatroom_created_at}</IonCardSubtitle>
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
                    {formatTime(message.time)}
                    <IonIcon icon={checkmarkDone}></IonIcon>
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
              <>
                <IonButton onClick={() => setShowModal(true)}>
                  <IonIcon icon={addCircle}></IonIcon>
                </IonButton>

                <IonModal
                  // className="contract-modal"
                  isOpen={showModal}
                  onDidDismiss={() => setShowModal(false)}
                >
                  <form onSubmit={handleFormSubmit}>
                    <header style={{ textAlign: "center" }}>Contract</header>
                    <IonInput
                      type="text"
                      placeholder="Job Description"
                      value={formData.description}
                      onIonChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.detail.value!,
                        })
                      }
                    ></IonInput>
                    <IonInput
                      type="number"
                      placeholder="Price"
                      value={formData.price}
                      onIonChange={(e) =>
                        setFormData({ ...formData, price: +e.detail.value! })
                      }
                      min={1} // 设置最小值为1
                    ></IonInput>
                    <IonInput
                      type="date"
                      value={formData.date}
                      onIonChange={handleDateChange}
                    ></IonInput>
                    <IonInput
                      type="time"
                      value={formData.time}
                      onIonChange={handleTimeChange}
                    ></IonInput>
                    <IonButton type="submit">Submit</IonButton>
                  </form>
                </IonModal>
              </>
              <IonButton>
                <IonIcon icon={document}></IonIcon>
              </IonButton>
              <IonButton>
                <IonIcon icon={image}></IonIcon>
              </IonButton>
              <IonButton>
                <IonIcon icon={videocam}></IonIcon>
              </IonButton>
              <IonButton>
                <IonIcon icon={camera}></IonIcon>
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
