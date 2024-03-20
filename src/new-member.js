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
})
function idPopUpHandler() {
  let haveChar = false
  const curId = userIdInput.value
  for (let i = 0; i < curId.length; i++) {
    if (isNaN(Number(curId[i]))) {
      haveChar = true
      break
    }
  }
  const idPopUp = document.querySelector("#id-pop-up")
  if (haveChar) {
    if (idPopUp) { //문자가지면서 idpopup 도 있을경우
      return
    } else { //문자가지고 idpopup은 없을경우
      const popUpEl = document.createElement('div')
      const idDiv = document.querySelector(".wrap.user-id")
      popUpEl.id = "id-pop-up"
      popUpEl.textContent = "숫자를입력해주세요!"
      idDiv.appendChild(popUpEl)
    }
  } else {
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
function popUpHandler(isNaN) {
  const popUp = document.querySelector("#tel-pop-up")
  if (isNaN) { //입력값이 NaN이면
    if (popUp) { //이미popup떠있으면 pass
      return
    } else { //없다면 추가
      const popUpEl = document.createElement('div')
      const telDiv = document.querySelector(".wrap.tel")
      popUpEl.id = "tel-pop-up"
      popUpEl.textContent = "숫자를입력해주세요!"
      telDiv.appendChild(popUpEl)
    }
  } else { //정상값이면
    if (popUp) { // popup떠있으면 삭제
      popUp.remove()
    } else { // 삭제된상태면 pass
      return
    }
  }
}