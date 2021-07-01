import { unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core/styles';

export const getColorHexValue = (colorName) =>{
    if(colorName==="primary") {return '#0D47A1';} 
    if(colorName==="secondary") {return '#282f36';}
    if(colorName==="info") {return '#00bcd4';}
    if(colorName==="warning") {return '#ff9800';}
    if(colorName==="success") {return '#4caf50';}
    if(colorName==="danger") {return '#f44336';}
    if(colorName==="rose") {return '#E22E6D';}
    
}

const theme = createMuiTheme({
    palette:{
        primary: {
            main: '#0D47A1',
        },
        secondary: {
            main: '#282f36',
        },
        info:{
            main: '#00bcd4',
        },
        warning: {
            main: '#ff9800',
        },
        success: {
            main: '#4caf50',
        },
        danger: {
            main: '#f44336',
        },
        rose: {
            main: '#E22E6D',
        }
    },
})

export default theme;