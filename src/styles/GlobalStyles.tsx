import { Global, css } from '@emotion/react'
import { color } from '@/constants/color'
import { fontSize } from '@/constants/font'
import Cursor from '@/assets/cursor.cur'

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

        @font-face {
          font-family: 'TTTtangsbudaejjigaeB';
          src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2212@1.0/TTTtangsbudaejjigaeB.woff2') format('woff2');
          font-weight: 700;
          font-style: normal;
      }

        body {
          font-family: 'S-CoreDream-3Light', Arial, sans-serif;
          color: ${color.white};
          width: 100%;
          height: 100%;
          overflow-y: scroll;
          overflow-x: hidden;
          margin: 0;
          padding: 0;
          position: relative;
          cursor: url(${Cursor}), auto;
        }

        h1,
        h2,
        h3,
        h4,
        
        h6 {
          font-family: 'STUNNING-Bd', 'Roboto';
        }

        h5 {
          font-family: 'TTTtangsbudaejjigaeB';
        }

        a {
          text-decoration: none;
        }

        ul {
          list-style: none;
        }

        html {
          font-size: ${fontSize.md};
        }
      `}
    />
  )
}

export default GlobalStyles
