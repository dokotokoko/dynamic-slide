let slides = [];
let currentSlideIndex = 0;

// タイピングアニメーションの関数 + タイピング音を再生
function typeText(text, element, speed = 100) {
  element.textContent = "";
  let index = 0;

  //入力音のAudioオブジェクトを作成（音声ファイルのパスを指定）
  const typingSound = new Audio("type-audio.mp3");

  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (index < text.length) {
        element.textContent += text.charAt(index);

        //音声を再生
        typingSound.currentTime = 0;
        typingSound.play();
        
        index++;
      } else {
        clearInterval(interval);
        resolve();
      }
    }, speed);
  });
}

// 指定したスライドの内容を表示
async function showSlide(index) {
  if (index >= 0 && index < slides.length) {
    const slideData = slides[index];
    const slideTextElement = document.getElementById("slide-text");
    await typeText(slideData.text, slideTextElement, 50);
  }
}

// コントロールの有効／無効更新
function updateControls() {
  document.getElementById("prevBtn").disabled = currentSlideIndex === 0;
  document.getElementById("nextBtn").disabled = currentSlideIndex === slides.length - 1;
}

// ボタンのイベントハンドラ初期化
function initControls() {
  document.getElementById("prevBtn").addEventListener("click", async () => {
    if (currentSlideIndex > 0) {
      currentSlideIndex--;
      await showSlide(currentSlideIndex);
      updateControls();
    }
  });
  document.getElementById("nextBtn").addEventListener("click", async () => {
    if (currentSlideIndex < slides.length - 1) {
      currentSlideIndex++;
      await showSlide(currentSlideIndex);
      updateControls();
    }
  });
}

// APIからスライドデータを取得
async function fetchSlides() {
  try {
    const response = await fetch('/api/slides');
    const data = await response.json();
    slides = data.slides;
    if (slides.length > 0) {
      currentSlideIndex = 0;
      await showSlide(currentSlideIndex);
      updateControls();
    }
  } catch (err) {
    console.error("Error fetching slides:", err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initControls();
  fetchSlides();
});
