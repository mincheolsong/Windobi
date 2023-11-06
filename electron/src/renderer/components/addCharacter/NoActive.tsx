import { MdFileUpload } from 'react-icons/md';
import * as S from './ImageDrop.style';

function NoActive() {
  return (
    <S.NoActive>
      이미지 업로드
      <MdFileUpload size="30" color="gray" />
    </S.NoActive>
  );
}

export default NoActive;
