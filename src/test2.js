const dropDownEl = document.querySelector('#drop-down3')
dropDownEl.addEventListener("mouseleave", function(){
  console.log('mouseleave')
  dropDownEl.scrollTo(0, 0) // behavior smooth는 안됨
/*
  dropDownEl.scrollTo({
    top : 0,
    left : 0,
    behavior : "smooth"
  })
*/
})

// const outer = document.querySelector('div#outer')
// const inner = document.querySelector('div#inner')
// outer.addEventListener("mouseover", function() {
//   console.log('outer!!');
// })
// inner.addEventListener("mouseover", function() {
//   console.log('inner!!');
// })