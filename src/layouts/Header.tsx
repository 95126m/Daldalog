/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Link } from 'react-router-dom';
import { useState } from 'react'
import { color } from '@/constants/color'
import { fontSize } from '@/constants/font'
import SearchIcon from '@mui/icons-material/Search'
import NightlightRoundIcon from '@mui/icons-material/NightlightRound'
import LightModeIcon from '@mui/icons-material/LightMode'
import CloseIcon from '@mui/icons-material/Close'

const Header = () => {
  const [isHovered, setIsHovered] = useState(false)
  const [isActive, setIsActive] = useState(false)

  return (
    <div css={wrapperStyle}>
      <Link to="/"><h1>DALDALOG</h1></Link>
      <div
        className="icon-wrapper"
        css={iconWrapperStyle}>
        <div css={searchContainer}>
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            css={searchInputStyle(isActive)}
            onBlur={() => setIsActive(false)}
          />
          {isActive ? (
            <CloseIcon
              css={searchIconStyle}
              onClick={() => setIsActive(false)}
            />
          ) : (
            <SearchIcon
              css={searchIconStyle}
              onClick={() => setIsActive(true)}
            />
          )}
        </div>

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
  padding: 0 230px;
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

const searchIconStyle = css`
  position: absolute;

  width: 26px;
  height: 26px;
  color: ${color.black};
  cursor: pointer;
  transition: opacity 0.5s ease-in-out;
`

const searchInputStyle = (isActive: boolean) => css`
  position: absolute;
  right: 0;
  width: ${isActive ? '200px' : '0'};
  opacity: ${isActive ? '1' : '0'};
  height: 30px;
  transform-origin: right;
  padding: ${isActive ? '0 10px' : '0'};
  border: ${isActive ? `1px solid ${color.gray}` : 'none'};
  border-radius: 50px;
  font-size: ${fontSize.xxxs};
  color: ${color.black};
  transition:
    width 0.8s ease-in-out,
    opacity 0.8s ease-in-out,
    padding 0.8s ease-in-out,
    border 0.3s ease-in-out;

  &:focus {
    outline: none;
    border-color: ${color.darkYellow};
  }

  ::placeholder {
    font-size: ${fontSize.xxxs};
  }
`

const iconWrapperStyle = css`
  display: flex;
  align-items: center;
  position: relative;
`

const searchContainer = css`
  position: relative;
  width: 30px;
  height: 30px;
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
