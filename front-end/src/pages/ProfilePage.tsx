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
  }>();

  async function getProfile() {
    let res = await fetch("http://localhost:3000/user/profile/1");
    let user = await res.json();
    console.log(user);

    if (user) {
      setDisplayInformation({ username: user.username });
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
        <IonItem>
          <div>username: {displayInformation?.username || "Loading"}</div>
        </IonItem>
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;
