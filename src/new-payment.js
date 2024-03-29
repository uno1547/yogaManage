const searchParams = new URLSearchParams(window.location.search)
const receivedId = Number(searchParams.get('user_id'))
console.log(receivedId)
const classInfo = {
  pt : {},
  gp : {}
}
// table 및 하위요소에서 click 발생시 해당줄의 radio활성화
const table = document.querySelector("table#drop-down")
table.addEventListener("click", function(evt) {
  // console.log(evt.target);
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
  // console.log(`현재 스크롤바의 value ${table.scrollTop}`)
  if (isRadioChecked) { //체크된요소가존재
    const checkedRow = isRadioChecked.closest('tr')
    const checkedRowIndex = Array.from(table.querySelectorAll('tr')).indexOf(checkedRow)
    // const rowHeight = checkedRow.offsetHeight 이걸로하면 56.53 이 올려져서 57이할당됨
    // 이렇게 되면 조금씩 오차가 커져서 나중에 스크롤된 위치가 안맞게됨
    const rowHeight = 56.57000006
    // const rowHeight = 56.77000006
    const rowScrollVal = rowHeight * checkedRowIndex
    table.scrollTo({
      top : rowScrollVal,
      behavior : 'smooth'
    })
    // table.scrollTo(0, rowScrollVal)
  } else { // 체크된요소존재안함
    table.scrollTo({
      top : 0,
      behavior : 'smooth'
    })
  }
})

const form = document.querySelector('form')
form.addEventListener("submit", function(evt) {
  evt.preventDefault()
  console.log('submit!!');
  const formData = new FormData(evt.target)
  const memberObj = Object.fromEntries(formData)
  console.log('form으로얻은 formdata :',memberObj)
  // // { class : 'group', method : 'credit' , teacher : '김영원' }
  setPaymentObj(memberObj) 
})
// memberObj 받아서 user_id, pay_year, pay_month, pay_day 처리 pay_teacher, pay_method도
function setPaymentObj(obj) {
  const payment = {}
  payment.user_id = receivedId
  const payDate = new Date()
  payment.pay_year = payDate.getFullYear()
  payment.pay_month = payDate.getMonth() + 1
  payment.pay_day = payDate.getDate()
  payment.pay_teacher = obj.teacher
  payment.pay_method = obj.method
  const payKey = obj.class
  console.log(payment);
  setPaymentClassInfo(payment, payKey)
}
// 넘어온 obj.class 속성으로 pay_fee 및 class_type, times_a_week, class_term 담긴 pay_class 프로퍼티(추가)
function setPaymentClassInfo(obj, key) {
  const payClass = {}  
  console.log('classkey :', key);
}


//  class, 결제수단, 결제강사 까지는 넘어옴 class를 토대로 결제일과 붙여서  
async function createNewPayment(obj) {
  
}