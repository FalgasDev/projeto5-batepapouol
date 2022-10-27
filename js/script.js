let messages = [];
let message = {};
const chat = document.querySelector('.messages');
let nome = prompt('Qual o seu nome?');

function joinChat() {
	axios
		.post('https://mock-api.driven.com.br/api/v6/uol/participants', {
			name: nome,
		})
		.then(messageChecker)
		.catch(() => {
			window.location.reload();
		});
}
joinChat();

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
			chat.innerHTML += `
        <div class="message red">
          <p><span>(${messages[i].time})</span> <strong>${messages[i].from}</strong> reservadamente para <strong>${messages[i].to}</strong>: ${messages[i].text}</p>
        </div>
      `;
		}
	}
	document.querySelector('.message:last-child').scrollIntoView();
}

function sendMessage() {
	const text = document.querySelector('input').value;

	const promise = axios.post(
		'https://mock-api.driven.com.br/api/v6/uol/messages',
		{
			from: nome,
			to: 'Todos',
			text: text,
			type: 'message',
		}
	);
	promise.then(messageChecker);
	promise.catch((error) => {
		console.log(error);
	});
}

setInterval(messageChecker, 3000);
