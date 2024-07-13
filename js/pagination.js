/*
구성요소

현재 element개수
보여줄 최대 element개수
element로 인해 생기는 page개수
현재 page number

ex) elNum = 9, maxNum = 5
    pageNum = maxElNum / elNum
*/
const els = [1,2,3,4,5,6,7,8,9]
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

    const prevBtn = document.querySelector('#pagination button#prev')
    const nextBtn = document.querySelector('#pagination button#next')
    // prevBtn.disabled = true
    prevBtn.addEventListener('click', this.paginationBarController)
    nextBtn.addEventListener('click', this.paginationBarController)
  }

  showCurrentPage() {
    
  }

  paginationBarController() {
    console.log('click');
  }


}
const paginationObj = new Pagination()
console.log(`원소개수 : ${paginationObj.elNum}`);
console.log(`최대 원소 개수 : ${paginationObj.maxElNum}`);
console.log(`페이지 개수 : ${paginationObj.pageNum}`);
console.log(`현재 페이지 번호 : ${paginationObj.curPageNum}`);
