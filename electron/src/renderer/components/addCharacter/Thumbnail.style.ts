import styled from 'styled-components';
import { AiFillCloseCircle } from 'react-icons/ai';

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 80px;
  height: 80px;
`;

const Image = styled.img`
  position: absolute;
  left: 0px;
  top: 0px;
`;

const Remove = styled(AiFillCloseCircle)`
  position: absolute;
  right: 0px;
  top: 0px;
  z-index: 10;
  font-size: 20px;

  &:hover {
    color: red;
    cursor: pointer;
    transition: all 0.1s ease-in-out;
  }
`;

export { Wrapper, Image, Remove };
