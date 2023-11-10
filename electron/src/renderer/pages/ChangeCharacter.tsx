/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import * as S from '../components/changeCharacter/ChangeCharacter.style';

type TCharacter = {
  name: string;
  image: string;
};

function ChangeCharacter() {
  const [characters, setCharacters] = useState<Array<TCharacter>>([
    { image: '', name: 'a' },
  ]);

  const { ipcRenderer } = window.electron;
  const changeCharacter = (character: string) => {
    ipcRenderer.sendMessage('change-character', character);
    ipcRenderer.sendMessage('set-setting', 'character', character);
  };

  // 캐릭터 리스트들을 불러오자
  useEffect(() => {
    ipcRenderer.sendMessage('windowOpened');
    ipcRenderer.sendMessage('size', { width: 400, height: 400 });

    (async () => {
      const characterList: Array<TCharacter> =
        await ipcRenderer.invoke('character-list');
      setCharacters(characterList);
    })();
  }, []);

  return (
    <S.Ul>
      {characters.map((character) => {
        return (
          <S.Li onClick={() => changeCharacter(character.name)}>
            {character.name}
            <img
              src={`data:image/png;base64,${character.image}`}
              width={60}
              height={60}
              alt={character.name}
            />
          </S.Li>
        );
      })}
    </S.Ul>
  );
}

export default ChangeCharacter;
