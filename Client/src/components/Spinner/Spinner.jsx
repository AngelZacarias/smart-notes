import React from 'react'
import './Spinner.css'
import PropTypes from "prop-types";

const Spinner = ({color}) => {
  return ( 
    <div className="spinner">
      <div className={`double-bounce1 bColor-${color}`} ></div>
      <div className={`double-bounce2 bColor-${color}`} ></div>
    </div>
  );
}
 
export default Spinner;

Spinner.propTypes = {
  color: PropTypes.string.isRequired, 
};