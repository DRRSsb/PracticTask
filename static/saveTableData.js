
import {globalData as num} from '/static/globalData.js';

import {updateTableData} from '/static/updateTableData.js';

export function saveTableData(numId) {

	document.getElementById(`save${numId}`).classList.remove("visually-hidden")
	let newValue0 = document.getElementById('newValue0').value;
	if(document.getElementById('newValue0').value === ""){
		newValue0 = num.defaultValue2;
	}
	let newValue1 = document.getElementById('newValue1').value;
	let newValue2 = document.getElementById('newValue2').value;
	let newValue3 = document.getElementById('newValue3').value;
	let newValue4 = document.getElementById('newValue4').files[0];
	let newValue5 = document.getElementById('newValue5').files[0];
	let newValue6 = document.getElementById('newValue6').files[0];
	let data = num.fetchData;
	const photo_device = data[numId-1].photo_device;
	const photo_serial_number_device =
		data[numId-1].photo_serial_number_device;
	const photo_ITAM_device = data[numId-1].photo_ITAM_device;
	if(newValue4===""){
		newValue4=photo_device;
	}
	if(newValue5===""){
		newValue5=photo_serial_number_device;
	}
	if(newValue6===""){
		newValue6=photo_ITAM_device;
	}
	const formData = new FormData();
	formData.append("id", numId);
	formData.append("type_device", newValue0);
	formData.append("model_device", newValue1);
	formData.append("serial_number", newValue2);
	formData.append("ITAM_device", newValue3);
	formData.append("photo_device", newValue4);
	formData.append("photo_serial_number_device", newValue5);
	formData.append("photo_ITAM_device", newValue6);
	fetch('/data', {
		method: 'PUT',
		credentials: 'include',
		body: formData
	})
		.then((response) => {
			if (response.ok) {
				return response.json();
			}
			if (response.status === 403) {
				console.error('Аккаунт не найден');
				window.location.href = '/auth';
			}
			else if(response.status === 404){
				console.error('Запись не найдена');
			}
			else {
				console.error('Error:', response.status);
			}
		})
		.then(() => {
		fetch('/data',{
			method: 'GET',
			credentials: 'include'
			})
		.then((response) => {
			if (response.ok) {
				return response.json();
			}
			if (response.status === 403) {
				console.error('Аккаунт не найден');
				window.location.href = '/auth';
			}
				else {
				console.error('Error:', response.status);
				}
		})
		.then((data2) => {
			num.fetchData = data2;
			const table = document.getElementById('table_device');
			const n = table.rows.length;
			for (let i = 1; i < n; i++) {
				table.deleteRow(1);
			}
			let n2 = data2.length;
			for (let i = 0; i < n2; i++) {
				const number = data2[i].id;
				const type_device = data2[i].type_device;
				const model_device = data2[i].model_device;
				const serial_number = data2[i].serial_number;
				const ITAM_device = data2[i].ITAM_device;
				const photo_device = data2[i].photo_device;
				const photo_serial_number_device =
				data2[i].photo_serial_number_device;
				const photo_ITAM_device = data2[i].photo_ITAM_device;
				updateTableData(
					number,
					type_device,
					model_device,
					serial_number,
					ITAM_device,
					photo_device,
					photo_serial_number_device,
					photo_ITAM_device
				);
			}
		})
		.catch((error) => console.error('Ошибка:', error));
		})
		.catch((error) => console.error('Ошибка:', error));


}

