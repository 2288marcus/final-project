import {
  IonButton,
  IonButtons,
  IonCard,
  IonChip,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenuButton,
  IonNote,
  IonPage,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonTabBar,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./RequirementPage.css";
import { format_2_digit, format_datetime } from "@beenotung/tslib/format";
import { postjob } from "../api/config";
import { object } from "cast.ts";
import { InputContext, InputField } from "../components/InputField";
import { add } from "ionicons/icons";

function toDateString(date: Date) {
  let y = date.getFullYear();
  let m = format_2_digit(date.getMonth() + 1);
  let d = format_2_digit(date.getDate());
  return `${y}-${m}-${d}`;
}

let defaultState = {
  price: "",
  description: "",
  type: "",
  title: "",
};

const RequirementPage: React.FC = () => {
  const title = "Requirement";

  const [state, setState] = useState(defaultState);
  type State = typeof state;

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const submit = () => {
    let data = {
      ...state,
    };
    console.log("data:", data);

    // 发送POST请求到后端
    postjob("/jobs/jobpost", data, object({}))
      .then((res) => {
        console.log("Result:", res);
      })
      .catch((err) => {
        console.log("Fail:", err);
      });
  };

  let price = +state.price;
  let priceErrorMessage =
    price >= 1 && price == Math.floor(price)
      ? ""
      : "(must be greater than zero, and round to dollar (no cents))";
  /////////////////////////////////////////////
  let commonTags = [
    { id: 1, name: "x", used: 1 },
    { id: 2, name: "y", used: 10 },
    { id: 3, name: "z", used: 5 },
  ];
  /////////////////////////////////////////////

  let inputContext: InputContext<State> = {
    state,
    setState,
    alwaysEditable: true,
  };

  return (
    <IonPage className="RequirementPage">
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

        <IonCard>
          <InputField
            inputContext={inputContext}
            label="Title:"
            field="title"
          />
          <div className="d-flex-md HalfInputFieldContainer">
            <div className="flex-grow HalfInputField">
              <IonItem>
                <IonLabel position="fixed">Service Type:</IonLabel>
                <IonSelect
                  value={state.type}
                  onIonChange={(e) => {
                    setState({ ...state, type: e.detail.value! });
                  }}
                >
                  <IonSelectOption value="demand">Demand</IonSelectOption>
                  <IonSelectOption value="supply">Supply</IonSelectOption>
                </IonSelect>
              </IonItem>
            </div>
            <InputField
              inputContext={inputContext}
              label="Price:"
              field="price"
            />
          </div>
          <div className="flex-grow HalfInputField">
            <IonItem>
              <IonLabel position="fixed">Hash Tags:</IonLabel>
              <IonInput
                type="text"
                value={newTag}
                onIonChange={(e) => setNewTag(e.detail.value || "")}
              ></IonInput>
              <IonButtons slot="end">
                <IonButton
                  onClick={() => {
                    setSelectedTags([...selectedTags, newTag]);
                    setNewTag("");
                  }}
                >
                  <IonIcon src={add}></IonIcon>
                </IonButton>
              </IonButtons>
            </IonItem>
          </div>
          <IonListHeader>Selected Tags:</IonListHeader>
          <div className="ion-padding-horizontal d-flex">
            {selectedTags.length == 0 ? (
              <IonNote className="ion-padding-horizontal">
                Not selected any tag yet
              </IonNote>
            ) : null}
            {selectedTags.map((tag) => (
              <IonChip
                key={tag}
                onClick={() =>
                  setSelectedTags(
                    selectedTags.filter((selectedTag) => selectedTag != tag)
                  )
                }
              >
                {tag}
              </IonChip>
            ))}
          </div>
          <IonListHeader>Common Tags:</IonListHeader>
          <div className="ion-padding-horizontal d-flex">
            {commonTags.map((tag) => (
              <IonChip
                key={tag.id}
                onClick={() => setSelectedTags([...selectedTags, tag.name])}
                hidden={selectedTags.includes(tag.name)}
              >
                {tag.name} ({tag.used} used)
              </IonChip>
            ))}
          </div>
          <InputField
            inputContext={inputContext}
            label="Description:"
            field="description"
            type="textarea"
          />
        </IonCard>

        <IonCard>
          <IonItem>
            <IonLabel position="floating">
              <IonText>Title:</IonText>
            </IonLabel>
            <IonInput
              type="text"
              onIonChange={(e) => {
                setState({ ...state, title: e.detail.value! });
              }}
            />
          </IonItem>
          <>
            <div className="d-flex-md HalfInputFieldContainer">
              <IonItem>
                <IonItem>
                  <IonSelect
                    label="Service:"
                    placeholder="-Type-"
                    onIonChange={(e) => {
                      setState({ ...state, type: e.detail.value! });
                    }}
                  >
                    <IonSelectOption value="demand">Demand</IonSelectOption>
                    <IonSelectOption value="supply">Supply</IonSelectOption>
                  </IonSelect>
                </IonItem>

                <IonItem>
                  <IonLabel
                    position="floating"
                    color={priceErrorMessage ? "danger" : ""}
                  >
                    <IonText color="dark">Price (HKD)</IonText>
                  </IonLabel>
                  <IonInput
                    type="number"
                    min="1"
                    step="1"
                    value={state.price}
                    onIonChange={(e) => {
                      setState({ ...state, price: e.detail.value! });
                    }}
                  />
                  {priceErrorMessage ? (
                    <IonNote className="ion-padding-horizontal ion-margin-bottom">
                      <IonText color="danger">{priceErrorMessage}</IonText>
                    </IonNote>
                  ) : null}
                </IonItem>
              </IonItem>
            </div>
          </>
          <IonItem>
            <IonItem slot="start">
              <IonInput
                label="Insert Related Tag:"
                type="text"
                onIonChange={(e) => {
                  // setState({ ...state, Tag: e.detail.value! });
                }}
              />
            </IonItem>
            <IonItem>
              <IonSelect placeholder="Select command tag(s)">
                <IonInput
                  type="text"
                  onIonChange={(e) => {
                    // setState({ ...state, tag: e.detail.value! });
                  }}
                />
                <IonSelectOption value="education">Education</IonSelectOption>
                <IonSelectOption value="cleaning">Cleaning</IonSelectOption>
                <IonSelectOption value="logistics">Logistics</IonSelectOption>

                <IonSelectOption value="sport">Sport</IonSelectOption>
                <IonSelectOption value="travel">Travel</IonSelectOption>
                <IonSelectOption value="fnb">Food and Beverage</IonSelectOption>

                <IonSelectOption value="IT">IT</IonSelectOption>
                <IonSelectOption value="photography">
                  Photography
                </IonSelectOption>
                <IonSelectOption value="journalist">Journalist</IonSelectOption>

                <IonSelectOption value="designer">Designer</IonSelectOption>
              </IonSelect>
            </IonItem>
            <IonGrid>
              <IonRow>
                <IonCol>1</IonCol>
                <IonCol>2</IonCol>
                <IonCol>3</IonCol>
              </IonRow>
            </IonGrid>
          </IonItem>

          <IonItem>
            <IonTextarea
              autoGrow
              label="Description"
              labelPlacement="floating"
              onIonChange={(e) => {
                setState({ ...state, description: e.detail.value! });
              }}
            />
          </IonItem>
        </IonCard>
        <IonButton expand="full" onClick={submit}>
          Post
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default RequirementPage;
