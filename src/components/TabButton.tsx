/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { fontSize } from '@/constants/font'
import { color } from '@/constants/color'

interface TabButtonProps {
  isActive: boolean
  label: string
  onClick: () => void
}

const TabButton = ({ isActive, label, onClick }: TabButtonProps) => {
  return (
    <button
      css={tabButtonStyle(isActive)}
      onClick={onClick}>
      {label}
    </button>
  )
}

export default TabButton

// 스타일 정의
const tabButtonStyle = (isActive: boolean) => css`
  border: none;
  border-bottom: ${isActive ? '2px solid #FFBB00' : 'none'};
  padding: 10px 10px;
  margin: 0;
  font-size: ${fontSize.xxs};
  background-color: transparent;
  color: ${isActive ? '#FFBB00' : 'black'};
  font-weight: ${isActive ? 'bold' : 'normal'};
  cursor: pointer;

  &:hover {
    color: ${color.darkYellow};
  }
`
