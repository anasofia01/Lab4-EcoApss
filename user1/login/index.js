document.addEventListener('DOMContentLoaded', () => {
	const formLogin = document.getElementById('form-login');
	formLogin.addEventListener('submit', async (event) => {
		event.preventDefault();
		const email = document.getElementById('lemail').value;
		const password = document.getElementById('lpassword').value;
		try {
			const response = await fetch('http://localhost:5050/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});
			if (!response.ok) {
				throw new Error('Failed to log in');
			}
			const data = await response.json();
			localStorage.setItem('token', data.token);
			localStorage.setItem('name', data.name);
			alert(data.message);
			formLogin.reset();
			window.location.href = '../userPosts/index.html';
		} catch (error) {
			console.error(error);
			alert(error.message);
		}
	});
});
