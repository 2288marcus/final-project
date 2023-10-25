import { JobCardData } from "./components/JobCard";

export type AddBookmarkEvent = {
  type: "AddBookmark";
  job: JobCardData;
};

export type RemoveBookmarkEvent = {
  type: "RemoveBookmark";
  job_id: number;
};

export type NewJobEvent = {
  type: "NewJob";
  job: JobCardData;
};

export type CancelJobEvent = {
  type: "CancelJob";
  job_id: number;
};

export type AddChatroomEvent = {
  type: "AddChatroom";
  chatroom_id: number;
};
