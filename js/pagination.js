/*
구성요소

현재 element개수
page 당 보여줄 최대 element개수
element로 인해 생기는 총 page개수
현재 page number

*/
// const els = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
const els = new Array(8).fill(0).map((val, idx) => idx + 1)
console.log(els);

class Pagination{
  constructor() {
    // 현재 el개수, 페이지당최대el개수 >> pageNum 계산
    this.elNum = els.length 
    this.maxElNum = 5
    this.pageNum = (this.elNum % this.maxElNum == 0) ? Math.floor(this.elNum / this.maxElNum) : Math.floor(this.elNum / this.maxElNum) + 1
    // this.maxPageNum = 5

    this.curPageNum = 1
  }
  initPaginationBar() {
    // 계산된 pageNum을 통해 indicator개수세팅
    const pageIndicatorDiv = document.querySelector("#pagination #page-indicator")
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
    const slicedItems = els.slice(startIdx, endIdx)
    const strOfItems = slicedItems.map((val) => {
      return `<tr>
        <th>${val}</th>
        <th>이름${val}</th>
        <th>설명${val}</th>
      </tr>`
    })

    const tableDiv = document.querySelector("div.inner table.list-val")
    tableDiv.innerHTML = ""
    strOfItems.forEach((itemStr) => {
      tableDiv.innerHTML += itemStr
    })
  }
}
const paginationObj = new Pagination()
paginationObj.initPaginationBar()
console.log(`원소개수 : ${paginationObj.elNum}`);
console.log(`최대 원소 개수 : ${paginationObj.maxElNum}`);
console.log(`페이지 개수 : ${paginationObj.pageNum}`);
console.log(`현재 페이지 번호 : ${paginationObj.curPageNum}`);
