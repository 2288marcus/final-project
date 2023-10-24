import {
  IonButton,
  IonButtons,
  IonCard,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonListHeader,
  IonMenuButton,
  IonModal,
  IonNote,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useEffect, useState } from "react";
import "./RequirementPage.css";
import { get, post } from "../api/config";
import { ParseResult, object, string, array, id, int } from "cast.ts";
import { InputContext, InputField } from "../components/InputField";
import { add } from "ionicons/icons";
import useToast from "../hooks/useToast";
import useGet from "../hooks/useGet";
import { JobCard, JobType } from "../components/JobCard";
import useAuth from "../hooks/useAuth";

const defaultState = {
  price: "",
  description: "",
  type: "demand" as JobType,
  title: "",
};

let getTagListParser = object({
  tagList: array(
    object({
      id: id(),
      name: string(),
      used: int(),
    })
  ),
});
type Tag = ParseResult<typeof getTagListParser>["tagList"][number];

const RequirementPage: React.FC = () => {
  const title = "Requirement";

  const [state, setState] = useState(defaultState);
  type State = typeof state;

  const toast = useToast();

  const auth = useAuth();

  type Mode = "draft" | "preview" | "submit";
  const [mode, setMode] = useState<Mode>("draft");

  function reset() {
    setState(defaultState);
    setMode("draft");
    setNewTag("");
    setSelectedTags([]);
  }

  const submit = () => {
    setMode("submit");
    let data = {
      ...state,
      tags: selectedTags,
    };
    console.log("data:", data);

    // 发送POST请求到后端
    post("/jobs", data, object({}))
      .then((res) => {
        console.log("Result:", res);
        toast.showSuccess("message");
        reset();
      })
      .catch((err) => {
        console.log("Fail:", err);
        let message = String(err);
        if (message.includes('Invalid int "body.price"')) {
          message =
            "The price must be greater than zero, and round to dollar (no cents)";
        }
        toast.showError(message);
        setMode("draft");
      });
  };

  /////////////////////////

  let price = +state.price;
  let priceErrorMessage =
    price >= 1 && price == Math.floor(price)
      ? ""
      : "must be greater than zero, and round to dollar (no cents)";

  const commonTags = useGet("/tags", getTagListParser);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [searchedTags, setSearchedTags] = useState<Tag[]>([]);

  useEffect(() => {
    if (!newTag) {
      setSearchedTags([]);
      return;
    }
    get("/tags/search?" + new URLSearchParams({ q: newTag }), getTagListParser)
      .then((json) => {
        setSearchedTags(json.tagList);
      })
      .catch((err) => {
        toast.showError(err);
      });
  }, [newTag]);

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
          <IonItem hidden>
            <IonInput
              label="aa:"
              labelPlacement="fixed"
              value="xxx"
              helperText="aaa"
              errorText="bbb"
              className="ion-invalid ion-touched"
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="fixed">Service:</IonLabel>
            <IonSelect
              placeholder="Type"
              value={state.type}
              onIonChange={(e) => {
                setState({ ...state, type: e.detail.value! });
              }}
            >
              <IonSelectOption value="demand">Demand</IonSelectOption>
              <IonSelectOption value="supply">Supply</IonSelectOption>
            </IonSelect>
          </IonItem>
          <div className="d-flex-md HalfInputFieldContainer">
            <div className="flex-grow HalfInputField">
              <InputField
                inputContext={inputContext}
                label="Title:"
                field="title"
              />
            </div>
            <InputField
              inputContext={inputContext}
              label="Price:"
              field="price"
              errorText={priceErrorMessage}
            />
          </div>
          <div className="flex-grow HalfInputField">
            <IonItem>
              <IonLabel position="fixed">Hash Tags:</IonLabel>
              <IonInput
                type="text"
                value={newTag}
                onIonInput={(e) => setNewTag(e.detail.value || "")}
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
          {newTag && searchedTags.length > 0 ? (
            <>
              <IonListHeader>Suggested Tags:</IonListHeader>
              <div className="ion-padding-horizontal d-flex">
                {searchedTags.map((tag) => (
                  <IonChip
                    key={tag.id}
                    onClick={() => setSelectedTags([...selectedTags, tag.name])}
                    hidden={selectedTags.includes(tag.name)}
                  >
                    <div>
                      <div>{tag.name}</div>
                      <div>({tag.used} used)</div>
                    </div>
                  </IonChip>
                ))}
              </div>
            </>
          ) : (
            <>
              <IonListHeader>Common Tags:</IonListHeader>
              <div className="ion-padding-horizontal d-flex">
                {commonTags.data?.tagList?.map((tag) => (
                  <IonChip
                    key={tag.id}
                    onClick={() => setSelectedTags([...selectedTags, tag.name])}
                    hidden={selectedTags.includes(tag.name)}
                  >
                    <div>
                      <div>{tag.name}</div>
                      <div>({tag.used} used)</div>
                    </div>
                  </IonChip>
                ))}
              </div>
            </>
          )}

          <InputField
            inputContext={inputContext}
            label="Description:"
            field="description"
            type="textarea"
          />
        </IonCard>
        <IonButton
          hidden={mode != "draft"}
          expand="full"
          onClick={() => setMode("preview")}
        >
          Preview
        </IonButton>
        <IonButton
          hidden={mode != "submit"}
          disabled
          expand="full"
          onClick={() => setMode("preview")}
        >
          Submitting...
        </IonButton>
      </IonContent>

      <IonModal isOpen={mode == "preview"}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="end">
              <IonButton onClick={() => setMode("draft")}>Cancel</IonButton>
            </IonButtons>
            <IonTitle>{title}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <p>
            Editing post is not allowed after submission. Please double-check
            before confirming.
          </p>
          <JobCard
            job={{
              job_id: 0,
              username: auth.state!.username,
              user_id: auth.state!.id,
              title: state.title,
              description: state.description,
              price: +state.price,
              created_at: new Date(),
              type: state.type,
              tags: selectedTags,
            }}
          />
          <IonButton onClick={submit}>Confirm & Submit</IonButton>
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

export default RequirementPage;
