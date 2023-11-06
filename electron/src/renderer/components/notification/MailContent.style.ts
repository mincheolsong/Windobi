import { styled } from "styled-components";


const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
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
  padding: 3px;
  border-radius: 5px;
  background-color: rgba(51,51,204, 0.5);
`;



const From = styled.div`
  width: 100%;
  height: 10%;
  display: flex;
  padding: 10px

  // background-color: blue;
`;
export { Wrapper, From, Text, Sender, SenderText };
