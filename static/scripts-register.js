
document.getElementById('form-register').addEventListener('submit', (event)=>{

	event.preventDefault();
	let valueEmail = document.getElementById('email-register').value;
	let valuePassword = document.getElementById('password-register').value;

	fetch('/signUp', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			email: valueEmail,
			password: valuePassword
		}),
	})
	.then((response) => {
		if (response.ok) {
			window.location.href = '/auth';
			return response.json();
		  } else if (response.status === 403) {
			document.getElementById('error-register').classList.remove("visually-hidden");
			document.getElementById('error-register').innerHTML="Аккаунт с таким адресом уже существует";
		  }else if(response.status === 422){
				document.getElementById('error-register').classList.remove("visually-hidden");
				document.getElementById('error-register').innerHTML="Пароль должен быть не менее 8 символов";
			}
			else{
				window.location.href = '/auth';
			}
	})
	.catch((error) => console.log(error));
})
