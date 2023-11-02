import { useState, useEffect } from 'react';
import OpenAI from 'openai';

function ChatGPT() {
  // const { ipcRenderer } = window.electron;
  window.electron.ipcRenderer.sendMessage('size', {
    width: 300,
    height: 500,
  });

  const [openai, setOpenai] = useState();

  const settingOpenAi = async () => {
    const key = await window.electron.ipcRenderer.invoke(
      'env',
      'OPENAI_API_KEY',
    );
    setOpenai(
      new OpenAI({
        apiKey: key,
        dangerouslyAllowBrowser: true,
      }),
    );
  };

  useEffect(() => {
    settingOpenAi();
  }, []);

  const [prompt, setPrompt] = useState('');
  const [apiResponse, setApiResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      });
      //console.log("response", result.data.choices[0].text);
      console.log(result);
      setApiResponse(result.choices[0].message.content);
    } catch (e) {
      //console.log(e);
      setApiResponse('Something is going wrong, Please try again.');
    }
    setLoading(false);
  };

  // useEffect(() => {
  //   ipcRenderer.sendMessage('size', { width: 300, height: 500 });
  // }, []);

  return (
    <>
      {apiResponse && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div>
            <strong>API response:</strong>
            {apiResponse}
          </div>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
        }}
      >
        <form onSubmit={handleSubmit}>
          <textarea
            type="text"
            value={prompt}
            placeholder="Please ask to openai"
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button disabled={loading || prompt.length === 0} type="submit">
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </form>
      </div>
    </>
  );
}

export default ChatGPT;
