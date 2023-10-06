import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
  IonFooter,
  IonTextarea,
  IonFab,
  IonFabButton,
  IonFabList,
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
import { Link } from "react-router-dom";

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
        {/* <IonFab vertical="bottom">
          <IonFabButton>
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
          <IonFabList side="top">
            <IonFabButton>
              <IonIcon icon={document}></IonIcon>
            </IonFabButton>
            <IonFabButton>
              <IonIcon icon={image}></IonIcon>
            </IonFabButton>
            <IonFabButton>
              <IonIcon icon={videocam}></IonIcon>
            </IonFabButton>
            <IonFabButton>
              <IonIcon icon={camera}></IonIcon>
            </IonFabButton>
          </IonFabList>
        </IonFab> */}
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
        </IonItem>
        <IonItem>
          <IonTextarea autoGrow placeholder="Message" />
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
