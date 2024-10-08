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
//전체 결제내역을 불러옴 


/*
const q = query(collection(db, "open_payments"))
const snapShots = await getDocs(q)
const paymentsArr = getPaymentsArr(snapShots) //결제객체 배열
console.log(paymentsArr);
// 객체배열을 통해서 먼저 카드결제 표시하는 이벤트, 다음 현금결제 표시하는 이벤트, 마지막으로 누적매출표시하는 이벤트 추가 
const sortedPayments = getSortedPayments(paymentsArr)
console.log(sortedPayments);
const sortedEvents = getSortedEvents(sortedPayments)

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
  events : sortedEvents,
  // eventColor : 'transparent',
  eventColor : 'rgb(256, 256, 256)',
  eventTextColor : 'rgb(0, 0, 0)'
})
calendar.render()
*/

const q = query(collection(db, "test_payments_string"))
const snapShots = await getDocs(q)
const paymentsArr = getPaymentsArr(snapShots)
console.log(paymentsArr);

const reducedPayments = getReducedPayments(paymentsArr)
console.log(reducedPayments);

const reducedEvents = getReducedEvents(reducedPayments)
console.log(reducedEvents);

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
  events : reducedEvents,
  // eventColor : 'transparent',
  eventColor : 'rgb(256, 256, 256)',
  eventTextColor : 'rgb(0, 0, 0)'
})
calendar.render()


function getPaymentsArr(snapShots) {
  const paymentsArr = []
  snapShots.forEach((snapshot) => {
    paymentsArr.push(snapshot.data())
    // console.log(snapshot.data().pay_fee);
  })
  // console.log(paymentsArr);
  return paymentsArr
}
function getReducedPayments(arr) {
  const reducedPayments = []
  for (let payment of arr) {
    console.log(payment);
    const prevSale = reducedPayments.find((sale) => {
      return sale.pay_date == payment.pay_date
    })
    console.log(prevSale);

    if (prevSale) { //동일한 날짜에 해당하는 결제 존재!!
      // ex) {pay_year : 2024, pay_month : 3, pay_day : 31, credit : 300000, cash : 0} 존재한다고 가정
      console.log('중복!!');
      prevSale[`${payment.pay_method}`] += payment.pay_fee
    } else { //존재하지않는다면 {pay_year : 2024, pay_month : 03, pay_day : 31, credit : 30000, cash : 0} 이런식으로 추가!!
      const sortedPay = {
        pay_date : payment.pay_date,
        card : 0,
        cash : 0
      }
      sortedPay[`${payment.pay_method}`] += payment.pay_fee
      reducedPayments.push(sortedPay)
    }

  }
  return reducedPayments
}
function getReducedEvents(arr) {
  const reducedEvents = []
  for (let pay of arr) {
    const year = pay.pay_date.slice(0,4)
    const month = pay.pay_date.slice(4,6)
    const day = pay.pay_date.slice(6)
    const creditEvt = {
      title : `카드: ${getCommaFormattedNumbers(String(pay.card))}원`,
      start : `${year}-${month}-${day}`,
      end : `${year}-${month}-${day}`,
    }
    const cashEvt = {
      title : `현금: ${getCommaFormattedNumbers(String(pay.cash))}원`,
      start : `${year}-${month}-${day}`,
      end : `${year}-${month}-${day}`,
    }
    const totalEvt = {
      title : `합계: ${getCommaFormattedNumbers(String(pay.card+pay.cash))}원`,
      start : `${year}-${month}-${day}`,
      end : `${year}-${month}-${day}`,
    }
    reducedEvents.push(creditEvt) // push 순서에 상관없이 이벤트가 사전순으로 정렬되는듯하다
    reducedEvents.push(cashEvt)
    reducedEvents.push(totalEvt)
  }
  return reducedEvents
}






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
      daySales.push(ob)
    } else { //동일날짜의 결제가 존재하면 갱신
      prevSale.fee += ob.fee
    }
  }
  return daySales
}
//날짜별로 이벤트객체배열 반환
function getEvents(daySales) {
  // console.log(daySales);
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
  events.push({
    title : '카드 : 100원',
    start : '2024-03-14',
    end : '2024-03-14',
  })
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

