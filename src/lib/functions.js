import sanitize from 'sanitize-html'
import { katexWhiteList } from './katexWhiteList'

export function isoStringToNaturalLanguage(isoString) {
  if (isoString.length < 4) {
    return isoString
  } else {
    return `${isoString.substr(0, 4)}년 ${isoString.substr(
      5,
      2
    )}월 ${isoString.substr(8, 2)}일`
  }
}

export function sortISOByTimeStamp(
  toBeLessIndex,
  toBeMoreIndex,
  reverseFactor
) {
  if (Date.parse(toBeLessIndex) > Date.parse(toBeMoreIndex)) {
    return -1 * reverseFactor
  } else if (Date.parse(toBeLessIndex) < Date.parse(toBeMoreIndex)) {
    return 1 * reverseFactor
  } else {
    return 0
  }
}

export const onClickTag = () => {
  alert('tag is clicked!')
}

export function textTooLongAlert(text, maximumLength) {
  if (text.length > maximumLength) {
    alert('too long')
    return text.slice(0, maximumLength - 1)
  } else {
    return text
  }
}

export const htmlFilter = (html) => {
  return sanitize(html, {
    allowedTags: [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'blockquote',
      'p',
      'a',
      'ul',
      'ol',
      'nl',
      'li',
      'b',
      'i',
      'strong',
      'em',
      'strike',
      'code',
      'hr',
      'br',
      'div',
      'table',
      'thead',
      'caption',
      'tbody',
      'tr',
      'th',
      'td',
      'pre',
      'iframe',
      'span',
      'img',
      'del',
      'input',
      ...katexWhiteList.tags,
    ],
    allowedAttributes: {
      a: ['href', 'name', 'target'],
      img: ['src'],
      iframe: ['src', 'allow', 'allowfullscreen', 'scrolling', 'class'],
      '*': ['class', 'id', 'aria-hidden'],
      span: ['style'],
      input: ['type'],
      ol: ['start'],
      ...katexWhiteList.attributes,
    },
    allowedStyles: {
      '*': {
        // Match HEX and RGB
        color: [
          /^#(0x)?[0-9a-f]+$/i,
          /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/,
        ],
        'text-align': [/^left$/, /^right$/, /^center$/],
      },
      span: {
        ...katexWhiteList.styles,
      },
    },
    //allowedIframeHostnames: ['www.youtube.com', 'codesandbox.io', 'codepen.io'],
  })
}
