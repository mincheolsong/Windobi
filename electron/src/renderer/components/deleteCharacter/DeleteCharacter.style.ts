import styled from 'styled-components';
import * as S from '../changeCharacter/ChangeCharacter.style';

const Ul = styled(S.Ul)``;

const Li = styled(S.Li)`
  &:hover {
    background-color: hsl(0, 60%, 80%);
  }
`;

export { Ul, Li };
