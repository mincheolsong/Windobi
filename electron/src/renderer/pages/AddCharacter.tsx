/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import ImageDrop from '../components/addCharacter/ImageDrop';

function AddCharacter() {
  const { ipcRenderer } = window.electron;

  useEffect(() => {
    ipcRenderer.sendMessage('size', { width: 400, height: 300 });
  }, []);

  return (
    <div>
      <ImageDrop />
    </div>
  );
}

export default AddCharacter;
