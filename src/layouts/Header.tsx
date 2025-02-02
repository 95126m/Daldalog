/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Link } from 'react-router-dom'
import { color } from '@/constants/color'
import { fontSize } from '@/constants/font'
import Logo from '@/assets/logo3.png'

const Header = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div css={wrapperStyle}>
      <Link
        to="/"
        onClick={scrollToTop}>
        <img
          src={Logo}
          alt="Logo"
          css={{ height: '26px', paddingLeft: '20px', cursor: 'pointer' }}
        />
      </Link>
    </div>
  )
}

export default Header

const wrapperStyle = css`
  width: 100%;
  height: 70px;
  margin: 0 auto;
  padding: 0 130px;
  background-color: ${color.white};
  border-bottom: 1px solid ${color.lightGray};
  display: flex;
  position: fixed;
  align-items: center;
  justify-content: space-between;
  z-index: 9;

  h1 {
    font-size: ${fontSize.sm};
    color: ${color.black};
    margin-left: 20px;
  }

  .icon-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-right: 20px;
    color: ${color.black};

    &:hover {
      cursor: pointer;
    }
  }
`
