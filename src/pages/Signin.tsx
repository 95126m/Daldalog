/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { color } from '@/constants/color'
import { fontSize } from '@/constants/font'

const Signin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const auth = getAuth()
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      alert(`${userCredential.user.email} 님 환영합니다!`)
      navigate('/')
    } catch (err) {
      console.error('로그인 에러:', err)
      alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.')
    }
  }

  return (
    <div css={wrapperStyle}>
      <div css={contentStyle}>
        <h1>관리자 로그인</h1>
        <div className="id-section">
          <h4>아이디</h4>
          <input
            type="text"
            placeholder="아이디를 입력하세요."
            css={id}
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className="pw-section">
          <h4>비밀번호</h4>
          <input
            type="password"
            placeholder="비밀번호를 입력하세요."
            css={pw}
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <button
          css={buttonStyle}
          onClick={handleLogin}>
          로그인
        </button>
      </div>
    </div>
  )
}

export default Signin

const wrapperStyle = css`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${color.lightGray};
`

const contentStyle = css`
  text-align: center;
  justify-content: center;
  align-items: center;
  display: flex;
  background-color: white;
  padding: 40px;
  height: 100%;
  width: 100%;
  flex-direction: column;

  h1 {
    font-size: ${fontSize.md};
    margin-bottom: 60px;
    color: ${color.black};
  }

  .id-section {
    h4 {
      text-align: start;
      margin: 0;
      color: ${color.charcoal};
      font-size: ${fontSize.xxs};
    }
  }

  .pw-section {
    h4 {
      text-align: start;
      margin: 0;
      color: ${color.charcoal};
      font-size: ${fontSize.xxs};
    }
  }
`

const id = css`
  margin-bottom: 20px;
  padding: 12px 12px;
  width: 350px;
  font-size: ${fontSize.xxs};
  border: 1px solid ${color.gray};
  border-radius: 4px;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border: 1px solid ${color.darkYellow};
  }
`

const pw = css`
  margin-bottom: 30px;
  padding: 12px 12px;
  width: 350px;
  font-size: ${fontSize.xxs};
  border: 1px solid ${color.gray};
  border-radius: 4px;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border: 1px solid ${color.darkYellow};
  }
`

const buttonStyle = css`
  padding: 18px 150px;
  font-size: ${fontSize.xxs};
  color: white;
  background-color: ${color.gray};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${color.yellow};
  }
`
