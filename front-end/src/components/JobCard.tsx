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
  int,
} from "cast.ts";
import { post } from "../api/config";
import useToast from "../hooks/useToast";
import { AddBookmarkEvent, RemoveBookmarkEvent } from "../events";
import { useEvent } from "react-use-event";
import "./JobCard.css";

export let jobCardParser = object({
  job_id: id(),
  user_id: id(),
  username: string(),
  title: string(),
  description: string(),
  price: float(),
  created_at: date(),
  type: values(["demand" as const, "supply" as const]),
  tags: array(string()),
  has_bookmark: int(),
});

export type JobCardData = ParseResult<typeof jobCardParser>;
export type JobType = JobCardData["type"];

export function JobCard(props: { job: JobCardData; buttons: React.ReactNode }) {
  const { job } = props;

  return (
    <IonCard key={job.job_id} className="JobCard">
      <IonCardContent>
        <div className="d-flex align-center ion-justify-content-between">
          <div className="d-flex mobile-col">
            <IonRouterLink
              routerLink={
                job.job_id ? routes.othersProfilePage(job.user_id) : undefined
              }
            >
              <div
                className="d-flex col align-center ion-justify-content-center user-part mobile-row"
                style={{ marginInlineEnd: "2rem" }}
              >
                <IonAvatar>
                  <img
                    src={`https://picsum.photos/seed/${job.user_id}/80/80`}
                    alt="avatar"
                  />
                </IonAvatar>
                <span className="author-name " style={{ fontSize: "medium" }}>
                  {job.username}
                </span>
              </div>
            </IonRouterLink>
            <div>
              <h1>-&nbsp; {job.title} &nbsp;-</h1>
              <p>${job.price.toLocaleString()}</p>
              <p>{job.description}</p>
            </div>
          </div>
          <IonButtons>{props.buttons}</IonButtons>
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
