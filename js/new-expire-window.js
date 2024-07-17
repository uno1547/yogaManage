import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js'
import { getFirestore, collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js';
const app = initializeApp({
  apiKey: "AIzaSyBykm-oqoMvIAjLFWHPnVi_OQ86Iis_NVs",
  authDomain: "yoga-663cb.firebaseapp.com",
  projectId: "yoga-663cb",
  storageBucket: "yoga-663cb.appspot.com",
  messagingSenderId: "256248240983",
  appId: "1:256248240983:web:07dcebbcb04debc34b3c12"
})
const db = getFirestore(app)

const prevBtn = document.querySelector("#date-nav #prev")
const nextBtn = document.querySelector("#date-nav #next")
const dateText = document.querySelector("#date-nav h2")

prevBtn.addEventListener('click', function() {
  day.setDate(day.getDate() - 1) 
  showDate()
  filterExpireee()
})
nextBtn.addEventListener('click', function() {
  day.setDate(day.getDate() + 1)
  showDate()
  filterExpireee()
})
/*
const allPaymentsFirestore = []
const q1 = query(collection(db, "open_payments"))
const querySnapshot1 = await getDocs(q1)
querySnapshot1.forEach(doc => {
  allPaymentsFirestore.push(doc.data())
});
const parsedDatas = allPaymentsFirestore.map((pay) => {
  return {name : pay.user_id, payDay : `${pay.pay_year} / ${pay.pay_month} / ${pay.pay_day}`, expDay : `${pay.pay_year} / ${pay.pay_month + pay.pay_class.class_term} / ${pay.pay_day}`}
})
console.log(parsedDatas);
*/
// 최초의 기준날짜는 현재날짜(금일)
const day = new Date()
showDate()

// 일단위 표시에서 Date로 기준날짜(금일) 표시
function showDate() {
  let [year, month, date] = [day.getFullYear(), day.getMonth() + 1, day.getDate()]
  month = String(month).padStart(2, '0')
  date = String(date).padStart(2, '0')
  dateText.innerHTML = `${year}년 ${month}월 ${date}일`
  console.log('현재 날짜는', day.toLocaleDateString());
}

// 7/9일 
/*
해야할것
만기날짜가 표시날짜 ~ 2주후 날짜 사이에 포함된다면 해당 결제들을 표시
해당 결제에 포함된 정보(이름, 수강권, 만기날짜)

1. 모든 결제를 일단 불러온다(배열에 담고) > 버튼을 누를때마다 갱신되는 날짜에 맞춰서 다시 filter해서 출력
장점 : 데이터 불러오기 한번이면 끝난다.
단점 : 전역변수를 사용하게 된다. filter작업을 어차피하면 

2. 버튼을 누를때마다 새요청을 보내고, 해당 데이터들만 출력
장점 : ?
단점 : 누를때마다 매번 요청을 해야한다.?
*/

// 전체 결제를 불러옴 



const allPayments = []
const q = query(collection(db, "open_payments"))
const querySnapshot = await getDocs(q)
querySnapshot.forEach(doc => {
  allPayments.push(doc.data())
});
filterExpireee()
console.log('hi');

// 순서 : 필터링(기준날짜15일) > 정렬 > 결제별 정보(회원) > 

class Pagination {
  constructor(userArr, expireArr) {
    // 현재 el개수, 페이지당최대el개수 >> pageNum 계산
    this.elNum = expireArr.length 
    this.maxElNum = 5
    this.pageNum = (this.elNum % this.maxElNum == 0) ? Math.floor(this.elNum / this.maxElNum) : Math.floor(this.elNum / this.maxElNum) + 1
    this.curPageNum = 1

    this.userArr = userArr
    this.expireArr = expireArr
    console.log(this.userArr, this.expireArr);
    console.log(`결제개수 : ${this.elNum} 페이지개수 : ${this.pageNum} 현재페이지번호 : ${this.curPageNum}`);
  }
  initPaginationBar() {
    // 계산된 pageNum을 통해 indicator개수세팅
    const pageIndicatorDiv = document.querySelector("#pagination #page-indicator")
    pageIndicatorDiv.innerHTML = ''
    for(let i = 0; i < this.pageNum; i++) {
      pageIndicatorDiv.innerHTML += `<div class="page-btn">
        <span class ="page-num">${i + 1}</span>
      </div>
      `
    }
    // 숫자 직접클릭시 페이지 이동 가능하게 리스너 추가
    const pageBtnElements = pageIndicatorDiv.querySelectorAll(".page-btn")
    pageBtnElements.forEach((btnNode) => {
      btnNode.addEventListener('click', () => {
        this.curPageNum = Number(btnNode.textContent)
        this.styleCurpageBtn()
        this.showCurrentPageItems()
      })
    })

    // 최초 current 페이지 스타일적용 및 해당 page item 표시
    this.styleCurpageBtn()
    this.showCurrentPageItems()

    const prevBtn = document.querySelector('#pagination button#prev')
    const nextBtn = document.querySelector('#pagination button#next')
    prevBtn.addEventListener('click', () => {
      const changedCurPageNum = this.curPageNum - 1  
      if(changedCurPageNum > 0) {
        this.curPageNum -= 1
        this.styleCurpageBtn()
        this.showCurrentPageItems()
      }
    })
    nextBtn.addEventListener('click', () => {
      const changedCurPageNum = this.curPageNum + 1  
      if(changedCurPageNum <= this.pageNum) {
        this.curPageNum += 1
        this.styleCurpageBtn()
        this.showCurrentPageItems()
      }
    })
  }
  // .current 에 스타일 추가
  styleCurpageBtn() {
    const pageIndicatorDiv = document.querySelector("#pagination #page-indicator")
    const prevCurBtnEl = pageIndicatorDiv.querySelector(".current")
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
    /*
    */
  }
  // curPageNum에 대해 item추가
  showCurrentPageItems() {
    const startIdx = this.maxElNum * (this.curPageNum - 1)
    const endIdx = this.maxElNum * this.curPageNum
    console.log(startIdx, endIdx);
    const tableDiv = document.querySelector("div.inner table.list-val")
    tableDiv.innerHTML = ""

    for(let i = startIdx; i < endIdx; i++) {
      const curExpire = this.expireArr[i]
      const curMember = this.userArr[i]
      if(curExpire == undefined || curMember == undefined) break
      const classType = (curExpire.pay_class.class_type == 'group') ? "요가" : "개인레슨"
      const perWeek = curExpire.pay_class.times_a_week
      const classTerm = curExpire.pay_class.class_term

      const endArr = getEnd(curExpire)
      const [startYear, startMonth, startDay] = [curExpire.pay_year, String(curExpire.pay_month).padStart(2, '0'), String(curExpire.pay_day).padStart(2, '0')]
      const [endYear, endMonth, endDay] = [endArr[0], String(endArr[1]).padStart(2, '0'), String(endArr[2]).padStart(2, '0')]
      const leftDays = getTermToday(curExpire)
      let tableElStr
      if(leftDays < 0) {
        tableElStr =  `<tr class = 'exp'>
        <td>${i + 1}</td>
        <td>${curMember.name} (${curMember.user_id}) [${curMember.gender}]</td>
        <td>${classType} 주${perWeek}회 [${classTerm}개월]</td>
        <td>${startYear}.${startMonth}.${startDay} ~ ${endYear}.${endMonth}.${endDay} ( ${leftDays}일 )</td>
      </tr>`
      } else {
        tableElStr = `<tr>
          <td>${i + 1}</td>
          <td>${curMember.name} (${curMember.user_id}) [${curMember.gender}]</td>
          <td>${classType} 주${perWeek}회 [${classTerm}개월]</td>
          <td>${startYear}.${startMonth}.${startDay} ~ ${endYear}.${endMonth}.${endDay} ( ${leftDays}일 )</td>
        </tr>`
      }
      tableDiv.innerHTML += tableElStr
    }
    /*
    const slicedExpires = this.expireArr.slice(startIdx, endIdx)
    const slicedUsers = this.userArr.slice(startIdx, endIdx)
    console.log(`start : ${startIdx} end : ${endIdx}`);
    console.log(slicedExpires);
    // map을 할때마다 당연히 슬라이스 된 위치부터 자르므로, idx가 0부터 시작된다
    const strOfItems = slicedExpires.map((val, idx) => {
      const curExpire = val
      const payUser = slicedUsers[idx]
      const classType = (curExpire.pay_class.class_type == 'group') ? "요가" : "개인레슨"
      const perWeek = curExpire.pay_class.times_a_week
      const classTerm = curExpire.pay_class.class_term

      const endArr = getEnd(curExpire)
      const [startYear, startMonth, startDay] = [curExpire.pay_year, String(curExpire.pay_month).padStart(2, '0'), String(curExpire.pay_day).padStart(2, '0')]
      const [endYear, endMonth, endDay] = [endArr[0], String(endArr[1]).padStart(2, '0'), String(endArr[2]).padStart(2, '0')]
      const leftDays = getTermToday(curExpire)
      let tableElStr
      if(leftDays < 0) {
        return `<tr class = 'exp'>
        <td>${idx + 1}</td>
        <td>${payUser.name} (${payUser.user_id}) [${payUser.gender}]</td>
        <td>${classType} 주${perWeek}회 [${classTerm}개월]</td>
        <td>${startYear}.${startMonth}.${startDay} ~ ${endYear}.${endMonth}.${endDay} ( ${leftDays}일 )</td>
      </tr>`
      } else {
        return `<tr>
          <td>${idx + 1}</td>
          <td>${payUser.name} (${payUser.user_id}) [${payUser.gender}]</td>
          <td>${classType} 주${perWeek}회 [${classTerm}개월]</td>
          <td>${startYear}.${startMonth}.${startDay} ~ ${endYear}.${endMonth}.${endDay} ( ${leftDays}일 )</td>
        </tr>`
      }

      // tableDiv.innerHTML += tableElStr
      // return `<tr>
      // <th>${val}</th>
      // <th>이름${val}</th>
      // <th>설명${val}</th>
      // </tr>`
    })
    const tableDiv = document.querySelector("div.inner table.list-val")
    tableDiv.innerHTML = ""
    strOfItems.forEach((itemStr) => {
      tableDiv.innerHTML += itemStr
    })
    */
  }
}


// 현재 날짜 기준으로 만료일이 15일 이후까지인 결제들 filter
function filterExpireee() {
  // allPayments.forEach((pay) => {getTerm(pay)})
  // console.log('hi');
  const soonExpire = allPayments.filter((pay) => {
    // console.log('filtering');
    return ((pay.pay_fee <= 100) &&(getTerm(pay) <= 15)) && (getTerm(pay) >= 0) //평가하니깐 당연히 출력됨
    // return ((pay.pay_fee < 50) && (getTerm(pay) <= 15) && (getTerm(pay) >= 0))
  })
  // console.log(soonExpire);
  sortExpires(soonExpire)
}

function sortExpires(expires) {
  expires.sort((a, b) => {
    const aDiff = getTerm(a)
    const bDiff = getTerm(b)
    
    if(aDiff < bDiff) return -1
    else if(aDiff > bDiff) return 1
    else return 0
  })
  // showExpires(expires)
  getExpireInfo(expires)
  // console.log(expires);
}
/*
이름 불러오는 코드
const q = query(collection(db, "test_members"), where("user_id", "==", userId))
const querySnapshot = await getDocs(q)
querySnapshot.forEach((doc) => {
  console.log(doc.data())
  })
  */
async function getExpireInfo(expires) {
  const userArr = []
  for(let i = 0; i < expires.length; i++) {
    const payUser = await getInfo(expires[i].user_id)
    userArr.push(payUser)
  }
    // return userArr
  showExpires(userArr, expires)
}
  
function showExpires(userArr, expires) {
  console.log(userArr)
  console.log(expires);
  const tableDiv = document.querySelector("#table-div table.list-val")
  tableDiv.innerHTML = ''
    
  const paginationObj = new Pagination(userArr, expires)
  paginationObj.initPaginationBar()
    
    /*
    for(let i = 0; i < expires.length; i++) {
      const curExpire = expires[i]
      const payUser = userArr[i]

      // const payUser = await getInfo(curExpire.user_id) // 이상태면 undefined로 감싸진 프로미스 올듯함
      // {user_id: 2212, name: '김윤오' .... }
      console.log(payUser)
      // const classInfo = getClassInfo(curExpire)
      const classType = (curExpire.pay_class.class_type == 'group') ? "요가" : "개인레슨"
      const perWeek = curExpire.pay_class.times_a_week
      const classTerm = curExpire.pay_class.class_term
      const endArr = getEnd(curExpire)
      const [startYear, startMonth, startDay] = [curExpire.pay_year, String(curExpire.pay_month).padStart(2, '0'), String(curExpire.pay_day).padStart(2, '0')]
      const [endYear, endMonth, endDay] = [endArr[0], String(endArr[1]).padStart(2, '0'), String(endArr[2]).padStart(2, '0')]
      const leftDays = getTermToday(curExpire)
    let tableElStr
    if(leftDays < 0) {
      tableElStr = `<tr class = 'exp'>
      <td>${i + 1}</td>
      <td>${payUser.name} (${payUser.user_id}) [${payUser.gender}]</td>
      <td>${classType} 주${perWeek}회 [${classTerm}개월]</td>
      <td>${startYear}.${startMonth}.${startDay} ~ ${endYear}.${endMonth}.${endDay} ( ${leftDays}일 )</td>
      </tr>`
    } else {
      tableElStr = `<tr>
      <td>${i + 1}</td>
      <td>${payUser.name} (${payUser.user_id}) [${payUser.gender}]</td>
      <td>${classType} 주${perWeek}회 [${classTerm}개월]</td>
      <td>${startYear}.${startMonth}.${startDay} ~ ${endYear}.${endMonth}.${endDay} ( ${leftDays}일 )</td>
      </tr>`
    }
    tableDiv.innerHTML += tableElStr
  }
  */  
}

async function getInfo(userId) { //userId로 이름, 성별 불러옴
  // const userInfo = {}
  let user
  const q = query(collection(db, "test_members"), where("user_id", "==", userId))
  const querySnapshot = await getDocs(q)
  querySnapshot.forEach((doc) => {
    // console.log(doc.data())
    user = doc.data()
    // userInfo.name = doc.data().name
    // userInfo.gender = doc.data().gender
  })
  return user // Fulfilled된 프로미스(result : user객체)가 반환되야하는거아님??
}

function getEnd(pay) {
  // const start = {year : pay.pay_year, month : pay.pay_month, day : pay.pay_day}
  const term = pay.pay_class.class_term
  const endDate = new Date(pay.pay_year, pay.pay_month - 1, pay.pay_day)
  endDate.setMonth(endDate.getMonth() + term)
  // console.log(endDate);
  const endDateArr = [endDate.getFullYear(), endDate.getMonth() + 1, endDate.getDate()]
  return endDateArr
  // const end = 
}
function getTermToday(pay) { // 현재 날짜기준 결제만료일이몇일 남았는지 구하기위함
  // const payDate = new Date(pay.pay_year, pay.pay_month - 1, pay.pay_day)
  // console.log('결제날짜객체', payDate);
  // const expDate = new Date(2024, 5, 26) // 결제 일의객체
  const today = new Date()
  const expDate = new Date(pay.pay_year, pay.pay_month - 1, pay.pay_day) // 결제 일의객체
  expDate.setMonth(expDate.getMonth() + pay.pay_class.class_term)
  ///
  expDate.setHours(23)
  expDate.setMinutes(59)
  expDate.setMinutes(59)
  // console.log('만료날짜객체', expDate);
  // console.log('현재날짜객체', day);
  ///
  // const withParDate = new Date(2024,5,25)
  // console.log('현재날짜 2024,5,25', withParDate);
  // console.log(`결제일 ${payDate.toLocaleDateString()}만료일 ${expDate.toLocaleDateString()} Date() ${day.toLocaleDateString()}`);
  // const expOfPay = new Date(2024, 6, 25)
  const diffSec = expDate.getTime() - today.getTime()
  const diffDate = Math.floor(diffSec / (1000 * 60 * 60 * 24))
  // const diffDate = (diffSec > 0) ? Math.floor(diffSec / (1000 * 60 * 60 * 24)) + 1 : parseInt(diffSec / (1000 * 60 * 60 * 24))
  // const diffDate = Math.floor(Math.abs(diffSec / (1000 * 60 * 60 * 24)))
  // const diffDate = Math.floor((diffSec / (1000 * 60 * 60 * 24)))
  // const diffDate = (diffSec / (1000 * 60 * 60 * 24))
  // console.log(diffDate,'일');
  return diffDate
}

// 기준날짜와 pay의 만료일사이의 날짜차이를 계산 > 결제 데이터에 expiredate의 멤버를 넣으면 날짜 비교를 더 편하게 할수있으려나
function getTerm(pay) { // 기준 날짜와 결제 만료일이 몇일차이나는지 구하기위함
  // const payDate = new Date(pay.pay_year, pay.pay_month - 1, pay.pay_day)
  // console.log('결제날짜객체', payDate);
  // const expDate = new Date(2024, 5, 26) // 결제 일의객체
  const expDate = new Date(pay.pay_year, pay.pay_month - 1, pay.pay_day) // 결제 일의객체
  expDate.setMonth(expDate.getMonth() + pay.pay_class.class_term)
  ///
  expDate.setHours(23)
  expDate.setMinutes(59)
  expDate.setMinutes(59)
  // console.log('만료날짜객체', expDate);
  // console.log('현재날짜객체', day);
  ///
  // const withParDate = new Date(2024,5,25)
  // console.log('현재날짜 2024,5,25', withParDate);
  // console.log(`결제일 ${payDate.toLocaleDateString()}만료일 ${expDate.toLocaleDateString()} Date() ${day.toLocaleDateString()}`);
  // const expOfPay = new Date(2024, 6, 25)
  const diffSec = expDate.getTime() - day.getTime()
  const diffDate = Math.floor(diffSec / (1000 * 60 * 60 * 24))
  // const diffDate = (diffSec > 0) ? Math.floor(diffSec / (1000 * 60 * 60 * 24)) + 1 : parseInt(diffSec / (1000 * 60 * 60 * 24))
  // const diffDate = Math.floor(Math.abs(diffSec / (1000 * 60 * 60 * 24)))
  // const diffDate = Math.floor((diffSec / (1000 * 60 * 60 * 24)))
  // const diffDate = (diffSec / (1000 * 60 * 60 * 24))
  // console.log(diffDate,'일');
  return diffDate
}
/*
11 -1일
12 0일
13 1
14 2
15 3
16 4
17 5
18 6
19 9
20 10
21 11
22 12
23 13
24 14
25 15







*/