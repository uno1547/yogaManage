
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js'
import { getFirestore, addDoc, collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js';
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
await addDoc(collection(db, "test_payments_string"), {
  user_id : 9999,
  user_name : '테스트',
  pay_date : "20240724",
  expire_date : "20240824",
  pay_fee : 10000, 
  pay_method : "cash", 
  pay_teacher : "김예림", 
  pay_class : { 
    class_type : "group", 
    times_a_week : 2, 
    class_term : 1, 
    }
});
*/

class Pagination {
  constructor(paymentArr, userDic) {
    this.elNum = paymentArr.length
    this.maxElNum = 10
    this.pageNum = (this.elNum % this.maxElNum == 0) ? Math.floor(this.elNum / this.maxElNum) : Math.floor(this.elNum / this.maxElNum) + 1
    this.curPageNum = 1
    this.paymentArr = paymentArr
    this.userDic = userDic
  }
  // #pagitaion 초기화하고, pageNum만큼 indicator추가
  initPaginationBar() {
    const paginationDiv = document.querySelector(".inner div#pagination")
    paginationDiv.innerHTML = 'hi'
    if(this.elNum == 0) {
      const listDiv = document.querySelector("div#table-list table#list-val")
      listDiv.innerHTML = "해당날짜에 만료예정 결제가 없습니다."
      return
    }
    // pagination 컴포넌트 추가
    paginationDiv.innerHTML = `<button id="prev"><</button>
    <div id="page-indicator"></div>
    <button id = "next">></button>
    `
    const pageIndicatorDiv = document.querySelector("#pagination #page-indicator")
    for(let i = 0; i < this.pageNum; i++) {
      pageIndicatorDiv.innerHTML += `<div class="page-btn">
        <span class ="page-num">${i + 1}</span>
      </div>
      `
    }

    // 각indicator에 클릭 리스너추가 (클릭시 해당페이지로이동)
    const pageBtnElements = pageIndicatorDiv.querySelectorAll(".page-btn")
    pageBtnElements.forEach((btnNode) => {
      btnNode.addEventListener('click', () => {
        // 이 리스너도 사실 중첩등록의 여지가 있지만, 매번 #pagination을 비우고시작하기에 상관없음
        this.curPageNum = Number(btnNode.textContent)
        console.log(`curPageNum : ${this.curPageNum}`);
        this.styleCurpageBtn()
        this.showCurrentPageItems()
      })
    })
    // 맨처음
    this.styleCurpageBtn()
    this.showCurrentPageItems()


    const prevBtn = document.querySelector('#pagination button#prev')
    const nextBtn = document.querySelector('#pagination button#next')

    // nextBtn, prevBtn 에 클릭 리스너추가
    prevBtn.addEventListener('click', () => {
      const changedCurPageNum = this.curPageNum - 1  
      if(changedCurPageNum > 0) {
        this.curPageNum -= 1
        console.log(`curPageNum : ${this.curPageNum}`);
        this.styleCurpageBtn()
        this.showCurrentPageItems()
      }
    })
    
    nextBtn.addEventListener('click', () => {
      const changedCurPageNum = this.curPageNum + 1  
      // 여기서 이 this는 nextBtn을 가르키지않네??? 
      if(changedCurPageNum <= this.pageNum) {
        this.curPageNum += 1
        console.log(`curPageNum : ${this.curPageNum}`);
        this.styleCurpageBtn()
        this.showCurrentPageItems()
      }
    })
  }

  styleCurpageBtn() {
    const pageIndicatorDiv = document.querySelector("#pagination #page-indicator")
    const prevCurBtnEl = pageIndicatorDiv.querySelector(".current")
    // 맨처음에는 선택된 버튼없으므로 초기화
    if(!prevCurBtnEl) {
      const firstPageBtn = document.querySelector(".page-btn:first-child")
      firstPageBtn.classList.add("current")
      return
    }
    // 갱신된 curPageNum에 대해 스타일  
    prevCurBtnEl.classList.remove("current")
    const btnEls = Array.from(pageIndicatorDiv.querySelectorAll("div.page-btn"))
    const curBtnEl = btnEls.filter((node) => node.textContent == this.curPageNum)[0]  
    curBtnEl.classList.add("current")
  }
  // curPageNum에 대해 item추가
  async showCurrentPageItems() {
    // 현재 구간에 대해서 slice해서 보여주면됌
    const startIdx = this.maxElNum * (this.curPageNum - 1)
    const endIdx = this.maxElNum * this.curPageNum
    console.log(`startIdx : ${startIdx} endIdx : ${endIdx}`)
    // 위치!! 여기뭔가 이상할지도 너무빨리 없애서?
    console.log(this.elNum);
    // 위치


    // start 부터 index 까지 info프로퍼티 추가해줌
    for(let i = startIdx; i < endIdx; i++) {
      const payment = this.paymentArr[i]
      if(!payment) break
      // console.log(payment);
      payment.info = {}
      const id = payment.user_id
      const infoPromise = this.userDic[id]
      await infoPromise.then((response) => response.forEach((snapshot) => {
        payment.info.teacher = snapshot.data().teacher
        payment.info.phoneNum = snapshot.data().phone_number
      }))
    }

    // 결제일 최신순으로 정렬
    // this.paymentArr.sort((a, b) => {
    //   if(a.pay_date < b.pay_date) { // 2023 2024
    //     return 1
    //   } else if(a.pay_date > b.pay_date){
    //     return -1
    //   } else {
    //     return 0
    //   }
    // })
    
    // info프로퍼티 추가된 start부터 index까지 html문자열화 
    const slicedPayments = this.paymentArr.slice(startIdx, endIdx)
    const paymentsInnerHTML = slicedPayments.map((payment) => {
      const payDate = payment.pay_date
      const [payYear, payMonth, payDay] = [payDate.slice(0, 4), payDate.slice(4, 6), payDate.slice(6)]
      const expireDate = payment.expire_date
      const [expireYear, expireMonth, expireDay] = [expireDate.slice(0, 4), expireDate.slice(4, 6), expireDate.slice(6)]
      return `<tr>
              <td>${payYear}-${payMonth}-${payDay}</td>
              <td>${payment.user_name}</td>
              <td>${"미지정"}</td>
              <td>${payment.pay_teacher}</td>
              <td>${"미지정"}</td>
              <td>요가 주${payment.pay_class.times_a_week}회 [${payment.pay_class.class_term}개월] [주 ${payment.pay_class.times_a_week}회권]</td>
              <td>${payYear}-${payMonth}-${payDay}</td>
              <td>${expireYear}-${expireMonth}-${expireDay}</td>
              <td>${100000}</td>
            </tr>`
    })
    
    const tableDiv = document.querySelector("div.inner table#list-val")
    tableDiv.innerHTML = ""

    for(let i = 0; i < paymentsInnerHTML.length; i++) {
      tableDiv.innerHTML += paymentsInnerHTML[i]
    } 
    for(let i = paymentsInnerHTML.length; i < 10; i++) {
      tableDiv.innerHTML += `          <tr class = "skeleton-line">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>`
    }
    // paymentsInnerHTML.forEach((el) => {
    //   tableDiv.innerHTML += el
    // })
  }

}


let date = new Date()
const dayInputStart = document.querySelector('#date-input input#start-date')
const dayInputEnd = document.querySelector('#date-input input#end-date')
// dayInputStart.addEventListener('input', () => {
//   console.log('input발생 arrowhandler', this);
// })
// dayInputStart.addEventListener('change', () => {
//   console.log('change발생 arrow', this);
// })
dayInputStart.addEventListener('input',function() {
  console.log('input발생 anonymous', this.value);
})
dayInputStart.addEventListener('change',function() {
  console.log('change발생 anonymous', this.value);
})
dayInputStart.addEventListener('blur',function() {
  console.log('blur발생 anonymous', this.value);
})

// 1. 오늘부터 15일 이전까지의 pay_date들을 불러온다!
async function getQueries() {
  const queriedPayments = [] // 불러온 payments 담을 배열
  const userDic = {} // 해당구간의 날짜에 속하는 pay_date의 userinfo를
  // const q = query(collection(db, "test_payments_string"))
  const q = query(collection(db, "test_payments_string"), where("pay_date", "<=", getTodayDateString()), where("pay_date", ">=", getPrevDateString()))
  // const numSnapshot = getDocs(q)
  // console.log(numSnapshot)
  const querySnapshot = await getDocs(q) // payments 컬랙션에 결제를 요청 (id로 쿼리날리는건 최소한 이라인 이후부터 실행해야할듯)
  console.log(querySnapshot.size); // await을 안하면 size불러올수없음 > 
  querySnapshot.forEach((doc) => {
    // 받은 결제데이터들을 받음과 동시에, 결제의 user_id로 member컬렉션에 미리 요청날려놓음 await는 안함. promise로 받아서 아래가서쓸거임
    const id = doc.data().user_id
    const idQuery = query(collection(db, "test_members"), where("user_id", "==", id))
    userDic[id] = getDocs(idQuery) // {1100 : promise, 2212 : promise}
    queriedPayments.push(doc.data()) // 받은 결제 담음
  })

  // 결제일 최신순으로 정렬
  queriedPayments.sort((a, b) => {
    if(a.pay_date < b.pay_date) { // 2023 2024
      return 1
    } else if(a.pay_date > b.pay_date){
      return -1
    } else {
      return 0
    }
  })

  console.log(userDic);
  console.log(queriedPayments);
  showInOverview(queriedPayments)
  // initInput()
  const page = new Pagination(queriedPayments, userDic)
  console.log(`elNum : ${page.elNum} maxNum : ${page.maxElNum} pageNum : ${page.pageNum}`);
  page.initPaginationBar()
  /*
  이렇게 하면 순차적으로 뜨는데, 아래처럼주면 찰나에 안뜨고 무시됨
  */
//  setTimeout(() => {
//    showPaymentList(queriedPayments, userDic)
//  }, 200);
  // showPaymentList(queriedPayments, userDic)
}
getQueries()
// 쿼리에쓰이는 문자열반환함수
function getTodayDateString() {
  const todayDate = new Date()
  const [year, month, date] = [todayDate.getFullYear(), String(todayDate.getMonth() + 1).padStart(2, '0'), String(todayDate.getDate()).padStart(2, '0')]
  // console.log(`${year}${month}${date}`);
  return `${year}${month}${date}`
}
// 쿼리에쓰이는 문자열반환함수
function getPrevDateString() {
  const prevDate = new Date()
  prevDate.setDate(prevDate.getDate() - 30)
  const [year, month, date] = [prevDate.getFullYear(), String(prevDate.getMonth() + 1).padStart(2, '0'), String(prevDate.getDate()).padStart(2, '0')]
  // console.log(`${year}${month}${date}`);
  return `${year}${month}${date}`
}
// 개수만큼 틀넣음
function showSkeletonLoading(num) {
  // const shortViewSkeletonDiv = document.querySelector()
  const skeletonDiv = document.querySelector("#table-list table#list-val")
  console.log(skeletonDiv);
  for(let i = 0; i < num; i++) {
    // console.log(i);
    skeletonDiv.innerHTML += `<tr class = "skeleton-line">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>`
  }

}

//3. 불러온 결제를 shortview 에 표시
function showInOverview(payments) {
  const overViewDiv = document.querySelector('table#short-view-val')
  overViewDiv.innerHTML = ''

  const payNum = payments.length
  const result = payments.reduce((price, payment) => {
    const fee = payment.pay_fee
    if(payment.pay_method == 'cash') {
      price.cash += fee
    } else {
      price.card += fee
    }
    price.total += fee
    return price
  }, {card : 0, cash : 0, total : 0})
  // console.log(result);
  const cardPrice = getFormattedNum(result.card)
  const cashPrice = getFormattedNum(result.cash)
  const totalPrice = getFormattedNum(result.total)
  overViewDiv.innerHTML = `<tr>
          <td>${payNum}</td>
          <td>${cardPrice}</td>
          <td>${cashPrice}</td>
          <td>0</td>
          <td>${totalPrice}</td>
        </tr>`
}
function getFormattedNum(number) {
  const strNum = String(number)
  let result = ''
  for(let i = 0; i < strNum.length; i++) {
    result += strNum[i]
    if(((strNum.length - i) % 3 == 1) && i != strNum.length - 1) {
      result += ','
    }
  }
  return result
}

//4. 기본날짜구간 (오늘 - 15일 ~ 오늘) input에 표시
function initInput() {
  const startInput = document.querySelector("input#start-date")
  const endInput = document.querySelector("input#end-date")
  const startDate = new Date()
  const [startYear, startMonth, startDay] = [startDate.getFullYear(), String(startDate.getMonth() + 1).padStart(2, '0'), String(startDate.getDate()).padStart(2, '0')]
  const prevDate = new Date()
  prevDate.setDate(prevDate.getDate() - 30)
  const [endYear, endMonth, endDay] = [prevDate.getFullYear(), String(prevDate.getMonth() + 1).padStart(2, '0'), String(prevDate.getDate()).padStart(2, '0')]
  endInput.value = `${startYear}-${startMonth}-${startDay}`
  startInput.value = `${endYear}-${endMonth}-${endDay}`
}

//5. 해당 결제의 user_id로 담당강사, 휴대폰번호 불러와야함
/*
async function getInfo(userId) {
  const q = query(collection(db, "test_members"), where("user_id", "==", userId))
  const querySnapshot = await getDocs(q) 
  const info = {}
  querySnapshot.forEach((doc) => {
    info.teacher = doc.data().teacher
    info.phoneNumber = doc.data().phone_number
  })
  return info
}
*/
//5. 기본 날짜구간 리스트에 표시
async function showPaymentList(payments, userInfo) {
  const listValDiv = document.querySelector("div#table-list table#list-val")
  listValDiv.innerHTML = ''
  for(let i = 0; i < payments.length; i++) {
    // 여기서 user_id로 접근가능한상황임 미리 전역에 담아두었던 프로미스 배열에서 꺼내서 프로퍼티 추가해줌
    payments[i]["info"] = {}
    const id = payments[i].user_id
    const promise = userInfo[id]
    await promise.then((snapshot) => snapshot.forEach((snapshot) => {
      payments[i]["info"].teacher = snapshot.data().teacher
      payments[i]["info"].phoneNum = snapshot.data().phone_number
    }))
    // console.log(payments[i]);
    // console.log(payments[i].info);
  }
  // 위에서 추가한 최종payment object들 출력
  const skelton = document.querySelector("div#is-loading")
  // skelton.remove()

  // payments.forEach(payment => {
  //   console.log(payment);
  // });
  /*
  일반 sort 사전순으로 정렬되기에 1000, 21 과같이 크기순정렬이되지않는다.

  */
  // 결제일 최신순으로 정렬
  payments.sort((a, b) => {
    if(a.pay_date < b.pay_date) { // 2023 2024
      return 1
    } else if(a.pay_date > b.pay_date){
      return -1
    } else {
      return 0
    }
  })
  // 정렬완료된걸 형식에 맞게 출력
  const paymentStrs = payments.map((payment) => {
    const payDate = payment.pay_date
    const [payYear, payMonth, payDay] = [payDate.slice(0, 4), payDate.slice(4, 6), payDate.slice(6)]
    const expireDate = payment.expire_date
    const [expireYear, expireMonth, expireDay] = [expireDate.slice(0, 4), expireDate.slice(4, 6), expireDate.slice(6)]
    return `<tr>
            <td><span>${payYear}-${payMonth}-${payDay}</span></td>
            <td><span>${payment.user_name}</span></td>
            <td><span>${payment.info.teacher}</span></td>
            <td><span>${payment.pay_teacher}</span></td>
            <td><span>${payment.info.phoneNum}</span></td>
            <td>요가 주${payment.pay_class.times_a_week}회 [${payment.pay_class.class_term}개월] [주 ${payment.pay_class.times_a_week}회권]</td>
            <td>${payYear}-${payMonth}-${payDay}</td>
            <td>${expireYear}-${expireMonth}-${expireDay}</td>
            <td>${100000}</td>
          </tr>`
  })
  paymentStrs.forEach((el) => {
    listValDiv.innerHTML += el
  })
}