/* eslint-disable prettier/prettier */
import { styled } from "styled-components";


const Wrapper = styled.div`
  width: 100%;
  // height: 100%;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  background-color: rgba(255,255,255,1);
`;

const Text = styled.div`
  font-family: GmarketSansTTFMedium;
  width: ${props => props.width};
  font-size: ${props => props.size};
  font-weight: ${props => props.bold};
  display: flex;
  text-align: left;
  align-items: center;
`;

const SenderText = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  padding: 3px;
  border-radius: 5px;
  background-color: rgba(51,51,204, 0.5);
`;


const Sender = styled.div`
  font-family: GmarketSansTTFMedium;
  width: 75%;
  font-weight: bold;
  font-size: 10px;


  margin: 0 0 0 5px;
  display: flex;
  text-align: left;
  align-items: center;

`;

const From = styled.div`
  width: 100%;
  height: 10%;
  display: flex;
  padding: 10px

  // background-color: blue;
`;

const Line = styled.div`
  width: 90%;
  margin: 0 auto;
  height: 0.1px;
  background-color: #ccc; /* You can change the color to your preference */
`;

const Subject = styled.div`
  padding: 10px;
  width: 100%;
  // background-color: rgba(123,123,123,0.5);
`;

const Time = styled.div`
  margin-top: 3px;
  font-family: GmarketSansTTFLight;
  width: 100%;
  font-size: 9px;
  // background-color: red;
`;

const Content = styled.div`
  padding: 10px;
  font-size: 14px;
  word-wrap: break-word;
  width: 100%;
  font-family: GmarketSansTTFLight
`;
export { Wrapper, From, Text, Sender, SenderText, Line, Subject, Time, Content };
