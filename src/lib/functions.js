import sanitize from 'sanitize-html'
import { katexWhiteList } from './katexWhiteList'

export function extractComment(someList, listType) {
  // 배열내의 원소들을 순회하면서 댓글들만 추출해서, 댓글로 이뤄진 어레이를 리턴.
  let commentList = []
  someList.map((element) => {
    if (element[`${listType}Comment`]) {
      commentList.push(element[`${listType}Comment`])
    }
  })
  return commentList
}

export function trimAnswerList(someAnswerList) {
  // 중복되는 id를 전부 날린다.
  let filteredList = someAnswerList
  let i = 0

  while (true) {
    filteredList = [filteredList[i]].concat(
      filteredList.filter((ele) => {
        return filteredList[i]._id !== ele._id
      })
    )
    i++
    if (filteredList.length === i) {
      break
    }
  }
  return filteredList
}

export function matchCommentAndAnswer(someAnswerList) {
  if (someAnswerList.length === 0) {
    return []
  }

  const extractedCommentList = extractComment(someAnswerList, 'answer')
  const trimedAnswerList = trimAnswerList(someAnswerList)
  return trimedAnswerList.map((answer) => {
    let matchedAnswer = { ...answer, answerComment: [] }
    for (const someComment of extractedCommentList) {
      if (someComment.postID === answer._id) {
        matchedAnswer.answerComment.push(someComment)
      }
    }

    return matchedAnswer
  })
}

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

export const refineDatetime = (raw) => {
  if(raw === "지금"){return raw}
  let datetime = new Date(raw)
  const [ yyyy, MM, dd ] = datetime.toLocaleDateString().split('.')
  const [ hh, mm, ss ] = datetime.toLocaleTimeString().split(':')


  return `${yyyy}년 ${MM}월 ${dd}일 ${hh}시 ${mm}분 ${ss}초`
}