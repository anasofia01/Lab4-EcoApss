document.addEventListener('DOMContentLoaded', () => {
	const formRegister = document.getElementById('form-register');
	formRegister.addEventListener('submit', async (event) => {
		event.preventDefault();
		const name = document.getElementById('rname').value;
		const email = document.getElementById('remail').value;
		const password = document.getElementById('rpassword').value;
		try {
			const response = await fetch('http://localhost:5050/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ name, email, password }),
			});
			if (!response.ok) {
				throw new Error(response.statusText);
			}
			const data = await response.json();
			// localStorage.setItem('token', data.token);
			localStorage.setItem('name', data.name);
			alert(data.message);
			formRegister.reset();
			window.location.href = '../index.html';
			// console.log(localStorage.getItem('token'));
		} catch (error) {
			alert(error.message);
			console.error(error);
		}
	});
});
