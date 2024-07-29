/*
*** 5개불러오는경우 
10개의 skeleton-line을 놔두고(with skeleton-span)
1. 10개 line을 다지우고, 내용line5개를 추가, 빈line5개추가
혹은
2. 10개 돌면서 앞의 5개 1)tr내부의 span제거, 2) td별로 text
content추가

*** 10개불러오는경우
10개의 skeleton-line을 놔두고(with skeleton-span)
1. 10개 line을 다지우고, 새line10개를 추가
혹은
2. 10개의 line을 돌며 내용만 바꿔넣음
이때 1)tr내부의 span을 제거하고, 2)td별로textContent넣어주면됌

*/

function getData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('data');
      resolve('data!')
    }, 100);
  })
}
async function showPayment() {
  await getData()
  const table = document.querySelector("table#list-val")
  const skeleton = document.querySelectorAll("table#list-val tr.skeleton-line")
  skeleton.forEach((skeleton) => skeleton.remove())
  console.log('표시!!');
  console.log(table);
  for(let i = 0; i < 10; i++) {
    table.innerHTML += `<tr>
      <td>이름${i+1}</td>
      <td>회원번호${i+1}</td>
      <td>연락처</td>
    </tr>`
  }
}
setTimeout(() => {
  showPayment()
}, 550);
// showPayment()