import styled, { keyframes } from 'styled-components';

const fadeOut = keyframes`
  from {
    opacity: 1;
    height: auto;
  }
  to {
    opacity: 0;
    height: 0;
  }
`;

const Wrapper = styled.div`
  border: 1px solid #000; /* 사각형 테두리 */
  padding: 13px; /* 내부여백*/
  margin-bottom: 2px; /* 박스 사이의 간격 */
  display: flex; /* 이미지와 텍스트를 한 줄로 배치 */
  align-items: center; /* 이미지와 텍스트를 세로 중앙에 배치 */
  border-radius: 8px;
  background-color: white;
  border: none;
  color: black;
  box-shadow: 2px 3px #9e9e9e;
  font-weight: bold;
  position: relative; /* 상대 위치 설정 */
  min-height: 10vh; /* 최소 높이를 뷰포트 높이로 설정 */
  animation: ${fadeOut} 0.3s linear; /* 애니메이션을 적용합니다. */
`;

const Icon = styled.img`
  width: 24px; /* 이미지 크기 */icon
  height: 24px;
  margin-right: 10px; /* 이미지와 텍스트 사이의 간격 */
`;

const Button = styled.button`
  border-radius: 8px;
  background-color: #0b6cff;
  color: white;
  font-weight: bold;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  &:hover {
    background-color: #0b6cffbb;
    transition: 0.1s all;
    color: black;
  }
`;

const DeleteButton = styled.button`
  margin-left: auto; /* 오른쪽 정렬을 위해 왼쪽 마진을 자동으로 설정 */
  background-color: red; /* 배경색을 빨간색으로 설정 */
  color: white; /* 글씨색을 흰색으로 설정 */
  border: none; /* 테두리 없음 */
  border-radius: 4px; /* 둥근 모서리 */
  padding: 5px 10px; /* 내부 여백 */
  cursor: pointer; /* 마우스 커서를 버튼 형태로 변경 */
`;
const Container = styled.div`
  padding-bottom: 60px; /* Button의 높이만큼 공간을 만들어 줍니다. */
  min-height: 100vh;
  box-sizing: border-box;
  position: relative;
`;

export { Wrapper, Icon, Button, DeleteButton, Container };
