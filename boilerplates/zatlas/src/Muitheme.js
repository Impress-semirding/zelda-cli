import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { fade } from 'material-ui/utils/colorManipulator';
import {
  grey100,
  deepPurpleA400,
  darkBlack,
  white
} from 'material-ui/styles/colors';

const muiTheme = getMuiTheme({
  palette: {
    background1Color: white,
    primary1Color: '#694FF9',
    primary2Color: grey100,
    secondary1Color: '#694FF9',
    accent1Color: deepPurpleA400,
    textColor: darkBlack,
    secondaryTextColor: fade(darkBlack, 0.54),
    alternateTextColor: white
  },
  tabs: {
    fontSize: '12px'
  },
});

export default muiTheme;
