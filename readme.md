## 항공대 교과목 정보 파서

### Raw data (종합정보시스템 - 강의시간표및계획서 - 개발자 도구의 network 탭에서 얻을 수 있음.)

![스크린샷](./screenshot.png)

### Parsed data (JSON)

![파싱 후](./result.png)

항공대 교과목 정보를 json으로 파싱해주는 파서입니다.

각 과목 속성에는 아래 값이 담깁니다.

## 파싱 결과물 예시 (JSON)

```
{
    "major": 과목명 (string),
    "classType": 학습유형 (string),
    "subjectNumber": 과목번호 (string),
    "subjectName": 과목명 (string),
    "subjectType": 이수구분 (string),
    "subjectGrade": 수강학년 (string),
    "classHour": 강의시간 - [D)TT:MM~D)TT:MM] / (Array),
    "classroom": 강의실 (string),
    "profName": 교수명 (string)
    "maxStudent": 정원 (string)
    "subjectScore": 학점 (string)
},
```

## 실행 방법

1. 텍스트 파일을 `subject.txt`로 놓는다.

2. 실행

```
node index.js
```

3. `parsedData.json` 이라는 이름의 결과물 출력

다만 아직 ICU, SDU, HCU는 지원하지 않습니다.  
교내 서비스 개발에 도움이 되시길 바라겠습니다. 😄
