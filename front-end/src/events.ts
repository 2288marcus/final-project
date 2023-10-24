import { JobCardData } from "./components/JobCard";

export type AddBookmarkEvent = {
  type: "AddBookmark";
  job: JobCardData;
};

export type RemoveBookmarkEvent = {
  type: "RemoveBookmark";
  job_id: number;
};
