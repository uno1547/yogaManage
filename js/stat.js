
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
/*
await addDoc(collection(db, "new_test_payments"), {
  user_id : 5040,
  user_name : '성주휘',
  phone_number : "010-2475-5837",
  pay_date : "20240624",
  expire_date : "20240724",
  pay_fee : 40000, 
  pay_method : "card", 
  pay_teacher : "김예림", 
  personal_teacher : "김예림",
  pay_class : { 
    class_type : "group", 
    times_a_week : 2, 
    class_term : 1, 
    }
});
*/
let date = new Date()
const dayInputStart = document.querySelector('#date-input input#start-date')
const dayInputEnd = document.querySelector('#date-input input#end-date')
// dayInputStart.addEventListener('input', () => {
//   console.log('input발생 arrowhandler', this);
// })
// dayInputStart.addEventListener('change', () => {
//   console.log('change발생 arrow', this);
// })
dayInputStart.addEventListener('input',function() {
  console.log('input발생 anonymous', this.value);
})
dayInputStart.addEventListener('change',function() {
  console.log('change발생 anonymous', this.value);
})
dayInputStart.addEventListener('blur',function() {
  console.log('blur발생 anonymous', this.value);
})

// 1. 오늘부터 15일 이전까지의 pay_date들을 불러온다!
async function getQueries() {
  const queriedPayments = [] // 불러온 payments 담을 배열
  const userDic = {} // 해당구간의 날짜에 속하는 pay_date의 userinfo를
  const q = query(collection(db, "test_payments_string"), where("pay_date", "<=", getTodayDateString()), where("pay_date", ">=", getPrevDateString()))
  // const q = query(collection(db, "test_payments_string"))
  const querySnapshot = await getDocs(q) // payments 컬랙션에 결제를 요청 (id로 쿼리날리는건 최소한 이라인 이후부터 실행해야할듯)
  // console.log(querySnapshot.size);
  querySnapshot.forEach((doc) => {
    // 받은 결제데이터들을 받음과 동시에, 결제의 user_id로 member컬렉션에 미리 요청날려놓음 await는 안함. promise로 받아서 아래가서쓸거임
    const id = doc.data().user_id
    const idQuery = query(collection(db, "test_members"), where("user_id", "==", id))
    userDic[id] = getDocs(idQuery) // {1100 : promise, 2212 : promise}
    queriedPayments.push(doc.data()) // 받은 결제 담음
  })
  console.log(userDic);
  console.log(queriedPayments);
  console.log(queriedPayments.length);
  showSkeletonLoading(queriedPayments.length)
  showInOverview(queriedPayments)
  // initInput()
  /*
  setTimeout(() => {
    showPaymentList(queriedPayments, userDic)
  }, 2000);
  이렇게 하면 순차적으로 뜨는데, 아래처럼주면 찰나에 안뜨고 무시됨
  */
  showPaymentList(queriedPayments, userDic)
}
getQueries()
// 쿼리에쓰이는 문자열반환함수
function getTodayDateString() {
  const todayDate = new Date()
  const [year, month, date] = [todayDate.getFullYear(), String(todayDate.getMonth() + 1).padStart(2, '0'), String(todayDate.getDate()).padStart(2, '0')]
  // console.log(`${year}${month}${date}`);
  return `${year}${month}${date}`
}
// 쿼리에쓰이는 문자열반환함수
function getPrevDateString() {
  const prevDate = new Date()
  prevDate.setDate(prevDate.getDate() - 30)
  const [year, month, date] = [prevDate.getFullYear(), String(prevDate.getMonth() + 1).padStart(2, '0'), String(prevDate.getDate()).padStart(2, '0')]
  // console.log(`${year}${month}${date}`);
  return `${year}${month}${date}`
}
// 개수만큼 틀넣음
function showSkeletonLoading(num) {
  const skeletonDiv = document.querySelector("#table-list table#list-val")
  console.log(skeletonDiv);
  for(let i = 0; i < num; i++) {
    console.log(i);
    skeletonDiv.innerHTML += `<tr class = "skeleton-line">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>`
  }

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
async function showPaymentList(payments, userInfo) {
  const listValDiv = document.querySelector("div#table-list table#list-val")
  listValDiv.innerHTML = ''
  for(let i = 0; i < payments.length; i++) {
    // 여기서 user_id로 접근가능한상황임 미리 전역에 담아두었던 프로미스 배열에서 꺼내서 프로퍼티 추가해줌
    payments[i]["info"] = {}
    const id = payments[i].user_id
    const promise = userInfo[id]
    await promise.then((snapshot) => snapshot.forEach((snapshot) => {
      payments[i]["info"].teacher = snapshot.data().teacher
      payments[i]["info"].phoneNum = snapshot.data().phone_number
    }))
    // console.log(payments[i]);
    // console.log(payments[i].info);
  }
  // 위에서 추가한 최종payment object들 출력
  const skelton = document.querySelector("div#is-loading")
  // skelton.remove()

  // payments.forEach(payment => {
  //   console.log(payment);
  // });
  /*
  일반 sort 사전순으로 정렬되기에 1000, 21 과같이 크기순정렬이되지않는다.

  */
  // 결제일 최신순으로 정렬
  payments.sort((a, b) => {
    if(a.pay_date < b.pay_date) { // 2023 2024
      return 1
    } else if(a.pay_date > b.pay_date){
      return -1
    } else {
      return 0
    }
  })
  // 정렬완료된걸 형식에 맞게 출력
  const paymentStrs = payments.map((payment) => {
    const payDate = payment.pay_date
    const [payYear, payMonth, payDay] = [payDate.slice(0, 4), payDate.slice(4, 6), payDate.slice(6)]
    const expireDate = payment.expire_date
    const [expireYear, expireMonth, expireDay] = [expireDate.slice(0, 4), expireDate.slice(4, 6), expireDate.slice(6)]
    return `<tr>
            <td>${payYear}-${payMonth}-${payDay}</td>
            <td>${payment.user_name}</td>
            <td>${payment.info.teacher}</td>
            <td>${payment.pay_teacher}</td>
            <td>${payment.info.phoneNum}</td>
            <td>요가 주${payment.pay_class.times_a_week}회 [${payment.pay_class.class_term}개월] [주 ${payment.pay_class.times_a_week}회권]</td>
            <td>${payYear}-${payMonth}-${payDay}</td>
            <td>${expireYear}-${expireMonth}-${expireDay}</td>
            <td>${100000}</td>
          </tr>`
  })
  paymentStrs.forEach((el) => {
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

