import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js'
import { getFirestore, collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js';
const app = initializeApp({
  apiKey: "AIzaSyBykm-oqoMvIAjLFWHPnVi_OQ86Iis_NVs",
  authDomain: "yoga-663cb.firebaseapp.com",
  projectId: "yoga-663cb",
  storageBucket: "yoga-663cb.appspot.com",
  messagingSenderId: "256248240983",
  appId: "1:256248240983:web:07dcebbcb04debc34b3c12"
})
const db = getFirestore(app)

/** 오늘할거
 * 만료 다가온 결제 목록 불러오기 getExpiredClass
 * 불러온거 띄우기 show
 */
//결제 내역중에 오늘기준, 만료일이 다가온 결제들을 추림
getExpireClasses()


async function getExpireClasses() {
  // 2024 6 22 
  //전체 문서 가져오기
  /*
  const querySnapshot1 = await getDocs(collection(db, "open_payments"))
  querySnapshot1.forEach(element => {
    console.log(element.data());
  });
  */
  // 쿼리해서 가져오기
  // const q = query(collection(db, "open_payments"), where("pay_month", "==", 6))
  /*
  복합쿼리(너무 복잡할듯)같은거 아니면 문자열 비교 같은거 생각해봐도 예외케이스가많음
  */
  // 쿼리보단 그냥 불러오고 임의로 판별해야할듯
  const allPayments = []
  const querySnapshot2 = await getDocs(collection(db, "open_payments"))
  querySnapshot2.forEach(element => {
    allPayments.push(element.data())
    // console.log(element.data());
  });
  console.log(allPayments);
  const expireClasses = allPayments.filter((payment) => checkExpireCome(payment))
  console.log(expireClasses);

  showExpireClasses(expireClasses)
}

// 만료기간 다가오는 결제들을 반환하기위한 filter함수
function checkExpireCome(payment) {
  const expireDateStr = getDateString(payment)[1] // "2024-6-9"
  return getTerm(expireDateStr) <= 30
}

// '결제' 객체에 대해서 '지불날짜' '만료날짜' 문자열을 반환하는 함수 manage.js에서 따옴
function getDateString(payment) {
  const payDate = new Date(payment.pay_year, payment.pay_month - 1, payment.pay_day)
  const payDateStr = payDate.toLocaleDateString().slice(0, -1).split('. ').join('-')
  // console.log(payDateStr);
  let expireDate = payDate
  // class_term 추가된 expireDate 문자열 얻고 반환
  expireDate.setMonth(payDate.getMonth() + payment.pay_class.class_term)
  const expireDateStr = expireDate.toLocaleDateString().slice(0, -1).split('. ').join('-')
  // console.log([payDateStr, expireDateStr]);
  return [payDateStr, expireDateStr]
}

function getTerm(expireDateStr) {
  const expireTime = new Date(expireDateStr).getTime()
  const todayTime = new Date().getTime()
  const diffSec = expireTime - todayTime
  const term = Math.floor(Math.abs(diffSec / (1000 * 60 * 60 * 24)))
  return term
}

//받아온 expireClass배열을 토대로 tableEl 생성후 표시
async function showExpireClasses(expireClasses) {
  // 만기일 가장 가까운것 순으로 정렬
  expireClasses.sort(function(a, b) {
    const aExpireDateStr = getDateString(a)[1]
    const bExpireDateStr = getDateString(b)[1]
    return getTerm(aExpireDateStr) - getTerm(bExpireDateStr)
    // return getTerm(bExpireDateStr) - getTerm(aExpireDateStr)
  })

  const listEl = document.querySelector("table.list-val")
  // 읽으며 배열 생성
  for(let i = 0; i < expireClasses.length; i++) {
    let expireClass = expireClasses[i]
    // console.log(expireClass);
    const memberInfo = await getMemberInfo(expireClass.user_id) 
    // console.log(memberInfo);
    let [memberName, memberNum, memberGender] = [memberInfo.name, expireClass.user_id, memberInfo.gender]

    let classType = expireClass.pay_class.class_type
    if (classType == 'group') {
      classType = '요가'
    } else {
      classType = '개인레슨'
    }
    let classPeriod = expireClass.pay_class.times_a_week
    let classTerm = expireClass.pay_class.class_term

    let [payDay, expireDay] = getDateString(expireClass)
    // console.log(payDay, expireDay);
    let term = getTerm(expireDay.split('-').map(val => val.padStart(2, '0')).join('-'))
    payDay = payDay.split('-').map(val => val.padStart(2,'0')).join('.')
    expireDay = expireDay.split('-').map(val => val.padStart(2,'0')).join('.')
    // console.log(expireDay);

    let trEl = `
    <tr>
      <td>${i + 1}</td>
      <td>${memberName} (${memberNum}) [${memberGender}]</td>
      <td>${classType} 주${classPeriod}회 [${classTerm}개월] [주 ${classPeriod}회권]</td>
      <td>${payDay} ~ ${expireDay} [만료 ${term}일전]</td>
    </tr>
    `
    listEl.innerHTML += trEl
    // let classPeriod = 
    // let classTerm = 
    // let clasNum =
    
    // let []
  }
}
// 아 payment에도 payer? 같은 이름 속성 넣어줘야하나 그냥 불러오면 안됌
async function getMemberInfo(userId) {
  const member = []
  const q = query(collection(db, "test_members"), where("user_id", "==", userId))
  const querySnapshot = await getDocs(q)
  querySnapshot.forEach(element => {
    member.push(element.data())
  });
  // async function 은 프로미스 반환하는거 아니였나?
  return member[0]
}

