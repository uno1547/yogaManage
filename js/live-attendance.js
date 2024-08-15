import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js'
import { getFirestore, collection, addDoc, query, where, getDocs, doc, onSnapshot, updateDoc} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js';
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
/*
await addDoc(collection(db, "open_attendances"), {
  user_id : 5040,
  attend_year : 2024, 
  attend_month : 5, 
  attend_day : 12,
  attend_time : [1, 10, 10],
});
async function upDoc() {
  const docRef = doc(db, "open_attendances", "6viSuQlJ1gyLKPafWna7")
  await updateDoc(docRef, {
    attend_time : [1, 47, 19]
  })
}
async function newDoc() {
  await addDoc(collection(db, "open_attendances"), {
    user_id : 1100,
    attend_year : 2024, 
    attend_month : 5, 
    attend_day : 12,
    attend_time : [1, 54, 10],
  });
}
*/

/*
아래코드는 5초 settimeout 설정해서 데이터 변경하면 실시간으로 반영됨
setTimeout(() => {
  newDoc()
}, 5000)
setTimeout(() => {
  upDoc()
}, 5000);
*/

/*
순서 : 최초 데이터 조회, 정렬, 표시



*/ 
//최초 로딩시의 데이터 조회 및 표시 이후의 갱신은 onsnapshot리스너를 통해가능하다
//(음 하루를 시간대별로 분리해서 수업대별로 출석현황 불러올수도있을듯)
showTodayVisits()
async function showTodayVisits() {
  const todayVisits = await getTodayVisits()
  // console.log(todayVisits);
  const sortedVisits = sortVisits(todayVisits)
  // console.log(sortedVisits);
  const visitsArr = await getVisitInfo(sortedVisits)
  // console.log(visitsArr);
  showVisits(visitsArr)
}
async function getTodayVisits() {
  const todayDate = new Date()
  const [todayYear, todayMonth, todayDay] = [String(todayDate.getFullYear()), String(todayDate.getMonth() + 1).padStart(2, '0'), String(todayDate.getDate()).padStart(2, '0')]
  // console.log(todayYear, todayMonth, todayDay);
  const todayString = `${todayYear}${todayMonth}${todayDay}`
  // const q1 = query(citiesRef, where("state", ">=", "CA"), where("state", "<=", "IN"));
  // const todayQueries = query(collection(db, "open_attendances"), where("attend_year", "==", todayYear), where("attend_month", "==", todayMonth), where("attend_date", "==", todayDay)) 
  const todayQueries = query(collection(db, "new1-attendances"), where("attend_date", "==", todayString)) 
  const querySnapshot = await getDocs(todayQueries);
  const todayVisits = []
  querySnapshot.forEach((doc) => {
    todayVisits.push(doc.data())
  });
  return todayVisits
}
showDate() 
showCurrentTime() 
//5초마다 새로방문있는지 체크하는 interval등록 이제 이렇게 안함
// setInterval(waitForVisit, 2000)

// 오늘날짜에 대한 전체 쿼리에 스냅샷 핸들러 추가 (아마도 변화 있을때 마다 콘솔에 찍혀야함)
/*
const unsubscribe = onSnapshot(query(collection(db, "open_attendances"), where("attend_day", "==", new Date().getDate())), (querySnapshot) => { //이게 핸들러? 같은데 맨처음 불러올때 호출되고, 그이후에는 문서에 변화가 생길때마다 추가되는듯함
  let changes = querySnapshot.docChanges()
  console.log(changes);
  querySnapshot.forEach((doc) => {
    console.log(doc.data());
    showTodayVisits()
    // 변화있을때마다 push, sort, visitInfo ,showVisit까지 이어져야함
  })
})
*/
// const unsubscribe = onSnapshot(query(collection(db, "new1-attendances"), where("attend_date".slice(6), "==", new Date().getDate())), (querySnapshot) => { //이게 핸들러? 같은데 맨처음 불러올때 호출되고, 그이후에는 문서에 변화가 생길때마다 추가되는듯함

// 불러온 출석들에 대해 시간순으로 정렬
function sortVisits(visits) {
  // console.log(visits)
  // const visitTime = visits.attend_time
  // const [time, minute, second] = [visitTime[0], visitTime[1], visitTime[2]]
  /*
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
  */
  visits.sort((a, b) => {
    if(a.attend_time > b.attend_time) {
      return -1
    } else if(a.attend_time < b.attend_time) {
      return 1
    } else {
      return 0 
    }
  })
  return visits
  // getVisitInfo(visits)
}
// 출석배열 받아서 각 출석의 user_id, user_name, vist_time 담은 객체배열 생성
async function getVisitInfo(sortedVisits) {
  // console.log(sortedVisits)
  // const infos = [] // 필요한지 모르겠음
  for (let visit of sortedVisits) { //sortedVisits는 출석객체배열
    // const info = {} // 얘도
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
    // console.log(visitMemberName)
    visit.visit_name = visitMemberName
    /*
    // console.log(getName(visit.user_id).then((res) => visitMemberName = res));
    // .then(() => info.visit_name = visitMemberName) //이과정자체도 비동기면 
    // 프로퍼티가 불러오고나서 할당되는건확실한데, 
    // 프로퍼티가 할당되고나서 배열 infos에 push가 될지 할당안된채로 배열에 push가 될지 말지 확실하지않은건가
    // info.visit_name = visitMemberName
    */
    // info.visit_time = visitTimeStr
    // info.visit_user_id = visit.user_id
    // infos.push(info)
    // info = {visit_time : "10:35:00", visit_user_id : 2212} 일단 여기까지는 만들어지고
    /*
    */
    /*
    //이문장이 여기있어야 음 콘솔에 제대로 찍히는 느낌?
    //이문장이 88번보다 먼저 실행되서 콘솔에 애매하게 찍히는건가, 이것도 순서 보장하려면 
    // then안에 가둬둬야하나
    */
  }
  // console.log(sortedVisits);
  return sortedVisits
  // console.log(infos);
  // return infos
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
//visitInfoArr배열 받아서 html추가 card 및 방문자수
function showVisits(arr) {
  console.log(arr);
  const container = document.querySelector('#attend-pallette')
  container.innerHTML = ``
  for (let visit of arr) {
    const attendCardEl = `
    <div class="attend">
      <div id="visit-name" class="row">
        <div class="text" id="name">회원이름</div>
        <div class="content" id="name">${visit.visit_name}</div>
      </div>
      <div id="visit-user-id" class="row">
        <div class="text" id="user-id">회원번호</div>
        <div class="content" id="user-id">${visit.user_id}</div>
      </div>
      <div id="visit-time" class="row">
        <div class="text" id="time">방문시각</div>
        <div class="content" id="time">${visit.attend_time}</div>
      </div>
    </div>`
    container.innerHTML += attendCardEl
  }
  //방문자들 카드 표시후 방문자수 표시
  let curVisitors = document.querySelectorAll('.attend').length
  const visitNumText = document.querySelector('#class-info .text #visit-num span')
  visitNumText.textContent = `현재 방문자 수는 ${curVisitors}명 입니다.`
}
//현재 날짜 표시 얘도 interval로 해야 정확할듯
function showDate() {
  const dateEl = document.querySelector("#class-info .text #date span")
  const today = new Date()
  const [year, month, date, day] = [today.getFullYear(), today.getMonth(), today.getDate(), today.getDay()]
  const dayArr = ['일', '월', '화', '수', '목', '금', '토']
  const dayStr = dayArr[day]
  dateEl.textContent = `${year}/${month + 1}/${date} ${dayStr}요일`
}
//시각표시 interval시작
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

//아래 waitVisit이랑 checkVisit 대신 realtime으로 해야함
//새로운 방문 갱신,처리,표시하는 interval함수
async function waitForVisit() {
  const newVisits = await checkVisit() // newVisits에 객체배열 반환
  const sortedVisits = sortVisits(newVisits)
  // console.log(newVisits);
  // console.log(sortedVisits);
  const visitInfoArr = await getVisitInfo(sortedVisits)
  showVisits(visitInfoArr)
}
//현재 날짜에 대한 출석 불러오는 함수
//현재 시간대에 대한걸 불러오는게 맞는건가 일단 날짜 일치부터 해결
async function checkVisit() {
  const q = query(collection(db, "open_attendances"), where("attend_day", "==", new Date().getDate()));
  const querySnapshot = await getDocs(q);
  const todayVisits = []
  querySnapshot.forEach((doc) => {
    todayVisits.push(doc.data())
  })
  return todayVisits
}


// const unsub = onSnapshot(todayQueries, (snapShot) => {
//   let changes = snapShot.docChanges()
//   console.log(changes);
// })

// 현재 총 방문자 수
// 한페이지당 표시할수있는 최대 방문자 수 : 20
// 페이지 단추 수
/*
실시간 출석이 20을 초과할경우 다음페이지추가 , 20을 초과할경우
*/ 

const todayDate = new Date()
const [todayYear, todayMonth, todayDay] = [String(todayDate.getFullYear()), String(todayDate.getMonth() + 1).padStart(2, '0'), String(todayDate.getDate()).padStart(2, '0')]
// console.log(todayYear, todayMonth, todayDay);
const todayString = `${todayYear}${todayMonth}${todayDay}`
const unsubscribe = onSnapshot(query(collection(db, "new1-attendances"), where("attend_date", "==", todayString)), (querySnapshot) => { //이게 핸들러? 같은데 맨처음 불러올때 호출되고, 그이후에는 문서에 변화가 생길때마다 추가되는듯함
// const unsubscribe = onSnapshot(query(collection(db, "new1-attendances")), (querySnapshot) => { //이게 핸들러? 같은데 맨처음 불러올때 호출되고, 그이후에는 문서에 변화가 생길때마다 추가되는듯함
  let changes = querySnapshot.docChanges()
  // console.log(changes);
  querySnapshot.forEach((doc) => {
    console.log(doc.data());
    showTodayVisits()
    // 변화있을때마다 push, sort, visitInfo ,showVisit까지 이어져야함
  })
})
/*
*/