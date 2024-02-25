import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js'
import { getFirestore, collection, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js'
//firebase app객체 만들고 실행!
const app = initializeApp({
  apiKey: "AIzaSyBykm-oqoMvIAjLFWHPnVi_OQ86Iis_NVs",
  authDomain: "yoga-663cb.firebaseapp.com",
  projectId: "yoga-663cb",
  storageBucket: "yoga-663cb.appspot.com",
  messagingSenderId: "256248240983",
  appId: "1:256248240983:web:07dcebbcb04debc34b3c12"
})
//페이지 로드시 현재 날짜를 따서, 이번달 달력에 현재 날짜까지 표시
document.addEventListener('DOMContentLoaded', function () {
  let currentDate = getDate() //현재 날짜 [02, 26]
  let eventsArr = getEvents(...currentDate) //event객체배열 
  console.log(eventsArr)

  const calendarEl = document.querySelector('.calender')
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView : 'dayGridMonth',
    buttonText : {
      today : '오늘'
    },
    headerToolbar : {
      start : '',
      center : 'title'
    },
    events : eventsArr
  })
  calendar.render()
})

//현재 날짜에대한 [월, 일]을 반환
function getDate() {
  let date = new Date()
  let month = date.getMonth() + 1
  month = String(month).padStart(2, '0')
  let day = date.getDate()
  return [month, day]
}
//날짜별로 이벤트객체배열 반환
function getEvents(month, day) {
  console.log(month, day)
  let events = []
  //1일부터 day일 까지의 event객체 배열을 생성후 반환
  for(let i = 1; i <= day; i++) {
    let evt = {
      title : `누적매출 : ${i}`,
      start : `2024-${month}-${String(i).padStart(2, '0')}`,
      end : `2024-${month}-${String(i).padStart(2, '0')}`
    }
    events.push(evt)
  }
  return events
}
const db = getFirestore(app)
const q = query(collection(db, "payments"), where("pay_day", "<=", 11)); //현재날짜 이전의 모든 결제내역이 담긴 배열
const querySnapshot = await getDocs(q);
// console.log(querySnapshot)
getDaySales(querySnapshot)
function getDaySales(queries) {
  let arrTofunc = []
  queries.forEach((doc) => { 
    let pay = {
      pay_month : doc.data().pay_month,
      pay_day : doc.data().pay_day,
      pay_fee : doc.data().fee,
    }
    arrTofunc.push(pay)
    // doc.data() is never undefined for query doc snapshots
    // console.log(doc.id, " => ", doc.data());
    // console.log(doc.data().fee)
  })
  console.log(arrTofunc) //정상 객체배열형태로 변환
  for(a of arrTofunc) {
    console.log(a)
    let sale = {}
    if (sale.pay_day) {
      console.log(sale)
    }
  }
}

/*
async function getFsMember() {
  const db = getFirestore(app)
  const q = query(collection(db, "payments"), where("pay_date", ">=", 20));
  let sum = 0
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    console.log(doc.data().fee)
    sum += doc.data().fee
  });
  return sum
}
*/
//결제내역 배열을 받아 날짜별로 일매출을 저장후 반환
