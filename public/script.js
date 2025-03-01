let slides = [];
let currentSlideIndex = 0;

// タイピングアニメーションの関数 + タイピング音を再生
function typeText(text, element, speed = 100) {
  element.textContent = "";
  let index = 0;

  // 複数の音声ファイルを用意して交互に使用する
  const typingSoundsFiles = [
    "Type_sound.mp3",
    "type_sound_2.mp3",
    "type_sound_3.mp3",
    "type_sound_4.mp3"
  ]
  
  const typingSounds = typingSoundsFiles.map(file => new Audio(file));

  typingSounds.forEach(sound => {
    sound.volume = 0.7;
  });

  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (index < text.length) {
        element.textContent += text.charAt(index);

        //ランダムに効果音を選んで再生
        if (text.charAt(index) !== " ")
        {
          const randomIndex = Math.floor(Math.random() * typingSounds.length);
          const randomSound = typingSounds[randomIndex];

          randomSound.currentTime = 0;
          randomSound.play().catch(err => console.error("Faild to play typing sound. :", err));
        }
        
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
    await typeText(slideData.text, slideTextElement, 200);
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
