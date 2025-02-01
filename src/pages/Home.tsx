/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ref, get, getDatabase, push, remove } from 'firebase/database'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy
} from 'firebase/firestore'
import { onValue } from 'firebase/database'

import { css } from '@emotion/react'
import { color } from '@/constants/color'
import { fontSize } from '@/constants/font'
import sample from '@/assets/sample2.jpg'
import EditIcon from '@mui/icons-material/Edit'
import TabButton from '@/components/TabButton'
import Pagination from '@/components/Pagination'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import NotesIcon from '@mui/icons-material/Notes'
import ManageSearchIcon from '@mui/icons-material/ManageSearch'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ApexChart from '@/components/ApexChart'
import ProfileImage from '@/assets/profile.jpg'
import Loading from '@/components/Loading'
import AddIcon from '@mui/icons-material/Add'
import DoneIcon from '@mui/icons-material/Done'
import RemoveIcon from '@mui/icons-material/Remove'

interface Post {
  id: string
  title: string
  groupTitle: string
  content: string
  date: Date | string
  image?: string
  thumbnail?: string
}

interface Todos {
  id: string
  value: string
}

const Home = () => {
  const navigate = useNavigate()
  const auth = getAuth()
  const firestore = getFirestore()
  const [todos, setTodos] = useState('')
  const [todosItem, setTodosItem] = useState<Todos[]>([])

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [postsData, setPostsData] = useState<Post[]>([])
  const [activeGroup, setActiveGroup] = useState<string>('전체')
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const introduceContentId = 'HGW5oBEVHa4FmEV4iWKJ'
  const profileContentId = 'cL3VjyK9ML1AwQ3dobDO'

  const handleAddTodosChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodos(event.target.value)
  }

  const handleAddTodos = async () => {
    if (todos.trim() === '') {
      alert('할 일을 입력해주세요.')
      return
    }

    try {
      const database = getDatabase()
      const todosRef = ref(database, 'todos')
      await push(todosRef, todos)
      setTodos('')
    } catch (error) {
      console.error('Firebase에 데이터 추가 실패:', error)
      alert('데이터 추가 중 문제가 발생했습니다.')
    }
  }

  const handleDeleteTodos = async (id: string) => {
    try {
      const database = getDatabase()
      const todoRef = ref(database, `todos/${id}`)
      await remove(todoRef)
      setTodosItem(prevTodos => prevTodos.filter(todo => todo.id !== id))
    } catch (error) {
      console.error('할 일 삭제 실패:', error)
      alert('할 일을 삭제하는 중 문제가 발생했습니다.')
    }
  }

  const handleWrite = () => {
    navigate('/write')
  }

  const handleDetail = (id: string) => {
    navigate(`/detail/${id}`)
  }

  const handleSearch = () => {
    navigate(`/search`)
  }

  const handleContent = (text: string, length: number) => {
    if (text.length > length) {
      return text.slice(0, length) + '...'
    }
    return text
  }

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

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todosItem))
  }, [todosItem])

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      setTodosItem(JSON.parse(savedTodos))
    }
  }, [])

  useEffect(() => {
    const database = getDatabase()
    const todosRef = ref(database, 'todos')

    const unsubscribe = onValue(todosRef, snapshot => {
      if (snapshot.exists()) {
        const data: Record<string, string> = snapshot.val()
        const todosArray: Todos[] = Object.entries(data).map(
          ([key, value]) => ({
            id: key,
            value
          })
        )
        setTodosItem(todosArray)
      } else {
        setTodosItem([])
      }
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true)

      try {
        const postsCollection = collection(firestore, 'posts')
        const postsQuery = query(postsCollection, orderBy('createdAt', 'desc'))
        const snapshot = await getDocs(postsQuery)

        if (!snapshot.empty) {
          const postsArray: Post[] = snapshot.docs.map(doc => {
            const postData = doc.data()
            console.log("🔥 Firestore에서 가져온 데이터:", postData);

            return {
              id: doc.id,
              title: postData.title,
              groupTitle: postData.groupTitle,
              content: postData.content,
              date: postData.date?.seconds
                ? new Date(postData.date.seconds * 1000)
                    .toISOString()
                    .split('T')[0]
                : postData.date || '',

                createdAt: postData.createdAt?.seconds
                ? new Date(postData.createdAt.seconds * 1000).toLocaleString()
                : new Date().toLocaleString(),
                
              image: postData.image || '',
              thumbnail: postData.thumbnail || ''
            }
          })

          setPostsData(postsArray)
        } else {
          console.log('Firestore 데이터가 없습니다.')
        }
      } catch (error) {
        console.error('Firestore에서 데이터 가져오기 실패:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [firestore])

  const ITEMS_PER_PAGE = 5
  const allGroups = [
    '전체',
    ...Array.from(new Set(postsData.map(post => post.groupTitle)))
  ]

  const filteredData =
    activeGroup === '전체'
      ? postsData
      : postsData.filter(
          post =>
            post.groupTitle.trim().toLowerCase() ===
            activeGroup.trim().toLowerCase()
        )

  const totalPage = Math.ceil(filteredData.length / ITEMS_PER_PAGE)
  const startIndex = currentPage * ITEMS_PER_PAGE
  const displayedItems = filteredData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  )

  return (
    <div css={wrapperStyle}>
      <section className="first">
        <div
          className="content"
          css={firstSectionContentStyle}>
          <img
            src={sample}
            alt="이미지"
            css={firstSectionImgStyle}
          />
          <div css={firstSectionTextStyle}>
            <h2>【스몰토크】</h2>
            <p>
              다양한 블로그 플랫폼들이 세상에 존재하는데, 운영자는 어째서
              본인만의 블로그를 제작하게 되었을까요?
              <br />
              이에 대해 의문점이 든다면 하단의 버튼을 클릭해 자세히 알아보세요!
              😸
            </p>
            <button onClick={() => handleDetail(introduceContentId)}>
              VIEW
            </button>
          </div>
        </div>
      </section>

      <section className="second">
        <div
          className="content"
          css={secondSectionContentStyle}>
          <img
            src={ProfileImage}
            alt="이미지"
            css={secondSectionImgStyle}
          />
          <div css={secondSectionTextStyle}>
            <h1>달다로</h1>
            <p>
              느지막히 개발공부를 시작하게된 달다로입니다.
              <br />
              공부필기 및 복습겸 제작하게된 블로그입니다.
              <br />
              꾸준하게 공부하며 성장하는 모습 보여드리겠습니다! 😸
            </p>
            <button onClick={() => handleDetail(profileContentId)}>
              Read More
            </button>
          </div>
        </div>
      </section>

      <section className="sixth">
        <div
          className="content"
          css={sixthSectionContentStyle}>
          <div
            className="title-section"
            css={titleWrapper}>
            <DoneIcon css={checkIcon} />
            <h1 css={todosTitle}>TODOS</h1>
          </div>
          <div css={sixthSectionTextStyle}>
            {isAdmin && (
              <div css={sixthTitleWrapper}>
                <input
                  type="text"
                  onChange={handleAddTodosChange}
                  value={todos}
                  css={sixthInput}
                />
                <AddIcon
                  css={sixthBtn}
                  onClick={handleAddTodos}
                />
              </div>
            )}
            <ul css={todoListStyle}>
              {todosItem.map(item => (
                <li
                  key={item.id}
                  css={todoItemStyle}>
                  <span>{item.value}</span>
                  {isAdmin && (
                    <RemoveIcon
                      css={deleteIcon}
                      onClick={() => handleDeleteTodos(item.id)}
                    />
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="third">
        <div className="content">
          <div css={tabContainerStyle}>
            <div css={thirdTitleWrapper}>
              <ContentCopyIcon css={thirdContentIcon} />
              <h1 css={thirdTitle}>POSTS</h1>
            </div>
            <div css={tabButtonContainerStyle}>
              {allGroups.map((group, index) => (
                <TabButton
                  key={index}
                  isActive={activeGroup === group}
                  label={group}
                  onClick={() => setActiveGroup(group)}
                />
              ))}
            </div>
            <div
              css={[
                tabContentStyle,
                isLoading &&
                  css`
                    min-height: 600px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  `
              ]}>
              {isLoading ? (
                <Loading />
              ) : (
                displayedItems.map(item => (
                  <div
                    key={item.id}
                    css={tabItemStyle}>
                    <img
                      src={item.thumbnail ? item.thumbnail : sample}
                      alt={item.title}
                    />
                    <div className="text-container">
                      <h3 onClick={() => handleDetail(item.id)}>
                        {item.title}
                      </h3>
                      <p>
                        {item.date instanceof Date
                          ? item.date.toLocaleString()
                          : item.date}
                      </p>
                      <span>{handleContent(item.content, 100)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <Pagination
            totalPage={totalPage}
            currentPage={currentPage}
            handlePageChange={setCurrentPage}
          />
        </div>
      </section>

      <section className="fourth">
        <div
          className="content"
          css={fourthSectionContentStyle}>
          <div css={fourthSectionTextStyle}>
            <div css={fourthTitleWrapper}>
              <NotesIcon css={fourthContentIcon} />
              <h1 css={fourthTitle}>SCHEDULE</h1>
            </div>
            <ApexChart />
          </div>
        </div>
      </section>

      <section className="fifth">
        <div
          className="content"
          css={fifthSectionContentStyle}>
          <div css={fifthSectionTextStyle}>
            <div css={fifthTitleWrapper}>
              <ManageSearchIcon css={fifthContentIcon} />
              <h1 css={fifthTitle}>SEARCH</h1>
              <ArrowForwardIcon
                css={arrowIcon}
                onClick={handleSearch}
              />
            </div>
          </div>
        </div>
      </section>

      {isAdmin && (
        <div css={writeIconStyle}>
          <EditIcon onClick={handleWrite} />
        </div>
      )}
    </div>
  )
}

export default Home

const headerHeight = 70

const wrapperStyle = css`
  width: 100%;
  margin: 0 auto;
  padding-top: ${headerHeight}px;
  background-color: transparent;

  display: grid;
  grid-template-columns: 6fr 2fr;
  grid-template-rows: auto auto auto auto;
  grid-template-areas:
    'first first'
    'third second'
    '. sixth'
    'fourth fourth'
    'fifth fifth';
  gap: 60px;

  padding: 0;

  section {
    display: flex;
    align-items: center;
    justify-content: center;

    .content {
      text-align: center;
      max-width: none;
      width: 100%;
    }
  }

  section.first {
    grid-area: first;
  }

  section.second {
    grid-area: second;
    padding: 0 30px;
    border: none;
    border-left: 1px solid ${color.lightGray};
    margin-right: 150px;
  }

  section.sixth {
    grid-area: sixth;
    padding: 0 30px;
    border: 1px solid ${color.lightGray};
    margin-right: 150px;
    min-height: 100px;
  }

  section.third {
    grid-area: third;
    padding: 0 0 0 150px;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  section.fourth {
    grid-area: fourth;
    padding: 0 150px;
  }

  section.fifth {
    grid-area: fifth;
    padding: 0 150px 100px 150px;
  }
`

/* 첫번째 영역 */
const firstSectionContentStyle = css`
  position: relative;
  width: 100vw;
  height: 600px;
  margin: 0 auto;
`

const firstSectionImgStyle = css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
  filter: brightness(0.5);
`

const firstSectionTextStyle = css`
  position: relative;
  z-index: 2;
  text-align: left;
  color: ${color.white};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  height: 100%;
  margin-top: 130px;
  margin-left: 60px;

  h2 {
    font-size: ${fontSize.xl};
    margin: 0;
  }

  p {
    font-size: ${fontSize.xxs};
    margin-top: 10px;
    margin-bottom: 40px;
  }

  button {
    padding: 10px 30px;
    font-size: ${fontSize.xxs};
    color: ${color.white};
    background-color: rgba(0, 0, 0, 0.4);
    border: 2px solid ${color.black};
    border-radius: 4px;
    cursor: pointer;
    transition:
      background-color 0.5s ease,
      color 0.5s ease;

    &:hover {
      background-color: rgba(0, 0, 0, 0.7);
      border: 2px solid ${color.black};
    }
  }
`

/* 두번째 영역 */
const secondSectionContentStyle = css`
  width: 100%;
`

const secondSectionImgStyle = css`
  width: 100%;
  object-fit: cover;
  z-index: 1;
`

const secondSectionTextStyle = css`
  width: 100%;
  text-align: left;
  z-index: 2;

  h1 {
    font-size: ${fontSize.lg};
    color: ${color.darkYellow};
    margin-top: 20px;
    margin-bottom: 20px;
  }

  p {
    font-size: ${fontSize.xxs};
    color: ${color.black};
    margin-bottom: 20px;
    text-align: left;
  }

  button {
    padding: 8px 0;
    font-size: ${fontSize.xxxs};
    color: ${color.gray};
    background: linear-gradient(
      to right,
      ${color.darkYellow} 50%,
      ${color.gray} 50%
    );
    background-size: 200% 100%;
    background-position: right bottom;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    border: none;
    border-bottom: 3px solid ${color.yellow};
    cursor: pointer;
    transition:
      background-position 0.5s ease-in-out,
      border 0.3s ease-in-out;

    &:hover {
      background-position: left bottom;
    }
  }
`

/* 세번째 영역*/
const thirdTitleWrapper = css`
  display: flex;
  justify-content: left;
  align-items: center;
`

const thirdContentIcon = css`
  color: ${color.black};
  font-size: 30px;
  margin-right: 10px;
`

const thirdTitle = css`
  color: ${color.black};
  font-size: ${fontSize.md};
`

const tabContainerStyle = css`
  position: relative;
  width: 100%;
  z-index: 3;
  margin: 0;
  text-align: start;
`

const tabButtonContainerStyle = css`
  display: flex;
  justify-content: flex-start;
  pointer-events: auto;
  z-index: 3;
`

const tabContentStyle = css`
  color: ${color.black};
  background-color: transparent;
`

const tabItemStyle = css`
  display: flex;
  align-items: center;
  gap: 60px;
  border-bottom: 1px solid ${color.lightGray};
  height: 200px;

  img {
    flex-shrink: 0;
    width: 250px;
    height: 150px;
    object-fit: cover;
  }

  .text-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: left;
    gap: 12px;
  }

  h3 {
    font-size: ${fontSize.sm};
    color: ${color.black};
    font-weight: bold;
    margin: 0;
    background: linear-gradient(
      to right,
      ${color.darkYellow} 50%,
      ${color.black} 50%
    );
    background-size: 200% 100%;
    background-position: right bottom;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    border: none;
    cursor: pointer;
    transition:
      background-position 0.8s ease-in-out,
      transform 0.8s ease-in-out;

    &:hover {
      background-position: left;
    }
  }

  p {
    font-size: ${fontSize.xxxs};
    color: ${color.gray};
    margin: 0;
  }

  span {
    font-size: ${fontSize.xxs};
    color: ${color.black};
  }
`

/* 네번째 영역*/

const fourthTitleWrapper = css`
  display: flex;
  justify-content: left;
  align-items: center;
  padding: 40px 0;

  svg {
    font-size: 30px;
    vertical-align: middle;
  }

  h1 {
    margin: 0;
    line-height: 1;
  }
`

const fourthContentIcon = css`
  color: ${color.black};
  font-size: 30px;
  margin-right: 10px;
`

const fourthTitle = css`
  color: ${color.black};
  font-size: ${fontSize.md};
  justify-content: center;
  text-align: center;
  align-items: center;
`

const fourthSectionContentStyle = css`
  width: 100%;
`

const fourthSectionTextStyle = css`
  width: 100%;
  align-items: center;
  justify-content: center;
  text-align: center;
  z-index: 2;

  h1 {
    font-size: ${fontSize.md};
    color: ${color.black};
    margin-top: 0;
  }

  p {
    font-size: ${fontSize.xxs};
    color: ${color.black};
    text-align: left;
  }
`

/* 다섯번째 영역*/
const fifthTitleWrapper = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40px 0;

  svg {
    font-size: 34px;
    vertical-align: middle;
  }

  h1 {
    margin: 0;
    line-height: 1;
  }
`

const fifthContentIcon = css`
  color: ${color.black};
  font-size: 30px;
  margin-right: 10px;
`

const fifthTitle = css`
  color: ${color.black};
  font-size: ${fontSize.md};
`

const fifthSectionContentStyle = css`
  width: 100%;
`
const arrowIcon = css`
  color: ${color.black};
  font-size: 30px;
  margin-left: auto;
  cursor: pointer;
  transition: color 0.3s ease-in-out;

  &:hover {
    color: ${color.yellow};
  }
`

const fifthSectionTextStyle = css`
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: center;
  color: ${color.black};
`

/* 여섯번째 영역*/
const sixthTitleWrapper = css`
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    font-size: 24px;
    vertical-align: middle;
  }

  h1 {
    margin: 0;
    line-height: 1;
  }
`

const sixthSectionContentStyle = css`
  width: 100%;
`

const titleWrapper = css`
  display: flex;
  align-items: center;
  justify-content: left;
  gap: 4px;
  padding: 0;
  margin-top: 20px;
  height: auto;
`

const checkIcon = css`
  color: ${color.black};
  font-size: ${fontSize.xs};
`

const todosTitle = css`
  color: ${color.black};
  font-size: ${fontSize.xs};
  line-height: 1.2;
  margin: 0;
`

const sixthSectionTextStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  margin-top: 20px;

  .input-container {
    display: flex;
    align-items: center;
    gap: 10px;
  }
`

const sixthInput = css`
  width: 220px;
  height: 40px;
  background-color: ${color.lightYellow};
  border: none;
  padding: 0 10px;
  font-size: ${fontSize.xxs};
  color: ${color.black};
  outline: none;
  transition: background-color 0.5s ease-in-out;

  &:focus {
    background-color: ${color.yellow};
  }
`

const sixthBtn = css`
  width: 24px;
  height: auto;
  color: ${color.black};
  cursor: pointer;
  transition: color 0.3s ease-in-out;

  &:hover {
    color: ${color.yellow};
  }
`

const todoListStyle = css`
  list-style: none;
  margin: 0;
  margin-bottom: 10px;
  padding: 0;
  width: 100%;
`

const todoItemStyle = css`
  background-color: transparent;
  padding: 10px;
  font-size: ${fontSize.xxxs};
  color: ${color.black};
  text-align: left;
`

const deleteIcon = css`
  margin-left: 10px;
  width: 12px;
  height: auto;
  color: ${color.red};
  cursor: pointer;
`

/* 글쓰기 아이콘 영역*/
const writeIconStyle = css`
  width: 50px;
  height: 50px;
  background-color: ${color.charcoal};
  color: ${color.white};
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 30px;
  right: 150px;
  border-radius: 50%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  z-index: 11;
  transition:
    background-color 0.8s ease,
    color 0.8s ease,
    transform 0.8s ease;

  &:hover {
    background-color: ${color.yellow};
    color: ${color.charcoal};
    transform: scale(1.1) rotate(360deg);
  }

  svg {
    font-size: 30px;
  }
`
