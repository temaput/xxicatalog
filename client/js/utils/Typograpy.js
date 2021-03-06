import {
  fullBlack,
    darkBlack,
    lightBlack,
    minBlack,
    fullWhite,
    darkWhite,
    lightWhite,
    cyan500,
    indigo500,
} from './colors';

const typography = {
  styles: {
    display4:  {
      fontSize: 112,
      fontWeight: 300,
    },
    display3: {
      fontSize: 56,
      fontWeight: 400
    },
    display2: {
      fontSize: 45,
      fontWeight: 400
    },
    display1: {
      fontSize: 34,
      fontWeight: 400
    },
    headline: {
      fontSize: 24,
      fontWeight: 400
    },
    title: {
      fontSize: 20,
      fontWeight: 500
    },
    subheading: {
      fontSize: 16,
      fontWeight: 400
    },
    body2: {
      fontSize: 14,
      fontWeight: 500
    },
    body1: {
      fontSize: 14,
      fontWeight: 400
    },
    tablebody: {
      fontSize: 13,
      fontWeight: 400
    },
    caption: {
      fontSize: 12,
      fontWeight: 400
    },
    bookListTitle: {
      fontSize: 15,
      fontWeight: 500,
      lineHeight: 'normal',
      color: indigo500,
      textDecoration: 'none',
    },
    bookListAuthor: {
      fontSize: 14,
      fontWeight: 300,
    },
    bookListSubtitle: {
      fontSize: 14,
      fontWeight: 300,
    }

  },

  // text colors
  textFullBlack: fullBlack,
  textDarkBlack: darkBlack,
  textLightBlack: lightBlack,
  textMinBlack: minBlack,
  textFullWhite: fullWhite,
  textDarkWhite: darkWhite,
  textLightWhite: lightWhite,

  // font weight
  fontWeightLight: 300,
  fontWeightNormal: 400,
  fontWeightMedium: 500,

  fontStyleButtonFontSize: 14,

}

export default typography;
