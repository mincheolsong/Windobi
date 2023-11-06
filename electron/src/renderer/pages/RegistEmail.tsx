import { useEffect } from 'react';

function RegistEmail() {
  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('size', {
      width: 500,
      height: 400,
    });
  }, []);

  return (
    <div>
      <div> 이메일 등록 화면 </div>
    </div>
  );
}
export default RegistEmail;
