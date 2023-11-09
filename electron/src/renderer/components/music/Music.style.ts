import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const Header = styled.div`
  font-size: 15px;
  font-family: 'GmarketSansTTFMedium';
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 45px;
  background-image: linear-gradient(to top, #fad0c4 0%, #ffd1ff 100%);
`;

const TitleInput = styled.input`
  border: none;
  border-radius: 10px;
  height: 25px;
  width: 200px;
`;

const Btn = styled.button`
  width: 100%;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 180px;
  background-image: linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%);
  border-radius: 25px;
`;

export { Wrapper, TitleInput, Btn, Header, Body };
