import React, { useState, useEffect } from "react";
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
} from "@ionic/react";
import { link } from "ionicons/icons";
import "./Blockchain.css";

const Blockchain: React.FC = () => {
  const title = "Blockchain";

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
        <>
          <IonCard className="card">
            <IonCardHeader>
              <IonCardTitle>Block 1</IonCardTitle>
              <IonCardSubtitle>Genesis block</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <h5>Hash:</h5>
              <small>0231478214hjkbdhbsydgjklkj18182</small>
              <h5>Hash of previous block:</h5>
              <small>0</small>
              <h5>Timestamp:</h5>
              <small>1241351251250000</small>
            </IonCardContent>
          </IonCard>
          <IonIcon icon={link} className="icon" />
        </>
        <>
          <IonCard className="card">
            <IonCardHeader>
              <IonCardTitle>Block 2</IonCardTitle>
              <IonCardSubtitle>xxx</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <h5>Hash:</h5>
              <small>0231478214hjkbdhbsydgjklkj18183</small>
              <h5>Hash of previous block:</h5>
              <small>0231478214hjkbdhbsydgjklkj18182</small>
              <h5>Timestamp:</h5>
              <small>1241351251250001</small>
            </IonCardContent>
          </IonCard>
          <IonIcon icon={link} className="icon" />
        </>
      </IonContent>
    </IonPage>
  );
};

export default Blockchain;
