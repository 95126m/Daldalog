/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { fontSize } from '@/constants/font'
import { color } from '@/constants/color'
import Loading from '@/components/Loading'
import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy
} from 'firebase/firestore'
import Pagination from '@/components/Pagination'
import sample from '@/assets/sample2.jpg'
import nocontent from '@/assets/nocontent.gif'

interface Post {
  id: string
  title: string
  groupTitle: string
  content: string
  date: Date | string
  image?: string
}

const Search = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [postsData, setPostsData] = useState<Post[]>([])
  const [filteredData, setFilteredData] = useState<Post[]>([])
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [searchInputValue, setSearchInputValue] = useState('')
  const navigate = useNavigate()
  const firestore = getFirestore()
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get('query') || ''
  const ITEMS_PER_PAGE = 10

  const handleDetail = (id: string) => {
    navigate(`/detail/${id}`)
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  const handleContent = (text: string, length: number) => {
    if (text.length > length) {
      return text.slice(0, length) + '...'
    }
    return text
  }

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true)

      try {
        const postsCollection = collection(firestore, 'posts')
        const postsQuery = query(postsCollection, orderBy('date', 'desc'))
        const snapshot = await getDocs(postsQuery)

        if (!snapshot.empty) {
          const postsArray: Post[] = snapshot.docs.map(doc => ({
            id: doc.id,
            title: doc.data().title,
            groupTitle: doc.data().groupTitle,
            content: doc.data().content,
            date: doc.data().date.toDate(),
            image: doc.data().image || ''
          }))

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

  useEffect(() => {
    if (searchQuery.trim() !== '') {
      const filtered = postsData.filter(
        post =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredData(filtered)
    } else {
      setFilteredData([])
    }
  }, [postsData, searchQuery])

  const handleSearch = () => {
    if (searchInputValue.trim() !== '') {
      setSearchParams({ query: searchInputValue })
    }
  }

  const totalPage = Math.ceil(filteredData.length / ITEMS_PER_PAGE)
  const startIndex = currentPage * ITEMS_PER_PAGE
  const displayedItems = filteredData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  )

  return (
    <div css={wrapperStyle}>
      <div className="content">
        <div
          className="Search-section"
          css={searchWrapper}>
          <input
            type="text"
            placeholder="궁금하신 컨텐츠를 검색해보세요!"
            value={searchInputValue}
            onChange={e => setSearchInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            css={searchInput}
          />
          <button
            css={searchBtn}
            onClick={handleSearch}>
            검색
          </button>
        </div>
        <div css={tabContainerStyle}>
          <h1 css={searchTitle}>
            "{searchQuery}"<span css={searchContent}>에 대한 검색 결과</span>
          </h1>

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
            ) : filteredData.length > 0 ? (
              displayedItems.map(item => (
                <div
                  key={item.id}
                  css={tabItemStyle}>
                  <img
                    src={item.image || sample}
                    alt={item.title}
                  />
                  <div className="text-container">
                    <h3 onClick={() => handleDetail(item.id)}>{item.title}</h3>
                    <p>
                      {item.date instanceof Date
                        ? item.date.toLocaleString()
                        : item.date}
                    </p>
                    <span>{handleContent(item.content, 100)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div css={noResultWrapper}>
                <img
                  src={nocontent}
                  alt="No content"
                  css={noContentImage}
                />
                <p css={noResultStyle}>안타깝지만 존재하지않아요!</p>
              </div>
            )}
          </div>
        </div>

        {filteredData.length > 0 && (
          <Pagination
            totalPage={totalPage}
            currentPage={currentPage}
            handlePageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  )
}

export default Search

const wrapperStyle = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  padding-top: 70px;
  box-sizing: border-box;
`

/* 검색 영역 */
const searchWrapper = css`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin: 0;
  padding: 100px;
  background-color: ${color.lightYellow};
`

const searchInput = css`
  width: 100%;
  max-width: 400px;
  height: 40px;
  padding: 0 14px;
  font-size: ${fontSize.xs};
  border: 1px solid ${color.gray};
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: ${color.darkYellow};
  }

  &::placeholder {
    font-size: ${fontSize.xxs};
    color: ${color.gray};
  }
`

const searchBtn = css`
  height: 40px;
  padding: 0 30px;
  font-size: ${fontSize.xxs};
  color: ${color.white};
  background-color: ${color.gray};
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${color.darkYellow};
  }
`

/* 검색 컨텐츠 제목 영역 */
const searchTitle = css`
  padding: 40px 0 20px 0;
  font-size: ${fontSize.xxs};
  color: ${color.yellow};
  border: none;
  border-bottom: 1px solid ${color.gray};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
`

const searchContent = css`
  color: ${color.black};
`

/* 검색어가 존재하지 않을 시 이미지 */
const noResultWrapper = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 100px;
`

const noContentImage = css`
  width: 250px;
  height: auto;
`

const noResultStyle = css`
  text-align: center;
  font-size: ${fontSize.xxs};
  color: ${color.gray};
`

/* 검색 컨텐츠 아이템 영역 */
const tabContainerStyle = css`
  position: relative;
  width: 100%;
  z-index: 3;
  padding: 0 150px;
  text-align: start;
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
    cursor: pointer;
    transition: color 0.3s ease;

    &:hover {
      color: ${color.darkYellow};
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
