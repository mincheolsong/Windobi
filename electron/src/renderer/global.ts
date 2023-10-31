import { createGlobalStyle } from 'styled-components';

import GmarketSansTTFBold from '../../assets/fonts/GmarketSansTTFBold.ttf';
import GmarketSansTTFMedium from '../../assets/fonts/GmarketSansTTFMedium.ttf';
import GmarketSansTTFLight from '../../assets/fonts/GmarketSansTTFLight.ttf';


export default createGlobalStyle`
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
`;
