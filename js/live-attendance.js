import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js'
import { getFirestore, collection, addDoc, query, where, getDocs} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js';
const app = initializeApp({
  apiKey: "AIzaSyBykm-oqoMvIAjLFWHPnVi_OQ86Iis_NVs",
  authDomain: "yoga-663cb.firebaseapp.com",
  projectId: "yoga-663cb",
  storageBucket: "yoga-663cb.appspot.com",
  messagingSenderId: "256248240983",
  appId: "1:256248240983:web:07dcebbcb04debc34b3c12"
})
const db = getFirestore(app)

//임의날짜의 출석을 추가하기 위한 코드
// 무작위 collection_id로 생성이기 때문에 아마도 로딩될때마다 중복결제 생길듯 ㅋ
/*
await addDoc(collection(db, "open_attendances"), {
  user_id : 2212,
  attend_year : 2023, 
  attend_month : 4, 
  attend_day : 5,
  attend_time : [18, 39, 10],
});
*/

//현재 날짜에 해당하는 출석들 모두 조회(음 하루를 시간대별로 분리해서 수업대별로 출석현황 불러올수도있을듯)
const q = query(collection(db, "open_attendances"), where("attend_day", "==", 6));
const querySnapshot = await getDocs(q);
const todayVisits = []
querySnapshot.forEach((doc) => {
  todayVisits.push(doc.data())
});
console.log(todayVisits);

const container = document.querySelector('#attend-pallette')
for (let visit of todayVisits) {
  const visitTime = visit.attend_time
  const newItem = document.createElement('div')
  newItem.textContent = visitTime.join(':')
  newItem.className = "attend"
  container.appendChild(newItem)
}

async function addVisit() {
  const date = new Date()
  const [attend_year, attend_month, attend_day] = [date.getFullYear(),date.getMonth() + 1, date.getDate()]
  // const attend_time = date.toLocaleTimeString()
  console.log(attend_year, attend_month, attend_day, attend_time);
  const attend_time = [date.getHours(), date.getMinutes(), date.getSeconds()]

}
const addBtn = document.querySelector('button#add')
addBtn.addEventListener("click", function () {
  const newItem = document.createElement('div')
  newItem.textContent = "attend"
  newItem.className = "attend"
  container.appendChild(newItem)
  let curVisitors = document.querySelectorAll('.attend').length
  console.log(curVisitors)
  addVisit()
})
const delBtn = document.querySelector('button#delete')
delBtn.addEventListener("click", function () {
  const divArr = document.querySelectorAll('.attend')
  divArr[divArr.length - 1].remove()
  let curVisitors = document.querySelectorAll('.attend').length
  console.log(curVisitors)
})

let curVisitors = document.querySelectorAll('.attend').length
// 현재 총 방문자 수
// 한페이지당 표시할수있는 최대 방문자 수 : 20
// 페이지 단추 수
/*
실시간 출석이 20을 초과할경우 다음페이지추가 , 20을 초과할경우
*/ 