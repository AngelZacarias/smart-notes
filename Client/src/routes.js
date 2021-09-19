// Icons from @material-ui/icons/
import { Dashboard, Today, Forum, Info, List, LibraryBooks, ScatterPlot } from "@material-ui/icons/";

// Component Views
import Subjects from "./views/General/Subjects";
import Chat from "./views/General/Chat";
import Schedule from "./views/General/Schedule";
import About from "./views/General/About";
import Profile from "./views/General/Profile";
import Search from "./views/General/Search";
import Notes from "./views/Subject/Notes";
import SmartStudy from "./views/Subject/SmartStudy";
import Tasks from "./views/Subject/Tasks";

const dashboardRoutes = [
  {
    path: "/subjects",
    name: "Materias",
    rtlName: "",
    icon: Dashboard,
    component: Subjects,
    layout: "/dashboard",
    menu: true,
    returnTo: "",
  },
  {
    path: "/schedule",
    name: "Horario",
    rtlName: "",
    icon: Today,
    component: Schedule,
    layout: "/dashboard",
    menu: true,
    returnTo: "",
  },
  {
    path: "/chat",
    name: "Chat",
    rtlName: "",
    icon: Forum,
    component: Chat,
    layout: "/dashboard",
    menu: true,
    returnTo: "",
  },
  {
    path: "/about",
    name: "Acerca de",
    rtlName: "",
    icon: Info,
    component: About,
    layout: "/dashboard",
    menu: true,
    returnTo: "",
  },
  {
    path: "/profile",
    name: "Profile",
    rtlName: "",
    icon: Info,
    component: Profile,
    layout: "/dashboard",
    menu: false,
    returnTo: "",
  },
  {
    path: "/search",
    name: "Search",
    rtlName: "",
    icon: Info,
    component: Search,
    layout: "/dashboard",
    menu: false,
    returnTo: "",
  },
  // SUBJECT
  {
    path: "/subject-tasks",
    name: "Tareas",
    rtlName: "",
    icon: List,
    component: Tasks,
    layout: "/subject",
    menu: true,
    returnTo: "",
  },
  {
    path: "/subject-notes",
    name: "Notas",
    rtlName: "",
    icon: LibraryBooks,
    component: Notes,
    layout: "/subject",
    menu: true,
    returnTo: "",
  },
  {
    path: "/subject-study",
    name: "Smart Study",
    rtlName: "",
    icon: ScatterPlot,
    component: SmartStudy,
    layout: "/subject",
    menu: true,
    returnTo: "",
  },
  {
    path: "/subjects",
    name: "Regresar al Dashboard",
    rtlName: "",
    icon: Dashboard,
    component: Subjects,
    layout: "/subject",
    menu: true,
    returnTo: "/dashboard",
  },
];

export default dashboardRoutes;
