/*
*** 5개불러오는경우 
10개의 skeleton-line을 놔두고(with skeleton-span)
1. 10개 line을 다지우고, 내용line5개를 추가, 빈line5개추가
혹은
2. 10개 돌면서 앞의 5개 1)tr내부의 span제거, 2) td별로 text
content추가 뒤의 5개 span태그제거

*** 10개불러오는경우
10개의 skeleton-line을 놔두고(with skeleton-span)
1. 10개 line을 다지우고, 새line10개를 추가
혹은
2. 10개의 앞의 10개 1)tr내부의 span을 제거하고, 2)td별로textContent넣어주면됌
뒤의 0개 span태그제거
*/

function getData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('data');
      resolve(4)
    }, 0);
  })
}
async function showPayment() {
  const num = await getData()
  console.log(num);
  showSkel(num)
  // showPay(num)
  setTimeout(() => {
    showPay(num)
  }, 1000);
}
showPayment()
function showPay(num) {
  const table = document.querySelector("table#list-val")
  const skeletonLines = document.querySelectorAll("table#list-val tr.skeleton-line")
  skeletonLines.forEach((skeleton) => skeleton.remove())
  console.log('표시!!');
  console.log(table);
  for(let i = 0; i < num; i++) {
    table.innerHTML += `<tr>
      <td>이름${i+1}</td>
      <td>회원번호${i+1}</td>
      <td>연락처</td>
    </tr>`
  }
  for(let i = num; i < 10; i++) {
    table.innerHTML += `<tr>
      <td></td>
      <td></td>
      <td></td>
    </tr>`
  }
}

function showSkel(num) {
  const trEls = document.querySelectorAll("table#list-val .skeleton-line")
  for(let i = 0; i < num; i++) {
    console.log(trEls[i]);
    const tdEls = trEls[i].querySelectorAll("td")
    tdEls.forEach(td => {
      td.innerHTML = '<span></span>'
    });
  }
}