import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js'
import { getFirestore, collection, query, where, getDocs, doc, getDoc, setDoc} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

const app = initializeApp({
  apiKey: "AIzaSyBykm-oqoMvIAjLFWHPnVi_OQ86Iis_NVs",
  authDomain: "yoga-663cb.firebaseapp.com",
  projectId: "yoga-663cb",
  storageBucket: "yoga-663cb.appspot.com",
  messagingSenderId: "256248240983",
  appId: "1:256248240983:web:07dcebbcb04debc34b3c12"
})
//테스트맴버 넣는 코드
/*
await setDoc(doc(db, "test_members", "new_member6"), {
  name : '이서현',
  user_id : 1396,
  gender : 'f',
  birth_date : '2000-05-20',
  phone_number : '010-4780-1396',
  sign_in_date : '2022-12-20',
  group : 'group',
  teacher : '김영원'
});
*/
// 테스트결제 넣는 코드
/*
await setDoc(doc(db, "test_payments", 'new_payment9'), {
  user_id : 2546,
  pay_year : 2024,
  pay_month : 1,
  pay_day : 1,
  pay_fee : 300000,
  pay_method : "cash",
  pay_teacher : "김영원",
  pay_class : {
    class_type : "그룹레슨",
    times_a_week : 3,
    class_term : 3,
    class_fee : 300000,
    status : "valid"
  }
});
*/
//테스트출석 넣는코드
/*
await setDoc(doc(db, "test_attendance", 'new_attendance4'), {
  user_id : 9928,
  attend_year : 2024,
  attend_month : 2,
  attend_day : 28,
  attend_time : "19:55:12",
});
*/

const db = getFirestore(app)
// firestore에서 (test_members)멤버정보받아와 전역배열에담음
const memberQueries = await getDocs(collection(db, "test_members"))
const members = [] 
memberQueries.forEach((doc) => {
members.push(doc.data())
})
members.sort((a, b) => a.name.localeCompare(b.name)) // 가나다순 정렬
// members = [{김윤오}, {성주휘}, {이지영}]

let currentMember = members[0] //먼저 첫번째 회원담고 기본정보,출결현황,결제내역을 표시!!
let currentMemberID = currentMember.user_id 

let currentMemberPayments = []
let currentMemberAttendance = []
//현재회원의 userid로 조회한 결제내역들 불러옴
const payQueries = query(collection(db, "test_payments"), where("user_id", "==", currentMemberID))
const payDocs = await getDocs(payQueries)
payDocs.forEach((doc) => currentMemberPayments.push(doc.data()))
console.log(currentMemberPayments)
//현재회원의 userid로 조회한 출석내역들 불러옴
const attendQueries = query(collection(db, "test_attendance"), where("user_id", "==", currentMemberID))
const attendDocs = await getDocs(attendQueries)
attendDocs.forEach((doc) => currentMemberAttendance.push(doc.data()))
console.log(currentMemberAttendance)

Viewer(currentMember, currentMemberID)
function Viewer(member, id) {
  showMemberInfo(member)
  showMemberClass(currentMemberPayments)
  showMemberPayments(currentMemberPayments)
  showMemberAttendane(currentMemberAttendance)
}
function showMemberInfo(member) { //얘도 그냥 innerText += 로 바꾸자
  for (let prop in member) {
    let liEl = document.querySelector(`li.${prop}`)
    if ((liEl.classList.contains('name')) || (liEl.classList.contains('gender'))) {
      let span = liEl.querySelector(`span#${prop}`)
      prop == "gender" ? span.textContent = `[${member[prop]}]` : span.textContent = member[prop]
    } else {
      liEl.textContent = member[prop]
    }
  }
}
//  결제내역중 가장최근 결제에대한 pay_class표시
function showMemberClass(payments) {
  payments.sort(function(a, b) { // 음수 > 
    if (a.pay_year > b.pay_year) { // 24년 ~ >= 23년 ~
      return -1
    } else if (a.pay_year == b.pay_year) { //24년 ~ == 24년 ~
      if (a.pay_month > b.pay_month) { //24년9월~ > 24년7월~
        return -1
      } else if (a.pay_month == b.pay_month) { //24년9월 == 24년9월
        if (a.pay_day > b.pay_day) {// 24년9월20일 > 24년9월10일
          return -1
        } else if(a.pay_day == b.pay_day) {//24년9월10일 == 24년9월10일
          return -1
        } else { // 24년9월10일 < 24년9월20일
          return 1
        }
      } else { //24년9월 <24년10월
        return 1
      }
    } else {//23년~ < 24년~
      return 1
    }
  })
  // console.log(payments)
  let recentPay = payments[0]
  // console.log(recentPay)
  const classLi = document.querySelector("ul#info-val li.class")
  classLi.innerHTML = `<span>${recentPay.pay_class.class_type}</span><span>주${recentPay.pay_class.times_a_week}회</span><span>[${recentPay.pay_class.class_term}개월]</span>`
}
//해당회원의 모든결제정보불러와서 내역목록표시
function showMemberPayments(payments) {
  const listArea = document.querySelector('#payment-vals')
  const ulEl = document.createElement('ul')
  ulEl.classList.add("payment")
  let innerHtml = ''
  for (let i = 0; i < payments.length; i++) {
    let payment = payments[i]
    let payDate = new Date(payment.pay_year, payment.pay_month-1, payment.pay_day)
    let expireDate = payDate
    payDate = payDate.toLocaleDateString()
    // console.log(payDate)
    expireDate.setMonth(expireDate.getMonth() + payment.pay_class.class_term)
    expireDate = expireDate.toLocaleDateString()
    // console.log(expireDate)
    let liEls = `
    <ul class = "payment">
    <li>${i+1}</li>
    <li>${payment.pay_year}. ${payment.pay_month}. ${payment.pay_day}</li>
    <li>${payment.pay_class.class_type} 주${payment.pay_class.times_a_week}회 [${payment.pay_class.class_term}개월]</li>
    <li>${payment.pay_class.status}</li>
    <li>${payDate} ~ ${expireDate}</li>
    <li>${payment.pay_fee}</li>
    </ul>
    `
    innerHtml += liEls
    listArea.innerHTML = innerHtml
  }
}
function showMemberAttendane(attendances) { //attendance객체 배열 매개변수로 받아서 
  let attendEvents = []
  attendances.forEach((attendance) => {
    let event = {}
    let atMonth = String(attendance.attend_month).padStart(2, "0")
    let atDay = String(attendance.attend_day).padStart(2, "0")
    let date = `${attendance.attend_year}-${atMonth}-${atDay}`
    event.start = date
    event.end = date
    event.display = 'background'
    event.color = '#8fdf82'
    attendEvents.push(event)
  })
  const calendarEl = document.querySelector('#attend-calender')
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView : 'dayGridMonth',
    buttonText : {
      today : '오늘'
    },
    headerToolbar : {
      start : 'today',
      center : 'title',
      end : 'prev,next'
    },
    events : attendEvents,
  })
  calendar.render()
}