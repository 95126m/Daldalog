/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { color } from '@/constants/color'
import { TabData } from '@/mocks/TabData'
import { fontSize } from '@/constants/font'
import Modal from '@/components/Modal'

const Detail = () => {
  const item = TabData[0]
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div css={wrapperStyle}>
      <div className="title-section">
        <div
          key={item.id}
          css={tabItemStyle}>
          <div className="text-container">
            <h4>{item.groupTitle}</h4>
            <h3>{item.title}</h3>
            <p>{item.date}</p>
          </div>
        </div>
      </div>

      <div
        className="button-section"
        css={btnWrapper}>
        <button
          css={deleteBtn}
          onClick={() => setIsModalOpen(true)}>
          <p css={deleteText}>삭제</p>
        </button>
        <button css={editBtn}>
          <p css={editText}>수정</p>
        </button>
      </div>

      <div
        className="content-section"
        css={contentSectionStyle}>
        <span>{item.content}</span>
      </div>

      <div css={goMain}>
        <button
          css={goMainBtn}
          onClick={handleBack}>
          메인으로
        </button>
      </div>

      <div
        className="other-content"
        css={otherContentWrapper}>
        <h1 css={otherContentTitleStyle}>
          {item.groupTitle}
          <span css={otherContentText}>의 다른 글</span>
        </h1>
        <div css={postsWrapper}>
          <div css={prevContentWrapper}>
            <p>이전 게시글</p>
            <h4>{item.title}</h4>
          </div>
          <div css={nextContentWrapper}>
            <p>다음 게시글</p>
            <h4>{item.title}</h4>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <Modal
          title="삭제하시겠습니까?"
          description="삭제한 게시글은 복구가 불가능합니다."
          onConfirm={() => {
            alert('삭제되었습니다.')
            setIsModalOpen(false)
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}

export default Detail

const wrapperStyle = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  padding-top: 100px;
  box-sizing: border-box;
`

/* 제목 */
const tabItemStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 130px;

  .text-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  h4 {
    font-size: ${fontSize.xxs};
    color: ${color.darkYellow};
    font-weight: bold;
    margin: 0;
    background: transparent;
    border: none;
    cursor: pointer;
  }

  h3 {
    font-size: ${fontSize.sm};
    color: ${color.black};
    font-weight: bold;
    margin: 0;
    background: transparent;
    border: none;
    cursor: pointer;
  }

  p {
    font-size: ${fontSize.xxxs};
    color: ${color.gray};
    margin: 0;
  }
`

/* 버튼 */
const btnWrapper = css`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  text-align: center;
  height: auto;
  gap: 8px;
  margin-right: 250px;
`
const deleteBtn = css`
  background-color: transparent;
  border: 1px solid ${color.gray};
  padding: 0 10px;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: ${color.lightGray};
  }
`

const deleteText = css`
  font-size: ${fontSize.xxxs};
  color: ${color.black};
  text-align: center;
`

const editBtn = css`
  background-color: ${color.yellow};
  border: 1px solid ${color.yellow};
  padding: 0 10px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${color.darkYellow};
    border: 1px solid ${color.darkYellow};
  }
`

const editText = css`
  color: ${color.white};
  font-size: ${fontSize.xxxs};
  text-align: center;
`

/* 내용 */
const contentSectionStyle = css`
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 100px 250px;
  line-height: 1.6;
  font-size: 18px;
  color: ${color.black};
  background-color: transparent;
  margin: 0;
  width: 100%;
  height: auto;
  border: none;
  border-bottom: 1px solid ${color.lightGray};
`

/* 메인으로 버튼 */
const goMain = css`
  width: 100%;
  display: flex;
  justify-content: right;
  padding: 60px 250px;
`

const goMainBtn = css`
  background-color: ${color.lightGray};
  border: none;
  border-radius: 4px;
  padding: 20px 20px;
  font-size: ${fontSize.xxs};
  color: ${color.gray};
  text-align: center;
  cursor: pointer;
  transition: all 0.5s ease;

  &:hover {
    background-color: ${color.gray};
    color: ${color.white};
  }
`

/* 다른 글 */
const otherContentWrapper = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  text-align: center;
  background-color: ${color.lightGray};
  padding: 40px 0;
  margin-bottom: 100px;
  box-sizing: border-box;
  gap: 24px;
`

const otherContentTitleStyle = css`
  padding-left: 250px;
  display: flex;
  font-size: ${fontSize.xs};
  color: ${color.yellow};
  font-weight: bold;
  gap: 8px;
`

const otherContentText = css`
  color: ${color.black};
`

const postsWrapper = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 32px;
  padding: 0 250px 20px;
`

const prevContentWrapper = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${color.gray};
  cursor: pointer;
  transition: background-color 0.5s ease;

  p {
    font-size: ${fontSize.xxxs};
    padding-top: 20px;
  }

  h4 {
    font-size: ${fontSize.xs};
    margin: 0;
    padding-bottom: 40px;
  }

  &:hover {
    background-color: ${color.charcoal};
  }
`

const nextContentWrapper = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${color.gray};
  cursor: pointer;
  transition: background-color 0.5s ease;

  p {
    font-size: ${fontSize.xxxs};
    padding-top: 20px;
  }

  h4 {
    font-size: ${fontSize.xs};
    margin: 0;
    padding-bottom: 40px;
  }

  &:hover {
    background-color: ${color.charcoal};
  }
`
