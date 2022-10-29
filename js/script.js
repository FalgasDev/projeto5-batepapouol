let messages = [];
let message = {};
let peoples = [];
const chat = document.querySelector('.messages');
const peopleOption = document.querySelector('.peoples');
const text = document.querySelector('.bottom-menu input');
const backSideMenu = document.querySelector('.back-side-menu');
const sideMenu = document.querySelector('.container-people');
const bottomMenu = document.querySelector('.bottom-menu p');
let checkPeople = document.querySelector('.contact .selected');
let checkVisibility = document.querySelector('.visibility .selected');
let textName;
let visibility =
	checkVisibility.parentNode.querySelector('.contact-name p').innerHTML;
let people = checkPeople.parentNode.querySelector('.contact-name p').innerHTML;

function registerName() {
	const layoutRegister = document.querySelector('.register-name');
	const button = document.querySelector('.register-name button');
	const input = document.querySelector('.register-name input');
	const gif = document.querySelector('.register-name img:last-child');
	textName = document.querySelector('.register-name input').value;
	axios
		.post('https://mock-api.driven.com.br/api/v6/uol/participants', {
			name: textName,
		})
		.then(messageChecker)
		.catch(() => {
			window.location.reload();
		});
	button.classList.add('hidden');
	input.classList.add('hidden');
	gif.classList.remove('hidden');
	setTimeout(() => {
		layoutRegister.classList.add('hidden');
	}, 1000);
	intervals();
	peopleChecker();
	bottomMenu.innerHTML = `
	Enviando para ${people} (${visibility})
	`
}

function messageChecker() {
	axios
		.get('https://mock-api.driven.com.br/api/v6/uol/messages')
		.then(messageArrived);
}

function messageArrived(res) {
	messages = res.data;
	chat.innerHTML = '';
	messageRender();
}

function messageRender() {
	for (let i = 0; i < messages.length; i++) {
		if (messages[i].type === 'status') {
			chat.innerHTML += `
        <div class="message">
          <p><span>(${messages[i].time})</span> <strong>${messages[i].from}</strong> ${messages[i].text}</p>
        </div>
      `;
		} else if (messages[i].type === 'message') {
			chat.innerHTML += `
        <div class="message white">
          <p><span>(${messages[i].time})</span> <strong>${messages[i].from}</strong> para <strong>${messages[i].to}</strong>: ${messages[i].text}</p>
        </div>
      `;
		} else {
			if (messages[i].to === textName || messages[i].from === textName) {
				chat.innerHTML += `
        	<div class="message red">
          	<p><span>(${messages[i].time})</span> <strong>${messages[i].from}</strong> reservadamente para <strong>${messages[i].to}</strong>: ${messages[i].text}</p>
        	</div>
      	`;
			}
		}
	}
	document.querySelector('.message:last-child').scrollIntoView();
}

function peopleChecker() {
	axios
		.get('https://mock-api.driven.com.br/api/v6/uol/participants')
		.then(peopleArrived);
}

function peopleArrived(res) {
	peoples = res.data;
	peopleOption.innerHTML = '';
	peopleRender();
}

function peopleRender() {
	for (let i = 0; i < peoples.length; i++) {
		peopleOption.innerHTML += `
			<div onclick="chosePeople(this)" class="contact option">
				<div class="contact-name">
					<ion-icon name="person-circle"></ion-icon>
					<p>${peoples[i].name}</p>
				</div>
				<ion-icon class="green hidden" name="checkmark-sharp"></ion-icon>
			</div>
		`;
	}
}

function sendMessage() {
	if (visibility === 'Reservadamente') {
		const promise2 = axios.post(
			'https://mock-api.driven.com.br/api/v6/uol/messages',
			{
				from: textName,
				to: people,
				text: text.value,
				type: 'private_message',
			}
		);
		promise2.then(messageChecker);
		promise2.catch(() => {
			window.location.reload();
		});
	} else {
		const promise = axios.post(
			'https://mock-api.driven.com.br/api/v6/uol/messages',
			{
				from: textName,
				to: people,
				text: text.value,
				type: 'message',
			}
		);
		promise.then(messageChecker);
		promise.catch(() => {
			window.location.reload();
		});
	}

	document.querySelector('.bottom-menu input').value = '';
}

function sendWithEnter() {
	text.addEventListener("keydown", e => {
		if (e.key === "Enter") {
			sendMessage()
		}
	});
}

sendWithEnter();

function openSideMenu() {
	sideMenu.classList.remove('hidden');
	backSideMenu.classList.remove('hidden');
}

function exitSideMenu() {
	sideMenu.classList.add('hidden');
	backSideMenu.classList.add('hidden');
}

function chosePeople(res) {
	const checkmark = res.querySelector('.green');
	if (checkPeople) {
		checkPeople.classList.remove('selected');
		checkPeople.classList.add('hidden');
	}
	checkmark.classList.remove('hidden');
	checkmark.classList.add('selected');
	checkPeople = document.querySelector('.contact .selected');
	people = checkPeople.parentNode.querySelector('.contact-name p').innerHTML;
	bottomMenu.innerHTML = `
	Enviando para ${people} (${visibility})
	`;
}

function choseVisibility(res) {
	const checkmark = res.querySelector('.green');
	if (checkVisibility) {
		checkVisibility.classList.remove('selected');
		checkVisibility.classList.add('hidden');
	}
	checkmark.classList.remove('hidden');
	checkmark.classList.add('selected');
	checkVisibility = document.querySelector('.visibility .selected');
	visibility =
		checkVisibility.parentNode.querySelector('.contact-name p').innerHTML;
	bottomMenu.innerHTML = `
	Enviando para ${people} (${visibility})
	`;
}

function intervals() {
	setInterval(messageChecker, 3000);
	setInterval(peopleChecker, 10000);
	setInterval(() => {
		axios
			.post('https://mock-api.driven.com.br/api/v6/uol/status', {
				name: textName,
			})
			.catch(() => {
				alert('Ocorreu um erro inesperado');
			});
	}, 5000);
}
