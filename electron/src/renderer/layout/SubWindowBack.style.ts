import { styled } from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.75);
  overflow-x: hidden;
  overflow-y: hidden;

  border-radius: 10px;
`;

const Header = styled.div`

  width: 100%;
  height: 35px;
  font-family:  NanumBarunGothicBold;
  font-size: 20px;
  color: white;

  display: flex;
  justify-content: center;
  align-items: center;

  position: fixed;
  z-index: 10;

  background-color: rgb(11, 108, 255);
  // background-color: red;

  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

const Back = styled.div`
  position: fixed;
  width: 26px;
  height: 26px;
  left: 10px;

  // background-color: red;

  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    cursor: pointer;
  }

`;

const Close = styled.div`
  position: fixed;
  width: 26px;
  height: 26px;
  right: 20px;

  background-color: red;
  border-radius: 13px;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    cursor: pointer;
    background-color: rgb(220, 0, 0);
  }
`;

const Body = styled.div`
  padding-top: 40px;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 5px;
  width: 100%;
  // height: calc(100% - 35px);
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-thumb {
    height: 30%;
    background: rgba(180, 180, 180, 0.75);

    border-radius: 10px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(245, 245, 245, 0.5);
  }
`;

export { Wrapper, Header, Close, Body, Back };
