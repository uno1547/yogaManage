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
const db = getFirestore(app)
//멤버 컬렉션에서 한명 불러오기(어떤순으로 정렬되있는거지?) 해도 나중에 버튼클릭으로 다음회원불러올려면 이벤트리스너로
//실행해야하는데 await 때문에 안될듯 그냥 한번에 불러와서 배열에 담아두고 써야할듯 

const memberQueries = await getDocs(collection(db, "test_members"))
const members = []
memberQueries.forEach((doc) => {
members.push(doc.data())
})
//member의 '이름' 키값 에 따라 정렬 [기본 : 이름(사전순)]
members.sort((a, b) => a.name.localeCompare(b.name)) // 가나다 순 첫번째 member
// console.log(members) // [{}, {}, {}, {}, {}]
let currentMember = members[0] //먼저 첫번째 회원
let currentUserID = 0
let currentMemberPayments = []
getMemeberInfo(currentMember)
const userPayments = query(collection(db, "test_payments"), where("user_id", "==", currentUserID))
const paymentQueries = await getDocs(userPayments)
paymentQueries.forEach((doc) => currentMemberPayments.push(doc.data()))
console.log(currentMemberPayments)
showMemberClassInfo(currentMemberPayments)
// member객체를받아 순회하며, 기본 정보띄움
function getMemeberInfo(member) {
  for (let prop in member) {
    let liEl = document.querySelector(`li.${prop}`)
    if ((liEl.classList.contains('name')) || (liEl.classList.contains('gender'))) {
      let span = liEl.querySelector(`span#${prop}`)
      prop == "gender" ? span.textContent = `[${member[prop]}]` : span.textContent = member[prop]
    } else {
      liEl.textContent = member[prop]
    }
  }
  currentUserID = member.user_id
}
//  결제내역중 가장최근 결제에대한 pay_class표시
function showMemberClassInfo(payments) {
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
  let recentPay = payments[0]
  console.log(recentPay)
  const classLi = document.querySelector("ul#info-val li.class")
  classLi.innerHTML = `<span>${recentPay.pay_class.class_type}</span><span>주${recentPay.pay_class.times_a_week}회</span><span>[${recentPay.pay_class.class_term}개월]</span>`
}

