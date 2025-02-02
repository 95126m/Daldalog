/** @jsxImportSource @emotion/react */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { css } from '@emotion/react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { db, storage } from '@/api/firebaseApp'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { color } from '@/constants/color'
import { fontSize } from '@/constants/font'
import ImageIcon from '@mui/icons-material/Image'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import FormatColorTextIcon from '@mui/icons-material/FormatColorText'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SelectBox from '@/components/SelectBox'

const Write = () => {
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [markdownText, setMarkdownText] = useState('')
  const [selectedOption, setSelectedOption] = useState('프로젝트')

  const handleSelectChange = (value: string) => {
    console.log('선택된 값:', value)
    setSelectedOption(value)
  }

  const options = [
    { label: '프로젝트', value: '프로젝트' },
    { label: '트러블슈팅', value: '트러블슈팅' },
    { label: '공지사항', value: '공지사항' },
    { label: '스몰토크', value: '스몰토크' },
    { label: '알아보자', value: '알아보자' },
    { label: 'IT뉴스', value: 'IT뉴스' }
  ]

  const handleBack = () => {
    navigate(-1)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setThumbnail(event.target.files[0])
    }
  }

  const handleImageFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const imageRef = ref(storage, `posts/${event.target.files[0].name}`)
      const uploadTask = uploadBytesResumable(imageRef, event.target.files[0])

      uploadTask.on(
        'state_changed',
        snapshot => {
          console.log(
            `이미지 업로드 진행률: ${(snapshot.bytesTransferred / snapshot.totalBytes) * 100}%`
          )
        },
        error => {
          console.error('이미지 업로드 실패:', error)
        },
        async () => {
          const imageUrl = await getDownloadURL(uploadTask.snapshot.ref)
          console.log('업로드된 이미지 URL:', imageUrl)

          setMarkdownText(
            prev => `${prev}\n\n![업로드된 이미지](${imageUrl})\n\n`
          )
        }
      )
    }
  }

  const handlePublish = async () => {
    if (!title || !markdownText) {
      alert('제목과 내용을 모두 입력해주세요.')
      return
    }

    try {
      let thumbnailUrl = ''

      if (thumbnail) {
        const storageRef = ref(storage, `thumbnails/${thumbnail.name}`)
        const uploadTask = uploadBytesResumable(storageRef, thumbnail)

        await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            snapshot => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              console.log(`업로드 진행률: ${progress}%`)
            },
            error => {
              console.error('업로드 실패:', error)
              reject(error)
            },
            async () => {
              thumbnailUrl = await getDownloadURL(uploadTask.snapshot.ref)
              console.log('업로드 완료! URL:', thumbnailUrl)
              resolve(thumbnailUrl)
            }
          )
        })
      }

      const postsCollection = collection(db, 'posts')
      await addDoc(postsCollection, {
        title,
        groupTitle: selectedOption,
        content: markdownText,
        date: Timestamp.fromDate(new Date()),
        thumbnail: thumbnailUrl,
        createdAt: Timestamp.fromDate(new Date())
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
        <FormatColorTextIcon css={iconStyle} />
        <p css={middleStyle}>|</p>
        <label htmlFor="image-upload">
          <ImageIcon css={iconStyle} />
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageFileChange}
          style={{ display: 'none' }}
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

          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            accept="image/*"
          />

          <label htmlFor="file-upload">썸네일 선택</label>

          <button
            css={uploadBtnStyle}
            onClick={handlePublish}>
            <h1 css={uploadTextStyle}>출간하기</h1>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Write

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
  padding: 0 150px;
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
  max-width: calc(100% - 300px);
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
  padding: 0 150px;
  background-color: ${color.lightGray};
  color: ${color.black};
  font-size: ${fontSize.xxs};
  height: calc(100vh - 500px);
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

  ul,
  ol {
    padding-left: 20px;
  }

  li {
    list-style-type: disc;
    font-size: ${fontSize.xxs};
    color: ${color.black};
    list-style-position: inside;
  }

  pre {
    background-color: ${color.lightGray};
    padding: 20px;
    border-radius: 3px;
    font-size: 14px;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
`

/* 버튼 섹션 */
const buttonWrapperStyle = css`
  border-top: 1px solid ${color.lightGray};
  width: 100%;
  max-width: calc(100% - 300px);
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
  font-size: 15px;
`

const backTextStyle = css`
  font-size: ${fontSize.xxs};
`

const selecboxWrapper = css`
  display: flex;
  align-items: center;
  gap: 8px;

  input {
    display: none;
  }

  label {
    padding: 8px 16px;
    font-size: 15px;
    background-color: ${color.gray};
    color: ${color.white};
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.5s ease-in-out;
    text-align: center;
    display: inline-block;

    &:hover {
      background-color: ${color.darkYellow};
    }
  }
`
