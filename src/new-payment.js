const searchParams = new URLSearchParams(window.location.search)
const receivedId = Number(searchParams.get('user_id'))
console.log(receivedId)
class Class {
  constructor(type, perWeek, term, cashPrice, creditPrice) {
    this.class_type = type,  
    this.times_a_week = perWeek,  
    this.class_term = term,  
    this.cash_price = cashPrice,
    this.credit_price = creditPrice  
  }
}
const classDic = {
  pt : new Class('pt', 10, 3, 600000, 600000),
  group_try : new Class('group', 30, 3, 0, 0),
  group_coupon : new Class('group', 10, 3, 230000, 250000),
  group_two_one : new Class('group', 2, 1, 129000, 143000),
  group_two_three1 : new Class('group', 2, 3, 330000, 367000),
  group_two_three2 : new Class('group', 2, 3, 347000, 386000),
  group_three_one : new Class('group', 3, 1, 149000, 165000),
  group_three_three1 : new Class('group', 3, 3, 360000, 400000),
  group_three_three2 : new Class('group', 3, 3, 378000, 420000),
  group_three_six1 : new Class('group', 3, 6, 677000, 752000),
  group_three_six2 : new Class('group', 3, 6, 713000, 792000),
  group_three_twelve1 : new Class('group', 3, 12, 1190000, 1320000),
  group_three_twelve2 : new Class('group', 3, 12, 1250000, 1390000),
  group_four_twelve : new Class('group', 4, 12, 1150000, 0),
  group_five_one : new Class('group', 5, 1, 168000, 187000),
  group_five_three1 : new Class('group', 5, 3, 408000, 453000),
  group_five_three2 : new Class('group', 5, 3, 429000, 477000),
  group_five_six1 : new Class('group', 5, 6, 768000, 853000),
  group_five_six2 : new Class('group', 5, 6, 810000, 898000),
  group_five_twelve1 : new Class('group', 5, 12, 1340000, 1490000),
  group_five_twelve2 : new Class('group', 5, 12, 1410000, 1570000),
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
    // const rowHeight = checkedRow.offsetHeight 
    //이걸로하면 56.53 이 올려져서 57이할당됨
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
  // console.log('submit!!');
  const formData = new FormData(evt.target)
  const memberObj = Object.fromEntries(formData)
  // console.log('form으로얻은 formdata :',memberObj)
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
  // console.log(payment);
  // console.log(payKey);
  setPaymentClassInfo(payment, payKey)
}
// 넘어온 obj.class 속성으로 pay_fee 및 class_type, times_a_week, class_term 담긴 pay_class 프로퍼티(추가)
function setPaymentClassInfo(obj, key) { //이거 원본 수정될수도있는건가
  // console.log(obj, key)
  const payClass = {
    class_type : classDic[key].class_type,
    times_a_week : classDic[key].times_a_week,
    class_term : classDic[key].class_term,
  } //여기서 classDic의 참조가 넘어와서 망가질가능성있음
  obj.pay_class = payClass
  // console.log(obj.pay_method);
  // console.log(classDic[key][`${obj.pay_method}_price`]);
  obj.pay_fee = classDic[key][`${obj.pay_method}_price`]
  console.log(obj);
}


//  class, 결제수단, 결제강사 까지는 넘어옴 class를 토대로 결제일과 붙여서  
async function createNewPayment(obj) {
  
}