import React, { useState, useEffect } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonAvatar,
  IonLabel,
  IonSearchbar,
  IonAccordion,
  IonAccordionGroup,
  IonSegment,
  IonSegmentButton,
  IonCard,
  IonChip,
  IonIcon,
  IonCardContent,
} from "@ionic/react";
import { star, starOutline } from "ionicons/icons";
import "./HomePage.css";
import { get } from "../api/config";
import useGet from "../hooks/useGet";
import {
  array,
  date,
  float,
  id,
  object,
  string,
  values,
  ParseResult,
  int,
} from "cast.ts";
import { useParams } from "react-router";
import useAuth from "../hooks/useAuth";

let jobListParser = object({
  jobList: array(
    object({
      job_id: id(),
      username: string(),
      user_id: id(),
      title: string(),
      description: string(),
      price: float(),
      created_at: date(),
      type: values(["demand" as const, "supply" as const]),
      tags: array(string()),
    })
  ),
});

type Jobstatus = ParseResult<typeof jobListParser>["jobList"];

const Jobstatus: React.FC = () => {
  const title = "Job Status";

  const [segment, setSegment] = useState<"demand" | "supply">("demand");

  const user_id = useAuth().state?.id;
  let jobList = useGet(`/jobs/search?user_id=${user_id}`, jobListParser);
  // let jobList = useGet(`/jobs/1/profile`, jobListParser);

  function BookmarkCard(props: {
    job: (typeof jobListParser)["sampleValue"]["jobList"][0];
  }) {
    const { job } = props;
    const [bookmark, setBookmark] = useState(false);

    return (
      <IonCard key={job.job_id}>
        <IonCardContent>
          <div className="d-flex align-center" style={{ gap: "8px" }}>
            <div className="d-flex col align-center ion-justify-content-center">
              <IonAvatar>
                <img
                  src={"https://picsum.photos/80/80?random=" + job.job_id}
                  alt="avatar"
                />
              </IonAvatar>
              <span className="author-name">{job.username}</span>
            </div>
            <div>
              <h1>- {job.title} -</h1>
              <p>{job.description}</p>
            </div>
            <IonButtons slot="end">
              <IonButton
                onClick={() => {
                  setBookmark(!bookmark);
                }}
              >
                <IonIcon
                  slot="icon-only"
                  icon={bookmark ? star : starOutline}
                ></IonIcon>
              </IonButton>
            </IonButtons>
          </div>
        </IonCardContent>
        <div>
          {job.tags.map((tag: string) => (
            <IonChip key={tag}>{tag}</IonChip>
          ))}
        </div>
      </IonCard>
    );
  }

  return (
    <IonPage className="HomePage">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonList class="SH">
            <IonTitle>Jobstatus</IonTitle>
          </IonList>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{title}</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonSegment
          value={segment}
          onIonChange={(e) => setSegment(e.detail.value as any)}
        >
          <IonSegmentButton value="demand">demand</IonSegmentButton>
          <IonSegmentButton value="supply">supply</IonSegmentButton>
        </IonSegment>
        <div>
          {jobList.render((json) =>
            json.jobList
              ?.filter((job) => job.type == segment)
              .map((job, index) => {
                return <BookmarkCard key={index} job={job} />;
              })
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Jobstatus;
