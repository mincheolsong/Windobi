/* eslint-disable no-use-before-define */
/* eslint-disable react/jsx-props-no-spreading */
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as S from './ImageDrop.style';
import Active from './Active';
import NoActive from './NoActive';

function ImageDrop() {
  const onDrop = useCallback((acceptedFiles: Array<File>) => {
    console.log(acceptedFiles[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <S.Wrapper {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? <Active /> : <NoActive />}
    </S.Wrapper>
  );
}

export default ImageDrop;
