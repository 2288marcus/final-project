import React, { useState } from "react";
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonButton,
} from "@ionic/react";
import {
  caretDown,
  caretUp,
  caretUpCircle,
  caretUpOutline,
  link,
} from "ionicons/icons";
import "./Blockchain.css";

const Blockchain: React.FC = () => {
  const title = "Blockchain";

  const [showCardContent, setShowCardContent] = useState({
    block1: false,
    block2: false,
  });

  const toggleCardContent = (block: any) => {
    setShowCardContent((prevState) => ({
      ...prevState,
      [block]: !prevState[block],
    }));
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="toolbar">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <p></p>
        <IonCard className="card">
          <IonCardHeader>
            <IonCardTitle>Block 1</IonCardTitle>
            <IonCardSubtitle>Genesis block</IonCardSubtitle>
          </IonCardHeader>
          {showCardContent.block1 && (
            <IonCardContent>
              <h5>Hash:</h5>
              <small className="break-word">
                0231478214hjkbdhbsydgjklkj181820231478214hjkbdhbsydgjklkj18182
              </small>
              <h5>Hash of previous block:</h5>
              <small>0</small>
              <h5>Timestamp:</h5>
              <small>1241351251250000</small>
            </IonCardContent>
          )}
          <IonButtons className="show">
            <IonButton
              onClick={() => toggleCardContent("block1")}
              expand="full"
            >
              {showCardContent.block1 ? (
                <IonIcon icon={caretUp} />
              ) : (
                <IonIcon icon={caretDown} />
              )}
            </IonButton>
          </IonButtons>
        </IonCard>
        <IonIcon icon={link} className="icon" />

        <IonCard className="card">
          <IonCardHeader>
            <IonCardTitle>Block 2</IonCardTitle>
            <IonCardSubtitle>xxx</IonCardSubtitle>
          </IonCardHeader>
          {showCardContent.block2 && (
            <IonCardContent>
              <h5>Hash:</h5>
              <small className="break-word">
                0231478214hjkbdhbsydgjklkj18183
              </small>
              <h5>Hash of previous block:</h5>
              <small className="break-word">
                0231478214hjkbdhbsydgjklkj181820231478214hjkbdhbsydgjklkj181825555555656565656565
              </small>
              <h5>Timestamp:</h5>
              <small>1241351251250001</small>
            </IonCardContent>
          )}
          <IonButtons className="show">
            <IonButton
              onClick={() => toggleCardContent("block2")}
              expand="full"
            >
              {showCardContent.block2 ? (
                <IonIcon icon={caretUp} />
              ) : (
                <IonIcon icon={caretDown} />
              )}
            </IonButton>
          </IonButtons>
        </IonCard>
        <IonIcon icon={link} className="icon" />
      </IonContent>
    </IonPage>
  );
};

export default Blockchain;
