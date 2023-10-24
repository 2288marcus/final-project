export let routes = {
  default: "/",
  Page: "/folder/:name",
  home: "/home",
  submit_job: "/submit-job",
  login: "/login",
  Chatroom: "/Chatroom/:id",
  ChatroomList: "/ChatroomList",
  ProfilePage: "/profile",
  SettingPage: "/SettingPage",
  Blockchain: "/Blockchain",
  test: "/test",
  welcome: "/welcome",
  DownloadKey: "/DownloadKey",
  DrawKey: "/DrawKey",
  Edit: "/Demo/Edit",
  Create: "/Demo/Create",
  register: "/register",
  othersProfilePage: (user_id: string | number) => `/profile/${user_id}`,
  BookmarkList: "/BookmarkList",
  JobStatus: "/JobStatus",
};
