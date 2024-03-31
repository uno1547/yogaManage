import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js'
import { getFirestore, collection, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js';
//firebase app객체 만들고 실행
const app = initializeApp({
  apiKey: "AIzaSyBykm-oqoMvIAjLFWHPnVi_OQ86Iis_NVs",
  authDomain: "yoga-663cb.firebaseapp.com",
  projectId: "yoga-663cb",
  storageBucket: "yoga-663cb.appspot.com",
  messagingSenderId: "256248240983",
  appId: "1:256248240983:web:07dcebbcb04debc34b3c12"
})
const db = getFirestore(app)
/*
이거 말도 안되는거 아닌가 현재 날짜 이전의 쿼리들을 다불러와야하는거 아닌가
let q = query(collection(db, "open_payments"), where("pay_year", "==", getDate()[0]))
q = query(collection(db, "open_payments"), where("pay_month", "==", getDate()[1]))
q = query(collection(db, "open_payments"), where("pay_day", "<=", getDate()[2]))
const querySnapshot = await getDocs(q)
querySnapshot.forEach((doc) => {
  console.log(doc.data());
})
const sales = getDaySales(querySnapshot)
console.log(sales)
const event = getEvents(sales)
console.log(event)
*/
 /*
 const yearQueries = query(collection(db, "open_payments"), where("pay_year", "==", getDate()[0])) //현재날짜의 '년도' 일치하는쿼리
 const yearSnapshot = await getDocs(yearQueries)
 yearSnapshot.forEach((doc) => {
   console.log(doc.data());
  })
  const monthQueries = query(collection(db, "open_payments"), where("pay_month", "==", getDate()[1])) //현재날짜의 '월' 일치하는쿼리
  const monthSnapshot = await getDocs(monthQueries)
  monthSnapshot.forEach((doc) => {
    console.log(doc.data());
  })
  const dayQueries = query(collection(db, "open_payments"), where("pay_day", "<=", getDate()[2])) //현재날짜의'일'이전 일치하는쿼리
  const daySnapshot = await getDocs(dayQueries)
  daySnapshot.forEach((doc) => {
    console.log(doc.data());
  })
  */
const q = query(collection(db, "open_payments"))
const snapShots = await getDocs(q)
console.log('hi')
const paymentsByDate = getPaymentsByDate(snapShots)
const daySales = getDaySales(paymentsByDate)
const saleEvents = getEvents(daySales)
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
  events : saleEvents,
  eventColor : 'transparent',
  eventTextColor : 'black'
  // eventDisplay : 'block'
})
calendar.render()

//현재 날짜에대한 [년, 월, 일]을 반환
function getDate() {
  let date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  console.log(year, month, day);
  return [year, month, day]
}
//스냅샷을 받아 일반객체배열로 반환
function getPaymentsByDate(snapShots) {
  const paymentsByDate = []
  snapShots.forEach((doc) => { 
    let pay = {
      pay_year : doc.data().pay_year,
      pay_month : doc.data().pay_month,
      pay_day : doc.data().pay_day,
      fee : doc.data().pay_fee,
    }
    paymentsByDate.push(pay)
  })
  return paymentsByDate
}
//동일 날짜별 누적합(객체배열) 반환
function getDaySales(arr) {
  let daySales = []
  for(let ob of arr) {
    const prevSale = daySales.find((sale) => {
      return (sale.pay_year == ob.pay_year) && (sale.pay_month == ob.pay_month) && (sale.pay_day == ob.pay_day)
    })
    // let prevSale = daySales.find((el) => el.pay_day == ob.pay_day) // 이거 일만 확인하는거라 년이랑 달도 따져서 동일한 날짜를 따져야함!!
    if (!prevSale) { //동일날짜의 결제가 존재하지않으면 그자체를 push
      /*
      ob.day_sale = ob.fee
      delete fee in ob 못씀
      */
      daySales.push(ob)
    } else { //동일날짜의 결제가 존재하면 갱신
      prevSale.fee += ob.fee
    }
  }
  return daySales
}
//날짜별로 이벤트객체배열 반환
function getEvents(daySales) {
  console.log(daySales);
  let events = []
  for (let daySale of daySales) {
    const year = daySale.pay_year
    const month = String(daySale.pay_month).padStart(2, '0')
    const day = String(daySale.pay_day).padStart(2, '0')
    const feeSum = getCommaFormattedNumbers(String(daySale.fee))
    // getCommaFormattedNumbers(feeSum)
    const evt = {
      title : `누적매출 : ${feeSum}원`,
      start : `${year}-${month}-${day}`,
      end : `${year}-${month}-${day}`,
    }
    events.push(evt)
  }
  return events
}
function getCommaFormattedNumbers(feeStr) {
  const characters = []
  for (let i = 0; i < feeStr.length; i++) {
    const curIndex = feeStr.length - 1 - i
    const remainder = i % 3
    if (remainder === 0) {
      if (i !== 0) {
        characters.push(",")
      }
    }
    characters.push(feeStr[curIndex])
  }
  return characters.reverse().join('')
}