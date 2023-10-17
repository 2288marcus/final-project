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
  IonPopover,
} from "@ionic/react";
import React, { useState, useEffect } from "react";
import "./ProfilePage.css";
import { cloudUpload } from "ionicons/icons";
import { selectFile } from "@beenotung/tslib/file";
import { api_origin, get } from "../api/config";
import { ParseResult, boolean, nullable, object, string } from "cast.ts";
import useGet from "../hooks/useGet";
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

type ProfileCheckPage = ParseResult<typeof getProfileParser>["profile"];

const ProfileCheckPage: React.FC = () => {
  const title = "Information";

  const getProfileResult = useGet("/user/profile", getProfileParser);

  // function setProfile(profile: ProfileCheckPage) {
  //   getProfileResult.setData({ profile });
  // }

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

  async function selectCVFile() {
    let [file] = await selectFile({
      accept: ".pdf,.doc,.docx",
    });
    if (!file) return;
    setDraftFile(file);
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
            const profileContext: InputContext<ProfileCheckPage> = {
              state: profile,
            };

            return (
              <>
                <InputField
                  inputContext={profileContext}
                  label="Username:"
                  field="username"
                />

                <div className="d-flex-md HalfInputFieldContainer">
                  <InputField
                    inputContext={profileContext}
                    label="Full Name:"
                    field="fullName"
                  />
                  <InputField
                    inputContext={profileContext}
                    label="Phone(+852):"
                    field="HK_phone"
                  />
                </div>
                <InputField
                  inputContext={profileContext}
                  label="Email:"
                  field="email"
                />
                <div className="description">
                  <InputField
                    inputContext={profileContext}
                    type="textarea"
                    label="Description:"
                    field="description"
                  />
                </div>

                <IonItem>
                  <IonLabel position="fixed">CV:</IonLabel>
                  <div>{draftFile?.name || profile.cv_upload}</div>
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
              </>
            );
          })}
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default ProfileCheckPage;
