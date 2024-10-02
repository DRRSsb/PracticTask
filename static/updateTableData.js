
import {editTableData} from '/static/editTableData.js';

import {saveTableData} from '/static/saveTableData.js';

import {deleteTableData} from '/static/deleteTableData.js';

export function updateTableData(
	number,
	type_device,
	model_device,
	serial_number_device,
	ITAM_device,
	photo_device,
	photo_serial_number_device,
	photo_ITAM_device
) {
	const table = document
	.getElementById('table_device')
	.getElementsByTagName('tbody')[0];
	const newRow = table.insertRow();
	const ceil1 = newRow.insertCell(0);
	const ceil2 = newRow.insertCell(1);
	const ceil3 = newRow.insertCell(2);
	const ceil4 = newRow.insertCell(3);
	const ceil5 = newRow.insertCell(4);
	const ceil6 = newRow.insertCell(5);
	const ceil7 = newRow.insertCell(6);
	const ceil8 = newRow.insertCell(7);
	const ceil9 = newRow.insertCell(8);
	const ceil10 = newRow.insertCell(9);
	const ceil11 = newRow.insertCell(10);
	ceil1.textContent = number;
	ceil2.textContent = type_device;
	ceil3.textContent = model_device;
	ceil4.textContent = serial_number_device;
	ceil5.textContent = ITAM_device;



	const templateText = document.querySelector('#template-img');
	ceil6.textContent = '';
	const input1 = templateText.content.cloneNode(true);
	input1.querySelector('img').src = `static/images/${photo_device}`;
	ceil6.append(input1);

	ceil7.textContent = '';
	const input2 = templateText.content.cloneNode(true);
	input2.querySelector('img').src = `static/images/${photo_serial_number_device}`;
	ceil7.append(input2);

	ceil8.textContent = '';
	const input3 = templateText.content.cloneNode(true);
	input3.querySelector('img').src = `static/images/${photo_ITAM_device}`;
	ceil8.append(input3);


	const template = document.querySelector('#template__table-button');

	ceil9.textContent = '';
	const buttonDelete = template.content.cloneNode(true);
	buttonDelete.querySelector('button').id = `delete${number}`;

	buttonDelete.querySelector('button').addEventListener("click", () => {
		deleteTableData(number);
	});

	buttonDelete.querySelector('button').value = "Удалить";
	buttonDelete.querySelector('button').textContent = "Удалить";
	ceil9.append(buttonDelete);

	ceil10.textContent = '';
	const buttonEdit = template.content.cloneNode(true);
	buttonEdit.querySelector('button').id = `add${number}`;
	buttonEdit.querySelector('button').addEventListener("click", () => {
		editTableData(number);
	});
	buttonEdit.querySelector('button').value = "Изменить";
	buttonEdit.querySelector('button').textContent = "Изменить";
	ceil10.append(buttonEdit);

	ceil11.textContent = '';
	const buttonSave = template.content.cloneNode(true);
	buttonSave.querySelector('button').id = `save${number}`;
	buttonSave.querySelector('button').addEventListener("click", () => {
		saveTableData(number);
	});

	buttonSave.querySelector('button').classList.add("visually-hidden")
	buttonSave.querySelector('button').value = "Сохранить";
	buttonSave.querySelector('button').textContent = "Сохранить";
	ceil11.append(buttonSave);
}
