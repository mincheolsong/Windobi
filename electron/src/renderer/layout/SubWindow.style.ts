import { styled } from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.75);
  overflow-x: hidden;
  overflow-y: hidden;

  border-radius: 10px;

  padding-top: 5px;
`;

const Header = styled.div`
  width: 100%;
  height: 35px;
  font-family: NanumBarunGothicBold;
  font-size: 25px;
  color: black;

  display: flex;
  justify-content: center;
  align-items: center;

  position: fixed;
  z-index: 999;

  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

const Close = styled.div`
  position: fixed;
  width: 20px;
  height: 20px;
  right: 20px;

  background-color: rgb(255, 96, 92);
  border-radius: 13px;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    cursor: pointer;
    background-color: rgb(255, 50, 50);
    transition: all 0.15s;
  }
`;

const Body = styled.div`
  margin-top: 40px;
  padding-left: 10px;
  padding-right: 10px;
  margin-bottom: 10px;

  width: 100%;
  height: calc(100% - 50px);

  overflow-y: auto;
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

export { Wrapper, Header, Close, Body };
