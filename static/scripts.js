import { updateTableData } from '/static/updateTableData.js';
import { globalData as num } from '/static/globalData.js';
import {deleteFile} from '/static/deleteFile.js';

function getData(){
	fetch('/data',{
		method: 'GET',
		credentials: 'include',
		})
	.then((response) => {
		if (response.ok) {
			return response.json();
		  } else if (response.status === 403) {
			console.error('Аккаунт не найден');
			window.location.href = '/auth';
		  } else {
			console.error('Error:', response.status);
		  }
	})
	.then((data) => {
		num.fetchData = data;
		const table = document.getElementById('table_device');
		const n = table.rows.length;

		for (let i = 1; i < n; i++) {
			table.deleteRow(1);
		}

		let n2 = data.length;

		for (let i = 0; i < n2; i++) {
			const id = data[i].id;
			const type_device = data[i].type_device;
			const model_device = data[i].model_device;
			const serial_number = data[i].serial_number;
			const ITAM_device = data[i].ITAM_device;
			const photo_device = data[i].photo_device;
			const photo_serial_number_device = data[i].photo_serial_number_device;
			const photo_ITAM_device = data[i].photo_ITAM_device;
			updateTableData(
				id,
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
}

function createForm(){
	let templateForms = document.getElementById("forms");
	const templateText = document.querySelector('#template-form');
	const input1 = templateText.content.cloneNode(true);
	let number = num.countForm;
	num.fileName1.push("");
	num.fileName2.push("");
	num.fileName3.push("");
	let field = input1.querySelector("select");
	let parentField = field.parentNode;
	let parentForm = parentField.parentNode;
	let paragraph = Array.from(parentForm.querySelectorAll("p"));
	let fieldInput = Array.from(input1.querySelectorAll("input"));
	if(number===1){
		input1.getElementById('form-delete').classList.add("visually-hidden");
	}
	input1.querySelector('form').id= `form${number}` ;
	let maxSizeError = document.querySelector(`#form${number}`);
	let p = Array.from(parentForm.parentNode.querySelectorAll("p"))
	const img = Array.from(parentForm.parentNode.querySelectorAll("img"));
	input1.getElementById('photo_device_select').addEventListener('input',(event) => {
		const input = event.target;
		if(event.target.files[0]===undefined){
			input.nextElementSibling.classList.add("visually-hidden")
			img[0].classList.add("visually-hidden")
			return;
		}
		const fileSize = event.target.files[0].size;
		const maxSize = 10*1024*1024;
		if (fileSize > maxSize) {
			input.type = 'text';
			input.type = "file";
			input.nextElementSibling.classList.add("visually-hidden")
			p[4].classList.add("form__field-lable-error")
			input.nextElementSibling.classList.add("visually-hidden")
			img[0].classList.add("visually-hidden")
		}
		else{
			p[4].classList.remove("form__field-lable-error")
			input.nextElementSibling.classList.remove("visually-hidden")
			img[0].classList.remove("visually-hidden")
			img[0].src = URL.createObjectURL(event.target.files[0]);
		}
	});
	input1.getElementById('photo_serial_number_device_select').addEventListener('input',(event) =>{
		const input = event.target;
		if(event.target.files[0]===undefined){
			input.nextElementSibling.classList.add("visually-hidden")
			img[1].classList.add("visually-hidden")
			return;
		}
		const fileSize = event.target.files[0].size;
		const maxSize = 10*1024*1024;
		if (fileSize > maxSize) {
			input.type = 'text';
			input.type = "file";
			input.nextElementSibling.classList.add("visually-hidden")
			p[5].classList.add("form__field-lable-error")
			input.nextElementSibling.classList.add("visually-hidden")
			img[1].classList.add("visually-hidden")
		}
		else{
			p[5].classList.remove("form__field-lable-error")
			input.nextElementSibling.classList.remove("visually-hidden")
			img[1].classList.remove("visually-hidden")
			img[1].src = URL.createObjectURL(event.target.files[0]);
		}
	});
	input1.getElementById('photo_ITAM_device_select').addEventListener('input',(event) => {
		const input = event.target;
		if(event.target.files[0]===undefined){
			input.nextElementSibling.classList.add("visually-hidden")
			img[2].classList.add("visually-hidden")
			return;
		}

		const fileSize = event.target.files[0].size;
		const maxSize = 10*1024*1024;
		if (fileSize > maxSize) {
			input.type = 'text';
			input.type = "file";
			input.nextElementSibling.classList.add("visually-hidden")
			p[6].classList.add("form__field-lable-error")
			input.nextElementSibling.classList.add("visually-hidden")
			img[2].classList.add("visually-hidden")
		}
		else{
			p[6].classList.remove("form__field-lable-error")
			input.nextElementSibling.classList.remove("visually-hidden")
			img[2].classList.remove("visually-hidden")
			img[2].src = URL.createObjectURL(event.target.files[0]);
		}
	});

	input1.getElementById('form-delete').addEventListener('click',()=>{
		if(num.fileName1[number]!=""){
			deleteFile(num.fileName1[number]);
		}
		if(num.fileName2[number]!=""){
			deleteFile(num.fileName2[number]);
		}
		if(num.fileName3[number]!=""){
			deleteFile(num.fileName3[number]);
		}
		num.fileName1[number]=null;
		num.fileName2[number]=null;
		num.fileName3[number]=null;
		document.getElementById(`form${number}`).remove();

	})

	field.addEventListener('blur', ()=>{
		validitySelect(field,paragraph[0]);
	})
	field.addEventListener('focus',()=>{
		field.classList.remove("form__field-input-error");
		parentField.classList.remove("form__field-lable-error");
	})

	for(let i=0;i<fieldInput.length;i++){
		if(fieldInput[i].type==="text"){
			let fieldInputValue = fieldInput[i];
			let parentField = fieldInputValue.parentNode;
			fieldInputValue.addEventListener('blur', ()=>{
				validitySelect(fieldInputValue,paragraph[i+1])
			})
			fieldInputValue.addEventListener('focus',()=>{
				fieldInputValue.classList.remove("form__field-input-error");
				parentField.classList.remove("form__field-lable-error");
			})
		}
		if(fieldInput[i].type==="file"){
			let input = fieldInput[i]
			input.addEventListener('input', ()=>{
				let parentField = input.parentNode.parentNode;
				if(!input.value){
					parentField.classList.add("form__field-lable-error");
					input.classList.add("form__field-input-error");
					input.addEventListener('input', ()=>{
						if(input.value){
							parentField.classList.remove("form__field-lable-error");
						}
					})
				}else{
					parentField.classList.remove("form__field-lable-error");
				}
			})
		}
	}
	templateForms.append(input1);
	num.countForm +=1;
	num.numberForm+=1;
}

createForm();

getData();




document.getElementById('exit').addEventListener('click',() => {
	fetch('/exit', {
		method: 'POST',
		credentials: 'include'
	})
	.then(response => response.json())
	.then(()=>{
		window.location.href = '/';
	})
	.catch(error => console.error(error));
});


document.getElementById("form-add").addEventListener('click',()=>{
	createForm();
})

document.getElementById("submit").addEventListener('click',()=>{

	for(let i=0;i<num.fileName1.length-1;i++){
		if(num.fileName1[i+1]!==null){
			let form = document.getElementById(`form${i+1}`);
			validityForm(form)

			if(!(form.checkValidity())){
				return;
			}
		}
	}

	for(let i=0;i<num.fileName1.length-1;i++){
		if(num.fileName1[i+1]!==null){
			let form = document.getElementById(`form${i+1}`);

			if (form.checkValidity()) {

				const formData = new FormData(form);
				fetch('/form', {
					method: 'POST',
					credentials: 'include',
					body: formData
				})
				.then(response => response.json())
				.then(getData)
				.catch(error => console.error(error));
			}
		}
	}

	num.fileName1.length=1;
	num.fileName2.length=1;
	num.fileName3.length=1;

	num.countForm=1;

	document.getElementById("forms").textContent = '';

	createForm();
})

function validityForm(form){

	let fieldSelect = form.querySelector("select");
	let parentField = fieldSelect.parentNode;
	let parentForm = parentField.parentNode;
	let paragraph = Array.from(parentForm.querySelectorAll("p"));
	if(!fieldSelect.value){
		validitySelect(fieldSelect,paragraph[0])
	}
	let fieldInput = Array.from(form.querySelectorAll("input"));
	for(let i=0;i<fieldInput.length;i++){
		if(fieldInput[i].type==="text"){
			validitySelect(fieldInput[i],paragraph[i+1])
		}
		if(fieldInput[i].type==="file"){
			validityFile(fieldInput[i])
		}
	}
}

function validitySelect(field,paragraph){
	let parentField = field.parentNode;

	if(!field.value){
		field.classList.add("form__field-input-error");
		parentField.classList.add("form__field-lable-error");
		paragraph.classList.remove("visually-hidden")
		field.addEventListener('input', ()=>{
			parentField.classList.remove("form__field-lable-error");
			field.classList.remove("form__field-input-error");
			paragraph.classList.add("visually-hidden")
		})
	}else{
		field.classList.remove("form__field-input-error");
		parentField.classList.remove("form__field-lable-error");
		paragraph.classList.add("visually-hidden")
	}
}
function validityFile(input){
	let parentField = input.parentNode.parentNode;
	if(!input.value){
		parentField.classList.add("form__field-lable-error");
		input.classList.add("form__field-input-error");
		input.addEventListener('input', ()=>{
			if(input.value){
				parentField.classList.remove("form__field-lable-error");
			}
		})
	}else{
		parentField.classList.remove("form__field-lable-error");
	}
}

