/* eslint-disable react/require-default-props */
import * as S from './Thumbnail.style';

type TThumbanil = {
  image: string;
  remove?: (...args: any[]) => void;
};

function Thumbnail({ image, remove }: TThumbanil) {
  return (
    <S.Wrapper>
      {remove && <S.Remove onClick={remove} />}
      <S.Image
        src={`data:image/png;base64,${image}`}
        width="80px"
        height="80px"
      />
    </S.Wrapper>
  );
}

export default Thumbnail;
