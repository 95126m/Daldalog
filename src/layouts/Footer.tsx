/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useState, useEffect } from 'react'
import { getDatabase, ref, get } from 'firebase/database'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { Link, useNavigate } from 'react-router-dom'
import { color } from '@/constants/color'
import { fontSize } from '@/constants/font'

const Footer = () => {
  const auth = getAuth()
  const database = getDatabase()
  const navigate = useNavigate()
  const [isSignin, setIsSignin] = useState<boolean>(false)

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            const adminRef = ref(database, 'admin/uid')
            const snapshot = await get(adminRef)
            if (snapshot.exists() && snapshot.val() === user.uid) {
              setIsSignin(true) 
            } else {
              setIsSignin(false) 
            }
          } else {
            setIsSignin(false) 
          }
        })
      } catch (error) {
        console.error('관리자 확인 오류:', error)
        setIsSignin(false)
      }
    }
    checkAdmin()
  }, [auth, database])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setIsSignin(false)
      navigate('/')
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error)
    }
  }

  return (
    <div css={wrapperStyle}>
      <h1>DALDALOG</h1>
      <p>© 2025 DALDALOG All Rights Reserved.</p>
      <nav>
        <span>|</span>
        <a href="">이메일 문의</a>
        <span>|</span>
        {isSignin ? (
          <button
            onClick={handleLogout}
            css={logoutButtonStyle}
          >
            로그아웃
          </button>
        ) : (
          <Link to="/signin">관리자 로그인</Link>
        )}
      </nav>
    </div>
  )
}

export default Footer

const wrapperStyle = css`
  width: 100%;
  height: 150px;
  margin: 0 auto;
  padding: 0 150px;
  background-color: ${color.charcoal};
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;

  h1 {
    font-size: ${fontSize.sm};
    color: ${color.white};
  }

  p {
    font-size: ${fontSize.xxs};
    color: ${color.white};
  }

  nav {
    display: flex;
    align-items: center;
    gap: 10px;

    a, button {
      font-size: ${fontSize.xxs};
      color: ${color.white};
      text-decoration: none;
      background: none;
      border: none;
      cursor: pointer;
      transition: color 0.3s ease;

      &:hover {
        color: ${color.yellow};
      }
    }

    span {
      font-size: ${fontSize.xxs};
      color: ${color.white};
    }
  }
`

const logoutButtonStyle = css`
  font-size: ${fontSize.xxs};
  color: ${color.white};
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: ${color.yellow};
  }
`
