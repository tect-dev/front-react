import React, { useCallback, useState, useRef } from 'react'
import '../../styles/layout/LoginModal.scss'
import { Button, DefaultButton } from '../Button'
import { Spinner } from '../Spinner'
import { emailLogin, emailSignUp } from '../../redux/auth'
import { useDispatch } from 'react-redux'
import { onClickTag } from '../../lib/functions'

import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { colorPalette, mediaSize } from '../../lib/constants'

export const LoginModal = React.memo(({ labelFor }) => {
  const dispatch = useDispatch()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [displayName, setDisplayName] = useState()
  const [introduce, setIntroduce] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const termsChecked = useRef(false)
  const [showTerms, setShowTerms] = useState(false)
  const [passwordCheck, setPasswordCheck] = useState(false)

  // 6~20자리. 최소 하나이상의 숫자 또는 특수문자를 포함해야함.
  const passwordRegex = /^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{6,20}$/

  const { loading } = useSelector((state) => {
    return {
      loading: state.auth.loading,
    }
  })

  // fancy한 방법인데
  //const onChange = (e) => {
  //  const {
  //    target: { name, value },
  //  } = e
  //  if (name === 'email') {
  //    setEmail(value)
  //  } else if (name === 'password') {
  //    setPassword(value)
  //  }
  //}

  const onChangeEmail = useCallback(
    (e) => {
      setEmail(e.target.value)
    },
    [email]
  )

  const onChangePassword = useCallback(
    (e) => {
      setPassword(e.target.value)

      if (passwordRegex.test(e.target.value)) {
        setPasswordCheck(true)
      } else {
        setPasswordCheck(false)
      }
    },
    [password, passwordCheck]
  )

  const onChangedisplayName = useCallback(
    (e) => {
      setDisplayName(e.target.value)
    },
    [displayName]
  )

  const onChangeIntroduce = useCallback(
    (e) => {
      setIntroduce(e.target.value)
    },
    [introduce]
  )

  const onEmailLogin = useCallback(
    async (e) => {
      e.preventDefault()
      await dispatch(emailLogin(email, password))
    },
    [dispatch, email, password]
  )

  const onEmailSignUp = useCallback(
    async (e) => {
      e.preventDefault()
      if (termsChecked.current) {
        dispatch(emailSignUp(email, password, displayName, introduce))
        //setEmail('')
        //setPassword('')
        //setDisplayName('')
        //setIntroduce('')
      } else {
        alert('약관에 동의한 후에 가입하실 수 있습니다.')
      }
    },
    [dispatch, email, password, displayName, introduce]
  )

  return (
    <>
      <div className="login-modal">
        {loading && <Spinner />}
        <div className="login-modal-display">
          <label
            className="login-modal-close-btn"
            htmlFor={labelFor}
            onClick={() => {
              setTimeout(() => {
                setIsSignUp(false)
                termsChecked.current = false
              }, 300)
            }}
          />

          <div className="login-modal-display-logo">
            {isSignUp ? 'Signup' : 'Login'}
          </div>
          <div className="login-modal-display-body">
            <form name="devguru-auth" className="login-form" autoComplete="off">
              <input
                id="login-id-input"
                className="login-input"
                placeholder="로그인 이메일을 입력해 주세요."
                name="email"
                value={email}
                onChange={onChangeEmail}
                required
              />
              <input
                id="login-pw-input"
                className="login-input"
                type="password"
                placeholder="로그인 비밀번호를 입력해 주세요."
                name="password"
                value={password}
                onChange={onChangePassword}
                required
              />
              {isSignUp && !passwordCheck ? (
                <div style={{ fontSize: '12px', color: colorPalette.red3 }}>
                  비밀번호는 영문 6~20자리 + 숫자 또는 특수문자를
                  포함해야합니다.
                </div>
              ) : null}

              {isSignUp ? (
                <>
                  <input
                    className="login-input"
                    type="text"
                    placeholder="표시될 닉네임을 입력해주세요."
                    name="displayName"
                    value={displayName}
                    onChange={onChangedisplayName}
                    required
                  />
                  <input
                    className="login-input"
                    type="text"
                    placeholder="한줄 자기 소개를 입력해주세요."
                    required
                    name="introduce"
                    value={introduce}
                    onChange={onChangeIntroduce}
                  />
                </>
              ) : (
                ''
              )}

              {!isSignUp && (
                <>
                  {' '}
                  <Button
                    id="loginSubmitBtn"
                    className="login-submit"
                    onClick={onEmailLogin}
                  >
                    Login
                  </Button>
                  <Button
                    className="login-submit"
                    onClick={(e) => {
                      e.preventDefault()
                      setIsSignUp(true)
                      return true
                    }}
                  >
                    Sign Up?
                  </Button>
                </>
              )}

              {isSignUp ? (
                <>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '10px',
                    }}
                  >
                    <div>
                      <input
                        type="checkbox"
                        id="terms-checked"
                        value="termsChecked"
                        required
                        onChange={(e) => {
                          termsChecked.current = e.target.checked
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '12px', marginLeft: '10px' }}>
                      서비스 이용약관, 개인정보 처리방침, 커뮤니티 이용규칙에
                      모두 동의합니다.
                    </span>
                  </div>
                  {showTerms ? (
                    <TermsModal>
                      <TermsButton
                        onClick={(e) => {
                          e.preventDefault()
                          setShowTerms(false)
                        }}
                      >
                        서비스 이용 약관 닫기
                      </TermsButton>
                      <Terms />
                    </TermsModal>
                  ) : (
                    <TermsButton
                      onClick={(e) => {
                        e.preventDefault()
                        setShowTerms(true)
                      }}
                    >
                      서비스 이용 약관 보기
                    </TermsButton>
                  )}
                  <DefaultButton
                    className="login-submit"
                    onClick={onEmailSignUp}
                    disabled={!passwordCheck}
                  >
                    Sign Up
                  </DefaultButton>
                </>
              ) : null}
            </form>
          </div>
        </div>
        <label
          className="login-modal-close-area"
          htmlFor={labelFor}
          onClick={() => {
            setTimeout(() => {
              setIsSignUp(false)
              termsChecked.current = false
            }, 300)
          }}
        />
      </div>
    </>
  )
})

const TermsModal = styled.div`
  ${mediaSize.small} {
    position: fixed;
    z-index: 2;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background: white;
    padding: 30px 10px;
    box-sizing: border-box;
  }
`

const TermsButton = styled.button`
  box-sizing: border-box;
  all: unset;
  font-size: 12px;
  transition: all ease 0.3s;
  &:hover {
    color: #69bc69;
    transition: all ease 0.3s;
  }
  ${mediaSize.small} {
    color: #69bc69;
  }
`

const Terms = () => {
  const Cotainer = styled.div`
    box-sizing: border-box;
    background: white;
    width: auto;
    box-sizing: border-box;
    height: 100px;
    margin-bottom: 20px;
    overflow-y: scroll;

    ${mediaSize.small} {
      height: 75vh;
      overflow-y: scroll;
    }

    h3 {
      font-size: 18px;
      margin: 10px 0px;
    }

    h5 {
      font-size: 14px;
      margin: 5px 0px;
    }
    p {
      font-size: 10px;
    }
  `

  return (
    <Cotainer>
      <h3>서비스 이용약관</h3>
      <h5>제1조(목적)</h5>
      <p style={{ marginBottom: '10px' }}>
        포레스티 서비스 이용약관은 회사가 서비스를 제공함에 있어, 회사와 이용자
        간의 권리, 의무 및 책임 사항 등을 규정함을 목적으로 합니다.
      </p>

      <h5>제2조(정의)</h5>
      <p>
        1. 이 약관에서 사용하는 용어의 정의는 다음과 같습니다. “회사“란,
        서비스를 제공하는 주체를 말합니다. “서비스“란, 회사가 제공하는 모든
        서비스 및 기능을 말합니다. “이용자“란, 이 약관에 따라 서비스를 이용하는
        회원 및 비회원을 말합니다. “회원“이란, 서비스에 회원등록을 하고 서비스를
        이용하는 자를 말합니다. “비회원“이란, 서비스에 회원등록을 하지 않고
        서비스를 이용하는 자를 말합니다. “게시물“이란, 서비스에 게재된 문자,
        사진, 영상, 첨부파일 등을 말합니다. “커뮤니티“란, 회사와 이용자가
        게시물을 게시할 수 있는 공간을 말합니다. “이용 기록“이란, 이용자가
        서비스를 이용하면서 직접 생성/참여한 게시글, 댓글 등을 말합니다. “로그
        기록“이란, 이용자가 서비스를 이용하면서 자동으로 생성된 IP 주소, 접속
        시간 등을 말합니다. “기기 정보“란, 이용자의 통신 기기에서 수집된
        운영체제 종류, ADID 등을 말합니다. “계정“이란, 이용계약을 통해 생성된
        회원의 고유 아이디와 이에 수반하는 정보를 말합니다. “연락처“란,
        회원가입, 본인 인증, 문의 창구 등을 통해 수집된 이용자의 이메일,
        휴대전화 번호 등을 의미합니다. “관련법“이란, 정보통신망 이용촉진 및
        정보보호 등에 관한 법률, 개인정보보호법, 통신비밀보호법 등 관련 있는
        국내외 법령을 말합니다. “본인 인증“이란, 휴대전화 번호 등을 이용한 본인
        확인 절차를 말합니다.
      </p>
      <p style={{ marginBottom: '10px' }}>
        2. 1항에서 정의되지 않은 약관 내 용어의 의미는 일반적인 이용관행에
        의합니다.
      </p>

      <h5>제3조(약관 등의 명시와 설명 및 개정)</h5>
      <p>1. 회사는 이 약관을 회원가입 화면 등에 게시합니다.</p>
      <p>
        2. 회사는 관련법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.
      </p>
      <p>
        3. 회원이 개정약관의 적용에 동의하지 않는 경우, 이용계약을 해지함으로써
        거부 의사를 표시할 수 있습니다. 단, 30일 내에 거부 의사 표시를 하지 않을
        경우 약관에 동의한 것으로 간주합니다.
      </p>
      <p>4. 회원은 약관 일부분만을 동의 또는 거부할 수 없습니다.</p>
      <p style={{ marginBottom: '10px' }}>
        5. 비회원이 서비스를 이용할 경우, 이 약관에 동의한 것으로 간주합니다.
      </p>

      <h5>제4조(서비스의 제공)</h5>
      <p>
        1. 회사는 다음 서비스를 제공합니다. 문서 작성 서비스 커뮤니티 서비스
        할인, 이벤트, 프로모션, 광고 정보 제공 서비스 기타 회사가 정하는 서비스
      </p>
      <p>
        2. 회사는 운영상, 기술상의 필요에 따라 제공하고 있는 서비스를 변경할 수
        있습니다.
      </p>
      <p>
        3. 회사는 이용자의 개인정보 및 서비스 이용 기록에 따라 서비스 이용에
        차이를 둘 수 있습니다.
      </p>
      <p>
        4. 회사는 천재지변, 인터넷 장애, 경영 악화 등으로 인해 서비스를 더 이상
        제공하기 어려울 경우, 서비스를 통보 없이 중단할 수 있습니다.
      </p>
      <p style={{ marginBottom: '10px' }}>
        5. 회사는 1항부터 전항까지와 다음 내용으로 인해 발생한 피해에 대해
        어떠한 책임을 지지 않습니다. 모든 서비스, 게시물, 이용 기록의 진본성,
        무결성, 신뢰성, 이용가능성 서비스 이용 중 타인과 상호 간에 합의한 내용
        게시물, 광고의 버튼, 하이퍼링크 등 외부로 연결된 서비스와 같이 회사가
        제공하지 않은 서비스에서 발생한 피해 이용자의 귀책사유 또는 회사의 귀책
        사유가 아닌 사유로 발생한 이용자의 피해
      </p>

      <h5>제5조(서비스 이용계약의 성립)</h5>
      <p>
        1. 만 14세 미만의 이용자는 서비스를 이용하거나 회원가입을 할 수 없으며,
        그럼에도 불구하고 성립된 회원가입은 무효로 간주됩니다.
      </p>
      <p>
        2. 회사와 회원의 서비스 이용계약은 서비스 내부의 회원가입 화면의 가입
        양식에 따라 회원정보를 기입한 후 필수 약관에 동의한다는 의사표시를 한
        비회원의 이용신청에 대하여, 서비스 화면에 이용승낙을 표시하는 방법
        등으로 의사표시를 하면서 체결됩니다.
      </p>
      <p>
        3. 승낙은 신청순서에 따라 순차적으로 처리되며, 회원가입의 성립시기는
        회사의 승낙이 회원에게 도달한 시점으로 합니다.
      </p>
      <p style={{ marginBottom: '10px' }}>
        4. 회사는 부정사용방지 및 본인확인을 위해 회원에게 본인 인증 및 학교
        인증, 직장 인증을 요청할 수 있습니다.
      </p>

      <h5>제6조(개인정보의 관리 및 보호)</h5>
      <p>
        1. 회원이 회사와 체결한 서비스 이용계약은 처음 이용계약을 체결한 본인에
        한해 적용됩니다.
      </p>
      <p>
        2. 회원은 회원가입 시 등록한 정보에 변동이 있을 경우, 즉시 “마이페이지”
        메뉴 등을 이용하여 정보를 최신화해야 합니다.
      </p>
      <p>
        3. 회원의 아이디, 비밀번호, 이메일, 신분 정보 등 모든 개인정보의
        관리책임은 본인에게 있으므로, 타인에게 양도 및 대여할 수 없으며 유출되지
        않도록 관리해야 합니다. 만약 본인의 아이디 및 비밀번호를 타인이 사용하고
        있음을 인지했을 경우 바로 서비스 내부의 문의 창구에 알려야 하고, 안내가
        있는 경우 이에 즉시 따라야 합니다.
      </p>
      <p style={{ marginBottom: '10px' }}>
        4. 회사는 2항부터 전항까지를 이행하지 않아 발생한 피해에 대해 어떠한
        책임을 지지 않습니다.
      </p>

      <h5>제7조(서비스 이용계약의 종료)</h5>
      <p>
        1. 회원은 언제든지 문의 창구를 통한 탈퇴를 요청할 수 있으며, 회사는 탈퇴
        요청을 확인한 후 탈퇴를 처리합니다.{' '}
      </p>
      <p>
        2. 탈퇴 처리가 완료 되었더라도, 회원이 게시한 게시물은 삭제되지
        않습니다.
      </p>
      <p>
        3. 회사는 회원이 연속하여 1년 동안 로그인을 하지 않을 경우, 회원의 동의
        없이 회원자격을 박탈할 수 있습니다.
      </p>
      <p>
        4. 회사는 천재지변, 테러, 파산 등 불가피한 사유로 더 이상 서비스를
        제공할 수 없을 경우 회원의 동의 없이 회원자격을 박탈할 수 있습니다.
      </p>
      <p style={{ marginBottom: '10px' }}>
        5. 회사는 1항부터 전항까지로 인해 발생한 피해에 대해 어떠한 책임을 지지
        않습니다.
      </p>

      <h5>제8조(회원에 대한 통보)</h5>
      <p>
        1. 회사가 회원에 대한 통보를 하는 경우, 서비스 내부 알림 수단과 회원의
        연락처를 이용합니다.{' '}
      </p>
      <p>
        2. 회사는 다수의 회원에 대한 통보를 할 경우 공지사항 등에 게시함으로써
        개별 통보에 갈음할 수 있습니다.{' '}
      </p>
      <p style={{ marginBottom: '10px' }}>
        3. 회원이 30일 이내에 의사 표시를 하지 않을 경우, 통보 내용에 대해
        동의한 것으로 간주합니다.
      </p>

      <h5>제9조(저작권의 귀속)</h5>
      <p>
        1. 회사는 유용하고 편리한 서비스를 제공하기 위해, 2021년부터 서비스 및
        서비스 내부의 기능의 체계와 다양한 기능을 직접 설계 및 운영하고 있는
        데이터베이스 제작자에 해당합니다. 저작권법에 따라 데이터베이스 제작자인
        회사는 복제권 및 전송권을 포함한 데이터베이스 전부에 대한 권리를 가지고
        있으며, 이는 법률에 따라 보호를 받는 대상입니다. 그러므로 이용자는
        데이터베이스 제작자인 회사의 승인 없이 데이터베이스의 전부 또는 일부를
        소지/복제/배포/방송 또는 전송할 수 없습니다.
      </p>
      <p>
        2. 회사가 작성한 게시물에 대한 권리는 회사에게 귀속되며, 회원이 작성한
        게시물에 대한 권리는 회원에게 귀속됩니다. 단, 회사는 서비스의 운영,
        확장, 홍보 등의 필요한 목적으로 회원의 저작물을 합리적이고 필요한 범위
        내에서 별도의 허락 없이 수정하여 무상으로 사용하거나 제휴사에게 제공할
        수 있습니다. 이 경우, 회원의 개인정보는 제공하지 않습니다.
      </p>
      <p style={{ marginBottom: '10px' }}>
        3. 회사는 전항 이외의 방법으로 회원의 게시물을 이용할 경우, 서비스 내부
        알림 수단과 회원의 연락처를 이용하여 사전에 회원의 동의를 받아야 합니다.
        단, 회원의 거부 의사가 없는 경우 사후에 동의를 받을 수 있습니다.
      </p>

      <h5>제10조(게시물의 게시 중단)</h5>
      <p style={{ marginBottom: '10px' }}>
        1. 회사는 관련법에 의거하여 회원의 게시물로 인한 법률상 이익 침해를
        근거로, 다른 이용자 또는 제3자가 회원 또는 회사를 대상으로 하여
        민형사상의 법적 조치를 취하거나 관련된 게시물의 게시중단을 요청하는
        경우, 회사는 해당 게시물에 대한 접근을 잠정적으로 제한하거나 삭제할 수
        있습니다.
      </p>

      <h5>제11조(광고의 게재 및 발신)</h5>
      <p>
        1. 회사는 서비스의 제공을 위해 서비스 내부에 광고를 게재할 수 있습니다.
      </p>
      <p>2. 회사는 이용자의 이용 기록을 활용한 광고를 게재할 수 있습니다.</p>
      <p>
        3. 회사는 회원이 광고성 정보 수신에 동의할 경우, 서비스 내부 알림 수단과
        회원의 연락처를 이용하여 광고성 정보를 발신할 수 있습니다.
      </p>
      <p style={{ marginBottom: '10px' }}>
        4. 회사는 광고 게재 및 동의된 광고성 정보의 발신으로 인해 발생한 피해에
        대해 어떠한 책임을 지지 않습니다.
      </p>

      <h5>제12조(금지행위)</h5>
      <p>
        1. 이용자는 다음과 같은 행위를 해서는 안됩니다. 개인정보 또는 계정 기만,
        침해, 공유 행위 개인정보를 허위, 누락, 오기, 도용하여 작성하는 행위
        타인의 개인정보 및 계정을 수집, 저장, 공개, 이용하는 행위 자신과 타인의
        개인정보를 제3자에게 공개, 양도하는 행위 다중 계정을 생성 및 이용하는
        행위 자신의 계정을 이용하여 타인의 요청을 이행하는 행위 시스템 부정행위
        허가하지 않은 방식의 서비스 이용 행위 회사의 모든 재산에 대한 침해 행위
        업무 방해 행위 서비스 관리자 또는 이에 준하는 자격을 사칭하거나 허가없이
        취득하여 직권을 행사하는 행위 회사 및 타인의 명예를 손상시키거나 업무를
        방해하는 행위 서비스 내부 정보 일체를 허가 없이 이용, 변조, 삭제 및
        외부로 유출하는 행위 이 약관, 개인정보 처리방침, 커뮤니티 이용규칙에서
        이행 및 비이행을 명시한 내용에 반하는 행위 기타 현행법에 어긋나거나
        부적절하다고 판단되는 행위
      </p>
      <p>
        2. 이용자가 1항에 해당하는 행위를 할 경우, 회사는 다음과 같은 조치를
        영구적으로 취할 수 있습니다. 이용자의 서비스 이용 권한, 자격, 혜택 제한
        및 회수 회원과 체결된 이용계약을 회원의 동의나 통보 없이 파기 회원가입,
        본인 인증, 학교 인증 거부 회원의 커뮤니티, 게시물, 이용기록을 임의로
        삭제, 중단, 변경 그 외 회사가 필요하다고 판단되는 조치
      </p>
      <p style={{ marginBottom: '10px' }}>
        3. 회사는 1항부터 전항까지로 인해 발생한 피해에 대해 어떠한 책임을 지지
        않으며, 이용자는 귀책사유로 인해 발생한 모든 손해를 배상할 책임이
        있습니다.
      </p>

      <h5>제13조(재판권 및 준거법)</h5>
      <p>
        1. 회사와 이용자 간에 발생한 분쟁에 관한 소송은 대한민국
        서울중앙지방법원을 관할 법원으로 합니다. 다만, 제소 당시 이용자의 주소
        또는 거소가 분명하지 않거나 외국 거주자의 경우에는 민사소송법상의
        관할법원에 제기합니다.
      </p>
      <p style={{ marginBottom: '10px' }}>
        2. 회사와 이용자 간에 제기된 소송에는 한국법을 적용합니다.
      </p>

      <h5>제14조(기타)</h5>
      <p>1. 이 약관은 2021년 2월 21일에 최신화 되었습니다.</p>
      <p>
        2. 이 약관에서 정하지 아니한 사항과 이 약관의 해석에 관하여는 관련법
        또는 관례에 따릅니다.
      </p>
      <p style={{ marginBottom: '10px' }}>
        3. 이 약관에도 불구하고 다른 약관이나 서비스 이용 중 안내 문구 등으로
        달리 정함이 있는 경우에는 해당 내용을 우선으로 합니다.
      </p>

      <h3>개인정보 처리 방침</h3>

      <h5>개인정보 처리 방침</h5>
      <p style={{ marginBottom: '10px' }}>
        개인정보 처리방침은 회사가 서비스를 제공함에 있어, 개인정보를 어떻게
        수집/이용/보관/파기하는지에 대한 정보를 담은 방침을 의미합니다. 개인정보
        처리방침은 개인정보보호법, 정보통신망 이용촉진 및 정보보호 등에 관한
        법률 등 국내 개인정보 보호 법령을 모두 준수하고 있습니다. 이 약관의
        정의는 서비스 이용약관을 따릅니다.
      </p>

      <h5>수집하는 개인정보의 항목</h5>
      <p style={{ marginBottom: '10px' }}>
        1. 회사는 회원가입, 원활한 고객상담, 각종 서비스의 제공을 위해 최초
        회원가입 당시 아래와 같은 개인정보를 수집하고 있습니다. - 아이디,
        이메일, 이름, 휴대전화 번호, 생년월일, 성별, 닉네임, 프로필 사진, 광고성
        정보 수신동의 여부 2. 서비스 이용과정이나 사업처리 과정에서 아래와 같은
        정보들이 자동으로 생성되어 수집될 수 있습니다. - IP Address, 쿠키, 방문
        일시, 서비스 이용 기록, 불량 이용 기록 3. 부가 서비스 및 맞춤식 서비스
        이용 또는 이벤트 응모 과정에서 해당 서비스의 이용자에 한해서만 아래와
        같은 정보들이 수집될 수 있습니다. - 개인정보 추가 수집에 대해 동의를
        받는 경우
      </p>

      <h5>개인정보의 제3자 제공 및 처리위탁</h5>
      <p style={{ marginBottom: '10px' }}>
        회사는 관련법 및 회원의 동의가 없는 한, 회원의 개인정보를 제3자에게 절대
        제공하지 않습니다. 단, 회사는 보안성 높은 서비스 제공을 위하여, 신뢰도가
        검증된 아래 회사에 개인정보 관련 업무 처리를 위탁할 수 있습니다. 이 경우
        회사는 회원에게 위탁을 받는 자와 업무의 내용을 사전에 알리고 동의를
        받습니다. 위탁을 받는 자 또는 업무의 내용이 변경될 경우에도 같습니다.
        회사는 정보통신서비스의 제공에 관한 계약을 이행하고 회원의 편의 증진
        등을 위하여 추가적인 처리 위탁이 필요한 경우에는 고지 및 동의 절차를
        거치지 않을 수 있습니다. 1. Amazon Web Service : 서비스 시스템 제공,
        데이터 관리 및 보관 2. Google Cloud Platform : 회원 관리, 운영 시스템
        지원
      </p>

      <h5>수집한 개인정보의 보관 및 파기</h5>
      <p style={{ marginBottom: '10px' }}>
        회사는 서비스를 제공하는 동안 개인정보 취급방침 및 관련법에 의거하여
        회원의 개인정보를 지속적으로 관리 및 보관합니다. 탈퇴 등으로 인해
        개인정보 수집 및 이용목적이 달성될 경우, 수집된 개인정보는 즉시 또는
        아래와 같이 일정 기간 이후 파기됩니다. 1. 게시물, 댓글 등 이용기록 :
        최대 3년 2. 가입 및 신분 인증 시 수집된 개인정보 : 탈퇴 후 14일 3.
        로그기록 : 최대 3년 4. 이용자 문의 자료 : 3년 5. 게시중단 요청 자료 :
        3년
      </p>

      <h5>개인정보의 기술적/관리적 보호 대책</h5>
      <p style={{ marginBottom: '10px' }}>
        회사는 이용자들의 개인정보를 취급함에 있어 개인정보가 분실, 도난, 누출,
        변조 또는 훼손되지 않도록 안전성 확보를 위하여 다음과 같은 기술적/관리적
        대책을 강구하고 있습니다. 1. 비밀번호 암호화 회사 회원 아이디(ID)의
        비밀번호는 암호화되어 저장 및 관리되고 있어 본인만이 알고 있으며,
        개인정보의 확인 및 변경도 비밀번호를 알고 있는 본인에 의해서만
        가능합니다. 2. 해킹 등에 대비한 대책 회사는 해킹이나 컴퓨터 바이러스
        등에 의해 회원의 개인정보가 유출되거나 훼손되는 것을 막기 위해 최선을
        다하고 있습니다. 개인정보의 훼손에 대비해서 자료를 수시로 백업하고 있고,
        최신 백신프로그램을 이용하여 이용자들의 개인정보나 자료가 누출되거나
        손상되지 않도록 방지하고 있으며, 암호화통신 등을 통하여 네트워크상에서
        개인정보를 안전하게 전송할 수 있도록 하고 있습니다. 그리고
        침입차단시스템을 이용하여 외부로부터의 무단 접근을 통제하고 있으며, 기타
        시스템적으로 보안성을 확보하기 위한 가능한 모든 기술적 장치를 갖추려
        노력하고 있습니다. 3. 취급 직원의 최소화 및 교육 회사의 개인정보관련
        취급 직원은 담당자에 한정시키고 있고 이를 위한 별도의 비밀번호를
        부여하여 정기적으로 갱신하고 있으며, 담당자에 대한 수시 교육을 통하여
        회사 개인정보취급방침의 준수를 항상 강조하고 있습니다. 4.
        개인정보보호전담기구의 운영 그리고 사내 개인정보보호전담기구 등을 통하여
        회사 개인정보취급방침의 이행사항 및 담당자의 준수여부를 확인하여 문제가
        발견될 경우 즉시 수정하고 바로 잡을 수 있도록 노력하고 있습니다. 단,
        이용자 본인의 부주의나 인터넷상의 문제 등 회사가 책임질 수 없는 사유로
        ID, 비밀번호, 주민등록번호 등 개인정보가 유출되어 발생한 문제에 대해
        회사는 일체의 책임을 지지 않습니다.
      </p>

      <h5>정보주체의 권리, 의무 및 행사</h5>
      <p style={{ marginBottom: '10px' }}>
        회원은 언제든지 [마이페이지]를 통해 자신의 개인정보를 조회할 수
        있습니다.
      </p>

      <h5>쿠키</h5>
      <p style={{ marginBottom: '10px' }}>
        쿠키란 웹사이트를 운영하는 데 이용되는 서버가 귀하의 브라우저에 보내는
        아주 작은 텍스트 파일로서 귀하의 컴퓨터 하드디스크에 저장됩니다.
        서비스는 사이트 로그인을 위해 아이디 식별에 쿠키를 사용할 수 있습니다.
        쿠키 설정 거부 방법 예시 1. Internet Explorer : 웹 브라우저 상단의 도구{' '}
        {`>`} 인터넷 옵션 {`>`} 개인정보 {`>`} 설정 2. Chrome : 웹 브라우저
        우측의 설정 {`>`} 고급 설정 표시 {`>`} 개인정보의 콘텐츠 설정 버튼 {`>`}{' '}
        쿠키
      </p>

      <h5>개인정보에 관한 책임자 및 서비스</h5>
      <p style={{ marginBottom: '10px' }}>
        귀하께서는 회사의 서비스를 이용하시며 발생하는 모든 개인정보보호 관련
        민원을 개인정보관리책임자 혹은 담당부서로 신고하실 수 있습니다.회사는
        이용자들의 신고사항에 대해 신속하게 충분한 답변을 드릴 것입니다.
        개인정보 관리책임자 이메일 : contact@foresty.net 기타 개인정보침해에
        대한 신고나 상담이 필요하신 경우에는 아래 기관에 문의하시기 바랍니다.
        개인정보침해신고센터 (www.118.or.kr / 118) 정보보호마크인증위원회
        (www.eprivacy.or.kr / 02-580-0533~4) 대검찰청 첨단범죄수사과
        (www.spo.go.kr / 02-3480-2000) 경찰청 사이버테러대응센터 (www.ctrc.go.kr
        / 02-392-0330)
      </p>

      <h5>기타</h5>
      <p style={{ marginBottom: '10px' }}>
        이 약관은 2021년 2월 20일에 최신화 되었습니다. 본 약관의 내용 추가, 삭제
        및 수정이 있을 경우 개정 최소 7일 전에 ‘공지사항’을 통해 사전 공지를 할
        것입니다. 다만, 수집하는 개인정보의 항목, 이용목적의 변경 등과 같이 회원
        권리의 중대한 변경이 발생할 때에는 최소 30일 전에 공지하거나, 동의를
        다시 받도록 하겠습니다. 회원 권리의 보호를 위한 긴급한 변경의 경우,
        사후통지 될 수 있습니다.
      </p>

      <h3>커뮤니티 이용규칙</h3>
      <p style={{ marginBottom: '10px' }}>
        커뮤니티를 이용하기 전 커뮤니티 이용규칙의 모든 내용을 숙지해 주시기
        바랍니다. 이 약관의 정의는 서비스 이용약관을 따릅니다.
      </p>

      <h5>금지 행위</h5>
      <p>
        다음 목록에 해당하는 게시물 작성, 1:1 대화 발송, 커뮤니티 개설, 악용
        행위를 금지하고 있습니다.
      </p>
      <p>
        1. 예의범절에 어긋나는 행위 - 타인 또는 특정단체/지역에 대한 욕설, 악담,
        비방, 비하, 비아냥 - 내용/결말을 발설하거나, 혐오를 불러일으키거나,
        속이거나, 놀라게 하는 행위 - 과도한 정치/종교 연관 행위
      </p>
      <p>
        2. 미풍양속에 어긋나는 행위 - 외설, 음란물, 음담패설, 신체사진 등
        청소년유해매체물 게시 - 불건전한 모임, 대화, 통화 등 온/오프라인 만남 -
        유흥 관련 정보 공유, 매매/알선 행위 등 불법 행위
      </p>
      <p>
        3. 정보통신망법에 반하는 홍보 행위 - 기업/비영리기관/개인/단체의
        직간접적 광고/홍보/판매 행위 - 계정 공유 요청, 홍보 요청, 바이럴 이벤트
        등 게시물 대리 작성 행위 - 공모전, 대외활동, 이벤트, 아카데미, 채용,
        행사, 강연, 공연, 영화 홍보 - 교육, 의료, 식당, 부동산, 배달, 공유 사업
        홍보 - 어플리케이션, 웹사이트, 블로그, 카페, 서비스 홍보 - 구독, 좋아요,
        학우 참여, 모집, 링크 클릭, 추천인 입력, 앱 설치, 회원가입 요청 -
        공동구매, 펀딩, 기부금품 요청 행위 - 기타 광고, 홍보, 판매 관련 게시물
        일체
      </p>
      <p>
        4. 공직선거법에 반하는 선거, 정당, 정치인 연관 행위 - 허위사실 공표,
        불공정 비판, 비방, 비하, 모욕 - 지지/홍보 및 선거운동 활동 - 금품
        제공/지시/권유 또는 요구 - 여론조사 경위 및 결과 인용 - 그 외 관련법에
        어긋나는 행위
      </p>
      <p>
        5. 의료/약사법에 반하는 거래 불가능 품목 거래 행위 - 주류, 담배, 마약류
        - 안경, 콘택트렌즈, 의약품, 헌혈증, 건강기능식품, 의료기기 - 이미테이션
        제품, 저작물 복사본 - 청소년유해매체물 - 2000불 이상의 달러/외화 - 그 외
        관련법에 의해 온라인을 통해 판매가 금지되거나, 개인 간 거래가 금지된
        물품
      </p>
      <p>
        6. 자살예방법에 반하는 자살유발정보 유통 행위 - 자살 동반자 모집 정보 -
        자살에 대한 구체적인 방법을 제시하는 정보 - 자살을 실행하거나 유도하는
        내용을 담은 문서, 사진 또는 동영상 등의 정보 - 자살위해물건의 판매 또는
        활용에 관한 정보 - 기타 명백히 자살 유발을 목적으로 하는 정보
      </p>
      <p>
        7. 비정상적 서비스 이용 행위 - 오류를 발생시키는 특수문자, 내용 없는 글
        등 비정상적 게시물 작성 행위 - 동일한 주제의 게시물을 하나 이상의
        커뮤니티에 반복적으로 게시하는 행위 - 익명을 이용한 여론 조작 행위 -
        신고 시스템 악용 행위 - 동아리, 스터디, 공모전, 대외활동 등 정보
        커뮤니티 내 비정상적 정보 기재 행위
      </p>
      <p>
        8. 불법 행위 - 초상권, 저작권 침해 등 타인의 권리를 침해하는 행위 -
        시스템 해킹, 게시물 크롤링 등 커뮤니티에 악영향을 주는 행위 - 운영자
        또는 이에 준하는 자격을 사칭하여 권한을 행사하는 행위 - 암표 등 수익
        목적의 재판매 행위 - 기타 관련 법률에 위배되는 행위
      </p>
      <p style={{ marginBottom: '10px' }}>
        9. 기타 위 목록의 행위와 동일하거나 비슷한 목적을 달성하기 위한 행위
        일체
      </p>

      <h5>허위사실 유포 및 명예훼손 게시물에 대한 게시중단 요청</h5>
      <p>
        1. 포레스티의 게시물로 인해, 저작권 침해, 명예훼손, 기타 권리 침해를
        당했다고 판단되실 경우, 추가적인 권리 침해를 방지하기 위해
        권리침해신고센터에서 해당 게시물에 대한 게시 중단 요청을 할 수 있습니다.
        2. 이후 담당자의 확인을 통해 게시 중단 조치가 이루어집니다.
      </p>

      <h5>전기통신사업법에 따른 불법촬영물 유통 금지</h5>
      <p>
        1. 불법촬영물 등을 유통할 경우 전기통신사업법 제22조의5제1항에 따른
        삭제, 접근 제한 등 유통방지에 필요한 조치가 취해지며, 관련 법률에 따라
        처벌을 받을 수 있습니다. 2. 불법촬영물, 허위영상물, 아동/청소년 성착취물
        등 불법촬영물로 의심되는 게시물을 발견하셨을 경우, 유해정보신고센터에
        신고해주시기 바랍니다.
      </p>
    </Cotainer>
  )
}
