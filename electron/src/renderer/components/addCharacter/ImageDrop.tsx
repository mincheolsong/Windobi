/* eslint-disable no-use-before-define */
/* eslint-disable react/jsx-props-no-spreading */
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as S from './ImageDrop.style';
import Active from './Active';
import NoActive from './NoActive';

type TImageDrop = {
  fileHandler: (file: File) => any;
};

function ImageDrop({ fileHandler }: TImageDrop) {
  const onDrop = useCallback(
    (acceptedFiles: Array<File>) => {
      if (acceptedFiles.length === 0) {
        alert('png파일만 업로드 가능합니다');
        return;
      }
      const targetFile = acceptedFiles[0];
      fileHandler(targetFile);
    },
    [fileHandler],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'image/png': ['.png'],
    },
  });

  return (
    <S.Wrapper {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? <Active /> : <NoActive />}
    </S.Wrapper>
  );
}

export default ImageDrop;
