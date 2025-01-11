import { Global, css } from '@emotion/react'
import { color } from '@/constants/color'
import { fontSize } from '@/constants/font'

const GlobalStyles = () => {
  return (
    <Global
      styles={css`
        * {
          box-sizing: border-box;
        }

        @font-face {
          font-family: 'Freesentation-9Black';
          src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/2404@1.0/Freesentation-9Black.woff2')
            format('woff2');
          font-weight: normal;
          font-style: normal;
        }

        @font-face {
          font-family: 'S-CoreDream-3Light';
          src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_six@1.2/S-CoreDream-3Light.woff')
            format('woff');
          font-weight: normal;
          font-style: normal;
        }

        @font-face {
          font-family: 'STUNNING-Bd';
          src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/2410-2@1.0/STUNNING-Bd.woff2')
            format('woff2');
          font-weight: normal;
          font-style: normal;
        }

        body {
          font-family: 'Freesentation-9Black', sans-serif;
          color: ${color.white};
          width: 100%;
          height: 100%;
          overflow-y: scroll;
          overflow-x: hidden;
          margin: 0;
          padding: 0;
          position: relative;
        }

        p,
        span,
        div {
          font-family: 'S-CoreDream-3Light';
        }

        h1,
        h2 {
          font-family: 'STUNNING-Bd', 'Roboto';
        }

        h3,
        h4,
        h5,
        h6 {
          font-family: 'Roboto', sans-serif;
        }

        a {
          text-decoration: none;
        }

        ul {
          list-style: none;
        }

        html {
          font-size: ${fontSize.sm};
        }
      `}
    />
  )
}

export default GlobalStyles
