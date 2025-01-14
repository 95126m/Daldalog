/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { color } from '@/constants/color'
import { fontSize } from '@/constants/font'

const Footer = () => {
  return (
    <div css={wrapperStyle}>
      <h1>DALDALOG</h1>
      <p>© 2025 DALDALOG All Rights Reserved.</p>
      <nav>
        <span>|</span>
        <a href="">소개</a>
        <span>|</span>
        <a href="">이메일 문의</a>
      </nav>
    </div>
  )
}

export default Footer

const wrapperStyle = css`
  width: 100%;
  height: 150px;
  margin: 0 auto;
  padding: 0 250px;
  background-color: ${color.charcoal};
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;

  h1 {
    font-size: ${fontSize.sm};
    color: ${color.white};
  }

  p {
    font-size: ${fontSize.xxs};
    color: ${color.white};
  }

  nav {
    display: flex;
    align-items: center;
    gap: 10px;

    a {
      font-size: ${fontSize.xxs};
      color: ${color.white};
      text-decoration: none;
      transition: color 0.3s ease;

      &:hover {
        color: ${color.yellow};
      }
    }

    span {
      font-size: ${fontSize.xxs};
      color: ${color.white};
    }
  }
`
