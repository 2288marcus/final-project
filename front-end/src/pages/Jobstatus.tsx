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
import { star, starOutline, trash } from "ionicons/icons";
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
import { JobCard, jobCardParser } from "../components/JobCard";

let jobListParser = object({
  jobList: array(jobCardParser),
});

const JobStatus: React.FC = () => {
  const title = "Job Status";

  const [segment, setSegment] = useState<"demand" | "supply">("demand");

  const user_id = useAuth().state?.id;
  let jobList = useGet(`/jobs/search?user_id=${user_id}`, jobListParser);

  return (
    <IonPage className="HomePage">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonList class="SH">
            <IonTitle>{title}</IonTitle>
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
              .map((job, index) => (
                <JobCard
                  key={index}
                  job={job}
                  buttons={
                    <IonButton color="danger">
                      <IonIcon src={trash} slot="icon-only"></IonIcon>
                    </IonButton>
                  }
                />
              ))
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default JobStatus;
