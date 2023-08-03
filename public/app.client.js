const dragArea = document.querySelector('.drag-area');
const fileName = document.querySelector('.file-name');
const uploadResult = document.querySelector('.upload-result');

let fileToUpload = null;

dragArea.addEventListener('dragover', (event) => {
	event.preventDefault();
	dragArea.classList.add('active');
});

dragArea.addEventListener('dragleave', (event) => {
	event.preventDefault();
	dragArea.classList.remove('active');
});

dragArea.addEventListener('drop', (event) => {
	event.preventDefault();
	dragArea.classList.remove('active');
	const file = event.dataTransfer.files[0];
	if (!file) return;
	fileName.textContent = file.name;
	fileToUpload = file;
});

fileInput.addEventListener('change', (event) => {
	event.preventDefault();
	const file = event.target.files.item(0);
	if (!file) return;
	fileName.textContent = file.name;
	fileToUpload = file;
});

submitBtn.addEventListener('click', async (event) => {
	if(!fileToUpload) return;
	console.log('uploading', fileToUpload);
	await uploadFile(fileToUpload);
});

async function uploadFile(file) {
	const formData = new FormData();
	formData.append('myFile', file, file.name.replace(/[\u4e00-\u9fa5\s]/g, ''));
  formData.append('name', 'myFile');
	const result = await (await fetch('http://localhost:3000/file', {
		method: 'POST',
		body: formData, 
		// headers: {
		// 	"Accept-Encoding": "UTF-8",
		// },
	})).json();
	if(!result.error) {
		const resultDiv = document.createElement('div');
		resultDiv.innerHTML = `<span>${result.url}</span><button class="copy">copy</button>`;
		if(uploadResult.children[0]) {
			uploadResult.insertBefore(resultDiv, uploadResult.children[0]);
		} else {
			uploadResult.appendChild(resultDiv);
		}
	} else {
		const errorDiv = document.createElement('div');
		errorDiv.className = 'error';
		errorDiv.textContent = result.message;
		if(uploadResult.children[0]) {
			uploadResult.insertBefore(errorDiv, uploadResult.children[0]);
		} else {
			uploadResult.appendChild(errorDiv);
		}
	}
	// console.log(result);
}

uploadResult.addEventListener('click', async (event) => {
	if(event.target.className === 'copy') {
		const text = event.target.parentNode.children[0].textContent;
		await navigator.clipboard.writeText(text);
		console.log(text);
	}
});
