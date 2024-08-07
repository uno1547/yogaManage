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
/*
//무작위 id의 결제추가
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
//무작위 id의 출석추가
await addDoc(collection(db, "test_attendance"), {
  user_id : 4385,
  attend_year : 2024,
  attend_month : 3,
  attend_day : 14,
  attend_time : "08:15:13",
});
*/
// con
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
  getQueries(currentMemberID)
})
nextBtn.addEventListener('click', function () {
  currentMemberIndex = Math.abs((currentMemberIndex + 1) % members.length)
  currentMember = members[currentMemberIndex]
  currentMemberID = currentMember.user_id
  getQueries(currentMemberID)
})
toUpdateBtn.addEventListener('click', function () {
  location.href = `/src/update-info.html?user_id=${currentMemberID}`
})

const signUpBtn = document.querySelector(".update #sign-up")
const newPayBtn = document.querySelector(".update #new-pay")
const atdBtn = document.querySelector(".update #attendance-update")
const expireBtn = document.querySelector(".update #show-expire")
signUpBtn.addEventListener('click', function() {
  location.href = "/src/new-member.html"
})
newPayBtn.addEventListener('click', function() {
  location.href = `/src/new-payment.html?user_id=${currentMemberID}`
})
atdBtn.addEventListener('click', function() {
  location.href = `/src/live-attendance.html`
})
expireBtn.addEventListener('click', function() {
  window.open('/src/expire-members.html', 'expire-popup' ,'popup, width=1000, height=1000, top=200, left=200')
  // window.open("https://www.mozilla.org/", "mozillaTab");
  // window.open("https://www.mozilla.org/", "mozillaWindow", "popup");

})


const db = getFirestore(app)
// firestore에서 (test_members)멤버정보받아와 전역배열에담음
const memberQueries = await getDocs(collection(db, "test_members"))
// 전역에 멤버 배열 !!!
const members = [] 
memberQueries.forEach(doc => members.push(doc.data()))
members.sort((a, b) => a.name.localeCompare(b.name)) // 가나다순 정렬
// [{}, {}, {}, {}]

let currentMember = members[0] //먼저 첫번째 회원담고 기본정보,출결현황,결제내역을 표시!!
let currentMemberIndex = members.indexOf(currentMember) //****이거 선언을 여기서했는데 맨위에 addEventlistener에서 사용가능한 이유가 뭐임? 이벤트 루프의 그 콜스택말고 큐로 들어가서 처리되서 그런건가!!
let currentMemberID = currentMember.user_id 
getQueries(currentMemberID)


// userId로 pay, attend 미리 다 불러옴
async function getQueries(userid) {
  const currentMemberPayments = []
  const currentMemberAttendance = []
  const payQueries = query(collection(db, "open_payments"), where("user_id", "==", userid))
  const attendQueries = query(collection(db, "open_attendances"), where("user_id", "==", userid))
  const payDocs = await getDocs(payQueries)
  payDocs.forEach((doc) => currentMemberPayments.push(doc.data()))
  const attendDocs = await getDocs(attendQueries)
  attendDocs.forEach((doc) => currentMemberAttendance.push(doc.data()))
  viewer(currentMember, currentMemberPayments, currentMemberAttendance)
}

function viewer(member, payments, attendances) {
  // console.log(payments);
  showMemberInfo(member)
  showMemberClass(payments)
  // console.log(payments); // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  showMemberPayments(payments)
  showMemberAttendance(attendances)
}
// member 객체를 돌면서, 수강정보를 제외한 기본정보 표시
function showMemberInfo(member) {
  for (let prop in member) {
    let tdEl = document.querySelector(`td.${prop}`)
    if (prop == "gender") {
      document.querySelector(".gender-span").textContent = `[${member[prop]}]`
    } else if (prop == "name"){
      document.querySelector(".name-span").textContent = member[prop]
    } else if(prop == "group") { // 이것도 사실 한글로 해도 상관없을듯 
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

// 수강정보 표시(by 결제내역의 pay_class)
function showMemberClass(payments) {
  // 결제일 순으로 정렬하고 맨첫번째요소(가장 최근 결제 건에 대해서만 만기 여부를 확인)
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
  /////////////////////////////////////////////////////

  /////////////////////////////////////////////////////
  // 가장 최근의 결제에 대해서 텍스트 강조 표시 변경
  let recentPay = payments[0]
  // 아래 showPayments에서 어차피 결제일 기준으로 정렬해야하므로, recentPay = payments[0] 써도 무방할듯 최상단에서 db에서 불러올때도, user_id에 대해 일단 다 불러오긴해야함
  console.log(recentPay)
  const classTd = document.querySelector("table.info td.class")
  if (recentPay) {
    let typeStr
    if (recentPay.pay_class.class_type == "group") {
      typeStr = "요가"
    } else { //멤버의 그룹이랑 요가랑 무슨상관인지 모르겠음 < 애초에 멤버의 그룹은 상관없는데?
      typeStr = "개인레슨"
    }
    // classTd.innerHTML = `<span>${typeStr}</span><span> 주${recentPay.pay_class.times_a_week}회</span><span> [${recentPay.pay_class.class_term}개월]</span> \n <span></span>`
    // 여기서 만료여부 표시는 가장최근 결제에 대해서만 수행하면된다. 그래도 문제가 없음
    // 존재하는 제일 최근 결제내역(수업)의 만료여부에 따라 표시 변경
    /*
    제일 최근 결제의 만료일이 오늘기준 15일 이내라면 ex) today : 24/07/12 > 만료일이 07/12 ~ 07/27 사이라면 
    
    */
    let payDate = getDateString(recentPay)[0]
    let expireDate = getDateString(recentPay)[1]
    // console.log();
    const term = getTermToday(recentPay)
    console.log(term);
    if((term <= 15) && (term >= 0)) { //만기일이 15일 이내라면
      classTd.innerHTML = `${typeStr} 주 ${recentPay.pay_class.times_a_week}회 [${recentPay.pay_class.class_term}개월] <br> <span class = "small-date alert">${payDate} ~ ${expireDate} [만기 ${term}일전]</span>`
    } else { //여유있을경우
      classTd.innerHTML = `${typeStr} 주 ${recentPay.pay_class.times_a_week}회 [${recentPay.pay_class.class_term}개월] <br> <span class = "small-date">${payDate} ~ ${expireDate}</span>`
    }
  } else {
    classTd.innerHTML = `등록된 수업이없습니다<br><span class = "small-date">수업을 등록해주세요</span>`
  }
}
// 특정 결제에 대해 '결제날짜', '수강기간'으로 '수강 만료 날짜'를 반환
function getDateString(payment) {
  //setMonth 는 Date객체에 대해 사용하면, 초과한 월에 대해 년도 에도 반영이된다.
  const payDate = new Date(payment.pay_year, payment.pay_month - 1, payment.pay_day)
  const payDateStr = payDate.toLocaleDateString().slice(0, -1)
  let expireDate = payDate
  // 기존의 payDate 에서 class_term 개월수 만큼 추가한 expireDate생성
  expireDate.setMonth(payDate.getMonth() + payment.pay_class.class_term)
  const expireDateStr = expireDate.toLocaleDateString().slice(0, -1)
  // console.log([payDateStr, expireDateStr]);
  return [payDateStr, expireDateStr]
}
/*
*/
// 현재 회원이 수강중인 항목(결제) 에대해 만료일이 다가오면 만기예정 알수있게 표현
function checkExpireCome(expireDateStr) { //expireDate = "2024. 7. 9"
  // 두 날짜의 일수 차이를 구함
  const expireDateEls = expireDateStr.split('. ').map((val) => val.padStart(2, '0'))
  const expireTime = new Date(expireDateEls.join('-')).getTime()
  // const expireTime = new Date('2024-06-22').getTime()
  const todayTime = new Date().getTime()
  const diffSec = expireTime - todayTime
  const diffDate = Math.floor(Math.abs(diffSec / (1000 * 60 * 60 * 24)))
  // 만기일이 일주일 이내면 true반환
  // console.log(diffDate);
  return diffDate <= 30 ? [true, diffDate] : false
}
// 현재 날짜, 만료일까지 남은 날짜를 반환해줌
function getTermToday(pay) { // 현재 날짜기준 결제만료일이몇일 남았는지 구하기위함
  const today = new Date()
  const expDate = new Date(pay.pay_year, pay.pay_month - 1, pay.pay_day)
  expDate.setMonth(expDate.getMonth() + pay.pay_class.class_term)
  console.log(today.toLocaleDateString(), expDate.toLocaleDateString());
  expDate.setHours(23)
  expDate.setMinutes(59)
  expDate.setMinutes(59)
  
  const diffSec = expDate.getTime() - today.getTime()
  const diffDate = Math.floor(diffSec / (1000 * 60 * 60 * 24))
  // const diffDate = (diffSec > 0) ? Math.floor(diffSec / (1000 * 60 * 60 * 24)) + 1 : parseInt(diffSec / (1000 * 60 * 60 * 24))
  // const diffDate = Math.floor(Math.abs(diffSec / (1000 * 60 * 60 * 24)))
  // const diffDate = Math.floor((diffSec / (1000 * 60 * 60 * 24)))
  // const diffDate = (diffSec / (1000 * 60 * 60 * 24))
  // console.log(diffDate,'일');
  return diffDate
}

//해당회원의 모든결제정보불러와서 내역목록표시
function showMemberPayments(payments) {
//payments = [{}, {}, {}, {}]
  let tableArea = document.querySelector('table.val')
  tableArea.innerHTML = ""
  if(payments.length == 0) {
    tableArea.innerHTML += `<span id = "empty">결제내역이 없습니다</span>`
    return
  }
  for (let i = 0; i < payments.length; i++) {
    //모든 결제에 대하여 순회하면서 정보 표시후 추가
    // 결제일 순으로 정렬되어있으므로, 제일 최근 결제에 대해서만 만료검사
    let payment = payments[i]
    let [classType, classPerWeek, classTerm] = [payment.pay_class.class_type, payment.pay_class.times_a_week, payment.pay_class.class_term]

    if (classType == 'group') {
      classType = '요가'
    } else {
      classType = '개인레슨'
    }

    let payDate = getDateString(payment)[0]
    let expireDate = getDateString(payment)[1]
    // console.log(expireDate);
    let fee = String(payment.pay_fee)
    let commaFormattedFee = getCommaFormattedNumbers(fee)
    let status 
    if (payment.pay_class.status == 'valid') {
      status = 'valid'
    } else {
      status = '미정'
    }
    let trEls
    ///////////////// 제일 최근의 결제에 대해서 만료검사
    const leftDays = getTermToday(payment)
    if(i == 0 && (leftDays <= 15) && (leftDays >= 0)) { //제일 최근의 결제에 대해서만 만기 검사 실행후 빨강표시
      trEls = `
      <tr class = "alert">
        <td>${i + 1}</td>
        <td>${payDate}</td>
        <td>${classType} 주 ${classPerWeek}회 [${classTerm}개월]</td>
        <td>${payDate} ~ ${expireDate}</td>
        <td>${status}</td>
        <td>${commaFormattedFee} 원</td>
      </tr>
      `
      // console.log('첫번째 결제가 만기!!');
      tableArea.innerHTML += trEls
      continue
    }

    if(leftDays < 0) { // 만료된 결제(수업)에 대해서 폐기 줄그음 처리
      trEls = `
      <tr class ='expire'>
        <td>${i + 1}</td>
        <td>${payDate}</td>
        <td>${classType} 주 ${classPerWeek}회 [${classTerm}개월]</td>
        <td>${payDate} ~ ${expireDate}</td>
        <td>${status}</td>
        <td>${commaFormattedFee} 원</td>
      </tr>
      `
      tableArea.innerHTML += trEls
      continue
    }
    trEls = `
    <tr>
      <td>${i + 1}</td>
      <td>${payDate}</td>
      <td>${classType} 주 ${classPerWeek}회 [${classTerm}개월]</td>
      <td>${payDate} ~ ${expireDate}</td>
      <td>${status}</td>
      <td>${commaFormattedFee} 원</td>
    </tr>
    `
    tableArea.innerHTML += trEls
  }
}
//attendance객체 배열 매개변수로 받아서 
function showMemberAttendance(attendances) { 
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
