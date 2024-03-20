import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js'
import { getFirestore, collection, query, where, getDocs} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js';

const app = initializeApp({
  apiKey: "AIzaSyBykm-oqoMvIAjLFWHPnVi_OQ86Iis_NVs",
  authDomain: "yoga-663cb.firebaseapp.com",
  projectId: "yoga-663cb",
  storageBucket: "yoga-663cb.appspot.com",
  messagingSenderId: "256248240983",
  appId: "1:256248240983:web:07dcebbcb04debc34b3c12"
})
const db = getFirestore(app)

const formEl = document.querySelector("form").addEventListener("submit", function(e) {
  console.log(e)
  e.preventDefault()
  // let valid = isValid()
  // console.log(valid)
  getMemInfo()
})
const telInput = document.querySelector("input#tel")
const userIdInput = document.querySelector("input#user-id")
telInput.addEventListener("input", function(evt) {
  const curInput = telInput.value
  const length = curInput.length
  const inputVal = Number(evt.data)
  const isNotNumber = isNaN(inputVal)
  if (isNotNumber) {
    console.log('enter a number please');
  } else {
    if (length === 3 || length === 8) {
      evt.data !== null ? telInput.value += "-" : 0
    }
  }
  // console.log(curInput);
  telPopUpHandler()
})
userIdInput.addEventListener("input", function() {
  idPopUpHandler()
  // pushCheckerButton(evt)
})
function pushCheckerButton(evt) {
  // console.log(evt);
}
const repChecker = document.querySelector(".user-id button#rep-check")
repChecker.addEventListener("click", async function() {
  const dupMems = []
  const idVal = document.querySelector("input#user-id").value 
  console.log(idVal);
  if (idVal.length == 0) {
    return
  } else {
    const q = query(collection(db, "test_members"), where("user_id", "==", Number(idVal)))
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // console.log(doc.id, doc.data());
      dupMems.push(doc.data())
    })
    let valid = true
    dupMems.length !== 0 ? valid = false : 0
    // console.log(valid);
    idValidPopUpHandler(valid)
  }
})
function idValidPopUpHandler(isvalid) {
  let isUserInputValid = false
  const idPopUp = document.querySelector("#id-pop-up") // "숫자를입력하세요" 떠있으면 "입력값을 확인하세요!!"
  const isValidPopUp = document.querySelector("#id-val-pop-up")
  if (idPopUp) {
    console.log("이미 팝업창이떠있다!");
    idPopUp.classList.add("red")
    idPopUp.textContent = "입력값을 확인해주세요!"
  } else {
    if (isvalid) { //true넘어오면 '유효한ID입니다'
      console.log("중복은아님");
      if (isValidPopUp) {
        console.log("박스가이미있으니 텍스트만바꿀게");
        isValidPopUp.classList.remove("red")
        isValidPopUp.classList.add("green")
        isValidPopUp.textContent = "유효한ID입니다!"
      } else {
        console.log("박스없으니 새로 추가할게");
        const popUpEl = document.createElement('div')
        const idDiv = document.querySelector(".wrap.user-id")
        popUpEl.id = "id-val-pop-up"
        // popUpEl.classList.remove("red")
        popUpEl.classList.add("green")
        popUpEl.textContent = "유효한ID입니다!"
        idDiv.appendChild(popUpEl)
      }
    } else { //false넘어오면 '이미 사용중인 ID입니다'
      console.log("중복이고");
      if (isValidPopUp) {
        console.log("박스가이미있으니 텍스트만바꿀게");
        isValidPopUp.classList.remove("green")
        isValidPopUp.classList.add("red")
        isValidPopUp.textContent = "이미사용중인ID입니다!"
      } else {
        console.log("박스없으니 새로 추가할게");
        const popUpEl = document.createElement('div')
        const idDiv = document.querySelector(".wrap.user-id")
        popUpEl.id = "id-val-pop-up"
        // popUpEl.classList.remove("green")
        popUpEl.classList.add("red")
        popUpEl.textContent = "이미사용중인ID입니다!"
        idDiv.appendChild(popUpEl)
      }
    }
  }
}
function idPopUpHandler() {
  const idValidPopUp = document.querySelector(".user-id.wrap #id-val-pop-up")
  idValidPopUp ? idValidPopUp.remove() : 0
  let haveChar = false
  const curId = userIdInput.value
  for (let i = 0; i < curId.length; i++) {
    if (isNaN(Number(curId[i]))) {
      haveChar = true
      break
    }
  }
  const idPopUp = document.querySelector("#id-pop-up")
  if (haveChar) { //문자 포함됨
    if (idPopUp) { //
      return
    } else { //문자 포함되고, idpopup은 없을경우
      const popUpEl = document.createElement('div')
      const idDiv = document.querySelector(".wrap.user-id")
      popUpEl.id = "id-pop-up"
      popUpEl.textContent = "숫자를입력해주세요!"
      idDiv.appendChild(popUpEl)
    }
  } else { //문자열 포함안
    idPopUp ? idPopUp.remove() : 0
  }
}
function telPopUpHandler() {
  let haveChar = false
  const curTel = telInput.value
  // console.log(curTel)
  for (let i = 0; i < curTel.length; i++) {
    if (isNaN(Number(curTel[i]))) { //중간에 문자가 포함되있을경우
      if (curTel[i] == "-") {
        continue
      } else {
        haveChar = true
        break
      }
    }
  }
  const telPopUp = document.querySelector("#tel-pop-up")
  if (haveChar) { // 문자가포함된경우
    if (telPopUp) { //이미 telpopup이있으면 유지
      return
    } else { //telpopup이 없다면 생성후 추가
      const popUpEl = document.createElement('div')
      const telDiv = document.querySelector(".wrap.tel")
      popUpEl.id = "tel-pop-up"
      popUpEl.textContent = "숫자를입력해주세요!"
      telDiv.appendChild(popUpEl)
    }
  } else { //문자가 포함되지않은경우
    telPopUp ? telPopUp.remove() : 0
  }
}
function isValid() {
  const userID = Number(document.querySelector("#user-id").value)
  console.log(userID);
  if (userID) {
    console.log('valid!');
    return true
  } else {
    console.log('somet wrong');
    return false
  }
}
function getMemInfo() {
  const form = document.querySelector("form")
  const user_id = Number(form.querySelector("#user-id").value)
  const name = form.querySelector("#name").value
  const phone_number = form.querySelector("#tel").value
  const birth_date = form.querySelector("#bthday").value
  const info = {
    user_id : user_id,
    name : name,
    phone_number : phone_number,
    birth_date : birth_date
  }
  getRadioValue(info)
  // const zcodeEl = form.querySelector("#zcode")
  // const addressEl = form.querySelector("#ads")
  // const specaddressEl = form.querySelector("#spad")
}
function getRadioValue(info) {
  const groupRadio = document.getElementsByName("group-type")
  const teacherRadio = document.getElementsByName("teacher")
  const genderRadio = document.getElementsByName("gender")
  groupRadio.forEach((el) => {
    el.checked ? info["group"] = el.value: 0
  })
  teacherRadio.forEach((el) => {
    el.checked ? info["teacher"] = el.value : 0
  })
  genderRadio.forEach((el) => {
    el.checked ? info["gender"] = el.value : 0
  })
  console.log(info)
}
// function popUpHandler(isNaN) {
//   const popUp = document.querySelector("#tel-pop-up")
//   if (isNaN) { //입력값이 NaN이면
//     if (popUp) { //이미popup떠있으면 pass
//       return
//     } else { //없다면 추가
//       const popUpEl = document.createElement('div')
//       const telDiv = document.querySelector(".wrap.tel")
//       popUpEl.id = "tel-pop-up"
//       popUpEl.textContent = "숫자를입력해주세요!"
//       telDiv.appendChild(popUpEl)
//     }
//   } else { //정상값이면
//     if (popUp) { // popup떠있으면 삭제
//       popUp.remove()
//     } else { // 삭제된상태면 pass
//       return
//     }
//   }
// }
