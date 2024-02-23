import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js'
import { getFirestore, collection, addDoc, getDocs, doc , getDoc } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js'
const app = initializeApp({
  apiKey: "AIzaSyBykm-oqoMvIAjLFWHPnVi_OQ86Iis_NVs",
  authDomain: "yoga-663cb.firebaseapp.com",
  projectId: "yoga-663cb",
  storageBucket: "yoga-663cb.appspot.com",
  messagingSenderId: "256248240983",
  appId: "1:256248240983:web:07dcebbcb04debc34b3c12"
})
const db = getFirestore(app)

// function getFsMember () {
  const docRef = doc(db, 'members', "tvn2fZd8eEUKn8l4d4Co")
  const docMem = await getDoc(docRef)
  // return docMem.data()
// }
//시작하기의 웹 모듈식 API 새 컬렉션에 첫 문서 저장 성공 !!
/*
try {
  const docRef = await addDoc(collection(db, "users"), {
    first: "Ada",
    last: "Lovelace",
    born: 1815
  });
  console.log("Document written with ID: ", docRef.id);
} catch (e) {
  console.error("Error adding document: ", e);
}
*/
//위의 users컬렉션에 새 문서 저장 성공
/*
try {
  const docRef = await addDoc(collection(db, "users"), {
    first: "Alan",
    middle: "Mathison",
    last: "Turing",
    born: 1912
  });
  console.log("Document written with ID: ", docRef.id);
} catch (e) {
  console.error("Error adding document: ", e);
}
*/
//위의 users컬럭션의 문서들 조회성공!
/*
const querySnapshot = await getDocs(collection(db, "users"));
querySnapshot.forEach((doc) => {
  console.log(`${doc.id} => ${doc.data()}`);
});
*/
// members의 문서 읽기성공 완전하지는않은듯
// const querySnapshot = await getDocs(collection(db, "members"));
// querySnapshot.forEach((doc) => {
//   console.log(`${doc.id} => ${doc.data()}`);
// });
// const docRef = doc(db, "members", "0XjIgUezbBYDu4HUBWjw");
// const docSnap = await getDoc(docRef);
// if (docSnap.exists()) {
//   console.log("Document data:", docSnap.data());
// } else {
//   // docSnap.data() will be undefined in this case
//   console.log("No such document!");
// }
//시작하기의 데이터 조회(web module API)
// const querySnapshot = getDocs(collection(db, "fbMembers"))
// querySnapshot.forEach((doc) => console.log(doc.id, doc.data()) )

/*
const docRef = doc(db, 'members', "tvn2fZd8eEUKn8l4d4Co")
const docSnap = getDoc(docRef)
console.log(docSnap.data())
*/


document.addEventListener('DOMContentLoaded', function () {
  getFsMember()
  const calendarEl = document.querySelector('.calender')
  const a = 19
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView : 'dayGridMonth',
    // selectable : true,
    buttonText : {
      today : '오늘'
    },
    headerToolbar : {
      start : '',
      center : 'title'
    },
    dateClick : function (info) {
      console.log(info)
    },
    events : [{
      id : 'a',
      title : `${a}`,
      start : '2024-02-10',
      end : '2024-02-10'
    }]
  })
  calendar.render()
  const event = calendar.getEventById('a')
  const start = event.start
  // console.log(start)
})