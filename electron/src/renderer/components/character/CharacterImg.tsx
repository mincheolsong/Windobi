/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';

type TMotion = 'click' | 'down' | 'move' | 'stop' | 'rest';
type TDirection =
  | 'left'
  | 'right'
  | 'stop'
  | 'rest'
  | 'down'
  | 'downsleep'
  | 'click';
type TMotionImage = {
  click: Array<string>;
  down: Array<string>;
  move: Array<string>;
  stop: Array<string>;
  rest: Array<string>;
};
type TMotionHandler = {
  left: () => ReturnType<typeof setInterval> | null;
  right: () => ReturnType<typeof setInterval> | null;
  stop: () => ReturnType<typeof setInterval> | null;
  rest: () => ReturnType<typeof setInterval> | null;
  down: () => ReturnType<typeof setInterval> | null;
  downsleep: () => ReturnType<typeof setInterval> | null;
  click: () => ReturnType<typeof setInterval> | null;
};

function CharacterImg() {
  const TICK = 250;

  const [character, setCharacter] = useState<string>('');
  const [motion, setMotion] = useState<TMotion>('stop');
  const [images, setImages] = useState<TMotionImage>({
    click: [],
    down: [],
    move: [],
    stop: [],
    rest: [],
  });

  const [reverse, setReverse] = useState<boolean>(false);
  const [imageIndex, setImageIndex] = useState<number>(0);
  const motionHandler: TMotionHandler = {
    left: () => null,
    right: () => null,
    stop: () => null,
    rest: () => null,
    down: () => null,
    downsleep: () => null,
    click: () => null,
  };

  const { ipcRenderer } = window.electron;
  const timerId = useRef<ReturnType<typeof setInterval> | null>(null);

  // 캐릭터가 변경(디렉터리 이름과 매치되어야 함)
  // 이에 따라 적절한 이미지를 불러오자
  useEffect(() => {
    if (!character) return;

    (async () => {
      const characterImages: TMotionImage = await ipcRenderer.invoke(
        'character-images',
        character,
      );

      ipcRenderer.removeAllListener('character-move');
      if (timerId.current !== null) clearInterval(timerId.current);
      setImages(() => characterImages);
    })();
  }, [character, ipcRenderer]);

  useEffect(() => {
    if (images.stop.length === 0) return;
    setMotion('stop');
    setImageIndex(0);

    const indexHandler = (length: number) => {
      setImageIndex((prev) => (prev + 1) % length);
    };

    motionHandler.left = () => {
      setReverse(false);
      setMotion('move');
      if (images.move.length <= 1) return null;
      return setInterval(indexHandler, TICK, images.move.length);
    };
    motionHandler.right = () => {
      setReverse(true);
      setMotion('move');
      if (images.move.length <= 1) return null;
      return setInterval(indexHandler, TICK, images.move.length);
    };
    motionHandler.stop = () => {
      setMotion('stop');
      if (images.stop.length <= 1) return null;
      return setInterval(indexHandler, TICK, images.stop.length);
    };
    motionHandler.rest = () => {
      setMotion('rest');
      if (images.rest.length <= 1) return null;
      return setInterval(indexHandler, TICK, images.rest.length);
    };
    motionHandler.down = () => {
      setMotion('down');
      if (images.down.length <= 1) return null;
      return setInterval(indexHandler, TICK, images.down.length);
    };
    motionHandler.downsleep = () => {
      setMotion('down');
      if (images.down.length <= 1) return null;
      return setInterval(indexHandler, TICK, images.down.length);
    };
    motionHandler.click = () => {
      setMotion('click');
      if (images.click.length <= 1) return null;
      return setInterval(indexHandler, TICK, images.click.length);
    };

    const handler = (direction: TDirection) => {
      if (timerId.current !== null) clearInterval(timerId.current);
      setImageIndex(() => 0);
      timerId.current = motionHandler[direction]();
    };
    ipcRenderer.on('character-move', handler);
  }, [images, ipcRenderer]);

  // ipcRenderer 이벤트 등록
  useEffect(() => {
    (async () => {
      const savedCharacter = await ipcRenderer.invoke(
        'get-setting',
        'character',
      );
      setCharacter(() => savedCharacter);
    })();
    ipcRenderer.on('change-character', (newCharacter: string) => {
      setCharacter(() => newCharacter);
    });
  }, []);

  return (
    <Image
      width="120"
      alt="icon"
      src={
        images[motion]?.length > 0
          ? images[motion][imageIndex]
            ? `data:image/png;base64,${images[motion][imageIndex]}`
            : `data:image/png;base64,${images[motion][0]}`
          : ''
      }
      style={{
        transform: `scaleX(${reverse ? -1 : 1})`,
      }}
    />
  );
}

const Image = styled.img`
  -webkit-user-drag: none;
  -webkit-user-select: none;
`;

export default CharacterImg;
