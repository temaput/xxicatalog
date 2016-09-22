import {
  fullBlack,
  darkBlack,
  lightBlack,
  minBlack,
  fullWhite,
  darkWhite,
  lightWhite,
} from './colors';

class Typography {

  constructor() {
    // text colors
    this.textFullBlack = fullBlack;
    this.textDarkBlack = darkBlack;
    this.textLightBlack = lightBlack;
    this.textMinBlack = minBlack;
    this.textFullWhite = fullWhite;
    this.textDarkWhite = darkWhite;
    this.textLightWhite = lightWhite;

    // font weight
    this.fontWeightLight = 300;
    this.fontWeightNormal = 400;
    this.fontWeightMedium = 500;

    this.fontStyleButtonFontSize = 14;

    this.styles = {
      display4:  {
        fontSize: 112,
        fontWeight: this.fontWeightLight,
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
      caption: {
        fontSize: 12,
        fontWeight: 400
      },
    }
  }
}

export default new Typography();
