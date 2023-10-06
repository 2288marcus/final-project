import {
  IonApp,
  IonRouterOutlet,
  IonSplitPane,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import Menu from "./components/Menu";
import Page from "./pages/Page";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import JobList from "./pages/JobList";
import BookmarkList from "./pages/BookmarkList";
import ProfilePage from "./pages/ProfilePage";
import RequirementPage from "./pages/RequirementPage";
import DrawKey from "./pages/DrawKey";
import DownloadKey from "./pages/DownloadKey";
import UploadKey from "./pages/UploadKey";
import Welcome from "./pages/Welcome";
import Chatroom from "./pages/Chatroom";
import ChatroomList from "./pages/ChatroomList";
import SettingPage from "./pages/SettingPage";

setupIonicReact();

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main">
            <Route path="/" exact={true}>
              <Redirect to="/folder/Inbox" />
            </Route>
            <Route path="/folder/:name" exact={true}>
              <Page />
            </Route>
            <Route path="/login" exact={true}>
              <LoginPage />
            </Route>
            <Route path="/register" exact={true}>
              <RegisterPage />
            </Route>
            <Route path="/JobList" exact={true}>
              <JobList />
            </Route>
            <Route path="/BookmarkList" exact={true}>
              <BookmarkList />
            </Route>
            <Route path="/ProfilePage" exact={true}>
              <ProfilePage />
            </Route>
            <Route path="/RequirementPage" exact={true}>
              <RequirementPage />
            </Route>
            <Route path="/DrawKey" exact={true}>
              <DrawKey />
            </Route>
            <Route path="/DownloadKey" exact={true}>
              <DownloadKey />
            </Route>
            <Route path="/UploadKey" exact={true}>
              <UploadKey />
            </Route>
            <Route path="/welcome" exact={true}>
              <Welcome />
            </Route>
            <Route path="/Chatroom" exact={true}>
              <Chatroom />
            </Route>
            <Route path="/ChatroomList" exact={true}>
              <ChatroomList />
            </Route>
            <Route path="/SettingPage" exact={true}>
              <SettingPage />
            </Route>
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
