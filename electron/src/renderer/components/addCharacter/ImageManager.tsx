/* eslint-disable react/no-array-index-key */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import ImageDrop from './ImageDrop';
import * as S from './ImageManager.style';
import Thumbnail from './Thumbnail';

type TImageManager = {
  images: Array<string>;
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
};

function ImageManager({ images, setImages }: TImageManager) {
  const TICK = 250;
  const [imageIndex, setImageIndex] = useState<number>(-1);

  const { ipcRenderer } = window.electron;

  const upload = async (file: File) => {
    const base64 = await ipcRenderer.invoke('get-image', file.path);
    setImages((prev) => [...prev, base64]);
  };

  const timerId = useRef<ReturnType<typeof setInterval> | null>(null);
  const animation = (length: number) => {
    setImageIndex((prev) => (prev + 1) % length);
  };
  useEffect(() => {
    if (images.length === 0) return;
    if (timerId.current !== null) clearInterval(timerId.current);
    timerId.current = setInterval(animation, TICK, images.length);
  }, [images.length]);

  const removeImage = (target: number) => {
    const removedImages = images.filter((_, index) => index !== target);
    if (removedImages.length === 0) setImageIndex(() => -1);
    else setImageIndex(() => 0);
    setImages(() => removedImages);
  };

  return (
    <S.Wrapper>
      <S.Row>
        <ImageDrop fileHandler={upload} />
        {images[imageIndex] && <Thumbnail image={images[imageIndex]} />}
      </S.Row>
      {images.map((image, index) => {
        return (
          <Thumbnail
            key={`${image}_${index}`}
            image={image}
            remove={() => removeImage(index)}
          />
        );
      })}
    </S.Wrapper>
  );
}

export default ImageManager;
