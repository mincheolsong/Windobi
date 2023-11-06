/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable default-case */
import { useEffect, useState } from 'react';

type TMotion = 'click' | 'down' | 'move' | 'stop' | 'up';
type TDirection = 'left' | 'right' | 'stop' | 'up' | 'down' | 'downsleep';
type TMotionImage = {
  click: Array<string>;
  down: Array<string>;
  move: Array<string>;
  stop: Array<string>;
  up: Array<string>;
};
type TMotionHandler = {
  left: () => ReturnType<typeof setInterval> | null;
  right: () => ReturnType<typeof setInterval> | null;
  stop: () => ReturnType<typeof setInterval> | null;
  up: () => ReturnType<typeof setInterval> | null;
  down: () => ReturnType<typeof setInterval> | null;
  downsleep: () => ReturnType<typeof setInterval> | null;
};

function CharacterImg() {
  const TICK = 500;

  const [character, setCharacter] = useState<string>('');
  const [motion, setMotion] = useState<TMotion>('stop');
  const [images, setImages] = useState<TMotionImage>({
    click: [],
    down: [],
    move: [],
    stop: [],
    up: [],
  });

  const [reverse, setReverse] = useState<boolean>(false);
  const [imageIndex, setImageIndex] = useState<number>(0);
  const motionHandler: TMotionHandler = {
    left: () => null,
    right: () => null,
    stop: () => null,
    up: () => null,
    down: () => null,
    downsleep: () => null,
  };

  const { ipcRenderer } = window.electron;

  let timerId: ReturnType<typeof setInterval> | null = null;
  // 캐릭터가 변경(디렉터리 이름과 매치되어야 함)
  // 이에 따라 적절한 이미지를 불러오자
  useEffect(() => {
    if (!character) return;

    (async () => {
      const characterImages: TMotionImage = await ipcRenderer.invoke(
        'character-images',
        character,
      );

      setImages(characterImages);
      if (timerId !== null) clearInterval(timerId);
    })();
  }, [character]);

  useEffect(() => {
    if (images.stop.length === 0) return;
    ipcRenderer.removeAllListener('character-move');

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
    motionHandler.up = () => {
      setMotion('up');
      if (images.up.length <= 1) return null;
      return setInterval(indexHandler, TICK, images.up.length);
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

    const handler = (direction: TDirection) => {
      if (timerId !== null) clearInterval(timerId);
      setImageIndex(() => 0);
      timerId = motionHandler[direction]();
    };
    ipcRenderer.on('character-move', handler);
  }, [images]);

  // ipcRenderer 이벤트 등록
  useEffect(() => {
    (async () => {
      const savedCharacter = await ipcRenderer.invoke(
        'get-setting',
        'character',
      );
      setCharacter(savedCharacter);
    })();
    ipcRenderer.on('change-character', (character: string) => {
      setCharacter(character);
    });
  }, []);

  return (
    <img
      width="100"
      alt="icon"
      src={
        images[motion]?.length > 0
          ? `data:image/png;base64,${images[motion][imageIndex]}`
          : ''
      }
      style={{
        WebkitUserDrag: 'none',
        transform: `scaleX(${reverse ? -1 : 1})`,
      }}
    />
  );
}

export default CharacterImg;
