/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import naver from '../../../../assets/naver.png';
import * as S from './Mail.style';
import Time from './Time';

function MailBox() {
  const [isHovering, setIsHovering] = useState(false);
  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  // useEffect(() => {}, [time]);

  return (
    <S.Wrapper>
      <S.MailWrapper>
        <S.Icon src={naver} />
        <S.Contents>
          <S.ContentsDiv>
            <S.Sender>아식스코리아 noreply-asics-korea@asics.co.kr</S.Sender>
            <Time
              onClick={() => {
                alert('ㅎㅇ');
              }}
            />
          </S.ContentsDiv>
          <S.Title>
            <S.Text
              onClick={() => {
                alert('임시');
              }}
            >
              주식회사 아식스코리아 이용약관 & 개인정보처리방침 개정 안내
            </S.Text>
          </S.Title>
        </S.Contents>
      </S.MailWrapper>
    </S.Wrapper>
  );
}

export default MailBox;
