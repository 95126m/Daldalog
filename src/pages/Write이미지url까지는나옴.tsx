/** @jsxImportSource @emotion/react */
import { useState, useRef } from 'react'
import { css } from '@emotion/react'
import { useNavigate } from 'react-router-dom'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/api/firebaseApp'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { color } from '@/constants/color'
import { fontSize } from '@/constants/font'
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import ImageIcon from '@mui/icons-material/Image'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined'
import FormatColorTextIcon from '@mui/icons-material/FormatColorText'
import FormatSizeIcon from '@mui/icons-material/FormatSize'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SelectBox from '@/components/SelectBox'

const Write = () => {
  const [title, setTitle] = useState('')
  const [markdownText, setMarkdownText] = useState('')
  const [selectedOption, setSelectedOption] = useState('프로젝트')
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const navigate = useNavigate()

  // 이미지 파일 업로드 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target
    if (files && files.length === 1) {
      const file = files[0]
      const imageUrl = URL.createObjectURL(file) // 로컬 URL 생성
      setSelectedImage(imageUrl) // 상태 업데이트

      uploadImageToServer(file) // 서버로 이미지 업로드 요청
    }
  }

  // 서버로 이미지 업로드 (프록시 서버 사용)
  const uploadImageToServer = (file: File) => {
    const reader = new FileReader()

    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        // reader.result가 string인 경우에만 처리
        const base64file = reader.result.split(',')[1] // base64 부분만 분리

        fetch('http://localhost:5000/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileUrl: base64file,
            fileName: file.name
          })
        })
          .then(response => response.json())
          .then(data => {
            setMarkdownText(prevText => prevText + `![](${data.fileUrl})`) // 서버에서 반환된 URL을 마크다운에 삽입
          })
          .catch(error => {
            console.error('Error uploading file:', error)
          })
      }
    }

    reader.readAsDataURL(file) // 파일을 base64로 읽기
  }

  

  const handleImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click() // 이미지 업로드 버튼 클릭
    }
  }

  // 선택한 옵션 처리
  const handleSelectChange = (value: string) => {
    setSelectedOption(value)
  }

  const options = [
    { label: '프로젝트', value: '프로젝트' },
    { label: '트러블슈팅', value: '트러블슈팅' }
  ]

  const handleBack = () => {
    navigate('/')
  }

  const handlePublish = async () => {
    if (!title || !markdownText) {
      alert('제목과 내용을 모두 입력해주세요.')
      return
    }

    try {
      console.log('게시글 업로드 중...', {
        title,
        content: markdownText,
        groupTitle: selectedOption
      })

      const postsCollection = collection(db, 'posts')
      await addDoc(postsCollection, {
        title,
        groupTitle: selectedOption,
        content: markdownText,
        date: Timestamp.fromDate(new Date())
      })

      alert('게시글이 성공적으로 업로드되었습니다!')
      navigate('/')
    } catch (error) {
      console.error('게시글 업로드 실패:', error)
      alert('게시글 업로드 중 오류가 발생했습니다.')
    }
  }

  return (
    <div css={wrapperStyle}>
      <div css={titleWrapperStyle}>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="제목을 입력하세요."
          css={titleInputStyle}
        />
      </div>

      <div css={iconSectionStyle}>
        <FormatSizeIcon css={iconStyle} />
        <FormatBoldIcon css={iconStyle} />
        <FormatUnderlinedIcon css={iconStyle} />
        <FormatColorTextIcon css={iconStyle} />
        <p css={middleStyle}>|</p>
        <ImageIcon
          css={iconStyle}
          onClick={handleImageUpload}
        />
        <p css={middleStyle}>|</p>
        <AttachFileIcon css={iconStyle} />
      </div>

      <div css={editorWrapperStyle}>
        <div css={contentWrapperStyle}>
          <textarea
            value={markdownText}
            onChange={e => setMarkdownText(e.target.value)}
            placeholder="내용을 작성하세요."
            css={textAreaStyle}
          />
        </div>
        <div css={previewWrapperStyle}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdownText}
          </ReactMarkdown>
        </div>
      </div>

      <div css={buttonWrapperStyle}>
        <div css={backBtnWrapper}>
          <ArrowBackIcon css={backIconStyle} />
          <button
            css={backBtnStyle}
            onClick={handleBack}>
            <h1 css={backTextStyle}>나가기</h1>
          </button>
        </div>
        <div css={selecboxWrapper}>
          <SelectBox
            options={options}
            value={selectedOption}
            placeholder="옵션을 선택하세요"
            onChange={handleSelectChange}
          />
        </div>
        <button
          css={uploadBtnStyle}
          onClick={handlePublish}>
          <h1 css={uploadTextStyle}>출간하기</h1>
        </button>
      </div>

      {/* 이미지 파일 input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        style={{ display: 'none' }}
      />
    </div>
  )
}

export default Write

// CSS Styles
const wrapperStyle = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background-color: ${color.lightGray};
  padding-top: 70px;
  box-sizing: border-box;
`

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

const editorWrapperStyle = css`
  display: flex;
  flex-direction: row;
  flex: 1;
  padding: 0 250px;
  background-color: ${color.lightGray};
  color: ${color.black};
  font-size: ${fontSize.xxs};
`

const contentWrapperStyle = css`
  flex: 1;
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

const previewWrapperStyle = css`
  flex: 1;
  padding: 20px;
  background-color: ${color.white};
  border: 1px solid ${color.lightGray};
  border-radius: 8px;
  overflow-y: auto;
`

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

const selecboxWrapper = css`
  margin-left: 50vw;
  display: flex;
  align-items: center;
`
