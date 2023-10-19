import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonLabel,
  IonItemDivider,
  IonIcon,
  useIonRouter,
} from "@ionic/react";
import React, { useState } from "react";
import "./ProfilePage.css";
import { close, cloudUpload, create, save } from "ionicons/icons";
import { selectFile } from "@beenotung/tslib/file";
import { ParseResult, boolean, nullable, object, string } from "cast.ts";
import useGet from "../hooks/useGet";
import useAuth from "../hooks/useAuth";
import { routes } from "../routes";
import { InputContext, InputField } from "../components/InputField";

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
    description: nullable(string()),
  }),
});

type Profile = ParseResult<typeof getProfileParser>["profile"];

const ProfilePage: React.FC = () => {
  const title = "Information";

  const [editingField, setEditingField] = useState<keyof Profile>();

  const getProfileResult = useGet("/user/profile", getProfileParser);
  function setProfile(profile: Profile) {
    getProfileResult.setData({ profile });
  }
  const auth = useAuth();
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
  const router = useIonRouter();
  function logout() {
    auth.setState(null);
    router.push(routes.login, "root");
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
          <div className="session-title">Personal Information</div>
        </IonItemDivider>
        <IonCard>
          {getProfileResult.render((json) => {
            const profile = json.profile;
            const profileContext: InputContext<Profile> = {
              state: profile,
              setState: setProfile,
              reset: getProfileResult.reload,
              editingField,
              setEditingField,
            };
            return (
              <>
                <InputField
                  inputContext={profileContext}
                  label="Username:"
                  field="username"
                  editable
                />
                <InputField
                  inputContext={profileContext}
                  label="Public Key:"
                  field="public_key"
                />
                <div className="d-flex-md HalfInputFieldContainer">
                  <InputField
                    inputContext={profileContext}
                    label="Full Name:"
                    field="fullName"
                    editable
                  />
                  <InputField
                    inputContext={profileContext}
                    label="Phone(+852):"
                    field="HK_phone"
                    editable
                  />
                </div>
                <InputField
                  inputContext={profileContext}
                  label="Email:"
                  field="email"
                  editable
                />
                <div className="d-flex-md HalfInputFieldContainer">
                  <InputField
                    inputContext={profileContext}
                    label="HKID:"
                    field="HKID"
                  />
                  <InputField
                    inputContext={profileContext}
                    label="Human Verification:"
                    field="human_verification"
                  />
                </div>
                <div className="d-flex-md HalfInputFieldContainer">
                  <InputField
                    inputContext={profileContext}
                    label="Created Date:"
                    field="created_at"
                  />
                  <InputField
                    inputContext={profileContext}
                    label="Update Date:"
                    field="updated_at"
                  />
                </div>
                <div className="description">
                  <InputField
                    inputContext={profileContext}
                    type="textarea"
                    label="Description:"
                    field="description"
                    editable
                  />
                </div>

                <IonItem>
                  <IonLabel position="fixed">CV:</IonLabel>

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
        <div>
          <IonButton onClick={logout} expand="block">
            Logout
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;
