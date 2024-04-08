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
/*

*/
//현재 날짜에 해당하는 출석들 모두 조회(음 하루를 시간대별로 분리해서 수업대별로 출석현황 불러올수도있을듯)
const q = query(collection(db, "open_attendances"), where("attend_day", "==", 6));
const querySnapshot = await getDocs(q);
const todayVisits = []
querySnapshot.forEach((doc) => {
  todayVisits.push(doc.data())
});
// console.log(todayVisits);
//조회된 출석들에 대해 시간순 정렬
const sortedVisits = sortVisits(todayVisits)
const visitInfoArr = getVisitInfo(sortedVisits)

// console.log(todayVisits)
// 불러온 출석들에 대해 시간순으로 정렬
function sortVisits(visits) {
  // console.log(visits)
  // const visitTime = visits.attend_time
  // const [time, minute, second] = [visitTime[0], visitTime[1], visitTime[2]]
  visits.sort(function(a, b) {
    // a : 18시 b : 20시
    if (a.attend_time[0] < b.attend_time[0]) { //a의 시간이 b의 시간보다 작으면 
      return -1
    } else if(a.attend_time[0] == b.attend_time[0]) { //a의 시간이 b의시간과 같음 추가비교해야함
      if (a.attend_time[1] < b.attend_time[1]) { //a의 분이 더 작음 
        return -1
      } else if(a.attend_time[1] == b.attend_time[1]) { //a의 분이 b와동일
        if (a.attend_time[2] < b.attend_time[2]) { // a의 초 < b의 초
          return -1
        } else if(a.attend_time[2] == b.attend_time[2]) {
          return 0
        } else {
          return 1
        }
      } else {
        return 1
      }
    } else { //a의 시간이 b보다 크면 
      return 1
    }
  })
  return visits
  // getVisitInfo(visits)
}
// 출석배열 받아서 각 출석의 user_id 및 담은 객체배열 생성
function getVisitInfo(sortedVisits) {
  console.log(sortedVisits)
  const infos = []
  for (let visit of sortedVisits) { //sortedVisits는 출석객체배열
    const info = {}
    // const visit_member = getName(visit.user_id) 
    // 이렇게 하고 싶은데 getName이 비동기 처리라서 그런가 아래 45번에 undefined들어간뒤에, 
    // getName의 response로 온 res 를 visit_member에 할당하기전에
    // 54번의 info.visit_name이 실행돼서 의도했던 getName으로 가져온 비동기 할당이 잘 이루어지지않음
    // 이후에 프로퍼티를 추가하려는데 순서대로 이루어지지않음
    // 51번 진행되고나서, 54번이 진행되길 순서를 보장받고 싶은데, 비동기처리의 특징이라 어쩔수없는건지
    // getName내부에서 저코드를 마지막에 물려서 순서를 만들수밖에 없는지
    
    let visitMemberName
    getName(visit.user_id).then((res) => visitMemberName = res)
    .then(() => info.visit_name = visitMemberName) //이과정자체도 비동기면 
    // 프로퍼티가 할당되는건확실한데, 할당되고나서 배열 infos에 push가 될지말지 확실하지않은건가
    // info.visit_name = visitMemberName
    const visitTimeArr = visit.attend_time.map((el) => String(el).padStart(2, "0"))
    const visitTimeStr = visitTimeArr.join(':')
    info.visit_time = visitTimeStr
    info.visit_user_id = visit.user_id
    console.log(info)
    infos.push(info) //
  }
  console.log(infos);
  return infos
}
//userid로 조회한 name반환
async function getName(userId) {
  let userName
  const q = query(collection(db, "test_members"), where("user_id", "==", userId))
  const querySnapshot = await getDocs(q)
  querySnapshot.forEach((doc) => userName = doc.data().name)
  // console.log(userName)
  return userName
}
//visitInfoArr배열 받아서 html추가
function showVisits(arr) {
  const container = document.querySelector('#')
}
// todayVisits.
// for (let visit of todayVisits) {
//   const visitTime = visit.attend_time
//   const newItem = document.createElement('div')
//   newItem.textContent = visitTime.join(':')
//   newItem.className = "attend"
//   container.appendChild(newItem)
// }

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
  // addVisit()
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