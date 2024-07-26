
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

/* 이런식으로도 가능하다면, 맨처음에 데이터 요청하고시작하면 조금은 단축될지도
const q = query(collection(db, "test_payments_string"), where("pay_date", "<=", getTodayDateString()), where("pay_date", ">=", getPrevDateString()))
const promise = getDocs(q)
console.log('hi');
promise.then((snapShots) => {
  snapShots.forEach((doc) => console.log(doc.data()))
})
*/
/*
1. 현재 날짜세팅
2. 현재날짜 - 15 ~ 현재날짜의 결제 불러옴
3. input type date 값 표시하고
4. 해당 결제 리스트 표시
*/

// 2. 오늘부터 15일 이전까지의 pay_date들을 불러온다!
// const userDic = [] 배열은 showPayment에서 id값으로 조회를못함
const userDic = {}
async function getQueries() {
  const queriedPayments = []
  const q = query(collection(db, "test_payments_string"), where("pay_date", "<=", getTodayDateString()), where("pay_date", ">=", getPrevDateString()))
  // 여기어딘가에서 똑같이 비동기로 쿼리보내고, 
  const querySnapshot = await getDocs(q) // 기본 날짜구간에 해당하는 결제를 요청 (id로 쿼리날리는건 최소한 이라인 이후부터 실행해야할듯)
  console.log(querySnapshot);
  querySnapshot.forEach((doc) => {
    // user_id로 멤버 쿼리 미리 날려둠
    // userDic.push(doc.data().user_id) 
    // 여기서 아이디 조회할때마다 기다리지않고, 아이디로 member컬렉션에 
    const id = doc.data().user_id
    console.log(id);
    /* ?? 왜 promise로 또감싸
    userDic[id] = new Promise((resolve) => {
      const q = query(collection(db, "test_members"), where("user_id", "==", id))
      const querySnapshot = getDocs(q) // promise반환
    })
    */
    const q = query(collection(db, "test_members"), where("user_id", "==", id))
    userDic[id] = getDocs(q) // {1100 : promise, 2212 : promise}
    // console.log(doc.data().pay_fee, doc.data().pay_method);
    queriedPayments.push(doc.data()) // {user_id : , pay_fee 등등이 담김}
  })
  console.log(userDic);
  console.log(queriedPayments);
  // await new Promise((resolve) => {
  //   setTimeout(() => resolve(), 200)
  // }) ㅋㅋㅋ 이렇게 딜레이 주는게 말이되나
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
function showPaymentList(payments) {
  const listValDiv = document.querySelector("div#table-list table#list-val")
  listValDiv.innerHTML = ''
  for(let i = 0; i < payments.length; i++) {
    // console.log(payments[i]);
    // 여기서 user_id로 접근가능한상황임 미리 전역에 담아두었던 프로미스 배열에서 꺼내서 쓰면될듯?
    payments[i].info = {}
    const id = payments[i].user_id
    const promise = userDic[id]

    // promise.then((snapshot) => snapshot.forEach((data) => console.log(data.data())))
    promise.then((snapshot) => snapshot.forEach((snapshot) => {
      payments[i].info["teacher"] = snapshot.data().teacher
      payments[i].info["phoneNum"] = snapshot.data().phone_number
    }))
    // const payUserInfo = await getInfo(payments[i].user_id) // 얘로인해 엄청난 시간지연발생
    // payments[i].info = payUserInfo
    console.log(payments[i]);
    console.log(payments[i].info); // 여기 비어있음 말이됨???

    const str = `<tr>
            <td>${payments[i].pay_date}</td>
            <td>${payments[i].user_name}</td>
            <td>${payments[i].info.teacher}</td>
            <td>${payments[i].pay_teacher}</td>
            <td>${payments[i].info["phoneNum"]}</td>
            <td>요가 주${payments[i].pay_class.times_a_week}회 [${payments[i].pay_class.class_term}개월] [주 ${payments[i].pay_class.times_a_week}회권]</td>
            <td>${payments[i].pay_date}</td>
            <td>${payments[i].expire_date}</td>
            <td>${payments[i].pay_fee}</td>
          </tr>`
    listValDiv.innerHTML += str
  }
  // console.log(payments);
  /*
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
  */
}

//6. payment데이터필드에 전화번호, 담당강사




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

