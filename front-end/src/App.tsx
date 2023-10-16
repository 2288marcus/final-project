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
import "./theme/global.css";
import "./theme/variables.css";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import BookmarkList from "./pages/BookmarkList";
import ProfilePage from "./pages/ProfilePage";
import RequirementPage from "./pages/RequirementPage";
import DrawKey from "./pages/DrawKey";
import DownloadKey from "./pages/DownloadKey";
import Welcome from "./pages/Welcome";
import Chatroom from "./pages/Chatroom";
import ChatroomList from "./pages/ChatroomList";
import SettingPage from "./pages/SettingPage";
import Blockchain from "./pages/Blockchain";
import Test from "./pages/test";
import EditPage from "./pages/Demo/EditPage";
import { routes } from "./routes";
import ProfileCheckPage from "./pages/ProfileCheckPage";

setupIonicReact();

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route>
            <IonSplitPane contentId="main">
              <Menu />
              <IonRouterOutlet id="main">
                <Route path={routes.Page} exact={true}>
                  <Page />
                </Route>
                <Route path={routes.default} exact={true}>
                  <LoginPage />
                </Route>
                <Route path={routes.login} exact={true}>
                  <LoginPage />
                </Route>
                <Route path={routes.register} exact={true}>
                  <RegisterPage />
                </Route>
                <Route path={routes.home} exact={true}>
                  <HomePage />
                </Route>
                {/* <Route path="/BookmarkList" exact={true}>
                  <BookmarkList />
                </Route> */}

                <Route path={routes.ProfilePage} exact={true}>
                  <ProfilePage />
                </Route>
                <Route path={routes.Create} exact={true}>
                  <ProfilePage />
                </Route>
                <Route path={routes.Edit} exact={true}>
                  <EditPage />
                </Route>
                <Route path={routes.submit_job} exact={true}>
                  <RequirementPage />
                </Route>
                {/* <Route path={routes.DrawKey} exact={true}>
                  <DrawKey />
                </Route>
                <Route path={routes.DownloadKey} exact={true}>
                  <DownloadKey />
                </Route> */}
                <Route path={routes.welcome} exact={true}>
                  <Welcome />
                </Route>
                <Route path={routes.Chatroom} exact={true}>
                  <Chatroom />
                </Route>
                <Route path={routes.ChatroomList} exact={true}>
                  <ChatroomList />
                </Route>
                <Route path={routes.SettingPage} exact={true}>
                  <SettingPage />
                </Route>
                <Route path={routes.Blockchain} exact={true}>
                  <Blockchain />
                </Route>
                <Route path={routes.test} exact={true}>
                  <Test />
                </Route>
                <Route path={routes.ProfileCheckPage} exact={true}>
                  <ProfileCheckPage />
                </Route>
              </IonRouterOutlet>
            </IonSplitPane>
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
