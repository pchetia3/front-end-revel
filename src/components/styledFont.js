import { css } from "styled-components";

import myFontURL from "../Fonts/proxima-thin.otf";

export const fontFaces = css`
  @font-face {
    font-family: "Proxima-Thin";
    src: url(${myFontURL}) format("opentype");
    font-weight: normal;
    font-style: normal;
  }
`;
