import { createGlobalStyle } from 'styled-components';

import GmarketSansTTFBold from '../../assets/fonts/GmarketSansTTFBold.ttf';
import GmarketSansTTFMedium from '../../assets/fonts/GmarketSansTTFMedium.ttf';
import GmarketSansTTFLight from '../../assets/fonts/GmarketSansTTFLight.ttf';
import NanumBarunGothic from '../../assets/fonts/NanumBarunGothic.ttf';
import NanumBarunGothicBold from '../../assets/fonts/NanumBarunGothicBold.ttf';
import NanumBarunGothicLight from '../../assets/fonts/NanumBarunGothicLight.ttf';
import NanumBarunGothicUltraLight from '../../assets/fonts/NanumBarunGothicUltraLight.ttf';
import Jalnan from '../../assets/fonts/Jalnan.ttf';

export default createGlobalStyle`
  @font-face {
        font-family: 'Jalnan';
        src: local('Jalnan'), local('Jalnan');
        font-style: normal;
        src: url(${Jalnan}) format('truetype');
  }
  @font-face {
        font-family: 'GmarketSansTTFBold';
        src: local('GmarketSansTTFBold'), local('GmarketSansTTFBold');
        font-style: normal;
        src: url(${GmarketSansTTFBold}) format('truetype');
  }
  @font-face {
        font-family: 'GmarketSansTTFMedium';
        src: local('GmarketSansTTFMedium'), local('GmarketSansTTFMedium');
        font-style: normal;
        src: url(${GmarketSansTTFMedium}) format('truetype');
  }
  @font-face {
    font-family: 'GmarketSansTTFLight';
    src: local('GmarketSansTTFLight'), local('GmarketSansTTFLight');
    font-style: normal;
    src: url(${GmarketSansTTFLight}) format('truetype');
  }

  @font-face {
        font-family: 'NanumBarunGothic';
        src: local('NanumBarunGothic'), local('NanumBarunGothic');
        font-style: normal;
        src: url(${NanumBarunGothic}) format('truetype');
  }
  @font-face {
        font-family: 'NanumBarunGothicBold';
        src: local('NanumBarunGothicBold'), local('NanumBarunGothicBold');
        font-style: normal;
        src: url(${NanumBarunGothicBold}) format('truetype');
  }
  @font-face {
    font-family: 'NanumBarunGothicLight';
    src: local('NanumBarunGothicLight'), local('NanumBarunGothicLight');
    font-style: normal;
    src: url(${NanumBarunGothicLight}) format('truetype');
  }
  @font-face {
    font-family: 'NanumBarunGothicUltraLight';
    src: local('NanumBarunGothicUltraLight'), local('NanumBarunGothicUltraLight');
    font-style: normal;
    src: url(${NanumBarunGothicUltraLight}) format('truetype');
  }
`;
