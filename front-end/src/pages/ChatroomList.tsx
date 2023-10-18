import React, { useState, useEffect } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonAvatar,
  IonLabel,
  IonCard,
  IonCardContent,
} from "@ionic/react";
import useGet from "../hooks/useGet";
import {
  array,
  date,
  float,
  id,
  object,
  string,
  values,
  number,
} from "cast.ts";
const ChatroomList: React.FC = () => {
  const title = "Chatroom List";

  const [items, setItems] = useState<string[]>([]);

  const chatrooms = () => {};

  let getChatroomParser = object({
    chatroomList: array(
      object({
        chatroom_id: number(),
        username: string(),
        created_at: string(),
        supplier_id: number(),
        demander_id: number(),
      })
    ),
  });

  let chatroomList = useGet("/chat/chatroom", getChatroomParser);
  console.log("chatroomList:", chatroomList);

  // useEffect(() => {
  //   chatrooms();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{title}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{title}</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          {chatroomList.render((json) =>
            json.chatroomList.map((chatroom) => (
              <IonCard key={chatroom.chatroom_id}>
                {" "}
                <IonCardContent>
                  <div className="d-flex align-center" style={{ gap: "8px" }}>
                    <div className="d-flex col align-center ion-justify-content-center">
                      <IonAvatar>
                        <img
                          src={
                            "https://picsum.photos/80/80?random=" +
                            chatroom.chatroom_id
                          }
                          alt="avatar"
                        />
                      </IonAvatar>
                      <span className="author-name">
                        {chatroom.chatroom_id}
                      </span>
                    </div>
                    <div></div>
                  </div>
                </IonCardContent>
              </IonCard>
            ))
          )}
          {/* <IonList>
            {items.map((item, index) => (
              <IonButtons>
                <IonButton routerLink="/Chatroom/:id">
                  <IonItem key={item}>
                    <IonAvatar slot="start">
                      <img
                        src={"https://picsum.photos/80/80?random=" + index}
                        alt="avatar"
                      />
                    </IonAvatar>
                    <IonLabel>{item}</IonLabel>
                  </IonItem>
                </IonButton>
              </IonButtons>
            ))}
          </IonList> */}
          <IonInfiniteScroll
            onIonInfinite={(ev) => {
              chatrooms();
              setTimeout(() => ev.target.complete(), 500);
            }}
          >
            <IonInfiniteScrollContent></IonInfiniteScrollContent>
          </IonInfiniteScroll>
        </IonContent>

        {/* <IonButton routerLink="/">hk</IonButton> */}
      </IonContent>
    </IonPage>
  );
};

export default ChatroomList;
