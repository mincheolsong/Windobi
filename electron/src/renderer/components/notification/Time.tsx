import { useState } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import * as S from './Mail.style';

function Time(props: { onClick: () => void }) {
  const [showIcon, setShowIcon] = useState(false);
  return (
    <S.Time
      onMouseEnter={() => setShowIcon(true)}
      onMouseLeave={() => setShowIcon(false)}
      onClick={props.onClick}
    >
      {showIcon ? <AiOutlineCloseCircle className="icon" /> : '1시간전'}
    </S.Time>
  );
}

export default Time;
