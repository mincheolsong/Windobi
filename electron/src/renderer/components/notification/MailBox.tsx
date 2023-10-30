import { useState, useEffect } from 'react';
import naver from '../../../../assets/naver.png';
import * as S from './Mail.style';
import { DeleteButton } from './DeleteButton.style';

function MailBox() {
  return (
    <S.Wrapper>
      <S.Mail>
        <S.MailWrapper>
          <S.Icon src={naver} />
          <S.Contents>
            <S.ContentsDiv>
              <S.Sender>아식스코리아 noreply-asics-korea@asics.co.kr</S.Sender>
              <S.Time>1시간전</S.Time>
            </S.ContentsDiv>
            <S.Title>
              <S.Text>
                주식회사 아식스코리아 이용약관 & 개인정보처리방침 개정 안내
              </S.Text>
            </S.Title>
          </S.Contents>
        </S.MailWrapper>
        <DeleteButton>Delete</DeleteButton>
      </S.Mail>
    </S.Wrapper>
  );
}

export default MailBox;
