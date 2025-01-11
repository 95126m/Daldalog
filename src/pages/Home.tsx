/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
// import { color } from '@/constants/color'

import useAuthStore from '@/store/AuthContext'

const Home = () => {
  const user = useAuthStore(state => state.user)

  return (
    <div css={wrapperStyle}>
      <h1>블로그</h1>
      {user ? (
        <button>글쓰기</button>
      ) : (
        <p>로그인을 해야 글을 작성할 수 있습니다.</p>
      )}
    </div>
  )
}

export default Home

const wrapperStyle = css`
  width: 100%;
  background-color: gray;
`
