import { MdFileUpload } from 'react-icons/md';
import * as S from './ImageDrop.style';

function Active() {
  return (
    <S.Active>
      <MdFileUpload size="30" color="rgb(0, 180, 0)" />
    </S.Active>
  );
}

export default Active;
