import { useState, useEffect } from 'react';

function MyPage() {
  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('size', {
      width: 500,
      height: 400,
    });
  });
  return (
    <div>
      <div>마이페이지(이메일등록)</div>
    </div>
  );
}
export default MyPage;
