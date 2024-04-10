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
const container = document.querySelector('#attend-pallette')
//조회된 출석들에 대해 시간순 정렬
const sortedVisits = sortVisits(todayVisits)
const visitInfoArr = await getVisitInfo(sortedVisits)
showVisits(visitInfoArr)
showDate() //현재 날짜 표시
showCurrentTime() //시각표시 interval시작

function showDate() {
  const dateEl = document.querySelector("#class-info .text #date span")
  const today = new Date()
  const [year, month, date, day] = [today.getFullYear(), today.getMonth(), today.getDate(), today.getDay()]
  const dayArr = ['일', '월', '화', '수', '목', '금', '토']
  const dayStr = dayArr[day]
  dateEl.textContent = `${year}/${month + 1}/${date} ${dayStr}요일`
}
function showCurrentTime() {
  const clockEl = document.querySelector("#class-info .text #clock span")
  const now = new Date()
  clockEl.textContent = `현재시각 : ${String(now.getHours()).padStart(2, '0')} : ${String(now.getMinutes()).padStart(2, '0')} : ${String(now.getSeconds()).padStart(2, '0')}`
  setInterval(() => {
    const now = new Date()
    const [hour, minute, second] = [String(now.getHours()).padStart(2, '0'), String(now.getMinutes()).padStart(2, '0'), String(now.getSeconds()).padStart(2, '0')]
    clockEl.textContent = `현재시각 : ${hour} : ${minute} : ${second}`
  }, 1000);
}
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
// 출석배열 받아서 각 출석의 user_id, user_name, vist_time 담은 객체배열 생성
async function getVisitInfo(sortedVisits) {
  // console.log(sortedVisits)
  const infos = []
  for (let visit of sortedVisits) { //sortedVisits는 출석객체배열
    const info = {}
    /*
    // const visit_member = getName(visit.user_id) 
    // 이렇게 하고 싶은데 getName이 비동기 처리라서 그런가 아래 45번에 undefined들어간뒤에, 
    // getName의 response로 온 res 를 visit_member에 할당하기전에
    // 54번의 info.visit_name이 실행돼서 의도했던 getName으로 가져온 비동기 할당이 잘 이루어지지않음
    // 이후에 프로퍼티를 추가하려는데 순서대로 이루어지지않음
    // 51번 진행되고나서, 54번이 진행되길 순서를 보장받고 싶은데, 비동기처리의 특징이라 어쩔수없는건지
    // getName내부에서 저코드를 마지막에 물려서 순서를 만들수밖에 없는지
    */
    let visitMemberName = await getName(visit.user_id)
    console.log(visitMemberName)
    info.visit_name = visitMemberName
    /*
    // console.log(getName(visit.user_id).then((res) => visitMemberName = res));
    // .then(() => info.visit_name = visitMemberName) //이과정자체도 비동기면 
    // 프로퍼티가 불러오고나서 할당되는건확실한데, 
    // 프로퍼티가 할당되고나서 배열 infos에 push가 될지 할당안된채로 배열에 push가 될지 말지 확실하지않은건가
    // info.visit_name = visitMemberName
    */
    const visitTimeArr = visit.attend_time.map((el) => String(el).padStart(2, "0"))
    const visitTimeStr = visitTimeArr.join(' : ')
    info.visit_time = visitTimeStr
    info.visit_user_id = visit.user_id
    infos.push(info)
    // info = {visit_time : "10:35:00", visit_user_id : 2212} 일단 여기까지는 만들어지고
    /*
    */
    /*
    //이문장이 여기있어야 음 콘솔에 제대로 찍히는 느낌?
    //이문장이 88번보다 먼저 실행되서 콘솔에 애매하게 찍히는건가, 이것도 순서 보장하려면 
    // then안에 가둬둬야하나
    */
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
  const container = document.querySelector('#attend-pallette')
  for (let visit of arr) {
    const attendCardEl = `
    <div class="attend">
      <div id="visit-name" class="row">
        <div class="text" id="name">회원이름</div>
        <div class="content" id="name">${visit.visit_name}</div>
      </div>
      <div id="visit-user-id" class="row">
        <div class="text" id="user-id">회원번호</div>
        <div class="content" id="user-id">${visit.visit_user_id}</div>
      </div>
      <div id="visit-time" class="row">
        <div class="text" id="time">방문시각</div>
        <div class="content" id="time">${visit.visit_time}</div>
      </div>
    </div>`
    container.innerHTML += attendCardEl
  }
  //방문자들 카드 표시후 방문자수 표시
  let curVisitors = document.querySelectorAll('.attend').length
  const visitNumText = document.querySelector('#class-info .text #visit-num span')
  visitNumText.textContent = `현재 방문자 수는 ${curVisitors}명 입니다.`
}

async function addVisit() {
  const date = new Date()
  const [attend_year, attend_month, attend_day] = [date.getFullYear(),date.getMonth() + 1, date.getDate()]
  // const attend_time = date.toLocaleTimeString()
  console.log(attend_year, attend_month, attend_day, attend_time);
  const attend_time = [date.getHours(), date.getMinutes(), date.getSeconds()]

}

// 현재 총 방문자 수
// 한페이지당 표시할수있는 최대 방문자 수 : 20
// 페이지 단추 수
/*
실시간 출석이 20을 초과할경우 다음페이지추가 , 20을 초과할경우
*/ 