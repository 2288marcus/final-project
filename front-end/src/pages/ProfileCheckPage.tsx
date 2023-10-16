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
  setupIonicReact,
  IonTextarea,
} from "@ionic/react";
import React, { useState, useEffect } from "react";
import "./ProfilePage.css";
import { close, cloudUpload, create, save } from "ionicons/icons";
import { selectFile } from "@beenotung/tslib/file";
import { api_origin, get } from "../api/config";
import { ParseResult, boolean, nullable, object, string } from "cast.ts";
import useGet from "../hooks/useGet";

let getProfileParser = object({
  profile: object({
    username: string(),
    email: string(),
    human_verification: boolean(),
    cv_upload: nullable(string()),
    created_at: string(),
    updated_at: string(),
    fullName: string(),
    HKID: string(),
    public_key: string(),
    HK_phone: string(),
  }),
});

type Profile = ParseResult<typeof getProfileParser>["profile"];

const Test: React.FC = () => {
  const title = "Information";

  const [editingField, setEditingField] = useState<keyof Profile>();

  const getProfileResult = useGet("/user/profile", getProfileParser);

  function setProfile(profile: Profile) {
    getProfileResult.setData({ profile });
  }
  const resetProfile = getProfileResult.reload;

  // setProfile({
  //   username: "alicewong123",
  //   email: "x",
  //   human_verification: true,
  //   cv_upload: "x.pdf",
  //   created_at: "x",
  //   updated_at: "x",
  //   fullName: "Alice Wong",
  //   HKID: "x",
  //   public_key: "x",
  //   HK_phone: "x",
  // });

  ///////////////////////////

  const [draftFile, setDraftFile] = useState<File>();
  const [uploadState, setUploadState] = useState("idle");

  async function selectCVFile() {
    let [file] = await selectFile({
      accept: ".pdf,.doc,.docx",
    });
    if (!file) return;
    setDraftFile(file);
  }

  async function uploadCVFile() {
    setUploadState("upload");
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setDraftFile(undefined);
    } catch (error) {
      // show error
    } finally {
      setUploadState("idle");
    }
  }

  return (
    <IonPage className="Profile">
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
          {getProfileResult.render((json) => {
            const profile = json.profile;
            const profileContext: ProfileContext = {
              profile,
              setProfile,
              resetProfile,
              editingField,
              setEditingField,
            };

            return (
              <>
                <ProfileField
                  profileContext={profileContext}
                  label="Username:"
                  field="username"
                />
                <ProfileField
                  profileContext={profileContext}
                  label="Public Key:"
                  field="public_key"
                />
                <div className="d-flex-md HalfInputFieldContainer">
                  <ProfileField
                    profileContext={profileContext}
                    label="Full Name:"
                    field="fullName"
                  />
                  <ProfileField
                    profileContext={profileContext}
                    label="Phone(+852):"
                    field="HK_phone"
                  />
                </div>
                <ProfileField
                  profileContext={profileContext}
                  label="Email:"
                  field="email"
                />
                <div className="d-flex-md HalfInputFieldContainer">
                  <ProfileField
                    profileContext={profileContext}
                    label="HKID:"
                    field="HKID"
                  />
                  <ProfileField
                    profileContext={profileContext}
                    label="Human Verification:"
                    field="human_verification"
                  />
                </div>
                <div className="d-flex-md HalfInputFieldContainer">
                  <ProfileField
                    profileContext={profileContext}
                    label="Created Date:"
                    field="created_at"
                  />
                  <ProfileField
                    profileContext={profileContext}
                    label="Update Date:"
                    field="updated_at"
                  />
                </div>

                <IonItem>
                  <IonLabel>Description</IonLabel>
                  <IonTextarea placeholder="Self-information" />
                </IonItem>

                <IonItem>
                  <IonLabel position="fixed">CV:</IonLabel>
                  <div>
                    {draftFile?.name || profileContext.profile.cv_upload}
                  </div>
                  <IonButtons>
                    <IonButton
                      size="small"
                      color="primary"
                      onClick={selectCVFile}
                    >
                      <IonIcon src={cloudUpload} slot="icon-only"></IonIcon>
                    </IonButton>
                  </IonButtons>
                </IonItem>
                <div className="d-flex">
                  <IonButton
                    color="dark"
                    className="flex-grow ion-no-margin"
                    expand="full"
                    onClick={() => setDraftFile(undefined)}
                    hidden={!draftFile || uploadState == "upload"}
                  >
                    <IonIcon src={close} slot="icon-only"></IonIcon>
                  </IonButton>
                  <IonButton
                    color="success"
                    className="flex-grow ion-no-margin"
                    expand="full"
                    onClick={uploadCVFile}
                    hidden={!draftFile || uploadState == "upload"}
                  >
                    <IonIcon src={save} slot="icon-only"></IonIcon>
                  </IonButton>
                  <IonButton
                    color="success"
                    className="flex-grow ion-no-margin"
                    expand="full"
                    disabled
                    hidden={uploadState != "upload"}
                  >
                    Uploading ...
                  </IonButton>
                </div>
              </>
            );
          })}
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

type ProfileContext = {
  profile: Profile;
  setProfile(value: Profile): void;
  resetProfile(): void;
  editingField?: keyof Profile;
  setEditingField(value?: keyof Profile): void;
};

function ProfileField(props: {
  profileContext: ProfileContext;
  label: string;
  field: keyof Profile;
  editable?: boolean;
}) {
  type Mode = "view" | "edit" | "cancel" | "save";

  const [mode, setMode] = useState<Mode>("view");

  async function saveProfile() {
    // TODO post to server
    setTimeout(() => {
      setMode("view");
    }, 5000);
  }

  const { field, editable } = props;
  const { setEditingField, resetProfile, profile, setProfile, editingField } =
    props.profileContext;

  const shouldResetEditingField = mode != "edit" && editingField == field;

  useEffect(() => {
    if (shouldResetEditingField) {
      setEditingField();
    }
    switch (mode) {
      case "edit":
        // setEditingField(field);
        return;
      case "cancel":
        // resetProfile();
        // setMode("view");
        return;
      case "save":
        // saveProfile();
        return;
    }
  }, [
    shouldResetEditingField,
    mode,
    setEditingField,
    saveProfile,
    resetProfile,
    field,
  ]);

  return (
    <div className="flex-grow HalfInputField">
      <IonItem>
        <IonLabel position={mode == "view" ? "fixed" : "floating"}>
          {props.label}
        </IonLabel>
        <IonInput
          value={String(profile[field])}
          onIonChange={(e) =>
            setProfile({
              ...profile,
              [props.field]: e.detail.value || "",
            })
          }
          readonly={mode != "edit"}
        />
        <IonButtons slot="end">
          <IonButton
            slot="end"
            size="small"
            color="primary"
            onClick={() => setMode("edit")}
            hidden={!editable || mode != "view"}
            disabled={editingField && editingField != field}
          >
            <IonIcon src={create} slot="icon-only"></IonIcon>
          </IonButton>
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
    </div>
  );
}

export default Test;
