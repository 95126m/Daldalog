/** @jsxImportSource @emotion/react */
import { useState } from 'react'
import { css } from '@emotion/react'
import { color } from '@/constants/color'
import { fontSize } from '@/constants/font'
import testImage from '@/assets/test-image.jpg'
import sample from '@/assets/sample2.jpg'
import EditIcon from '@mui/icons-material/Edit'
import { TabData } from '@/mocks/TabData'
import TabButton from '@/components/TabButton'
import Pagination from '@/components/Pagination'

const Home = () => {
  const allGroups = [
    '전체',
    ...Array.from(new Set(TabData.map(tab => tab.groupTitle)))
  ]
  const [activeGroup, setActiveGroup] = useState<string>(allGroups[0])
  const [currentPage, setCurrentPage] = useState<number>(0)

  const ITEMS_PER_PAGE = 3

  const filteredData =
    activeGroup === '전체'
      ? TabData
      : TabData.filter(tab => tab.groupTitle === activeGroup)

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
            <h2>첫 번째 섹션</h2>
            <p>누르면 블로그 소개글로 페이지 이동됩니다.</p>
            <button>VIEW</button>
          </div>
        </div>
      </section>

      <section className="second">
        <div
          className="content"
          css={secondSectionContentStyle}>
          <img
            src={testImage}
            alt="이미지"
            css={secondSectionImgStyle}
          />
          <div css={secondSectionTextStyle}>
            <span>공지사항</span>
            <h1>게시글 제목</h1>
            <p>게시글의 간략한 생략 메시지</p>
            <button>VIEW</button>
          </div>
        </div>
      </section>

      <section className="third">
        <div className="content">
          <div css={tabContainerStyle}>
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

            <div css={tabContentStyle}>
              {displayedItems.map(item => (
                <div
                  key={item.id}
                  css={tabItemStyle}>
                  <img
                    src={item.image || sample}
                    alt={item.title}
                  />
                  <div className="text-container">
                    <h3>{item.title}</h3>
                    <p>{item.date}</p>
                    <span>{item.content}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Pagination
            totalPage={totalPage}
            currentPage={currentPage}
            handlePageChange={setCurrentPage}
          />
        </div>
      </section>

      <div css={writeIconStyle}>
        <EditIcon />
      </div>
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

  section {
    min-height: 500px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 100px;

    &:last-of-type {
      margin-bottom: 0;
    }

    .content {
      text-align: center;
      max-width: none;
      width: 100%;
    }
  }

  section.first {
    background-color: transparent;
  }

  section.second {
    background-color: transparent;
    border: 1px solid ${color.gray};
    padding: 0;
    margin-left: 250px;
    margin-right: 250px;
  }

  section.third {
    background-color: transparent;
    height: 850px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0 250px;
  }

  section.third h3 {
    color: ${color.black};
    text-align: left;
  }
`

const firstSectionContentStyle = css`
  position: relative;
  width: 100vw;
  height: 600px;
  max-width: 1200px;
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
  margin-top: 100px;
  margin-left: 150px;

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

const secondSectionContentStyle = css`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 150px;
  max-width: 1200px;
`

const secondSectionImgStyle = css`
  width: 100%;
  height: 500px;
  max-width: 700px;
  object-fit: cover;
  z-index: 1;

`

const secondSectionTextStyle = css`
  width: 60%;
  text-align: left;
  z-index: 2;

  span {
    display: block;
    font-size: ${fontSize.xxxs};
    color: ${color.gray};
    margin-bottom: 10px;
  }

  h1 {
    font-size: ${fontSize.lg};
    color: ${color.black};
    margin-top: 0;
    margin-bottom: 10px;
  }

  p {
    font-size: ${fontSize.xxs};
    color: ${color.black};
    margin-bottom: 20px;
  }

  button {
    padding: 10px 30px;
    font-size: ${fontSize.xxs};
    color: ${color.white};
    background-color: ${color.black};
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition:
      background-color 0.5s ease,
      color 0.5s ease;

    &:hover {
      background-color: ${color.yellow};
      color: ${color.black};
    }
  }
`

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
  right: 250px;
  border-radius: 50%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
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

const tabContainerStyle = css`
  width: 100%;
  margin: 0;
  text-align: start;
`

const tabButtonContainerStyle = css`
  display: flex;
  justify-content: flex-start;
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
