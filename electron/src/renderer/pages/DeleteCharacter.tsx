/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import * as S from '../components/deleteCharacter/DeleteCharacter.style';

type TCharacter = {
  name: string;
  image: string;
};

function DeleteCharacter() {
  const { ipcRenderer } = window.electron;
  const [characters, setCharacters] = useState<Array<TCharacter>>([]);

  useEffect(() => {
    ipcRenderer.sendMessage('windowOpened');
    ipcRenderer.sendMessage('size', { width: 400, height: 400 });
  }, []);

  useEffect(() => {
    (async () => {
      const characterList = await ipcRenderer.invoke('character-list');
      setCharacters(characterList);
    })();
  }, []);

  const onClickDelete = async (name: string) => {
    const check = window.confirm(`${name}을 삭제할까요?`);
    if (!check) return;
    const success = await ipcRenderer.invoke('delete-character', name);

    if (success) {
      const characterList = await ipcRenderer.invoke('character-list');
      setCharacters(characterList);
    } else {
      alert('삭제하는데 실패하였습니다');
    }
  };

  return (
    <S.Ul>
      {characters.map((character) => {
        return (
          <S.Li onClick={() => onClickDelete(character.name)}>
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

export default DeleteCharacter;
