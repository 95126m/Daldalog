/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

const Signin = () => {
  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  async function signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, provider);
      alert(`로그인 성공: ${result.user.displayName || '사용자 이름 없음'}`);
    } catch (error) {
      if (error instanceof FirebaseError) {
        alert(`로그인 실패: ${error.message}`);
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    }
  }

  return (
    <div css={wrapperStyle}>
      <button onClick={signInWithGoogle}>Google 로그인</button>
    </div>
  );
};

export default Signin;

const wrapperStyle = css`
  width: 100%;
  background-color: gray;
`;
