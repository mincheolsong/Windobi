import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;

const ApplicationWrapper = styled.div`
  width: 100px;
  height: 100px;
  justify-content: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Img = styled.img`
  border: 1px solid #80808021;
  border-radius: 15px;
  padding: 5px;
  width: 45px;
  height: 45px;
`;

export { Wrapper, ApplicationWrapper, Img };
