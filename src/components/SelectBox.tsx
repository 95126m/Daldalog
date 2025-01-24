/** @jsxImportSource @emotion/react */
import React, { useState, useRef, useEffect } from 'react'
import { css } from '@emotion/react'
import { color } from '@/constants/color'
import { fontSize } from '@/constants/font'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

interface Option {
  label: string
  value: string
}

interface SelectBoxProps {
  options: Option[]
  value: string // value prop 추가
  placeholder?: string
  onChange: (value: string) => void
}

const SelectBox: React.FC<SelectBoxProps> = ({
  options,
  value, // value를 props로 받음
  placeholder = '선택하세요',
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState(value) // value로 초기화
  const selectRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    setSelectedValue(value) // value prop이 변경되면 상태 업데이트
  }, [value])

  const handleSelect = (value: string) => {
    setSelectedValue(value)
    onChange(value)
    setIsOpen(false)
  }

  return (
    <div ref={selectRef} css={wrapperStyle}>
      {/* 드롭다운 상단 */}
      <div
        css={defaultStyle()}
        onClick={() => setIsOpen(prev => !prev)}>
        <span>{selectedValue || placeholder}</span>
        <KeyboardArrowDownIcon css={iconStyle(isOpen)} />
      </div>

      {/* 드롭다운 옵션 */}
      {isOpen && (
        <ul css={optionsStyle}>
          {options.map(option => (
            <li
              key={option.value}
              css={optionItemStyle}
              onClick={() => handleSelect(option.value)}>
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// Emotion CSS
const wrapperStyle = css`
  position: relative;
  width: 200px;
`

const defaultStyle = () => css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid ${color.gray};
  color: ${color.black};
  font-size: ${fontSize.xxxs};
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${color.white};
  transition: border-color 0.3s ease;
`

const iconStyle = (isOpen: boolean) => css`
  font-size: 16px; /* 아이콘 사이즈를 16px로 줄임 */
  color: ${color.black};
  transform: rotate(${isOpen ? '180deg' : '0deg'});
  transition: transform 0.8s ease;
`

const optionsStyle = css`
  font-size: ${fontSize.xxxs};
  color: ${color.black};
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  border: 1px solid ${color.gray};
  border-radius: 4px;
  background-color: ${color.white};
  list-style: none;
  margin: 0;
  padding: 0;
  z-index: 1000;
  overflow: hidden;
  animation: slideDown 0.8s ease;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10%);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

const optionItemStyle = css`
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid ${color.lightGray};

  &:hover {
    background-color: ${color.lightGray};
  }

  &:last-of-type {
    border-bottom: none;
  }
`

export default SelectBox
