document.addEventListener('DOMContentLoaded', () => {
	fetchData('http://localhost:5050/users', renderUsers);
	fetchData('http://localhost:5050/posts', renderPosts);
});

async function fetchData(url, renderData) {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		const data = await response.json();
		renderData(data);
	} catch (error) {
		console.error(error);
		error.style.display = 'block';
	}
}

function renderUsers(users) {
	const usersContainer = document.getElementById('users-container');
	usersContainer.innerHTML = '';
	users.forEach((user) => {
		const card = document.createElement('div');
		card.classList.add('col-md-4', 'card-container');
		card.innerHTML = `
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">${user.name}</h5>
          <p class="card-text">${user.email}</p>
        </div>
      </div>
    `;
		usersContainer.appendChild(card);
	});
}

function renderPosts(posts) {
	const postsContainer = document.getElementById('posts-container');
	postsContainer.innerHTML = '';
	posts.forEach((post) => {
		const card = document.createElement('div');
		card.classList.add('col-md-4', 'card-container');
		card.innerHTML = `
      <div class="card">
        <img class="card-img-top" src="${post.urlImg}" alt="Card image caption">
        <div class="card-body">
          <h5 class="card-title">${post.title}</h5>
					<p class="card-text">${post.name}</p>
          <p class="card-text">${post.description}</p>
        </div>
      </div>
    `;
		postsContainer.appendChild(card);
	});
}
