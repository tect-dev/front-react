import { Link } from 'react-router-dom'
import '../../styles/layout/Footer.scss'
import styled from 'styled-components'
import { layout, colorPalette } from '../../lib/constants'

const Footer_Wrapper = styled.footer`
  display: flex;
  justify-content: center;
  margin: auto 0 0 0;
  width: 100%;
  min-height: ${layout.footer_height};
  background: ${colorPalette.gray7};
`

const Footer_Container = styled.div`
  display: flex;
  flex-flow: column wrap;
  width: ${layout.pc_max_width};
`

const Footer_Element = styled.div`
  color: ${colorPalette.gray3};
`

export default function Footer() {
  return (
    <>
      <Footer_Wrapper>
        <Footer_Container>
          {/* <div>기업 푸터</div>
          <div>일반: 전화번호, 이메일, 계좌정보 </div>
          <div>고객센터 : 전화, 팩스, 이메일, 카카오톡ID(혹은 링크) 상담가능 일시</div>
          <div>법인 : 상호, 대표, 주소, 개인정보관리 책임자, 사업자 등록번호, 통신판매업 신고</div>
          <div> 계좌번호 목록</div>
          <div>회사소개, 개인정보보호정책/처리방침, 이용약관, 사이트맵</div>
          <div>SNS 링크</div>
          <div>별도의 Contact us도 필요한가</div> */}
          <Footer_Element> </Footer_Element>
          <Footer_Element>
            Copyright Tect.dev all right reserved{' '}
          </Footer_Element>
        </Footer_Container>
      </Footer_Wrapper>
      {/* <ul>
        <li className="nav-item">
          <Link to="/about" className="nav-links">
            About Tect.dev
          </Link>
        </li>
      </ul> */}
    </>
  )
}
