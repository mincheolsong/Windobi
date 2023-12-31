import { useState, useEffect, useRef } from 'react';
import OpenAI from 'openai';
import '../components/chatGPT/chatGPT.scss';
import sam from '../../../assets/sam.json';

function ChatGPT() {
  const { ipcRenderer } = window.electron;

  const [openai, setOpenai] = useState();
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const settingOpenAi = async () => {
    const m = sam.sun;

    setOpenai(
      new OpenAI({
        apiKey: m,
        dangerouslyAllowBrowser: true,
      }),
    );
  };

  useEffect(() => {
    ipcRenderer.sendMessage('windowOpened');
    window.electron.ipcRenderer.sendMessage('size', {
      width: 300,
      height: 500,
    });
    settingOpenAi();
  }, []);

  const [prompt, setPrompt] = useState(''); // 입력창에 사용되는 state
  const [apiResponse, setApiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState([]); // 채팅 말풍선을 보여주기 위한 state
  const [message, setMessage] = useState([]); // 챗봇을 위한 message

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setChat((chat) => [...chat, { type: 1, content: prompt }]);

    const newMessage = message.slice();
    newMessage.push({ role: 'user', content: prompt });

    try {
      const result = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: newMessage,
      });

      setApiResponse(result.choices[0].message.content);
      newMessage.push(result.choices[0].message);
      setChat((chat) => [
        ...chat,
        { type: 0, content: result.choices[0].message.content },
      ]);
      setMessage(newMessage); // 메시지 상태(state)를 업데이트합니다
    } catch (e) {
      setApiResponse('Something is going wrong, Please try again.');
    }
    setLoading(false);
    setPrompt('');
  };

  const enterKey = (e) => {
    if (e.keyCode === 13) {
      handleSubmit(e);
    }
  };
  // chat이 변경될 때 마다 scroll을 항상 아래로 내리기 위함
  useEffect(() => {
    messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  return (
    <div>
      <div className="wrap">
        {chat.map((item, index) =>
          item.type === 0 ? (
            <div className="chat ch1" key={index}>
              <div className="textbox">{item.content}</div>
            </div>
          ) : item.type === 1 ? (
            <div className="chat ch2" key={index}>
              <div className="textbox">{item.content}</div>
            </div>
          ) : null,
        )}
      </div>
      <div ref={messageEndRef} />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          height: '7vh',
          paddingLeft: '5px',
          paddingRight: '5px',
        }}
      >
        <textarea
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyUp={(e) => enterKey(e)}
          style={{
            height: '100%',
            border: 'none',
            borderRadius: '10px',
            width: '75%',
            maxHeight: '66px',
          }}
        />
        <button
          disabled={loading || prompt.length === 0}
          type="button"
          onClick={handleSubmit}
          style={{
            border: 'none',
            color: 'black',
            background: '#f9eb54',
            borderRadius: '10px',
            height: '100%',
            padding: '5px',
            cursor: 'pointer',
            minWidth: '50px',
          }}
        >
          {loading ? '답변중...' : '전송'}
        </button>
      </div>
    </div>
  );
}

export default ChatGPT;
