let currentQuestionIndex = 0;
const questions = document.querySelectorAll('.question');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
const generateButton = document.getElementById('generate-button');
const resetButton = document.getElementById('reset-button');

// Show the current question
function showQuestion(index) {
  questions.forEach((question, i) => {
    question.classList.toggle('active', i === index);
  });
  prevButton.disabled = index === 0;
  nextButton.style.display = index === questions.length - 1 ? 'none' : 'inline-block';
  generateButton.style.display = index === questions.length - 1 ? 'inline-block' : 'none';
}

// Navigation buttons
prevButton.addEventListener('click', () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    showQuestion(currentQuestionIndex);
  }
});

nextButton.addEventListener('click', () => {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    showQuestion(currentQuestionIndex);
  }
});

// Generate 6 colors based on selections
generateButton.addEventListener('click', () => {
  const selectedStyles = getSelectedValues('color-style');
  const selectedEmotions = getSelectedValues('emotion');
  const selectedIndustries = getSelectedValues('industry');
  const selectedThemes = getSelectedValues('theme');

  if (!selectedStyles.length || !selectedEmotions.length || !selectedIndustries.length || !selectedThemes.length) {
    alert('Please select up to 3 options for each question.');
    return;
  }

  const colors = [
    generateColorFromSelection(selectedStyles),
    generateColorFromSelection(selectedEmotions),
    generateColorFromSelection(selectedIndustries),
    generateColorFromSelection(selectedThemes),
    generateRandomColor(),
    generateRandomColor(),
  ];

  displayPalette(colors);
});

// Reset the quiz
resetButton.addEventListener('click', () => {
  document.querySelectorAll('.option-button').forEach(button => button.classList.remove('selected'));
  currentQuestionIndex = 0;
  showQuestion(currentQuestionIndex);
  document.getElementById('palette').innerHTML = '';
});

// Helpers
function getSelectedValues(group) {
  return Array.from(document.querySelectorAll(`.option-button.selected[data-group="${group}"]`)).map(button => button.value);
}

function generateColorFromSelection(selection) {
  const colors = {
    neutrals: '#B0BEC5',
    earthy: '#8D6E63',
    shades: '#263238',
    pastels: '#FFD1DC',
    vibrant: '#FF6F61',
    monochrome: '#9E9E9E',
    bold: '#D32F2F',
    bright: '#FFD600',
    minimalist: '#F5F5F5',
  };
  return colors[selection[0]] || generateRandomColor();
}

function generateRandomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}

function displayPalette(colors) {
  const paletteContainer = document.getElementById('palette');
  paletteContainer.innerHTML = '';
  colors.forEach(color => {
    const colorBox = document.createElement('div');
    colorBox.className = 'color-box';
    colorBox.style.backgroundColor = color;
    colorBox.setAttribute('data-color', color);
    colorBox.addEventListener('click', () => copyToClipboard(color));
    paletteContainer.appendChild(colorBox);
  });
}

function copyToClipboard(color) {
  navigator.clipboard.writeText(color).then(() => {
    alert(`Copied ${color} to clipboard!`);
  });
}

// Selection logic
document.querySelectorAll('.option-button').forEach(button => {
  button.addEventListener('click', () => {
    const group = button.dataset.group;
    const selectedButtons = document.querySelectorAll(`.option-button.selected[data-group="${group}"]`);
    if (button.classList.contains('selected')) {
      button.classList.remove('selected');
    } else if (selectedButtons.length < 3) {
      button.classList.add('selected');
    } else {
      alert('You can select up to 3 options only.');
    }
  });
});

// Initialize
showQuestion(currentQuestionIndex);
