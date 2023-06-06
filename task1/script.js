const xmlString = `<list>
  <student>
    <name lang="en">
      <first>Ivan</first>
      <second>Ivanov</second>
    </name>
    <age>35</age>
    <prof>teacher</prof>
  </student>
  <student>
    <name lang="ru">
      <first>Петр</first>
      <second>Петров</second>
    </name>
    <age>58</age>
    <prof>driver</prof>
  </student>
</list>`;

const parser = new DOMParser();
// Парсинг XML
const xmlDOM = parser.parseFromString(xmlString, "text/xml");

// Получение всех DOM-нод
const studentsData = xmlDOM.querySelectorAll("student");
var studentsList = [];
for (let i = 0; i < studentsData.length; i++) {
  const s = studentsData[i];
  const studentName = s.querySelector("name");
  const firstName = studentName.querySelector("first");
  const secondName = studentName.querySelector("second");
  const lang = studentName.getAttribute('lang');
  const age = s.querySelector("age");
  const prof = s.querySelector("prof");
  const student = {
    name: `${firstName.textContent} ${secondName.textContent}`,
    age: age.textContent,
    prof: prof.textContent,
    lang: lang
  };
  studentsList.push(student);
}
const listResult = {
  list: studentsList
}

console.log(listResult);


// {
//   list: [
//     { name: 'Ivan Ivanov', age: 35, prof: 'teacher', lang: 'en' },
//     { name: 'Петр Петров', age: 58, prof: 'driver', lang: 'ru' },
//   ]
// }