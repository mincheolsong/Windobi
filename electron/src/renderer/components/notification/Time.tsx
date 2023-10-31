import { useState } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import * as S from './Mail.style';
import moment from 'moment';
import 'moment/locale/ko';

function Time(props: { onClick: () => void; time: Date }) {

  const [showIcon, setShowIcon] = useState(false);
  return (
    <S.Time
      onMouseEnter={() => setShowIcon(true)}
      onMouseLeave={() => setShowIcon(false)}
      onClick={props.onClick}
    >
      {showIcon ? (
        <AiOutlineCloseCircle className="icon" />
      ) : props.time === null ? (
        ''
      ) : (
        moment(props.time).fromNow()
      )}
    </S.Time>
  );
}

export default Time;
