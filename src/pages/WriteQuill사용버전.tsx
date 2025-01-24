/** @jsxImportSource @emotion/react */

import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { css } from '@emotion/react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { db } from '@/api/firebaseApp'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL
} from 'firebase/storage'
import { color } from '@/constants/color'
import { fontSize } from '@/constants/font'
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined'
import FormatColorTextIcon from '@mui/icons-material/FormatColorText'
import FormatSizeIcon from '@mui/icons-material/FormatSize'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SelectBox from '@/components/SelectBox'

const Write = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [editorValue, setEditorValue] = useState('')
  const [selectedOption, setSelectedOption] = useState('프로젝트')
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const handleSelectChange = (value: string) => {
    console.log('선택된 값:', value)
    setSelectedOption(value)
  }

  const options = [
    { label: '프로젝트', value: '프로젝트' },
    { label: '트러블슈팅', value: '트러블슈팅' }
  ]

  const handleBack = () => {
    navigate(-1)
  }

  const handlePublish = async () => {
    if (!title || !editorValue) {
      alert('제목과 내용을 모두 입력해주세요.')
      return
    }

    try {
      const postsCollection = collection(db, 'posts')
      await addDoc(postsCollection, {
        title,
        groupTitle: selectedOption,
        content: editorValue,
        image: imageUrl,
        date: Timestamp.fromDate(new Date())
      })

      alert('게시글이 성공적으로 업로드되었습니다!')
      navigate('/')
    } catch (error) {
      console.error('게시글 업로드 실패:', error)
      alert('게시글 업로드 중 오류가 발생했습니다.')
    }
  }

  const quillRef = useRef<ReactQuill>(null)

  // 이미지 업로드 핸들러
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const storage = getStorage()
      const storageRef = ref(storage, `images/${file.name}`)
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on(
        'state_changed',
        snapshot => {
          // 진행 상황을 알 수 있습니다 (optional)
        },
        error => {
          console.error('이미지 업로드 실패:', error)
        },
        () => {
          // 업로드 완료 후 URL 가져오기
          getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
            // quillRef를 통해 에디터에 접근하여 이미지를 삽입
            const quill = quillRef.current?.getEditor()
            const range = quill?.getSelection()
            if (range) {
              quill?.insertEmbed(range.index, 'image', downloadURL)
            }
          })
        }
      )
    }
  }

  return (
    <div css={wrapperStyle}>
      <div
        className="title-section"
        css={titleWrapperStyle}>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="제목을 입력하세요."
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
        <AttachFileIcon css={iconStyle} />
      </div>

      <div css={editorWrapperStyle}>
        <div css={contentWrapperStyle}>
          <ReactQuill
            ref={quillRef} // ReactQuill에 ref를 설정
            value={editorValue}
            onChange={setEditorValue} // 내용 업데이트
            placeholder="내용을 작성하세요."
            modules={editorModules}
            css={textAreaStyle}
          />
        </div>
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
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: 'none' }}
        id="imageUpload"
      />
      <label htmlFor="imageUpload">
        <button css={uploadBtnStyle}>이미지 업로드</button>
      </label>
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

/* 에디터 영역 */
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

/* 버튼 섹션 */
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

const editorModules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['bold', 'italic', 'underline'],
    ['link', 'image'], // image 삽입 옵션 추가
    [{ align: [] }],
    ['clean']
  ]
}
