import { MdFileUpload } from 'react-icons/md';
import * as S from './ImageDrop.style';

function NoActive() {
  return (
    <S.NoActive>
      이미지를 드래그해주세요
      <MdFileUpload size="30" color="gray" />
    </S.NoActive>
  );
}

export default NoActive;
