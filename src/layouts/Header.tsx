/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { color } from '@/constants/color'
import { fontSize } from '@/constants/font'
import NightlightRoundIcon from '@mui/icons-material/NightlightRound'
import LightModeIcon from '@mui/icons-material/LightMode'
import Logo from '@/assets/logo3.png'

const Header = () => {
  const [isHovered, setIsHovered] = useState(false)

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

      <div
        className="icon-wrapper"
        css={iconWrapperStyle}>
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          css={themeToggleWrapperStyle}>
          <LightModeIcon css={[iconStyle, !isHovered && visibleStyle]} />
          <NightlightRoundIcon css={[iconStyle, isHovered && visibleStyle]} />
        </div>
      </div>
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

const iconWrapperStyle = css`
  display: flex;
  align-items: center;
  position: relative;
`

const themeToggleWrapperStyle = css`
  position: relative;
  width: 30px;
  height: 30px;
`

const iconStyle = css`
  position: absolute;
  top: 0;
  left: 0;
  width: 30px;
  height: 30px;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
`

const visibleStyle = css`
  opacity: 1;
`
