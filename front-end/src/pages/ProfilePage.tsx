import {
  IonButton,
  IonButtons,
  IonCardHeader,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
  IonRefresher,
  IonFooter,
} from "@ionic/react";
import React, { useState, ChangeEvent, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "./ProfilePage.css";
import { useForm, SubmitHandler } from "react-hook-form";

const ProfilePage: React.FC = () => {
  const title = "(User update) Person Profile";

  const { register, handleSubmit } = useForm();
  const onSubmit = (data: any) => console.log("data:", data);

  ///////////////////////////

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  const [displayInformation, setDisplayInformation] = useState<{
    username: string;
    email: string;
    human_verification: boolean;
    cv_upload: string;
    created_at: string;
    updated_at: string;
    fullName: string;
    hkId: string;
    public_key: string;
    hk_phone: string;
  }>();

  async function getProfile() {
    let res = await fetch("http://localhost:3000/user/profile/1");
    let user = await res.json();
    console.log(user);

    if (user) {
      setDisplayInformation(user);
    }
    return;
  }

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <IonPage>
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
        <IonList>
          <IonCardHeader className="Hd">Information </IonCardHeader>
          <br />
          <form onSubmit={handleSubmit(onSubmit)}>
            <IonItem>
              <IonInput label="Name" {...register("name")} />
            </IonItem>
            <IonItem>
              <IonInput label="Phone Number" />
              <IonInput label="Email" />
            </IonItem>
            <br />
            <IonItem>
              <IonInput>Description</IonInput>
            </IonItem>
            <IonItem>
              Optional:
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                hidden
                id="file-input"
              />
              {/* <label htmlFor="file-input">
                {selectedFile ? selectedFile.name : "Optional:"}
              </label> */}
              <IonButton
                onClick={() => {
                  const fileInput = document.getElementById(
                    "file-input"
                  ) as HTMLInputElement;
                  fileInput.click();
                }}
                fill="outline"
                expand="block"
              >
                CV Upload
              </IonButton>
            </IonItem>

            <IonButton type="submit" expand="full">
              Send
            </IonButton>
          </form>
        </IonList>
      </IonContent>
      <IonFooter>
        <div>HKID: {displayInformation?.hkId || "Loading"}</div>
        <div>Username: {displayInformation?.username || "Loading"}</div>
        <div>Full Name: {displayInformation?.fullName || "Loading"}</div>
        <div>Email: {displayInformation?.email || "Loading"}</div>
        <div>HK Phone: {displayInformation?.hk_phone || "Loading"}</div>
        <div>
          Human Verification:
          {displayInformation?.human_verification || "Loading"}
        </div>
        <div>CV: {displayInformation?.cv_upload || "Loading"}</div>
        <div>Public Key: {displayInformation?.public_key || "Loading"}</div>
        <div>created_at: {displayInformation?.created_at || "Loading"}</div>
        <div>updated_at: {displayInformation?.updated_at || "Loading"}</div>
      </IonFooter>
    </IonPage>
  );
};

export default ProfilePage;
