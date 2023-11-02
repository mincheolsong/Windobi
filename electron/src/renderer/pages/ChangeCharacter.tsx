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

  // 캐릭터 리스트들을 불러오자
  useEffect(() => {
    ipcRenderer.sendMessage('size', { width: 400, height: 400 });

    (async () => {
      const characterList: Array<string> =
        await ipcRenderer.invoke('character-list');

      if (characterList.length !== 0) {
        const promises = characterList.map(
          (char) => import(`../../../assets/character/${char}/stop.png`),
        );

        const images = await Promise.all(promises);

        const result: Array<TCharacter> = [];
        for (let i = 0; i < images.length; i += 1) {
          result.push({ name: characterList[i], image: images[i].default });
        }
        setCharacters(result);
      }
    })();
  }, []);

  return (
    <S.Ul>
      {characters.map((character) => {
        return (
          <S.Li>
            {character.name}
            <img
              src={character.image}
              width={60}
              height={60}
              alt={character.image}
            />
          </S.Li>
        );
      })}
    </S.Ul>
  );
}

export default ChangeCharacter;
