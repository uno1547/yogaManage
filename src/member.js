import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js'
import { getFirestore, collection, query, where, getDocs, doc, getDoc, setDoc, addDoc} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

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
await setDoc(doc(db, "test_payments", 'new_payment12'), { // id 명시해줘야함
  user_id : 7381,
  pay_year : 2024,
  pay_month : 4,
  pay_day : 19,
  pay_fee : 300000,
  pay_method : "cash",
  pay_teacher : "김영원",
  pay_class : {
    class_type : "그룹레슨",
    times_a_week : 1,
    class_term : 1,
    class_fee : 300000,
    status : "valid"
  }
});
*/
//테스트출석 넣는코드
/*
await setDoc(doc(db, "test_attendance", 'new_attendance12'), {
  user_id : 7381,
  attend_year : 2024,
  attend_month : 3,
  attend_day : 26,
  attend_time : "08:15:13",
});
*/
const buttons = document.querySelector("#personal-data .buttons")
const prevBtn = buttons.querySelector("#prevMember")
const nextBtn = buttons.querySelector("#nextMember")
const toUpdateBtn = buttons.querySelector("#update-info")
prevBtn.addEventListener('click', function () {
  if (currentMemberIndex == 0) {
    currentMemberIndex = members.length - 1
  } else {
    currentMemberIndex -= 1
  }
  currentMember = members[currentMemberIndex]
  currentMemberID = currentMember.user_id
  // console.log(`현재멤버 : 멤버의 index${currentMemberIndex} 멤버의 ID${currentMemberID}`);
  getQueries(currentMemberID)
})
nextBtn.addEventListener('click', function () {
  // console.log(members);
  currentMemberIndex = Math.abs((currentMemberIndex + 1) % members.length)
  currentMember = members[currentMemberIndex]
  currentMemberID = currentMember.user_id
  // console.log(`현재멤버 : 멤버의 index${currentMemberIndex} 멤버의 ID${currentMemberID}`);
  getQueries(currentMemberID)
})
toUpdateBtn.addEventListener('click', function () {
  console.log(currentMemberID);
  // const want = prompt('이동할래?')
  // want ? location.href = `/src/update-info.html?user_id=${currentMemberID}` : 0
  location.href = `/src/update-info.html?user_id=${currentMemberID}`
})

const signUpBtn = document.querySelector(".update #sign-up")
const newPayBtn = document.querySelector(".update #new-pay")
const atdBtn = document.querySelector(".update #attendance-update")
signUpBtn.addEventListener('click', function() {
  location.href = "/src/new-member.html"
})
newPayBtn.addEventListener('click', function() {
  location.href = `/src/new-payment.html?user_id=${currentMemberID}`
})

const db = getFirestore(app)
/*
await addDoc(collection(db, "test_payments"), {
  user_id : 4385,
  pay_year : 2024,
  pay_month : 3,
  pay_day : 14,
  pay_fee : 100000,
  pay_method : "cash",
  pay_teacher : "김영원",
  pay_class : {
    class_type : "그룹레슨",
    times_a_week : 1,
    class_term : 1,
    class_fee : 100000,
    status : "valid"
  }
});

await addDoc(collection(db, "test_attendance"), {
  user_id : 4385,
  attend_year : 2024,
  attend_month : 3,
  attend_day : 14,
  attend_time : "08:15:13",
});
*/
// firestore에서 (test_members)멤버정보받아와 전역배열에담음
/* async 함수 내부에서도 쓸수있는것같은데 아직 어떻게 쓰는건지 감이 안옴
async function getMemQueries() {
  const memQ = await getDocs(collection(db, "test_members"))
  const members = []
  memQ.forEach((doc) => members.push(doc.data()))
  return members
}
const pr = getMemQueries()
console.log(pr);
pr.then((data) => console.log(data))
console.log(33333);
*/
//
const memberQueries = await getDocs(collection(db, "test_members"))
// 전역에 멤버 배열 !!!
const members = [] 
memberQueries.forEach(doc => members.push(doc.data()))
members.sort((a, b) => a.name.localeCompare(b.name)) // 가나다순 정렬
// console.log(members);

let currentMember = members[0] //먼저 첫번째 회원담고 기본정보,출결현황,결제내역을 표시!!
let currentMemberIndex = members.indexOf(currentMember)
let currentMemberID = currentMember.user_id 
console.log(currentMember,`멤버의index ${currentMemberIndex} 멤버id${currentMemberID}`);

let currentMemberPayments = []
let currentMemberAttendance = []
//현재회원의 userid로 조회한 결제내역들 불러옴
const payQueries = query(collection(db, "test_payments"), where("user_id", "==", currentMemberID))
const payDocs = await getDocs(payQueries)
payDocs.forEach((doc) => currentMemberPayments.push(doc.data()))

//현재회원의 userid로 조회한 출석내역들 불러옴
const attendQueries = query(collection(db, "test_attendance"), where("user_id", "==", currentMemberID))
const attendDocs = await getDocs(attendQueries)
attendDocs.forEach((doc) => currentMemberAttendance.push(doc.data()))

viewer(currentMember, currentMemberPayments, currentMemberAttendance)
// async 함수 이건 그냥 반복호출을위해 함수가 필요해서 한느낌 promise then을 가독성 좋게 하기위함은 아닌듯 이제보니
async function getQueries(userid) {
  currentMemberPayments = []
  currentMemberAttendance = []
  console.log('결제 :', currentMemberPayments);
  console.log('출석 :', currentMemberAttendance);
  const payQueries = query(collection(db, "test_payments"), where("user_id", "==", userid))
  const attendQueries = query(collection(db, "test_attendance"), where("user_id", "==", userid))
  const payDocs = await getDocs(payQueries)
  payDocs.forEach((doc) => currentMemberPayments.push(doc.data()))
  const attendDocs = await getDocs(attendQueries)
  attendDocs.forEach((doc) => currentMemberAttendance.push(doc.data()))
  console.log('결제 :', currentMemberPayments);
  console.log('출석 :', currentMemberAttendance);
  viewer(currentMember, currentMemberPayments, currentMemberAttendance)
}
function viewer(member, payments, attendances) {
  // console.log(member);
  showMemberInfo(member)
  showMemberClass(payments)
  // console.log(payments); // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  showMemberPayments(payments)
  showMemberAttendane(attendances)
}
function showMemberInfo(member) {
  for (let prop in member) {
    let tdEl = document.querySelector(`td.${prop}`)
    // console.log(tdEl)
    if (prop == "gender") {
      document.querySelector(".gender-span").textContent = `[${member[prop]}]`
    } else if (prop == "name"){
      document.querySelector(".name-span").textContent = member[prop]
    } else if(prop == "group") {
      switch(member[prop]) {
        case "group":
          tdEl.textContent = "그룹레슨"
          break
        case "misole":
          tdEl.textContent = "마이솔"
          break
        case "pt":
          tdEl.textContent = "개인레슨"
          break
      }
    } else {
      tdEl.textContent = member[prop]
    }
  }
}
//결제내역중 가장최근 결제에대한 pay_class표시
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
  console.log(recentPay)
  const classTd = document.querySelector("table.info td.class")
  if (recentPay) {
    classTd.innerHTML = `<span>${recentPay.pay_class.class_type}</span><span> 주${recentPay.pay_class.times_a_week}회</span><span> [${recentPay.pay_class.class_term}개월]</span>`
  } else {
    classTd.innerHTML = `등록된 수업이없습니다`
  }
}
//해당회원의 모든결제정보불러와서 내역목록표시
function showMemberPayments(payments) {
//payments = [{}, {}, {}, {}]
  let tableArea = document.querySelector('table.val')
  tableArea.innerHTML = ""
  for (let i = 0; i < payments.length; i++) {
    let payment = payments[i]
    let [classType, classPerWeek, classTerm] = [payment.pay_class.class_type, payment.pay_class.times_a_week, payment.pay_class.class_term]
    let payDate = new Date(payment.pay_year, payment.pay_month - 1, payment.pay_day)
    let expireDate = payDate
    payDate = payDate.toLocaleDateString().slice(0, -1)
    expireDate.setMonth(expireDate.getMonth() + payment.pay_class.class_term)
    expireDate = expireDate.toLocaleDateString().slice(0, -1)
    let fee = String(payment.pay_fee)
    let commaFormattedFee = getCommaFormattedNumbers(fee)
    const trEls = `
    <tr>
      <td>${i + 1}</td>
      <td>${payDate}</td>
      <td>${classType} 주 ${classPerWeek}회 [${classTerm}개월]</td>
      <td>${payDate} ~ ${expireDate}</td>
      <td>${payment.pay_class.status}</td>
      <td>${commaFormattedFee} 원</td>
    </tr>
    `
    tableArea.innerHTML += trEls
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
function getCommaFormattedNumbers(fee) {
  const characters = []
  for (let i = 0; i < fee.length; i++) {
    const curIndex = fee.length - 1 - i
    const remainder = i % 3
    if (remainder === 0) {
      if (i !== 0) {
        characters.push(",")
      }
    }
    characters.push(fee[curIndex])
  }
  return characters.reverse().join('')
}
function getComma(fee) {
  const characters = []
  for (let i = 0; i < fee.length; i++) {
    const curIndex = fee.length - 1 - i
    const remainder = i % 3
    if (remainder === 0) {
      if (curIndex !== fee.length - 1) {
        characters.push(',')
      }
    }
    characters.push(fee[curIndex])
    console.log(characters);
  }
  console.log(characters.reverse().join(''));
}
function getComma1(fee) {
  const characters = []
  let cnt = 0
  for (let j = fee.length - 1; j >= 0; j--) {
    cnt++
    characters.push(fee[j])
    if (cnt == 3 && j != 0) {
      characters.push(",")
      cnt = 0
    }
  }
  console.log(characters.reverse().join(''));
}
function getComma2() {
  let fee = String(300000000000)
  let nor = []
  for (let j = fee.length - 1; j >= 0; j--) {
    // console.log(`${j}번째 문자`);
    nor.push(fee[j]) 
    if (fee.length % 3 == 0) { //길이가 3의 배수
      if (j != 0) {
        j % 3 == 0 ? nor.push(',') : 0
      }
    } else { // 이외
      // j == 3n + (l % 3)
      (j - (fee.length % 3)) % 3 == 0 ? nor.push(',') : 0
    }
  }
  fee = nor.reverse().join('')
}
