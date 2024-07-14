/*
구성요소

현재 element개수
보여줄 최대 element개수
element로 인해 생기는 page개수
현재 page number

ex) elNum = 9, maxNum = 5
    pageNum = maxElNum / elNum
*/
const els = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
// const els = document.querySelectorAll('tr')
class Pagination{
  constructor() {
    // elNum, pageNum등을 계산후 초기화
    this.elNum = els.length //9
    this.maxElNum = 5 //5
    this.pageNum = (this.elNum % this.maxElNum == 0) ? Math.floor(this.elNum / this.maxElNum) : Math.floor(this.elNum / this.maxElNum) + 1
    this.maxPageNum = 5

    this.curPageNum = 1
  }
  initPaginationBar() {
    // 계산된 pageNum을 통해 indicator개수세팅
    const pageIndicatorDiv = document.querySelector("#pagination #page-indicator")
    if(this.pageNum < this.maxPageNum) { // 계산된 page수 < 최대 page수(5)
      for(let i = 0; i < this.pageNum; i++) {
        pageIndicatorDiv.innerHTML += `<div class="page-btn">
          <span class ="page-num">${i + 1}</span>
        </div>
        `
      }
    } else {
      for(let i = 0; i < this.maxPageNum; i++) {
        pageIndicatorDiv.innerHTML += `<div class="page-btn">
          <span class ="page-num">${i + 1}</span>
        </div>
        `
      }
    }

    const pageBtnElements = pageIndicatorDiv.querySelectorAll(".page-btn")
    pageBtnElements.forEach((btnNode) => {
      // console.log(btnNode);
      btnNode.addEventListener('click', () => {
        this.curPageNum = Number(btnNode.textContent)
        console.log(`직접이동한 curPageNum ${this.curPageNum}`);
        this.styleCurpageBtn()
        this.showCurrentPageItems()
      })
    })


    this.styleCurpageBtn()
    this.showCurrentPageItems()
    const prevBtn = document.querySelector('#pagination button#prev')
    const nextBtn = document.querySelector('#pagination button#next')
    // prevBtn.disabled = true
    // console.log(this.paginationBarController);
    prevBtn.addEventListener('click', () => {
      // this.curPageNum -= 1
      // console.log(this.curPageNum);


      const changedCurPageNum = this.curPageNum - 1  
      // console.log(changedCurPageNum)
      if(changedCurPageNum > 0) {
        this.curPageNum -= 1
        this.styleCurpageBtn()
        this.showCurrentPageItems()
      }
      // console.log(this.curPageNum);
    })
    nextBtn.addEventListener('click', () => {
      // this.curPageNum += 1
      // console.log(this.curPageNum);


      const changedCurPageNum = this.curPageNum + 1  
      // console.log(changedCurPageNum);
      if(changedCurPageNum <= this.pageNum) {
        this.curPageNum += 1
        this.styleCurpageBtn()
        this.showCurrentPageItems()
      }
      // console.log(this.curPageNum);
    })
  }

  
  // paginationBarController() {
  //   const changedCurPageNum = this.curPageNum - 1
  //   if((changedCurPageNum > 0) && (changedCurPageNum < this.pageNum)) {
  //     console.log();
  //   }
  //   console.log('click');
  //   // this.styleCurpageBtn()
  // }

  styleCurpageBtn() {
    const pageIndicatorDiv = document.querySelector("#pagination #page-indicator")
    const prevCurBtnEl = pageIndicatorDiv.querySelector(".current")
    if(!prevCurBtnEl) {
      const firstPageBtn = document.querySelector(".page-btn:first-child")
      // console.log(firstPageBtn);
      firstPageBtn.classList.add("current")
      return
    }
    // 갱신된 curPageNum에 대해 표시 
    prevCurBtnEl.classList.remove("current")
    const btnEls = Array.from(pageIndicatorDiv.querySelectorAll("div.page-btn"))
    const curBtnEl = btnEls.filter((node) => node.textContent == this.curPageNum)[0]  
    curBtnEl.classList.add("current")
    // console.log(btnEls);
    // const curBtnEl = btnEls
    // console.log(prevCurBtnEl);
    // prevCurBtnEl.classList.remove("current")

    /*
    */
    // btnEls.forEach((node) => console.log(node.textContent))
  }

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

    const tableDiv = document.querySelector("div.inner table")
    tableDiv.innerHTML = ""
    strOfItems.forEach((itemStr) => {
      tableDiv.innerHTML += itemStr
    })
    // console.log(slicedItems);
  }
}
const paginationObj = new Pagination()
paginationObj.initPaginationBar()
console.log(`원소개수 : ${paginationObj.elNum}`);
console.log(`최대 원소 개수 : ${paginationObj.maxElNum}`);
console.log(`페이지 개수 : ${paginationObj.pageNum}`);
console.log(`현재 페이지 번호 : ${paginationObj.curPageNum}`);
