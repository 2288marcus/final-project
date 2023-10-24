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
  IonIcon,
} from "@ionic/react";
import React, { useState } from "react";
import "./ProfilePage.css";
import { cloudUpload } from "ionicons/icons";
import { selectFile } from "@beenotung/tslib/file";
import { ParseResult, nullable, object, string } from "cast.ts";
import useGet from "../hooks/useGet";
import { InputContext, InputField } from "../components/InputField";
import { useParams } from "react-router";

let getProfileParser = object({
  profile: object({
    username: string(),
    email: string(),
    cv_upload: nullable(string()),
    fullName: string(),
    HK_phone: string(),
    description: nullable(string()),
  }),
});

type OthersProfilePage = ParseResult<typeof getProfileParser>["profile"];

const OthersProfilePage: React.FC = () => {
  const title = "Target Information";

  const params = useParams<{ user_id: string }>();

  const getProfileResult = useGet(
    `/users/${params.user_id}/profile`,
    getProfileParser
  );

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

        <IonCard>
          {getProfileResult.render((json) => {
            const profile = json.profile;
            const profileContext: InputContext<OthersProfilePage> = {
              state: profile,
            };
            return (
              <>
                <div className="d-flex-md HalfInputFieldContainer">
                  <InputField
                    inputContext={profileContext}
                    label="Username:"
                    field="username"
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
                <div className="d-flex-md HalfInputFieldContainer">
                  <InputField
                    inputContext={profileContext}
                    label="Full Name:"
                    field="fullName"
                  />
                  <InputField
                    inputContext={profileContext}
                    label="Volume :"
                    field="HK_phone"
                  />
                </div>
              </>
            );
          })}
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default OthersProfilePage;
