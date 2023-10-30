import styled, { css } from 'styled-components';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const Header = styled.div`
  width: 100%;
  height: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

type TArrow = {
  disabled: boolean;
};

const Left = styled(AiFillCaretLeft)<TArrow>`
  font-size: 40px;
  color: #428df5;

  &:hover {
    cursor: pointer;
    color: #7ad2f5;
    transition: all 0.15s ease-in-out;
  }
`;
const Right = styled(AiFillCaretRight)<TArrow>`
  font-size: 40px;

  ${({ disabled }) =>
    disabled
      ? css`
          color: gray;
          &:hover {
            cursor: not-allowed;
          }
        `
      : css`
          color: #428df5;
          &:hover {
            cursor: pointer;
            color: #7ad2f5;
            transition: all 0.15s ease-in-out;
          }
        `}
`;

const TypeText = styled.div`
  width: 100%;
  height: 100%;
  font-size: 12px;
  font-weight: bold;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export { Wrapper, Header, Left, Right, TypeText };
