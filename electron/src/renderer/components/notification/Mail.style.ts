import { styled } from "styled-components";



const Wrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 10px;
`;

const Mail = styled.div`

`;

const MailWrapper = styled.div`
  border-radius: 5px;
  display: flex;
  width: 470px;
  height: 70px;
  background-color: rgba(255,255,255, 1);
  align-items: center;
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
  width: 390px;
  margin: 5px 10px 5px 0px;
  height: 60px;
  background-color: white;
  border-radius:2px;
`

const ContentsDiv = styled.div`
  display: flex;
  flex-flow: row wrap;
  width: 390px;
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

  width: 150px;
  // background-color: rgba(10,220,30,0.8);
`;
const Title = styled.div`
  padding: 0 4px 9px 6px;
  display: flex;
  align-items: center;
  width: 390px;
  height: 37px;
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
  width: 240px;
  text-align: right;
  // background-color: rgba(255,255,125,0.8);
`;

export { Mail, Wrapper, MailWrapper, Icon, Sender, Contents, Time, ContentsDiv, Text, Title };
