export const mediaQuery = (maxWidth) => `
  @media (max-width: ${maxWidth}px)
`
export const mediaSize = {
  xxlarge: mediaQuery(1920),
  xlarge: mediaQuery(1440),
  large: mediaQuery(1200),
  medium: mediaQuery(1024),
  small: mediaQuery(768),
  xsmall: mediaQuery(375),
  custom: mediaQuery,
}

export const userDefaultID = '000000000000000000000000'

export const colorPalette = {
  // Indigo
  indigo0: '#edf2ff',
  indigo1: '#dbe4ff',
  indigo2: '#bac8ff',
  indigo3: '#91a7ff',
  indigo4: '#748ffc',
  indigo5: '#5c7cfa',
  indigo6: '#4c6ef5',
  indigo7: '#4263eb',
  indigo8: '#3b5bdb',
  indigo9: '#364fc7',
  // Blue
  blue0: '#e7f5ff',
  blue1: '#d0ebff',
  blue2: '#a5d8ff',
  blue3: '#74c0fc',
  blue4: '#4dabf7',
  blue5: '#339af0',
  blue6: '#228be6',
  blue7: '#1c7ed6',
  blue8: '#1971c2',
  blue9: '#1864ab',
  /* teal */
  teal0: '#F3FFFB',
  teal1: '#C3FAE8',
  teal2: '#96F2D7',
  teal3: '#63E6BE',
  teal4: '#38D9A9',
  teal5: '#20C997',
  teal6: '#12B886',
  teal7: '#0CA678',
  teal8: '#099268',
  teal9: '#087F5B',
  /* gray */
  gray0: '#F8F9FA',
  gray1: '#F1F3F5',
  gray2: '#E9ECEF',
  gray3: '#DEE2E6',
  gray4: '#CED4DA',
  gray5: '#ADB5BD',
  gray6: '#868E96',
  gray7: '#495057',
  gray8: '#343A40',
  gray9: '#212529',
  /* red */
  red0: '#fff5f5',
  red1: '#ffe3e3',
  red2: '#ffc9c9',
  red3: '#ffa8a8',
  red4: '#ff8787',
  red5: '#ff6b6b',
  red6: '#fa5252',
  red7: '#f03e3e',
  red8: '#e03131',
  red9: '#c92a2a',
}
