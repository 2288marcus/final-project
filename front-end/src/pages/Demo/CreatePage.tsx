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
  IonCard,
  IonLabel,
  IonItemDivider,
  IonItemGroup,
  IonListHeader,
  IonRow,
  IonCol,
  IonCardContent,
  IonIcon,
} from "@ionic/react";
import React, { useState, ChangeEvent, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "./ProfilePage.css";
import { useForm, SubmitHandler } from "react-hook-form";
import { IonContext } from "@ionic/react/dist/types/contexts/IonContext";
import {
  calendarClear,
  close,
  closeCircle,
  create,
  save,
} from "ionicons/icons";

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
    HKID: string;
    public_key: string;
    HK_phone: string;
  }>();

  async function getProfile() {
    try {
      let res = await fetch("http://localhost:3000/user/profile/1");
      let json = await res.json();
      let { user, error } = json;
      if (error) {
        throw new Error(error);
      }
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
    } catch (error) {
      console.error(error);
      // sample data
      setDisplayInformation({
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

    return;
  }

  useEffect(() => {
    getProfile();
  }, []);
  ///////////////////////////

  const [mode, setMode] = useState("view");

  return (
    <IonPage className="ProfilePage">
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

        <div>before</div>
        <IonItemDivider>
          {/* <div className="session-title">Personal Information</div> */}
          <div className="session-title d-flex ion-justify-content-between ion-align-items-center">
            <div>
              {mode == "edit" ? (
                <IonButton
                  slot="end"
                  size="small"
                  color="dark"
                  onClick={() => setMode("view")}
                >
                  <IonIcon src={close} slot="icon-only"></IonIcon>
                </IonButton>
              ) : null}
            </div>
            <div>Personal Information</div>
            <div>
              {mode != "edit" ? (
                <IonButton
                  slot="end"
                  size="small"
                  onClick={() => setMode("edit")}
                >
                  <IonIcon src={create} slot="icon-only"></IonIcon>
                </IonButton>
              ) : (
                <>
                  <IonButton
                    slot="end"
                    size="small"
                    color="success"
                    onClick={() => setMode("save")}
                  >
                    <IonIcon src={save} slot="icon-only"></IonIcon>
                  </IonButton>
                </>
              )}
            </div>
          </div>
        </IonItemDivider>
        <div>edit all</div>

        <IonCard>
          {!displayInformation ? (
            <p className="ion-text-center">Loading Profile...</p>
          ) : (
            <>
              <IonItem>
                <IonLabel position="fixed">Username</IonLabel>
                <IonInput value={displayInformation.username}></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="fixed" color="danger">
                  Email
                </IonLabel>
                <IonInput></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="fixed">Full Name</IonLabel>
                <IonInput
                  value={displayInformation.fullName}
                  readonly={mode == "view"}
                ></IonInput>
              </IonItem>
            </>
          )}
        </IonCard>
        <div>edit each</div>
        <IonCard>
          {!displayInformation ? (
            <p className="ion-text-center">Loading Profile...</p>
          ) : (
            <>
              <IonCardHeader>Mode: {mode}</IonCardHeader>
              <IonItem>
                <IonLabel position="fixed">Username</IonLabel>
                <IonInput value={displayInformation.username}></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="fixed" color="danger">
                  Email
                </IonLabel>
                <IonInput></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="fixed">Full Name</IonLabel>
                <IonInput
                  value={displayInformation.fullName}
                  readonly={mode == "view"}
                ></IonInput>
                {mode == "view" ? (
                  <IonButton
                    slot="end"
                    size="small"
                    onClick={() => setMode("edit")}
                  >
                    <IonIcon src={create} slot="icon-only"></IonIcon>
                  </IonButton>
                ) : (
                  <IonButton
                    slot="end"
                    size="small"
                    color="success"
                    onClick={() => setMode("view")}
                  >
                    <IonIcon src={save} slot="icon-only"></IonIcon>
                  </IonButton>
                )}
              </IonItem>
            </>
          )}
        </IonCard>
        <div>after</div>

        <IonItemDivider>
          <IonTitle size="small">Personal Information</IonTitle>
        </IonItemDivider>
        <IonCard className="profilecard">
          <IonItem>
            <IonItem lines="none">
              Username: {displayInformation?.username || "Loading"}
            </IonItem>
            <IonItem lines="none">
              (+852) Phone: {displayInformation?.HK_phone || "Loading"}
            </IonItem>
          </IonItem>
          <IonItem>
            <IonItem lines="none">
              Email: {displayInformation?.email || "Loading"}
            </IonItem>
          </IonItem>
          <IonItem>
            <IonItem lines="none">
              Full Name: {displayInformation?.fullName || "Loading"}
            </IonItem>
            <IonItem lines="none">
              HKID: {displayInformation?.HKID || "Loading"}
            </IonItem>
          </IonItem>
          <IonItem>
            <IonItem lines="none">
              Created at: {displayInformation?.created_at || "Loading"}
            </IonItem>
            <IonItem lines="none">
              Updated at: {displayInformation?.updated_at || "Loading"}
            </IonItem>
          </IonItem>
          <IonItem>
            <IonItem lines="none">
              Public Key: {displayInformation?.public_key || "Loading"}
            </IonItem>
            <IonItem lines="none">
              Human Verification:
              {displayInformation?.human_verification || "Loading"}
            </IonItem>
          </IonItem>
          <IonItem>
            <IonItem> CV:{displayInformation?.cv_upload || "Loading"}</IonItem>
          </IonItem>
        </IonCard>
        <br />

        <IonList>
          <IonItemDivider>
            <IonTitle size="small">Information Update</IonTitle>
          </IonItemDivider>
          <form onSubmit={handleSubmit(onSubmit)}>
            <IonItem>
              <IonInput label="Username" {...register("name")} />
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
    </IonPage>
  );
};

export default ProfilePage;
