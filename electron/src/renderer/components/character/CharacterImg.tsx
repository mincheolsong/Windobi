/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable default-case */
import { useEffect, useState } from 'react';

type TMotion =
  | 'stop'
  | 'left1'
  | 'left2'
  | 'up1'
  | 'up2'
  | 'down1'
  | 'down2'
  | 'down3';

type TImages = {
  stop: string;
  left1: string;
  left2: string;
  up1: string;
  up2: string;
  down1: string;
  down2: string;
  down3: string;
};

type TDirection = 'left' | 'right' | 'stop' | 'up' | 'down' | 'downsleep';

function CharacterImg() {
  const TICK = 250;

  const [character, setCharacter] = useState<string>('hanbyul');
  const [motion, setMotion] = useState<TMotion>('stop');
  const [images, setImages] = useState<TImages>({
    stop: '',
    left1: '',
    left2: '',
    up1: '',
    up2: '',
    down1: '',
    down2: '',
    down3: '',
  });
  const [reverse, setReverse] = useState<boolean>(false);

  const { ipcRenderer } = window.electron;

  let timerId: ReturnType<typeof setInterval> | null = null;

  // 캐릭터가 변경(디렉터리 이름과 매치되어야 함)
  // 이에 따라 적절한 이미지를 불러오자
  useEffect(() => {
    if (!character) return;

    (async () => {
      const [stop, left1, left2, up1, up2, down1, down2, down3] =
        await Promise.all([
          import(`../../../../assets/character/${character}/stop.png`),
          import(`../../../../assets/character/${character}/left1.png`),
          import(`../../../../assets/character/${character}/left2.png`),
          import(`../../../../assets/character/${character}/up1.png`),
          import(`../../../../assets/character/${character}/up2.png`),
          import(`../../../../assets/character/${character}/down1.png`),
          import(`../../../../assets/character/${character}/down2.png`),
          import(`../../../../assets/character/${character}/down3.png`),
        ]);

      setImages({
        stop: stop.default,
        left1: left1.default,
        left2: left2.default,
        up1: up1.default,
        up2: up2.default,
        down1: down1.default,
        down2: down2.default,
        down3: down3.default,
      });
    })();
  }, [character]);

  // 각 모션에 대해 어떠한 처리를 할지 설정
  const motions = {
    left: () => {
      setReverse(false);
      return setInterval(() => {
        setMotion((prev) => (prev === 'left2' ? 'left1' : 'left2'));
      }, TICK);
    },
    right: () => {
      setReverse(true);
      return setInterval(() => {
        setMotion((prev) => (prev === 'left2' ? 'left1' : 'left2'));
      }, TICK);
    },
    stop: () => {
      setMotion(() => 'stop');
      return null;
    },
    up: () => {
      return null;
    },
    down: () => {
      return setInterval(() => {
        setMotion((prev) => (prev === 'down2' ? 'down1' : 'down2'));
      }, TICK);
    },
    downsleep: () => {
      setMotion(() => 'down3');
      return null;
    },
  };

  // 캐릭터 모션 변경 이벤트가 오면
  useEffect(() => {
    ipcRenderer.on('character-move', (direction: TDirection) => {
      if (timerId !== null) {
        // 그전에 있던 이벤트는 없애고
        clearInterval(timerId);
      }
      const handler = motions[direction];
      timerId = handler();
    });
  }, []);

  // 캐릭터 변경 리스너 등록
  useEffect(() => {
    ipcRenderer.on('change-character', (character: string) => {
      setCharacter(character);
    });
  }, []);

  return (
    <img
      width="100"
      alt="icon"
      src={images[motion]}
      style={{
        WebkitUserDrag: 'none',
        transform: `scaleX(${reverse ? -1 : 1})`,
      }}
    />
  );
}

export default CharacterImg;
