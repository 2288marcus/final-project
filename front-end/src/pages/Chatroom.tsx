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
} from "@ionic/react";
import {
  add,
  document,
  camera,
  image,
  mic,
  paperPlane,
  videocam,
} from "ionicons/icons";

const Chatroom: React.FC = () => {
  const title = "Chatroom";
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
      <IonContent>
        {new Array(100).fill(0).map((_, i) => (
          <p>{i + 1}</p>
        ))}
      </IonContent>
      <IonFooter>
        <IonItem>
          <IonButtons>
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
            style={{ marginTop: "10px" }}
          />
          <IonButtons slot="end">
            <IonButton>
              <IonIcon icon={paperPlane}></IonIcon>
            </IonButton>
          </IonButtons>
        </IonItem>
      </IonFooter>
    </IonPage>
  );
};

export default Chatroom;
