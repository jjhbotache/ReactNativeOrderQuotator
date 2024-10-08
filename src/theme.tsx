import { createTheme } from "@rneui/themed";
import { styleConstants } from "./constants";

declare module '@rneui/themed' {
  export interface Colors {
    tertiary: string;
  }
}

const theme = createTheme({ 
  darkColors:{
    primary: styleConstants.colors.primary,
    secondary: styleConstants.colors.secondary,
    tertiary: styleConstants.colors.tertiary,
    background: styleConstants.colors.background,
    white: styleConstants.colors.text,
    
  },
  mode:"dark",
  components: {
    Text: {
      style: {
        color: styleConstants.colors.text,
      },
    },
    Input: {
      style: {
        color: styleConstants.colors.text,
        fontSize: 20, // Adjust the font size to make the inputs smaller
      },
      inputStyle: {
        color: styleConstants.colors.text,
        fontSize: 7, // Adjust the font size to make the inputs smaller
      },
      labelStyle: {
        color: styleConstants.colors.text,
      },
      containerStyle: {
        backgroundColor:"rgba(255,255,255,0.1)",
        borderRadius: 5,
        marginVertical: 5,
        paddingTop: 2, // Adjust the padding to make the inputs smaller
        paddingBottom: 2, // Adjust the padding to make the inputs smaller
      },
    },
    Button:{
    },
    Dialog:{
      overlayStyle:{
        backgroundColor: styleConstants.colors.secondary,
      }
    },
    DialogTitle:{
      titleStyle:{
        color: styleConstants.colors.text,
        fontSize: 30,
      }
    },
    DialogButton:{
      titleStyle:{
        color: styleConstants.colors.text,
        fontSize: 20,
      },
      buttonStyle:{
        marginHorizontal: 5,
        marginVertical: 2,
        paddingVertical: 5,
        paddingHorizontal: 13,
        borderRadius: 5,
        elevation: 20,
      }
    },
    ListItem:{
      containerStyle:{
        backgroundColor: styleConstants.colors.secondary,
        borderRadius: 15,
        marginVertical: 5,
      },
      
    },
  }
});

export default theme;