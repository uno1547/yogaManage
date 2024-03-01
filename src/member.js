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
const querySnapshot = await getDocs(collection(db, "test_members"))
const members = []
querySnapshot.forEach((doc) => {
members.push(doc.data())
})
//member의 프로퍼티 값에 따라 정렬 기본 : 이름(사전순)
members.sort((a, b) => a.name.localeCompare(b.name)) // 가나다 순 첫번째 member
const firstMember = members[0]
console.log(firstMember)
for (let prop in firstMember) {
  let liEl = document.querySelector(`.${prop}`)
  liEl.textContent = firstMember[prop]
  //name이랑 gender가 같은칸에 위치해서 '이름/성별'순으로 넣어야함!!
}
