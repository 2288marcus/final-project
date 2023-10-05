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
      <IonFooter>
        <IonItem>
          <IonTextarea autoGrow />
          <IonButtons slot="end">
            <IonFab vertical="top">
              <IonFabButton color="secondary">
                <IonIcon icon={paperPlane}></IonIcon>
              </IonFabButton>
              <IonFabList side="start">
                <IonFabButton color="dark">
                  <IonIcon icon={image}></IonIcon>
                </IonFabButton>
                <IonFabButton color="dark">
                  <IonIcon icon={videocam}></IonIcon>
                </IonFabButton>
                <IonFabButton color="dark">
                  <IonIcon icon={camera}></IonIcon>
                </IonFabButton>
                <IonFabButton color="dark">
                  <IonIcon icon={mic}></IonIcon>
                </IonFabButton>
                <IonFabButton color="dark">
                  <IonIcon icon={document}></IonIcon>
                </IonFabButton>
              </IonFabList>
            </IonFab>
            {/* <IonButton>
              <IonIcon slot="end" icon={paperPlane}></IonIcon>
            </IonButton> */}
          </IonButtons>
        </IonItem>
      </IonFooter>
    </IonPage>
  );
};

export default Chatroom;
