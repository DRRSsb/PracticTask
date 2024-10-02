
document.getElementById('form-auth').addEventListener('submit', (event)=>{

	event.preventDefault();
	let valueEmail = document.getElementById('email-auth').value;
	let valuePassword = document.getElementById('password-auth').value;

	fetch('/signIn', {
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
			window.location.href = '/'
			return response.json();
		  } else if (response.status === 403) {
			document.getElementById('error-auth').classList.remove("visually-hidden");
			document.getElementById('error-auth').innerHTML="Аккаунта не существует";
		  }else if(response.status === 422){
				document.getElementById('error-auth').classList.remove("visually-hidden");
				document.getElementById('error-auth').innerHTML="Введён не правильный пароль";
			}
			else{
				window.location.href = '/auth';
			}
	})
	.catch((error) => console.log(error));
})
