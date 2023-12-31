/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from '../components/addCharacter/AddCharacter.style';
import ImageManager from '../components/addCharacter/ImageManager';

function AddCharacter() {
  const navigate = useNavigate();

  const { ipcRenderer } = window.electron;
  const [stopImages, setStopImages] = useState<Array<string>>([]);
  const [moveImages, setMoveImages] = useState<Array<string>>([]);
  const [clickImages, setClickImages] = useState<Array<string>>([]);
  const [downImages, setDownImages] = useState<Array<string>>([]);
  const [restImages, setRestImages] = useState<Array<string>>([]);

  const [name, setName] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const [able, setAble] = useState<boolean>(false);

  useEffect(() => {
    ipcRenderer.sendMessage('windowOpened');
    ipcRenderer.sendMessage('size', { width: 440, height: 500 });
  }, []);

  useEffect(() => {
    if (
      stopImages.length !== 0 &&
      moveImages.length !== 0 &&
      clickImages.length !== 0 &&
      downImages.length !== 0 &&
      restImages.length !== 0 &&
      name
    ) {
      setAble(true);
    } else {
      setAble(false);
    }
  }, [
    stopImages.length,
    moveImages.length,
    clickImages.length,
    downImages.length,
    restImages.length,
    name,
  ]);

  const saveCharacter = async () => {
    const { success, message: newMessage } = await ipcRenderer.invoke(
      'add-character',
      {
        name,
        stop: stopImages,
        move: moveImages,
        click: clickImages,
        down: downImages,
        rest: restImages,
      },
    );

    if (!success) {
      setMessage(newMessage);
    }
    if (success) {
      alert('캐릭터 등록 성공!');
      navigate('/changecharacter');
    }
  };

  return (
    <S.Wrapper>
      <S.Details>
        <S.Summary>stop</S.Summary>
        <ImageManager images={stopImages} setImages={setStopImages} />
      </S.Details>
      <S.Details>
        <S.Summary>move</S.Summary>
        <ImageManager images={moveImages} setImages={setMoveImages} />
      </S.Details>
      <S.Details>
        <S.Summary>click</S.Summary>
        <ImageManager images={clickImages} setImages={setClickImages} />
      </S.Details>
      <S.Details>
        <S.Summary>down</S.Summary>
        <ImageManager images={downImages} setImages={setDownImages} />
      </S.Details>
      <S.Details>
        <S.Summary>rest</S.Summary>
        <ImageManager images={restImages} setImages={setRestImages} />
      </S.Details>
      <S.Input
        placeholder="캐릭터 이름"
        onChange={(e) => setName(e.target.value)}
      />
      {message && <S.Message>{message}</S.Message>}
      <S.Button onClick={saveCharacter} disabled={!able} able={able}>
        저장
      </S.Button>
    </S.Wrapper>
  );
}

export default AddCharacter;
