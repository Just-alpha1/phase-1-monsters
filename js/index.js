const API_URL = 'http://localhost:3000/monsters';
let currentPage = 1;
const limit = 50;

// Fetch and render monsters
function fetchMonsters(page = 1) {
  fetch(`${API_URL}?_limit=${limit}&_page=${page}`)
    .then(response => response.json())
    .then(monsters => renderMonsters(monsters))
    .catch(error => console.error('Error fetching monsters:', error));
}

// Render monsters to the DOM
function renderMonsters(monsters) {
  const monsterList = document.getElementById('monster-list');
  monsters.forEach(monster => {
    const monsterCard = document.createElement('div');
    monsterCard.className = 'monster-card';
    monsterCard.innerHTML = `
      <h2>${monster.name}</h2>
      <p>Age: ${monster.age}</p>
      <p>Description: ${monster.description}</p>
    `;
    monsterList.appendChild(monsterCard);
  });
}

// Handle new monster submission
function handleMonsterSubmission(e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const age = parseFloat(document.getElementById('age').value);
  const description = document.getElementById('description').value;

  fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ name, age, description })
  })
    .then(response => {
      if (!response.ok) throw new Error('Failed to create monster');
      return response.json();
    })
    .then(newMonster => {
      const monsterCard = document.createElement('div');
      monsterCard.className = 'monster-card';
      monsterCard.innerHTML = `
        <h2>${newMonster.name}</h2>
        <p>Age: ${newMonster.age}</p>
        <p>Description: ${newMonster.description}</p>
      `;
      document.getElementById('monster-list').prepend(monsterCard);
      e.target.reset();
    })
    .catch(error => console.error('Error creating monster:', error));
}

// Load more monsters
function handleLoadMore() {
  currentPage++;
  fetchMonsters(currentPage);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  fetchMonsters(currentPage);
  document.getElementById('monster-form').addEventListener('submit', handleMonsterSubmission);
  document.getElementById('load-more').addEventListener('click', handleLoadMore);
});