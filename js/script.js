let messages = [];

const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');

promise.then(messageArrived);

function messageArrived(res) {
	messages = res.data;
	messageRender();
}

function messageRender() {
	const chat = document.querySelector('.messages');

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
}
