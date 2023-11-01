import { styled } from "styled-components";



const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 10px 5px 10px 10px;
`;

const Mail = styled.div`
  display: flex;
  width: 100%;
  // background-color: red;
`;

const MailWrapper = styled.div`
  border-radius: 5px;
  display: flex;
  width: 100%;
  height: 70px;
  background-color: rgba(255, 255, 255, 1);
  align-items: center;
  box-shadow: 0px 1px 1px 1px rgba(0,0,0,0.2);
`

const Icon = styled.img`
  border-radius: 5px;
  margin: 10px 8px;
  width: 60px;
  height: 60px;
`;

const Contents = styled.div`
  display: flex;
  flex-flow: column wrap;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  width: 100%;
  margin: 5px 10px 5px 0px;
  height: 60px;
  background-color: white;
  border-radius:2px;
`

const ContentsDiv = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;

  width: 100%;
  height: 23px;
  // background-color: rgba(123,123,123,100);
`;

const Sender = styled.div`
  padding: 5px;
  font-family: GmarketSansTTFMedium;
  font-size: 11px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  width: 50%;
  // background-color: rgba(10,220,30,0.8);
`;
const Title = styled.div`
  padding: 0 4px 9px 6px;
  display: flex;
  align-items: center;
  width: 100%;
  height: 37px;
  cursor: pointer;
`;

const Text = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-family: GmarketSansTTFBold;
  font-size: 15px;
`;

const Time = styled.div`
  padding: 5px;
  font-family: GmarketSansTTFMedium;
  font-size: 11px;
  width: 15%;
  text-align: right;
  cursor: pointer;
  position: relative;
  // background-color: rgba(255,255,125,0.8);
  transition: padding 0.3s ease;

  &:hover {
    padding: 2px 5px;
  }
  .icon {
    font-size: 15px; /* 아이콘 크기 조절 */
  }
`;

export { Mail, Wrapper, MailWrapper, Icon, Sender, Contents, Time, ContentsDiv, Text, Title };
