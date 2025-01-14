/** @jsxImportSource @emotion/react */
import { Dispatch, SetStateAction, useState } from 'react'
import { css } from '@emotion/react'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material'
import { color } from '@/constants/color'
import { fontSize, fontWeight } from '@/constants/font'

interface PaginationProps {
  totalPage: number
  currentPage: number
  handlePageChange: Dispatch<SetStateAction<number>>
}

const Pagination: React.FC<PaginationProps> = ({
  totalPage,
  currentPage,
  handlePageChange
}) => {
  const PAGE_PER_GROUP = 10
  const [pageGroup, setPageGroup] = useState(0)

  const startPage = pageGroup * PAGE_PER_GROUP
  const endPage = Math.min(startPage + PAGE_PER_GROUP - 1, totalPage - 1)

  const handlePreviousGroup = () => {
    if (currentPage > 0) {
      handlePageChange(currentPage - 1)
      if (currentPage - 1 < startPage) {
        setPageGroup(pageGroup - 1)
      }
    }
  }

  const handleNextGroup = () => {
    if (currentPage < totalPage - 1) {
      handlePageChange(currentPage + 1)
      if (currentPage + 1 > endPage) {
        setPageGroup(pageGroup + 1)
      }
    }
  }

  return (
    <ul css={paginationStyle}>
      <li
        className="page-button icon-button"
        onClick={handlePreviousGroup}>
        <KeyboardArrowLeft css={iconStyle} />
      </li>
      {Array.from({ length: endPage - startPage + 1 }, (_, index) => {
        const pageIndex = startPage + index
        return (
          <li
            key={pageIndex}
            className={`page-button ${currentPage === pageIndex ? 'active' : ''}`}
            onClick={() => handlePageChange(pageIndex)}>
            {pageIndex + 1}
          </li>
        )
      })}
      <li
        className="page-button icon-button"
        onClick={handleNextGroup}>
        <KeyboardArrowRight css={iconStyle} />
      </li>
    </ul>
  )
}

const paginationStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${fontSize.xxxs};
  color: ${color.black};
  gap: 4px;
  margin-top: 32px;
  margin-bottom: 32px;

  .page-button {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 24px;
    height: 24px;
    padding: 0 4px;
    border-radius: 50%;

    :hover {
      cursor: pointer;
      font-size: ${fontWeight.bold};
      background-color: ${color.darkYellow};
      color: ${color.white};
    }

    svg {
      font-size: 20px;
    }
  }

  .icon-button:hover {
    background-color: transparent; 
  }

  .active {
    font-size: ${fontWeight.bold};
    background-color: ${color.darkYellow};
    color: ${color.white};
  }
`

const iconStyle = css`
  color: ${color.black};

  &:hover {
    color: ${color.yellow};
    background-color: transparent;
  }
`

export default Pagination
