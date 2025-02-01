/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ref, get, getDatabase } from 'firebase/database'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  deleteDoc
} from 'firebase/firestore'
import { db } from '@/api/firebaseApp'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { color } from '@/constants/color'
import { fontSize } from '@/constants/font'
import Modal from '@/components/Modal'

interface Post {
  id: string
  title: string
  groupTitle: string
  content: string
  date: string
  image?: string
}

const Detail = () => {
  const { id } = useParams<{ id: string }>()
  const auth = getAuth()
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [postsData, setPostsData] = useState<Post[]>([])
  const [currentPost, setCurrentPost] = useState<Post | null>(null)

  const currentIndex = postsData.findIndex(
    post => post.id === id && post.groupTitle === currentPost?.groupTitle
  )
  const item = postsData[currentIndex]

  const prevItem =
    currentIndex > 0
      ? postsData
          .slice(0, currentIndex)
          .reverse()
          .find(post => post.groupTitle === currentPost?.groupTitle)
      : null

  const nextItem =
    currentIndex < postsData.length - 1
      ? postsData
          .slice(currentIndex + 1)
          .find(post => post.groupTitle === currentPost?.groupTitle)
      : null

  const handlePrev = () => {
    if (prevItem) {
      navigate(`/detail/${prevItem.id}`)
    }
  }

  const handleNext = () => {
    if (nextItem) {
      navigate(`/detail/${nextItem.id}`)
    }
  }

  const handleBack = () => {
    navigate(`/`)
  }

  const handleEdit = () => {
    if (currentPost) {
      navigate(`/edit/${currentPost.id}`)
    }
  }

  const handleDelete = async () => {
    if (!id) {
      alert('삭제할 게시글이 존재하지 않습니다.')
      return
    }

    try {
      const docRef = doc(db, 'posts', id)

      await deleteDoc(docRef)

      alert('게시글이 삭제되었습니다.')
      navigate('/')
    } catch (error) {
      console.error('삭제 실패:', error)
      alert('삭제에 실패했습니다.')
    }
  }

  useEffect(() => {
    const fetchPosts = async () => {
      const db = getFirestore()
      const postsCollection = collection(db, 'posts')
      const querySnapshot = await getDocs(postsCollection)
      const postsList: Post[] = []

      querySnapshot.forEach(doc => {
        const post = doc.data()
        const date = post.date?.seconds
          ? new Date(post.date.seconds * 1000).toISOString().split('T')[0]
          : post.date || ''

        postsList.push({
          id: doc.id,
          title: post.title,
          groupTitle: post.groupTitle,
          content: post.content,
          date: date
        })
      })
      setPostsData(postsList)
    }

    fetchPosts()
  }, [])

  useEffect(() => {
    if (id && postsData.length > 0) {
      const foundPost = postsData.find(post => post.id === id)
      setCurrentPost(foundPost || null)
    }
  }, [id, postsData])

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const database = getDatabase()

        onAuthStateChanged(auth, async user => {
          if (user) {
            const adminRef = ref(database, 'admin/uid')
            const snapshot = await get(adminRef)

            if (snapshot.exists() && snapshot.val() === user.uid) {
              setIsAdmin(true)
            } else {
              setIsAdmin(false)
            }
          } else {
            setIsAdmin(false)
          }
        })
      } catch (error) {
        console.error('관리자 확인 오류:', error)
        setIsAdmin(false)
      }
    }

    checkAdmin()
  }, [auth])

  if (!currentPost) {
    return <div>게시글을 찾을 수 없습니다.</div>
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

      {isAdmin && (
        <div
          className="button-section"
          css={btnWrapper}>
          <button
            css={deleteBtn}
            onClick={() => setIsModalOpen(true)}>
            <p css={deleteText}>삭제</p>
          </button>
          <button
            css={editBtn}
            onClick={handleEdit}>
            <p css={editText}>수정</p>
          </button>
        </div>
      )}

      <div
        className="content-section"
        css={contentSectionStyle}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            img: ({ ...props }) => (
              <img
                {...props}
                css={css`
                  max-width: 100%;
                  max-height: 300px;
                  object-fit: contain;
                `}
              />
            )
          }}>
          {item.content}
        </ReactMarkdown>
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
          <div
            onClick={handlePrev}
            css={prevContentWrapper}>
            <p>이전 게시글</p>
            <h4>{prevItem ? prevItem.title : '이전 게시글이 없습니다.'}</h4>
          </div>
          <div
            onClick={handleNext}
            css={nextContentWrapper}>
            <p>다음 게시글</p>
            <h4>{nextItem ? nextItem.title : '다음 게시글이 없습니다.'}</h4>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <Modal
          title="삭제하시겠습니까?"
          description="삭제한 게시글은 복구가 불가능합니다."
          onConfirm={async () => {
            await handleDelete()
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
  text-align: left;
  padding: 40px 150px;
  line-height: 1.6;
  font-size: 18px;
  color: ${color.black};
  background-color: transparent;
  margin: 0;
  width: 100%;
  height: auto;
  border: none;
  border-bottom: 1px solid ${color.lightGray};

  ul,
  ol {
    padding-left: 0;
  }

  li {
    list-style-type: disc;
    font-size: ${fontSize.xxs};
    color: ${color.black};
    list-style-position: inside;
  }

  pre {
    display: inline-block;
    width: 50vw;
    background-color: ${color.lightGray};
    padding: 10px;
    border-radius: 3px;
    font-size: 14px;
    white-space: pre-wrap;
    word-wrap: break-word;
    text-align: left;
  }
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
