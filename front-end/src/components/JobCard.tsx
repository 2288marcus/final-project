import {
  IonCard,
  IonCardContent,
  IonRouterLink,
  IonAvatar,
  IonButtons,
  IonButton,
  IonIcon,
  IonChip,
} from "@ionic/react";
import { star, starOutline } from "ionicons/icons";
import { useState } from "react";
import { routes } from "../routes";
import {
  object,
  id,
  string,
  float,
  date,
  values,
  array,
  ParseResult,
} from "cast.ts";

export let jobCardParser = object({
  job_id: id(),
  username: string(),
  user_id: id(),
  title: string(),
  description: string(),
  price: float(),
  created_at: date(),
  type: values(["demand" as const, "supply" as const]),
  tags: array(string()),
});

export type JobCardData = ParseResult<typeof jobCardParser>;
export type JobType = JobCardData["type"];

export function JobCard(props: { job: JobCardData }) {
  const { job } = props;
  const [bookmark, setBookmark] = useState(false);

  return (
    <IonCard key={job.job_id}>
      <IonCardContent>
        <div className="d-flex align-center" style={{ gap: "8px" }}>
          <IonRouterLink
            routerLink={
              job.job_id ? routes.othersProfilePage(job.user_id) : undefined
            }
          >
            <div
              className="d-flex col align-center ion-justify-content-center user-part"
              onClick={() => {}}
            >
              <IonAvatar>
                <img
                  src={"https://picsum.photos/80/80?random=" + job.job_id}
                  alt="avatar"
                />
              </IonAvatar>
              <span className="author-name">{job.username}</span>
            </div>
          </IonRouterLink>
          <div>
            <h1> &nbsp; {job.title} &nbsp; </h1>
            <p>${job.price.toLocaleString()}</p>
            <p>{job.description}</p>
          </div>
          <IonButtons slot="end">
            <IonButton
              hidden={!job.job_id}
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
