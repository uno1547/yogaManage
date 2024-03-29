const searchParams = new URLSearchParams(window.location.search)
const receivedId = Number(searchParams.get('user_id'))
console.log(receivedId)
// table 및 하위요소에서 click 발생시 해당줄의 radio활성화
const table = document.querySelector("table#drop-down")
table.addEventListener("click", function(evt) {
  console.log(evt.target);
  const target = evt.target
  // console.log(target.parentElement.tagName);
  let radio
  if (target.parentElement.tagName == "TR") {
    radio = target.parentElement.querySelector("input[type='radio']")
    // console.log(radio);
  } else if (target.parentElement.tagName == "TBODY"){
    radio = target.querySelector("input[type='radio']")
    // console.log(radio);
  } else {
    return
  }
  radio.checked = "true"
})
// 드롭다운밖으로 마우스 이동시 top 아니면 선택요소로 스크롤
table.addEventListener("mouseleave", function() {
  const isRadioChecked = table.querySelector("input[type='radio']:checked")
  console.log(`현재 스크롤바의 value ${table.scrollTop}`)
  if (isRadioChecked) { //체크된요소가존재
    const checkedRow = isRadioChecked.closest('tr')
    const checkedRowIndex = Array.from(table.querySelectorAll('tr')).indexOf(checkedRow)
    const rowHeight = checkedRow.offsetHeight
    const rowScrollVal = rowHeight * checkedRowIndex + 1
    table.scrollTo(0, rowScrollVal)
    table.scrollTo({
      top : rowScrollVal,
      behavior : 'smooth'
    })
  } else { // 체크된요소존재안함
    table.scrollTo(0, 0)
    table.scrollTo({
      top : 0,
      behavior : 'smooth'
    })
  }
})
