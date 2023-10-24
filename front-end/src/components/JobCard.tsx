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
  has_bookmark: int(),
});

export type JobCardData = ParseResult<typeof jobCardParser>;
export type JobType = JobCardData["type"];

export function JobCard(props: { job: JobCardData }) {
  const { job } = props;

  const toast = useToast();

  const dispatchAddBookmarkEvent = useEvent<AddBookmarkEvent>("AddBookmark");

  const addBookmark = async (job: JobCardData) => {
    try {
      const json = await post(`/jobs/${job.job_id}/bookmark`, {}, object({}));
      console.log("successfully add");
      dispatchAddBookmarkEvent({ job });
    } catch (error) {
      console.log(error);
      toast.showError(error);

      return;
    }
  };

  return (
    <IonCard key={job.job_id}>
      <IonCardContent>
        <div className="d-flex align-center" style={{ gap: "8px" }}>
          <IonRouterLink
            routerLink={
              job.job_id ? routes.othersProfilePage(job.user_id) : undefined
            }
          >
            <div className="d-flex col align-center ion-justify-content-center user-part">
              <IonAvatar>
                <img
                  src={`https://picsum.photos/seed/${job.user_id}/80/80`}
                  alt="avatar"
                />
              </IonAvatar>
              <span className="author-name">{job.username}</span>
            </div>
          </IonRouterLink>
          <div>
            <h1>-&nbsp; {job.title} &nbsp;-</h1>
            <p>${job.price.toLocaleString()}</p>
            <p>{job.description}</p>
          </div>
          <IonButtons slot="end">
            <IonButton
              hidden={!job.job_id}
              onClick={() => {
                // if (job.has_bookmark == 0) {
                addBookmark(job);
                // }
              }}
            >
              <IonIcon
                slot="icon-only"
                icon={job.has_bookmark == 0 ? starOutline : star}
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
