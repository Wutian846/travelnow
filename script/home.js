function interval() {
    plusSlides(1);
    setTimeout(interval, 10000); 
} function binterval() {
    plusSlides(1);
    setTimeout(binterval, 15000); 
}
let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active";
}
let bslideIndex = 1;
showSlides(bslideIndex);

function plusSlides(n) {
  showSlides(bslideIndex += n);
}

function currentSlide(n) {
  showSlides(bslideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("bmySlides");
  let dots = document.getElementsByClassName("bdot");
  if (n > slides.length) {bslideIndex = 1}    
  if (n < 1) {bslideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[bslideIndex-1].style.display = "block";  
  dots[bslideIndex-1].className += " active";
}
binterval();
interval();