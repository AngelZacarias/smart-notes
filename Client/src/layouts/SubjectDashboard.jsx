import React, { useContext } from "react";
//import { Switch, Route, Redirect } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Navbar from "components/Navbars/Navbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import routes from "routes.js";

import styles from "assets/jss/material-dashboard-react/layouts/adminStyle.js";

import bgImage from "assets/img/sidebar-4.jpg";
import logo from "assets/img/logo.svg";

//Context for this subject
import { SubjectContext } from './../hooks/SubjectContext';

let ps;
/*
const switchRoutes = (
  <Switch>
    {routes.map((prop, key) => {
      if (prop.layout === "/subject") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      }
      return null;
    })}
    <Redirect from="/subject" to="/subject/subject-tasks" />
  </Switch>
);
*/
const useStyles = makeStyles(styles);

export default function SubjectDashboard({ ...rest }) {
  // styles
  const classes = useStyles();
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = React.createRef();
  // Context
  const { subjectInformation } = useContext(SubjectContext);

  // Translate the color name for the card into the colors for the dashboard sidebar
  const getColor = () =>{
    if(subjectInformation.color === 'success'){
      return 'green';
    }
    else if(subjectInformation.color === 'info'){
      return 'blue';
    }
    else if(subjectInformation.color === 'warning'){
      return 'orange';
    }
    else if(subjectInformation.color === 'error'){
      return 'red';
    }
    else if(subjectInformation.color === 'rose'){
      return 'rose';
    }
    else{
      return 'primary';
    }
  }

  // states and functions
  const image = bgImage;
  const color = getColor();
  console.log(color);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };
  // initialize and destroy the PerfectScrollbar plugin
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
      document.body.style.overflow = "hidden";
    }
    window.addEventListener("resize", resizeFunction);
    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
      window.removeEventListener("resize", resizeFunction);
    };
  }, [mainPanel]);

  return (
    <div className={classes.wrapper}>
      <Sidebar
        routes={routes.filter(route => route.layout === '/subject')}
        logo={logo}
        image={image}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color={color}
        {...rest}
      />
      <div className={classes.mainPanel} ref={mainPanel}>
        <Navbar
          routes={routes.filter(route => route.layout === '/subject')}
          handleDrawerToggle={handleDrawerToggle}
          {...rest}
        />
        {/* On the /maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
          <div className={classes.content}>
            <div className={classes.container}>{}</div>
          </div>
        <Footer />
      </div>
    </div>
  );
}
