
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js'
import { getFirestore, addDoc, collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js';
const app = initializeApp({
  apiKey: "AIzaSyBykm-oqoMvIAjLFWHPnVi_OQ86Iis_NVs",
  authDomain: "yoga-663cb.firebaseapp.com",
  projectId: "yoga-663cb",
  storageBucket: "yoga-663cb.appspot.com",
  messagingSenderId: "256248240983",
  appId: "1:256248240983:web:07dcebbcb04debc34b3c12"
})
const db = getFirestore(app)

// 현재날짜구하고 얘가 근데 굳이 필요할까?
let date = new Date()

/*
1. 현재 날짜세팅
2. 현재날짜 - 15 ~ 현재날짜의 결제 불러옴
3. input type date 값 표시하고
4. 해당 결제 리스트 표시
*/

// 2. 오늘부터 15일 이전까지의 pay_date들을 불러온다!
async function getQueries() {
  const queriedPayments = []
  const q = query(collection(db, "test_payments_string"), where("pay_date", "<=", getTodayDateString()), where("pay_date", ">=", getPrevDateString()))
  const querySnapshot = await getDocs(q)
  querySnapshot.forEach((doc) => {
    // console.log(doc.data());
    console.log(doc.data().pay_fee, doc.data().pay_method);
    queriedPayments.push(doc.data())
  })
  // console.log(queriedPayments);
  showInOverview(queriedPayments)
  initInput()
  showPaymentList(queriedPayments)
}
getQueries()
// 쿼리에쓰이는 문자열반환함수
function getTodayDateString() {
  const todayDate = new Date()
  const [year, month, date] = [todayDate.getFullYear(), String(todayDate.getMonth() + 1).padStart(2, '0'), String(todayDate.getDate()).padStart(2, '0')]
  console.log(`${year}${month}${date}`);
  return `${year}${month}${date}`
}
// 쿼리에쓰이는 문자열반환함수
function getPrevDateString() {
  const prevDate = new Date()
  prevDate.setDate(prevDate.getDate() - 30)
  const [year, month, date] = [prevDate.getFullYear(), String(prevDate.getMonth() + 1).padStart(2, '0'), String(prevDate.getDate()).padStart(2, '0')]
  console.log(`${year}${month}${date}`);
  return `${year}${month}${date}`
}

//3. 불러온 결제를 shortview 에 표시
function showInOverview(payments) {
  const overViewDiv = document.querySelector('table#short-view-val')
  overViewDiv.innerHTML = ''

  const payNum = payments.length
  const result = payments.reduce((price, payment) => {
    const fee = payment.pay_fee
    if(payment.pay_method == 'cash') {
      price.cash += fee
    } else {
      price.card += fee
    }
    price.total += fee
    return price
  }, {card : 0, cash : 0, total : 0})
  // console.log(result);
  const cardPrice = getFormattedNum(result.card)
  const cashPrice = getFormattedNum(result.cash)
  const totalPrice = getFormattedNum(result.total)
  overViewDiv.innerHTML = `<tr>
          <td>${payNum}</td>
          <td>${cardPrice}</td>
          <td>${cashPrice}</td>
          <td>0</td>
          <td>${totalPrice}</td>
        </tr>`
}
function getFormattedNum(number) {
  const strNum = String(number)
  let result = ''
  for(let i = 0; i < strNum.length; i++) {
    result += strNum[i]
    if(((strNum.length - i) % 3 == 1) && i != strNum.length - 1) {
      result += ','
    }
  }
  return result
}

//4. 기본날짜구간 (오늘 - 15일 ~ 오늘) input에 표시
function initInput() {
  const startInput = document.querySelector("input#start-date")
  const endInput = document.querySelector("input#end-date")
  const startDate = new Date()
  const [startYear, startMonth, startDay] = [startDate.getFullYear(), String(startDate.getMonth() + 1).padStart(2, '0'), String(startDate.getDate()).padStart(2, '0')]
  const prevDate = new Date()
  prevDate.setDate(prevDate.getDate() - 30)
  const [endYear, endMonth, endDay] = [prevDate.getFullYear(), String(prevDate.getMonth() + 1).padStart(2, '0'), String(prevDate.getDate()).padStart(2, '0')]
  endInput.value = `${startYear}-${startMonth}-${startDay}`
  startInput.value = `${endYear}-${endMonth}-${endDay}`
}

//5. 해당 결제의 user_id로 담당강사, 휴대폰번호 불러와야함
async function getInfo(userId) {
  const q = query(collection(db, "test_members"), where("user_id", "==", userId))
  const querySnapshot = await getDocs(q)
  const info = {}
  querySnapshot.forEach((doc) => {
    info.teacher = doc.data().teacher
    info.phoneNumber = doc.data().phone_number
  })
  return info
}
//5. 기본 날짜구간 리스트에 표시
async function showPaymentList(payments) {
  for(let i = 0; i < payments.length; i++) {
    const payUserInfo = await getInfo(payments[i].user_id)
    payments[i].info = payUserInfo
  }
  console.log(payments);
  const entire = payments.map((payment) => {
    return `<tr>
            <td>${payment.pay_date}</td>
            <td>${payment.user_name}</td>
            <td>${payment.info.teacher}</td>
            <td>${payment.pay_teacher}</td>
            <td>${payment.info.phoneNumber}</td>
            <td>요가 주${payment.pay_class.times_a_week}회 [${payment.pay_class.class_term}개월] [주 ${payment.pay_class.times_a_week}회권]</td>
            <td>${payment.pay_date}</td>
            <td>${payment.expire_date}</td>
            <td>${payment.pay_fee}</td>
          </tr>`
  })
  const listValDiv = document.querySelector("div#table-list table#list-val")
  listValDiv.innerHTML = ''
  entire.forEach((el) => {
    listValDiv.innerHTML += el
  })
}





// 1. 문자열필드
/*
// const expire_date = "20240615"
// const endDate = "20240809"
const startDate = "20240720"
const endDate = "20240726"
const q = query(collection(db, "test_payments"), where("expire_date", ">=", startDate), where("expire_date", "<=", endDate))
//가능은함 문자열의 expire_date를 가진다 치면, 필드와 비교할값을 생성하는 코드를 추가해서 그결과랑 비교하면 될듯함(기준날짜 바뀔때마다, 시작문자열, 종료문자열 반환하게)
const querySnapshot = await getDocs(q)
querySnapshot.forEach(doc => {
  // console.log(doc.data());
});
*/

// 2. 배열필드
/*
const q2 = query(collection(db, "test_payments"), where("pay_date"[0], "==", 7))
const querySnapshot2 = await getDocs(q2)
querySnapshot2.forEach(doc => {
  console.log(doc.data());
});
배열필드일땐 쿼리하는방법 모르겠음진짜
*/
// 현재날짜에 따라서 15일치의 결제를 보여주자 

