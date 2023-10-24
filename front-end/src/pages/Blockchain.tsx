import React, { Fragment, useState } from "react";
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

  const [showCardContent, setShowCardContent] = useState<{
    [block: number]: boolean;
  }>({});

  const toggleCardContent = (block: number) => {
    setShowCardContent((prevState) => ({
      ...prevState,
      [block]: !prevState[block],
    }));
  };

  const blocks = [1, 2];

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

        {blocks.map((block) => (
          <Fragment key={block}>
            <IonCard className="card">
              <IonCardHeader>
                <IonCardTitle>Block {block}</IonCardTitle>
                <IonCardSubtitle hidden={block != 1}>
                  Genesis block
                </IonCardSubtitle>
              </IonCardHeader>
              {showCardContent[block] && (
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
                  onClick={() => toggleCardContent(block)}
                  expand="full"
                >
                  {showCardContent[block] ? (
                    <IonIcon icon={caretUp} />
                  ) : (
                    <IonIcon icon={caretDown} />
                  )}
                </IonButton>
              </IonButtons>
            </IonCard>
            <IonIcon icon={link} className="icon" />
          </Fragment>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default Blockchain;
