import React, { useState } from "react";
import {
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonList,
  IonItem,
  IonContent,
} from "@ionic/react";

const JobList: React.FC = () => {
  const title = "JobList";
  const [selectedSegment, setSelectedSegment] = useState<string>("default");

  const handleSegmentChange = (value: string | undefined) => {
    if (value) {
      setSelectedSegment(value);
    }
  };
  const renderList = () => {
    switch (selectedSegment) {
      case "default":
        return (
          <IonList>
            <IonItem>
              <IonLabel>Item 1</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>Item 2</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>Item 3</IonLabel>
            </IonItem>
          </IonList>
        );
      case "segment":
        return (
          <IonList>
            <IonItem>
              <IonLabel>Segment Item 1</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>Segment Item 2</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>Segment Item 3</IonLabel>
            </IonItem>
          </IonList>
        );
      case "buttons":
        return (
          <IonList>
            <IonItem>
              <IonLabel>Button Item 1</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>Button Item 2</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>Button Item 3</IonLabel>
            </IonItem>
          </IonList>
        );
      default:
        return null;
    }
  };

  return (
    <IonContent>
      <IonSegment
        value={selectedSegment}
        onIonChange={(e) => handleSegmentChange(e.detail.value)}
      >
        <IonSegmentButton value="default">
          <IonLabel>Default</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="segment">
          <IonLabel>Segment</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="buttons">
          <IonLabel>Button</IonLabel>
        </IonSegmentButton>
      </IonSegment>

      {renderList()}
    </IonContent>
  );
};

export default JobList;
