/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { color } from '@/constants/color'
import { fontSize } from '@/constants/font'

interface ModalProps {
  title: string
  description: string
  onConfirm: () => void
  onCancel: () => void
}

const Modal: React.FC<ModalProps> = ({ title, description, onConfirm, onCancel }) => {
  return (
    <div css={wrapperStyle}>
      <div css={contentStyle}>
        <h1>{title}</h1>
        <p>{description}</p>
        <div css={btnWrapper}>
          <button css={cancelBtn} onClick={onCancel}>
            취소
          </button>
          <button css={confirmBtn} onClick={onConfirm}>
            확인
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal

const wrapperStyle = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9;
`

const contentStyle = css`
  background-color: ${color.white};
  border-radius: 8px;
  padding: 24px;
  width: 450px;
  text-align: center;

  h1 {
    font-size: ${fontSize.xs};
    color: ${color.darkYellow};
    margin-bottom: 16px;
  }

  p {
    font-size: ${fontSize.xxs};
    color: ${color.gray};
    margin-bottom: 24px;
  }
`

const btnWrapper = css`
  display: flex;
  gap: 16px;
`

const cancelBtn = css`
  flex: 1;
  background-color: ${color.lightGray};
  border: none;
  border-radius: 4px;
  padding: 10px;
  font-size: ${fontSize.xs};
  cursor: pointer;
`

const confirmBtn = css`
  flex: 1;
  background-color: ${color.yellow};
  color: ${color.white};
  border: none;
  border-radius: 4px;
  padding: 10px;
  font-size: ${fontSize.xs};
  cursor: pointer;
`
