import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Radio, Grid } from '@material-ui/core';
import PropTypes from "prop-types";
/*
    "warning",
    "success",
    "danger",
    "info",
    "primary",
    "rose",
*/

const WarningColorRadio = withStyles((theme)=>({
    root: {
      color: theme.palette.warning.main,
      '&$checked': {
        color: theme.palette.warning.main,
      },
    },
    checked: {},
}))((props) => <Radio color="default" {...props} />);

const SuccessColorRadio = withStyles((theme)=>({
    root: {
      color: theme.palette.success.main,
      '&$checked': {
        color: theme.palette.success.main,
      },
    },
    checked: {},
}))((props) => <Radio color="default" {...props} />);

const DangerColorRadio = withStyles((theme)=>({
    root: {
      color: theme.palette.danger.main,
      '&$checked': {
        color: theme.palette.danger.main,
      },
    },
    checked: {},
}))((props) => <Radio color="default" {...props} />);

const InfoColorRadio = withStyles((theme)=>({
    root: {
      color: theme.palette.info.main,
      '&$checked': {
        color: theme.palette.info.main,
      },
    },
    checked: {},
}))((props) => <Radio color="default" {...props} />);

const PrimaryColorRadio = withStyles((theme)=>({
    root: {
      color: theme.palette.primary.main,
      '&$checked': {
        color: theme.palette.primary.main,
      },
    },
    checked: {},
}))((props) => <Radio color="default" {...props} />);

const RoseColorRadio = withStyles((theme)=>({
    root: {
      color: theme.palette.rose.main,
      '&$checked': {
        color: theme.palette.rose.main,
      },
    },
    checked: {},
}))((props) => <Radio color="default" {...props} />);

const ColorSelector = ({selectedColorValue, setselectedColorValue}) => {
    const handleChange = (event) => {
        setselectedColorValue(event.target.value);
    };
    return ( 
        <Grid 
            container 
            direction="row"
            justify="space-around"
            alignItems="center"
        >
            <Grid item >
                <RoseColorRadio
                    checked={selectedColorValue === 'rose'}
                    onChange={handleChange}
                    value="rose"
                    name="rose"
                />
            </Grid>
            <Grid item >
                <PrimaryColorRadio
                    checked={selectedColorValue === 'primary'}
                    onChange={handleChange}
                    value="primary"
                    name="primary"
                />
            </Grid>
            <Grid item >
                <DangerColorRadio
                    checked={selectedColorValue === 'danger'}
                    onChange={handleChange}
                    value="danger"
                    name="danger"
                />
            </Grid>
            <Grid item >
                <SuccessColorRadio
                    checked={selectedColorValue === 'success'}
                    onChange={handleChange}
                    value="success"
                    name="success"
                />
            </Grid>
            <Grid item >
                <WarningColorRadio
                    checked={selectedColorValue === 'warning'}
                    onChange={handleChange}
                    value="warning"
                    name="warning"
                />
            </Grid>
            <Grid item >
                <InfoColorRadio
                    checked={selectedColorValue === 'info'}
                    onChange={handleChange}
                    value="info"
                    name="info"
                    size="small"
                />
            </Grid>
        </Grid>
    );
}
 
export default ColorSelector;

ColorSelector.propTypes = {
    selectedColorValue: PropTypes.string, 
    setselectedColorValue: PropTypes.func,
};