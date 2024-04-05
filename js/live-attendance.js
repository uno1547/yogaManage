import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js'
import { getFirestore, collection, addDoc} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js';
const app = initializeApp({
  apiKey: "AIzaSyBykm-oqoMvIAjLFWHPnVi_OQ86Iis_NVs",
  authDomain: "yoga-663cb.firebaseapp.com",
  projectId: "yoga-663cb",
  storageBucket: "yoga-663cb.appspot.com",
  messagingSenderId: "256248240983",
  appId: "1:256248240983:web:07dcebbcb04debc34b3c12"
})
const db = getFirestore(app)

//임의날짜의 출석을 추가하기 위한 코드
/* 무작위 collection_id로 생성이기 때문에 아마도 로딩될때마다 중복결제 생길듯 ㅋ
await addDoc(collection(db, "open_attendance"), {
  user_id : 2212,
  attend_year : 2023, 
  attend_month : 12, 
  attend_day : 25,
  attend_time : """,
});
*/
const addBtn = document.querySelector('button#add')
const container = document.querySelector('#attend-pallette')
addBtn.addEventListener("click", function () {
  const newItem = document.createElement('div')
  newItem.textContent = "attend"
  newItem.className = "attend"
  container.appendChild(newItem)
})
const delBtn = document.querySelector('button#delete')
delBtn.addEventListener("click", function () {
  const divArr = document.querySelectorAll('.attend')
  divArr[divArr.length - 1].remove()
})