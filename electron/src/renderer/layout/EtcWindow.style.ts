import styled from 'styled-components';
import { AiOutlineClose } from 'react-icons/ai';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(240, 240, 240, 0.75);
  overflow-x: hidden;
  overflow-y: hidden;
  border-radius: 10px;
  padding-top: 5px;
  border: 0.5px #ddd solid;
`;

const Top = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const Header = styled.div`
  width: 100%;
  height: 35px;
  -webkit-app-region: drag;
  padding-top: 5px;
  font-family: GmarketSansTTFBold;
  font-size: 20px;
  margin-left: 22px;
  color: black;

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 999;

  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

const Close = styled(AiOutlineClose)`
  width: 15px;
  height: 15px;

  border-radius: 13px;
  color: gray;
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    cursor: pointer;
    scale: 1.02;
    transition: all 0.15s;
    color: black;
  }
`;

const Body = styled.div`
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

export { Wrapper, Header, Close, Body, Top };
