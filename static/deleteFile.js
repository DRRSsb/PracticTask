
export function deleteFile(name){
	fetch(`/file/${name}`, {
		method: 'DELETE',
		credentials: 'include',
	})
	.then((response) => response.json())
	.catch((error) => console.error('Ошибка:', error));
}

