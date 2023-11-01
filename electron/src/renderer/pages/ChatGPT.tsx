import { useState, useEffect } from 'react';

function chatGPT() {
  window.electron.ipcRenderer.sendMessage('size', { width: 300, height: 500 });

  return <div>test</div>;
}

export default chatGPT;
