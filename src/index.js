import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js'
import { getFirestore, collection, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js'
//firebase app객체 만들고 실행
const app = initializeApp({
  apiKey: "AIzaSyBykm-oqoMvIAjLFWHPnVi_OQ86Iis_NVs",
  authDomain: "yoga-663cb.firebaseapp.com",
  projectId: "yoga-663cb",
  storageBucket: "yoga-663cb.appspot.com",
  messagingSenderId: "256248240983",
  appId: "1:256248240983:web:07dcebbcb04debc34b3c12"
})
//여기다가 두니깐 달력출력안됌
document.addEventListener('DOMContentLoaded', function () {
  console.log('loaded')
})
const db = getFirestore(app)
let q = query(collection(db, "payments"), where("pay_year", "==", getDate()[0])) //현재날짜의 '년도' 일치하는쿼리
q = query(collection(db, "payments"), where("pay_month", "==", getDate()[1])) //현재날짜의 '월' 일치하는쿼리
q = query(collection(db, "payments"), where("pay_day", "<=", getDate()[2])) //현재날짜의'일'이전 일치하는쿼리
const querySnapshot = await getDocs(q)
const sales = getDaySales(querySnapshot)
console.log(sales)
const event = getEvents(sales)
console.log(event)

//캘린더에 일일매출을 표시해서 출력
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
  events : event,
  eventColor : 'rgb(167, 167, 167)',
  eventTextColor : 'black'
})
calendar.render()
// })

//현재 날짜에대한 [년, 월, 일]을 반환
function getDate() {
  let date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  // month = String(month).padStart(2, '0')
  let day = date.getDate()
  // console.log(year, month, day)
  return [year, month, day]
}
//쿼리를 받아 일별누적매출 담긴 일반객체배열로 반환
function getDaySales(queries) {
  let paymentArr = []
  queries.forEach((doc) => { 
    let pay = {
      pay_year : doc.data().pay_year,
      pay_month : doc.data().pay_month,
      pay_day : doc.data().pay_day,
      fee : doc.data().fee,
    }
    paymentArr.push(pay)
  })
  //위에서 현재'일' 까지의 모든결제내역을 가져옴 
  //아래에서 '일'별로 누적결제내역을구함
  // console.log(...paymentArr) //정상 객체배열형태로 변환
  let daySales = []
  for(let ob of paymentArr) {
    let prevSum = daySales.find((el) => el.pay_day == ob.pay_day)
    if (!prevSum) {
      daySales.push(ob)
    } else {
      prevSum.fee += ob.fee
    }
  }
  // console.log(...daySales)
  return daySales
}
//날짜별로 이벤트객체배열 반환
function getEvents(daySale) {
  let events = []
  for (let sale of daySale) {
    // console.log(sale)
    let month = String(sale.pay_month).padStart(2, '0')
    let day = String(sale.pay_day).padStart(2, '0')
    let feeSum = sale.fee
    let evt = {
      title : `누적매출 : ${feeSum}`,
      start : `2024-${month}-${day}`,
      end : `2024-${month}-${day}`,
    }
    events.push(evt)
    // console.log(events)
  }
  return events
}
