const searchParams = new URLSearchParams(window.location.search)
const receivedId = Number(searchParams.get('user_id'))
console.log(receivedId)
// table 및 하위요소에서 click 발생시 해당줄의 radio활성화
const table = document.querySelector("table#drop-down")
table.addEventListener("click", function(evt) {
  console.log(evt.target);
  const target = evt.target
  console.log(target.parentElement.tagName);
  let radio
  if (target.parentElement.tagName == "TR") {
    radio = target.parentElement.querySelector("input[type='radio']")
    console.log(radio);
  } else if (target.parentElement.tagName == "TBODY"){
    radio = target.querySelector("input[type='radio']")
    console.log(radio);
  }
  radio.checked = "true"
})
// table.addEventListener("mouseleave", function() {
//   const radios = table.querySelectorAll("input[type='checked]")
//   radios.forEach(radios.)
// })