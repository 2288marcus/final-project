import React, { useState, useEffect } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonAvatar,
  IonCard,
  IonCardContent,
} from "@ionic/react";
import useGet from "../hooks/useGet";
import { useParams } from "react-router";
import useAuth from "../hooks/useAuth";
import { array, object, string, values, number } from "cast.ts";
import { id } from "@beenotung/tslib";

const ChatroomList: React.FC = () => {
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
        type: values(["demand" as const, "supply" as const]),
      })
    ),
  });

  let chatroomList = useGet("/chat/chatroom", getChatroomParser);

  const user_id = auth.state?.id || "unknown";
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
  return (
    <IonPage>
      {/* <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{title}</IonTitle>
        </IonToolbar>
      </IonHeader> */}
      <IonContent fullscreen className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{title}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {chatroomList.render((json) =>
            json.chatroomList.map((chatroom) => (
              <IonCard key={chatroom.id}>
                <IonCardContent>
                  <div className="d-flex align-center" style={{ gap: "8px" }}>
                    <div className="d-flex col align-center ion-justify-content-center">
                      <IonAvatar>
                        <img
                          src={
                            "https://picsum.photos/80/80?random=" + chatroom.id
                          }
                          alt="avatar"
                        />
                      </IonAvatar>
                      {/* <span>{chatroom.id}</span> */}
                    </div>
                    <div>
                      <h1>Job: {chatroom.title}</h1>
                      <p>
                        created_at:{" "}
                        {chatroom.created_at.replace("T", " ").replace("Z", "")}
                      </p>
                      <p>supplier: {chatroom.supplier_username}</p>
                      <p>demander: {chatroom.demander_username}</p>
                      <IonButton routerLink={`/Chatroom/${chatroom.id}`}>
                        chat now !!
                      </IonButton>
                    </div>
                  </div>
                </IonCardContent>
              </IonCard>
            ))
          )}
          {/* <IonInfiniteScroll
            onIonInfinite={(ev) => {
              chatroomList();
              setTimeout(() => ev.target.complete(), 500);
            }}
          >
            <IonInfiniteScrollContent></IonInfiniteScrollContent>
          </IonInfiniteScroll> */}
        </IonContent>
      </IonContent>
    </IonPage>
  );
};

export default ChatroomList;
