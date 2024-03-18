const formEl = document.querySelector("form").addEventListener("submit", function(e) {
  console.log(e)
  e.preventDefault()
  // let valid = isValid()
  // console.log(valid)
  getMemInfo()
})
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