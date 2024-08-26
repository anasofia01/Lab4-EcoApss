document.addEventListener('DOMContentLoaded', () => {
	const btnLogout = document.getElementById('logout');
	btnLogout.addEventListener('click', () => {
		localStorage.removeItem('token');
		alert('You have been logged out');
		window.location.href = '../index.html';
	});

	function checkTokenExpiration() {
		const token = localStorage.getItem('token');
		console.log(token);
		if (token) {
			try {
				const tokenDecodified = jwt_decode(token);
				const currentTime = Date.now() / 1000;
				if (tokenDecodified.exp < currentTime) {
					localStorage.removeItem('token');
					alert('The session was expired');
					window.location.href = '../index.html';
				}
			} catch (error) {
				console.error(error);
			}
		}
	}

	const token = localStorage.getItem('token');
	if (token) {
		setInterval(checkTokenExpiration, 1000);
	} else {
		alert('The token is not valid');
		window.location.href = '../index.html';
	}

	const postForm = document.getElementById('form-post');
	postForm.addEventListener('submit', async (event) => {
		event.preventDefault();
		const urlImg = document.getElementById('urlImg').value;
		const title = document.getElementById('titlePost').value;
		const description = document.getElementById('descriptionPost').value;
		const name = localStorage.getItem('name');
		const token = localStorage.getItem('token');
		if (!token) {
			alert('The token is not valid');
			window.location.href = '../index.html';
		}
		try {
			const response = await fetch('http://localhost:5050/posts', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ urlImg, title, description, name }),
			});
			if (!response.ok) {
				throw new Error('Failed to create post');
			}
			const data = await response.json();
			alert(data.message);
			postForm.reset();
		} catch (error) {
			console.error(error);
			alert(error.message);
		}
	});
});
