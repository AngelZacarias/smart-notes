import { unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core/styles';

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
        error: {
            main: '#f44336',
        }
    },
})

export default theme;