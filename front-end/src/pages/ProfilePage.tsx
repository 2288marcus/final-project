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
} from "@ionic/react";
import React, { useState, ChangeEvent, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "./ProfilePage.css";
import { useForm, SubmitHandler } from "react-hook-form";

const Test: React.FC = () => {
  const title = "(User update) Person Profile";

  const { register, handleSubmit } = useForm();
  const onSubmit = (data: any) => console.log("data:", data);

  ///////////////////////////

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleUpload = () => {
    console.log("Uploading");
    // if (selectedFile) {
    //   // 在這裡處理上傳PDF的邏輯
    //   console.log("上傳的PDF文件:", selectedFile);
    // }
  };

  const [displayInformation, setDisplayInformation] = useState<{
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
    let res = await fetch("http://localhost:3000/user/profile/1");
    let user = await res.json();
    console.log(user);

    if (user) {
      setDisplayInformation({
        username: user.username,
        email: user.email,
        human_verification: user.human_verification,
        cv_upload: user.cv_upload,
        created_at: user.created_at,
        updated_at: user.updated_at,
        fullName: user.fullName,
        HKID: user.HKID,
        public_key: user.public_key,
        HK_phone: user.HK_phone,
      });
    }

    return;
  }

  useEffect(() => {
    getProfile();
  }, []);
  ///////////////////////////

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
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                hidden
                id="file-input"
              />
              <label htmlFor="file-input">
                {selectedFile ? selectedFile.name : "Optional:"}
              </label>
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

            <IonButton type="submit">Send</IonButton>
          </form>
        </IonList>
      </IonContent>
      <div>Username: {displayInformation?.username || "Loading"}</div>
      <div>Full Name: {displayInformation?.fullName || "Loading"}</div>
      <div>Email: {displayInformation?.email || "Loading"}</div>
      <div>HK Phone: {displayInformation?.HK_phone || "Loading"}</div>
      <div>HKID: {displayInformation?.HKID || "Loading"}</div>
      <div>
        Human Verification:
        {displayInformation?.human_verification || "Loading"}
      </div>
      <div>CV: {displayInformation?.cv_upload || "Loading"}</div>
      <div>Public Key: {displayInformation?.public_key || "Loading"}</div>
      <div>created_at: {displayInformation?.created_at || "Loading"}</div>
      <div>updated_at: {displayInformation?.updated_at || "Loading"}</div>
    </IonPage>
  );
};

export default Test;
