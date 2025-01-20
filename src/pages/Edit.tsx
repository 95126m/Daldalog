/** @jsxImportSource @emotion/react */
import { useLocation, useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { css } from '@emotion/react'
import { color } from '@/constants/color'
import { fontSize } from '@/constants/font'
import { TabData } from '@/mocks/TabData'
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import ImageIcon from '@mui/icons-material/Image'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined'
import FormatColorTextIcon from '@mui/icons-material/FormatColorText'
import FormatSizeIcon from '@mui/icons-material/FormatSize'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const Edit = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams() 
  const [data, setData] = useState({
    title: '',
    content: ''
  })

  useEffect(() => {
    if (location.state) {
      setData(location.state); 
    } else if (id) {
      const item = TabData.find((tab) => tab.id === Number(id)); 
      if (item) {
        setData(item);
      } else {
        console.warn('Item not found for ID:', id);
      }
    }
  }, [location.state, id]);
  

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div css={wrapperStyle}>
      <div
        className="title-section"
        css={titleWrapperStyle}>
        <input
          type="text"
          placeholder="제목을 입력하세요."
          value={data.title}
          onChange={e => setData({ ...data, title: e.target.value })}
          css={titleInputStyle}
        />
      </div>
      <div
        className="icon-section"
        css={iconSectionStyle}>
        <FormatSizeIcon css={iconStyle} />
        <FormatBoldIcon css={iconStyle} />
        <FormatUnderlinedIcon css={iconStyle} />
        <FormatColorTextIcon css={iconStyle} />
        <p css={middleStyle}>|</p>
        <ImageIcon css={iconStyle} />
        <p css={middleStyle}>|</p>
        <AttachFileIcon css={iconStyle} />
      </div>

      <div
        className="write-section"
        css={contentWrapperStyle}>
        <textarea
          placeholder="내용을 작성하세요."
          value={data.content}
          onChange={e => setData({ ...data, content: e.target.value })}
          css={textAreaStyle}
        />
      </div>

      <div
        className="button-section"
        css={buttonWrapperStyle}>
        <div css={backBtnWrapper}>
          <ArrowBackIcon css={backIconStyle} />
          <button
            css={backBtnStyle}
            onClick={handleBack}>
            <h1 css={backTextStyle}>나가기</h1>
          </button>
        </div>
        <button
          css={uploadBtnStyle}
          onClick={() => {
            console.log('Updated Data:', data)
          }}>
          <h1 css={uploadTextStyle}>수정하기</h1>
        </button>
      </div>
    </div>
  )
}

export default Edit

const wrapperStyle = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background-color: ${color.lightGray};
  padding-top: 70px;
  box-sizing: border-box;
`

/* 제목 영역 */
const titleWrapperStyle = css`
  padding: 0 250px;
  background-color: ${color.lightGray};
`

const titleInputStyle = css`
  width: 100%;
  height: 100px;
  padding: 20px;
  font-size: ${fontSize.md};
  color: ${color.black};
  border: none;
  border-bottom: 1px solid ${color.lightGray};
  outline: none;

  ::placeholder {
    color: ${color.lightGray};
  }
`

/* 아이콘 영역 */
const iconSectionStyle = css`
  display: flex;
  width: 100%;
  max-width: calc(100% - 500px);
  margin: 0 auto;
  border: none;
  background-color: ${color.white};
  border-bottom: 1px solid ${color.lightGray};
  justify-content: flex-start;
  align-items: center;
  padding-left: 20px;
  gap: 15px;
  height: 60px;
`

const iconStyle = css`
  color: ${color.black};
  cursor: pointer;
  font-size: 24px;
  transition:
    transform 0.2s ease-in-out,
    color 0.2s ease-in-out;

  &:hover {
    transform: scale(1.2);
    color: ${color.darkYellow};
  }
`

const middleStyle = css`
  color: ${color.lightGray};
  font-size: ${fontSize.xxs};
`

/* 내용 영역 */
const contentWrapperStyle = css`
  flex: 1;
  padding: 0 250px;
  background-color: ${color.lightGray};
`

const textAreaStyle = css`
  width: 100%;
  height: 100%;
  resize: none;
  padding: 20px;
  font-size: ${fontSize.xxs};
  color: ${color.black};
  border: none;
  background-color: ${color.white};
  outline: none;
  box-sizing: border-box;

  ::placeholder {
    color: ${color.lightGray};
  }
`

/* 버튼 영역 */
const buttonWrapperStyle = css`
  border-top: 1px solid ${color.lightGray};
  width: 100%;
  max-width: calc(100% - 500px);
  margin: 0 auto;
  padding: 10px 20px;
  background-color: ${color.white};
  justify-content: space-between;
  align-items: center;
  display: flex;
`

const backBtnWrapper = css`
  display: flex;
  align-items: center;
  cursor: pointer;
`

const backIconStyle = css`
  font-size: 20px;
  color: ${color.black};
`

const backBtnStyle = css`
  background-color: transparent;
  color: ${color.charcoal};
  font-size: ${fontSize.md};
  padding: 10px 8px;
  border: none;
  cursor: pointer;
`

const uploadBtnStyle = css`
  padding: 0 10px;
  font-size: ${fontSize.xxs};
  color: ${color.white};
  background-color: ${color.gray};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition:
    background-color 0.5s ease,
    color 0.5s ease;

  &:hover {
    background-color: ${color.darkYellow};
  }
`

const uploadTextStyle = css`
  color: ${color.white};
  font-size: ${fontSize.xxs};
`

const backTextStyle = css`
  font-size: ${fontSize.xxs};
`
