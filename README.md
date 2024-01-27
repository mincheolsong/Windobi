# Windobi

> 📱 데스크톱 어플리케이션  
> 📆 진행 기간 : 2023.10.10 ~ 2023.11.17  
> 팀 구성 : 4명  
> **담당역할 : 프론트엔드 & 백엔드**  
> 다운 링크 : https://drive.google.com/file/d/1ahEa0zZijW29Q4WNW0t11D4psnjLvgTB/view?usp=sharing  

## 프로젝트 소개영상
[![Video Label](http://img.youtube.com/vi/UjIa21FY2bo/3.jpg)](https://www.youtube.com/watch?v=UjIa21FY2bo)

## 사용 기술 및 라이브러리

- Electron
- React
- TypeScript
- Styled Components
- SQLite
- nivo 차트
- openai API
- youtube data API

## 기술 선정 이유

- Electron  
  JavaScript, HTML 및 CSS와 같은 웹 기술을 사용하여 데스크톱 애플리케이션을 만들기 위해 사용
- sqlite  
  서버 없이, 사용시간 데이터를 저장하기 위해 사용
- openai API  
  chatcompletion을 이용한 prompt를 작성하여 원하는 json 데이터를 얻기위해 사용
- youtube data api  
  실제 유튜브 뮤직 플레이리스트를 생성하기 위해 사용

## 프로젝트 개요

<p align="center">
<img src="https://github.com/mincheolsong/Windobi/assets/80660585/8b694828-458c-4be7-8683-e5f3c3e05a9f" height="200px"/></p>

> 😀 **윈도비는** 작업표시줄을 돌아다니며 사용자를 도와주는 나만의 비서입니다.<br> 사용자의 **프로그램 사용량**을 분석합니다. **VSCode**, **IntelliJ**를 통해 어떤 **언어**를 많이 개발했는지, **Chrome**을 통해 어떤 사이트에 오래 머물렀는지, **카카오톡** 대화방에 머무른 시간을 기록합니다.<br> 기록된 정보는 **주간 보고서**로 정리하여 매주 등록된 **메일로 전송**하게 됩니다.
> 자신만의 캐릭터로 **커스텀**이 가능합니다.

### 프로그램 사용시간 분석

- IDE별 사용언어 분석
- 카카오톡 대화방 분석
- Chrome 사이트 분석

### 주간보고서 전송

- 개발 잔디
- 시간대별 사용시간

### 캐릭터 커스텀

### 원하는 youtube music 플레이리스트 자동생성

### 메일 알림(다음, 네이버)

- 메일 수신시 알림
- 수신메일 내용보기 기능 제공

### 실시간 날씨

---

## 담당업무

### 원형메뉴

<p align="center"><img src="https://github.com/mincheolsong/Windobi/assets/80660585/000c264d-c86e-49b5-af47-4e5ac18cc4c7"/></p>

> Ipc를 사용한 캐릭터 우클릭 시 browse window 생성

> useEffect hooks를 사용하여 첫 랜더링과 마지막 랜더링에 메뉴 펼쳐지는 에니메이션 적용

### 주간보고서

<p align="center"><img src="https://github.com/mincheolsong/Windobi/assets/80660585/20e470e0-42f8-4701-800d-4255ba834806" height="250px"/></p>

> 사용시간 DB를 조회하여 일 별 데이터 정리

> nivo chart를 활용한 일주일간 사용시간, 90일간 개발 시간 데이터 시각화

### 원하는 youtube music 플레이리스트 자동생성

<p align="center"><img src="https://github.com/mincheolsong/Windobi/assets/80660585/80120658-d4f8-4e9a-9209-d86aa14f397d" height="300"/></p>

> Openai chatcompletion 프롬프트 작성을 통해 Json 데이터 생성

> Youtube data api와 google oauth2를 활용하여 실제 플레이리스트 생성

## 알게된 점

> electron은 main 프로세스와 renderer 프로세스로 구분됨.

> renderer 프로세스에서 NodeJS.API 에 접근하려면 nodeIntegration설정을 true로 해야 됨.

> 각각의 renderer 프로세스들은 독립적으로 작동하기 때문에, 다른 renderer 프로세스에게 영향을 주지 않음.

## 아키텍처

<p align="center"><img src="https://github.com/mincheolsong/Windobi/assets/80660585/eb66b7a1-3959-4e70-a633-8dcb8d32343d"/></p>
