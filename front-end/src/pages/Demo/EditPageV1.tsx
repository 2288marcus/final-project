import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonLabel,
  IonItemDivider,
  IonIcon,
} from "@ionic/react";
import React, { useState, useEffect } from "react";
import "./DemoPage.css";
import { close, create, save } from "ionicons/icons";

const EditPage: React.FC = () => {
  const title = "Demo Edit";

  const [profile, setProfile] = useState<{
    username: string;
    email: string;
    human_verification: boolean;
    cv_upload: string;
    created_at: string;
    updated_at: string;
    fullName: string;
    HKID: string;
    public_key: string;
    HK_phone: string;
  }>();

  async function getProfile() {
    setProfile({
      username: "alicewong123",
      email: "x",
      human_verification: true,
      cv_upload: "x",
      created_at: "x",
      updated_at: "x",
      fullName: "Alice Wong",
      HKID: "x",
      public_key: "x",
      HK_phone: "x",
    });
  }

  useEffect(() => {
    setTimeout(() => {
      getProfile();
    }, 1000);
  }, []);
  ///////////////////////////

  type Mode = "view" | "edit" | "cancel" | "save";

  const [mode, setMode] = useState<Mode>("view");

  async function saveProfile() {
    // TODO post to server
    setTimeout(() => {
      setMode("view");
    }, 5000);
  }

  useEffect(() => {
    switch (mode) {
      case "cancel":
        getProfile();
        setMode("view");
        return;
      case "save":
        saveProfile();
        return;
    }
  }, [mode, profile]);

  return (
    <IonPage className="DemoPage">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{title} </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{title}</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonItemDivider>
          {/* <div className="session-title">Personal Information</div> */}
          <div className="session-title">Personal Information</div>
        </IonItemDivider>
        <IonCard>
          {!profile ? (
            <p className="ion-text-center">Loading Profile...</p>
          ) : (
            <>
              <IonItem>
                <IonLabel position="fixed">Username</IonLabel>
                <IonInput value={profile.username}></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="fixed" color="danger">
                  Email
                </IonLabel>
                <IonInput></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position={mode == "view" ? "fixed" : "floating"}>
                  Full Name
                </IonLabel>
                <IonInput
                  value={profile.fullName}
                  onIonChange={(e) =>
                    setProfile({
                      ...profile,
                      fullName: e.detail.value || "",
                    })
                  }
                  readonly={mode != "edit"}
                />
                <IonButtons slot="end">
                  {mode == "view" ? (
                    <IonButton
                      slot="end"
                      size="small"
                      color="primary"
                      onClick={() => setMode("edit")}
                    >
                      <IonIcon src={create} slot="icon-only"></IonIcon>
                    </IonButton>
                  ) : (
                    <>
                      <IonButton
                        color="success"
                        onClick={() => setMode("view")}
                      />
                      <IonButton color="dark" onClick={() => setMode("view")} />
                    </>
                  )}
                </IonButtons>
              </IonItem>

              <div className="d-flex">
                <IonButton
                  color="dark"
                  className="flex-grow ion-no-margin"
                  expand="full"
                  onClick={() => setMode("cancel")}
                  hidden={mode != "edit"}
                >
                  <IonIcon src={close} slot="icon-only"></IonIcon>
                </IonButton>
                <IonButton
                  color="success"
                  className="flex-grow ion-no-margin"
                  expand="full"
                  onClick={() => setMode("save")}
                  hidden={mode != "edit"}
                >
                  <IonIcon src={save} slot="icon-only"></IonIcon>
                </IonButton>
                <IonButton
                  color="success"
                  className="flex-grow ion-no-margin"
                  expand="full"
                  disabled
                  hidden={mode != "save"}
                >
                  Saving ...
                </IonButton>
              </div>
            </>
          )}
        </IonCard>
        <p>mode: {mode}</p>
      </IonContent>
    </IonPage>
  );
};

export default EditPage;
