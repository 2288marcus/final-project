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
  IonCard,
  IonTitle,
  IonListHeader,
  IonCardContent,
} from "@ionic/react";
import {
  document,
  camera,
  image,
  paperPlane,
  videocam,
  checkmarkDone,
  addCircle,
  reader,
  body,
  roseOutline,
} from "ionicons/icons";
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { api_origin, getAuthorization, post } from "../api/config";
import {
  object,
  string,
  number,
  array,
  nullable,
  id,
  date,
  float,
  optional,
} from "cast.ts";
import "./Chatroom.css";
import useGet from "../hooks/useGet";
import useAuth from "../hooks/useAuth";
import { useParams } from "react-router";
import useToast from "../hooks/useToast";
import { routes } from "../routes";

// const socket = io(api_origin);
let getRoomDataParser = object({
  room: object({
    job_id: id(),
    created_at: date(),
    title: string(),
    type: string(),
    description: string(),
    price: string(),
  }),
  messages: array(
    object({
      id: number(),
      username: string(),
      content: string(),
      time: string(),
    })
  ),
  contract: optional(
    object({
      contract_id: id(),
      real_description: string(),
      real_price: float(),
      created_at: date(),
      real_finish_time: optional(date()),
      confirm_finish_time: optional(date()),
    })
  ),
  supplier: object({
    id: id(),
    username: string(),
  }),
  demander: object({
    id: id(),
    username: string(),
  }),
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

let defaultContractData = {
  real_description: "",
  real_price: 0,
  date: "",
  time: "",
};

const Chatroom: React.FC = () => {
  const title = "Chatroom List";
  const auth = useAuth();

  const username = auth.state?.username || "unknown";
  const user_id = auth.state?.id || "unknown";
  // console.log("登入的user id:", user_id);

  const contentRef = useRef<HTMLDivElement>(null);

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
          if (!json?.messages) return json;
          return {
            ...json,
            messages: [
              ...json.messages,
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
  // console.log(chatroom_id);

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

  const [isShowCreateContractModal, setIsShowCreateContractModal] =
    useState(false);

  const [contractData, setContractData] = useState(defaultContractData);

  const toast = useToast();

  const submitContract = async () => {
    // 在这里执行表单提交操作
    console.log(contractData);

    try {
      let json = await post(
        `/chat/${params.id}/contract`,
        {
          real_description: contractData.real_description,
          real_price: contractData.real_price,
          estimated_finish_time: contractData.date + " " + contractData.time,
        },
        object({ contract_id: number() })
      );
      console.log("post contract result:", json);
      // 关闭模态框
      setIsShowCreateContractModal(false);
      // 重置表单数据
      setContractData(defaultContractData);
      roomData.reload();
    } catch (error) {
      console.log("post contract fail:", error);
      toast.showError(error);
    }
  };

  const Payment = async (contract_id: number) => {
    try {
      let res = await fetch(`${contract_id}/create-payment`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: getAuthorization(),
        },
      });
      let result = await res.json();
      console.log("post real finish time result:", result[0]);
    } catch (error) {
      console.log("post real finish time fail:", error);
      toast.showError(error);
    }
  };

  const createRealFinishTime = async (contract_id: number) => {
    try {
      let res = await fetch(
        `${api_origin}/chat/${contract_id}/contract/real-finish-time`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: getAuthorization(),
          },
        }
      );
      let result = await res.json();
      if (result.message && result.statusCode) {
        throw new Error(result.message);
      }

      console.log("post real finish time success");
      roomData.reload();
    } catch (error) {
      console.log("post real finish time fail:", error);
      toast.showError(error);
    }
  };

  const createConfirmFinishTime = async (contract_id: number) => {
    try {
      let res = await fetch(
        `${api_origin}/chat/${contract_id}/contract/confirm-finish-time`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: getAuthorization(),
          },
        }
      );
      let result = await res.json();
      if (result.message && result.statusCode) {
        throw new Error(result.message);
      }
      console.log("post confirm finish time success");
      roomData.reload();
    } catch (error) {
      console.log("post confirm finish time fail:", error);
      toast.showError(error);
    }
  };

  const handleDateChange = (e: CustomEvent) => {
    const selectedDate = e.detail.value;
    const currentDate = new Date().toISOString().split("T")[0];

    if (selectedDate < currentDate) {
      // 处理日期早于当前日期的情况
      // 这里可以显示错误消息或执行其他逻辑
      console.log("日期不能早于当前日期");
    } else {
      setContractData({ ...contractData, date: selectedDate! });
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
      setContractData({ ...contractData, time: selectedTime! });
    }
  };

  const roomData = useGet(`/chat/room/${params.id}`, getRoomDataParser);
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
  }, [roomData.data?.messages]); // 当 messages 状态发生变化时触发

  const [isShowContractModal, setIsShowContractModal] = useState(false);

  return (
    <IonPage className="Chatroom">
      <IonHeader>
        <IonToolbar color="light">
          <IonButtons slot="start">
            <IonBackButton defaultHref={routes.ChatroomList}></IonBackButton>
          </IonButtons>
          <IonTitle>
            <div>{roomData.data?.room?.title}</div>
            <small>{roomData.data?.room?.created_at?.toLocaleString()}</small>
          </IonTitle>
          {/* <IonCardTitle>{chatroom_title}</IonCardTitle>
          <IonCardSubtitle>Created at: {chatroom_created_at}</IonCardSubtitle> */}
          <IonButtons slot="end">
            <IonButton onClick={() => setIsShowContractModal(true)}>
              <IonIcon icon={reader} slot="icon-only"></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonModal
        isOpen={isShowContractModal}
        onDidDismiss={() => setIsShowContractModal(false)}
      >
        <IonHeader>
          <IonToolbar color="light">
            <IonTitle>Job Details</IonTitle>
            <IonButtons slot="start">
              <IonButton
                color="primary"
                onClick={() => setIsShowContractModal(false)}
              >
                Dismiss
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding" color="light">
          <IonListHeader>Job Info</IonListHeader>
          <IonCard>
            <IonCardContent>
              <p>Title: {roomData.data?.room?.title}</p>
              <p>Type: {roomData.data?.room?.type}</p>
              <p>Price: ${roomData.data?.room?.price}HKD</p>
              <p>Description: {roomData.data?.room?.description}</p>
            </IonCardContent>
          </IonCard>

          {roomData.data?.contract ? (
            <>
              <IonListHeader>Contract</IonListHeader>
              <small>
                Status:
                {roomData.data.contract.real_finish_time != null
                  ? " contract finished"
                  : " contract not finished"}
              </small>
              <IonCard className="ion-padding">
                <IonCardContent>
                  {auth.state?.id == roomData.data.demander.id ? (
                    <>
                      <IonButton onClick={() => Payment}>Pay</IonButton>
                      <IonButton
                        disabled={
                          roomData.data?.contract?.real_finish_time != null ||
                          roomData.data?.contract?.confirm_finish_time == null
                        }
                        onClick={() =>
                          createRealFinishTime(
                            roomData.data?.contract?.contract_id!
                          )
                        }
                      >
                        confirm by demander
                      </IonButton>
                    </>
                  ) : null}
                  {auth.state?.id == roomData.data.supplier.id ? (
                    <>
                      <IonButton
                        disabled={
                          roomData.data?.contract?.confirm_finish_time != null
                        }
                        onClick={() =>
                          createConfirmFinishTime(
                            roomData.data?.contract?.contract_id!
                          )
                        }
                      >
                        confirm by supplier
                      </IonButton>
                    </>
                  ) : null}
                </IonCardContent>
                <IonCardContent>
                  Description: {roomData.data?.contract?.real_description}
                  <br />
                  Price: ${roomData.data?.contract?.real_price.toLocaleString()}
                  HKD
                  <br />
                  Estimated finish time:
                  {roomData.data?.contract?.created_at.toLocaleString()}
                  <br />
                  Confirm finish time:
                  {roomData.data?.contract?.confirm_finish_time?.toLocaleString()}
                  <br />
                  Real finish time:
                  {roomData.data?.contract?.real_finish_time?.toLocaleString()}
                </IonCardContent>
              </IonCard>
            </>
          ) : null}
        </IonContent>
      </IonModal>
      <IonContent>
        {/* <div>
          {roomData.render((json) =>
            json.messages.map((message) => (
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
        </div> */}

        {roomData.render((json) => (
          <>
            {json.messages.map((message) => (
              <div
                key={message.id}
                className="message-box-line"
                data-by={message.username == username ? "me" : "other"}
              >
                <IonCard className="message-box" color="light">
                  <div className="chat-message-box">
                    <small>{message.username}</small>
                    <div>{message.content}</div>
                    <small>
                      {formatTime(message.time)}
                      <IonIcon icon={checkmarkDone}></IonIcon>
                    </small>
                  </div>
                </IonCard>
              </div>
            ))}
          </>
        ))}
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
                <IonButton onClick={() => setIsShowCreateContractModal(true)}>
                  <IonIcon icon={addCircle}></IonIcon>
                </IonButton>
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

      <IonModal
        // className="create-contract-modal"
        // className="contract-modal"
        isOpen={isShowCreateContractModal}
        onDidDismiss={() => setIsShowCreateContractModal(false)}
      >
        <IonHeader>
          <IonToolbar color="light">
            <IonTitle>Create Contract</IonTitle>
            <IonButtons slot="start">
              <IonButton
                color="primary"
                onClick={() => setIsShowCreateContractModal(false)}
              >
                Dismiss
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding" color="light">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitContract();
            }}
          >
            <IonInput
              type="text"
              placeholder="Job Description"
              value={contractData.real_description}
              onIonChange={(e) =>
                setContractData({
                  ...contractData,
                  real_description: e.detail.value!,
                })
              }
            ></IonInput>
            <IonInput
              type="number"
              placeholder="Price"
              value={contractData.real_price}
              onIonChange={(e) =>
                setContractData({
                  ...contractData,
                  real_price: +e.detail.value!,
                })
              }
              min={1} // 设置最小值为1
            ></IonInput>
            <IonInput
              type="date"
              value={contractData.date}
              onIonChange={handleDateChange}
            ></IonInput>
            <IonInput
              type="time"
              value={contractData.time}
              onIonChange={handleTimeChange}
            ></IonInput>
            <IonButton type="submit">Submit</IonButton>
          </form>
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

export default Chatroom;
