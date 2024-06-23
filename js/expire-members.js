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
  // 일단 전체 결제를 불러옴
  const allPayments = []
  const querySnapshot2 = await getDocs(collection(db, "open_payments"))
  querySnapshot2.forEach(element => {
    allPayments.push(element.data())
    // console.log(element.data());
  });
  console.log(allPayments);
  const expireClasses = allPayments.filter((payment) => checkExpireCome(payment))
  console.log(expireClasses);

  ////////
  expireClasses.sort(function(a, b) {
    // 원래는 가나다순 정렬후 만기일 가까이오는것에대해 한번 더 정렬 해야함 
    // 근데 현재 expireClass에 name키가 없기에 불가, 추가해주면될듯
    const aExpireDateStr = getDateString(a)[1]
    const bExpireDateStr = getDateString(b)[1]
    return getTerm(aExpireDateStr) - getTerm(bExpireDateStr)
    // return getTerm(bExpireDateStr) - getTerm(aExpireDateStr)
  })
  
  // 여기에서 만기일 다가온 결제들에 대해서, 해당 결제 이후에 신규 결제가 있다면, 제거해줘야함
  // 아니면 처음부터 제일 최근 결제들에 대해서만 만기검사를 하던지 일관되게 하는게 좋을듯 제일 최근 결제들에대해서 하자
  // 멤버 id에 대해서 제일 최근 결제들을 불러와야함(각 멤버들의 제일 최근 결제)
  // 멤버가 50명인데 멤버별로 100개의 결제가있다고 치면, 이결제를 다 검사하는건 비효율적일듯함 > 그냥 매번 결제가 추가될때마다 recent키를 추가해주자 
  /*{
    pay_class : {class_type: 'group', times_a_week: 3, class_term: 6}
    pay_day : 31
    pay_fee : 677000
    pay_method : "cash"
    pay_month : 3
    pay_teacher : "김영원"
    pay_year : 2024
    user_id : 1100}
  } 
  */
  const memberInfos = []
  for(let i = 0; i < expireClasses.length; i++) {
    const q = query(collection(db, "test_members"), where("user_id", "==", expireClasses[i].user_id))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach(element => {
      memberInfos.push(element.data())
    });
  }
  console.log(memberInfos);
  /////////
  showExpireClasses(expireClasses, memberInfos)
}

// 만료기간 다가오는 결제들을 반환하기위한 filter함수
function checkExpireCome(payment) {
  const expireDateStr = getDateString(payment)[1] // "2024-6-9"
  console.log(expireDateStr);
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
function showExpireClasses(expireClasses, memberInfos) {
  console.log(expireClasses, memberInfos);
  const listEl = document.querySelector("table.list-val")
  // 읽으며 배열 생성
  for(let i = 0; i < expireClasses.length; i++) {
    let expireClass = expireClasses[i]
    let memberInfo = memberInfos[i]
    // console.log(expireClass, memberInfo);
    // console.log(expireClass);
    // ****************************** 아마 이 await땜에 버벅이는듯
    // const memberInfo = await getMemberInfo(expireClass.user_id) 
    // const memberInfo = await getMemberInfo(expireClass.user_id) // 안기다려주고 실행되니 아래에는 undefined 들어감
    // const memberInfo = getMemberInfo(expireClass.user_id) // 안기다려주고 실행되니 아래에는 undefined 들어감
    console.log(memberInfo);
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
  console.log(member);
  return member[0]
}

