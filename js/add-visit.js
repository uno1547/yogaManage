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
/*
await addDoc(collection(db, "open_attendances"), {
  user_id : 2212,
  attend_year : 2023, 
  attend_month : 4, 
  attend_day : 5,
  attend_time : [18, 39, 10],
});
*/
const formEl = document.querySelector('form')
formEl.addEventListener("submit", function(e) {
  e.preventDefault()
  alert('출석완료!!')
  const userId = Number(formEl.querySelector('input#user-id').value)
  addVisit(userId)
})
// console.log(new Date().getHours());
// console.log(new Date().getMinutes());
// console.log(new Date().getSeconds());
async function addVisit(userId) {
  const today = new Date()
  await addDoc(collection(db, "open_attendances"), {
    user_id : userId,
    attend_year : today.getFullYear(), 
    attend_month : today.getMonth() + 1, 
    attend_day : today.getDate(),
    attend_time : [today.getHours(), today.getMinutes(), today.getSeconds()],
  });
}