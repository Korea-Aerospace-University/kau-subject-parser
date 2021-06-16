var fs = require("fs");

try {
  const dataList = [];
  const textFile = fs.readFileSync("subject.txt").toString();
  const trimmedTxt = textFile
    .replace(/[\x00-\x09\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, "")
    .replace(/[\n\' ']/g, "");

  const p1 = trimmedTxt.replaceAll("FL5", "FL\n");
  const p2 = p1.replaceAll("일반1", "일반\n");
  const p5 = p2.replaceAll("일반2", "일반\n");
  const p3 = p5.replaceAll("일반3", "일반\n");
  const p8 = p3.replaceAll("일반8", "일반\n");
  const p4 = p8.replaceAll("일반A", "일반\n");
  const ptbl = p4.replaceAll("PtBLB", "PtBL\n");
  const pmbl = ptbl.replaceAll("PmBLC", "PmBL\n");
  const trimNsbp = pmbl.replaceAll(/&nbsp;/g, "");
  const parsedTxt1 = trimNsbp.replaceAll("-/-", "비대면");
  const parsedTxt2 = parsedTxt1.replaceAll("-", "비대면");

  const subjectList = parsedTxt2.split("\n");

  const getClassTypeAndMajor = (string) => {
    const classType = ["PtBL", "FL", "일반", "PmBL"];
    for (type of classType) {
      if (string.includes(type)) {
        const major = string.replace(type, "");
        return { major, classType: type };
      }
    }
  };

  const getProfessorNameAndMaxStudent = (string) => {
    try {
      let profName = "";
      let maxStudent = "";
      for (char of string) {
        if (isNaN(char) === true && maxStudent === "") {
          profName += char;
        }
        if (isNaN(char) === false) {
          maxStudent += char;
        }
        if (isNaN(char) === true && maxStudent !== "") {
          return { profName, maxStudent };
        }
      }
    } catch (err) {
      console.log("교수명, 수강생 정보 파싱 에러");
    }
  };

  const getClassHourAndClassroom = (string) => {
    const weekDays = ["월)", "화)", "수)", "목)", "금)"];
    const A0000Index = string.indexOf("A0000");
    const classHour = [];
    let lastIndex = 0;
    try {
      for (weekday of weekDays) {
        const weekIndex = string.indexOf(weekday);
        if (weekIndex !== -1) {
          lastIndex = weekIndex;
          classHour.push(string.substring(weekIndex, weekIndex + 13));
        }
      }

      const classroom = string.substring(lastIndex + 13, A0000Index);

      if (classHour.length === 0) {
        classHour.push("강의시간 정보가 없습니다.");
        return { classHour, classroom: "강의실 정보가 없습니다." };
      }

      return { classHour, classroom };
    } catch (err) {
      console.log(err);
    }
  };

  const getSubjectInfo = (subject) => {
    // 0776확률통계론2전필3김선옥65월)09:00∼10:30수)10:30∼12:00비대면A0000소프트일반
    // subString1 = "A0000소프트일반"
    // subString2 = "김선옥65월)09:00∼10:30수)10:30∼12:00비대면A0000소프트일반"
    const A0000Index = subject.indexOf("A0000");
    const subString1 = subject.substring(A0000Index + 5, subject.length);
    const { major, classType } = getClassTypeAndMajor(subString1);

    const subjectNumber = subject.substring(0, 4);
    const subjectType = ["전선", "전필", "일선", "교선", "교필"];

    for (type of subjectType) {
      let typeIndex = subject.indexOf(type);
      if (typeIndex !== -1) {
        if (isNaN(subject[typeIndex - 1]) || isNaN(subject[typeIndex + 2])) {
          continue;
        }
        const subString2 = subject.substring(typeIndex + 3, subject.length);
        const { profName, maxStudent } = getProfessorNameAndMaxStudent(subString2);
        const { classHour, classroom } = getClassHourAndClassroom(subString2);

        return {
          major,
          classType,
          subjectNumber,
          subjectType: type,
          subjectGrade: subject[typeIndex - 1],
          subjectName: subject.substring(4, typeIndex - 1),
          classHour,
          classroom,
          profName,
          maxStudent,
          subjectScore: subject[typeIndex + 2],
        };
      }
    }
  };

  for (subject of subjectList) {
    try {
      const {
        major,
        classType,
        subjectNumber,
        subjectName,
        subjectType,
        subjectGrade,
        classHour,
        classroom,
        profName,
        maxStudent,
        subjectScore,
      } = getSubjectInfo(subject);
      const data = {
        major,
        classType,
        subjectNumber,
        subjectName,
        subjectType,
        subjectGrade,
        classHour,
        classroom,
        profName,
        maxStudent,
        subjectScore,
      };
      dataList.push(data);
    } catch (err) {
      continue;
    }
  }
  fs.writeFileSync("data.json", JSON.stringify(dataList));
} catch (err) {
  console.log("존재하지 않는 파일이거나, 파일이 손상되었습니다.");
  console.log("파일 이름이 subject.txt가 맞는지 확인해주세요.");
}
