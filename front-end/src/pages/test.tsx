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
} from "@ionic/react";
import React, { useState, ChangeEvent } from "react";
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
  ///////////////////////////

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

      <IonContent fullscreen className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{title}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          <IonCardHeader className="Hd">Information</IonCardHeader>
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
              <IonItem>Optional:</IonItem>
              {/* ///////////////////////////////////////////////// */}
              <input
                type="file"
                id="file"
                {...register("file", { required: true })}
              />
              {/* ///////////////////////////////////////////////// */}
              {/* <IonButton</IonButton> */}
            </IonItem>
            <IonButton type="submit">Send</IonButton>
          </form>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Test;
