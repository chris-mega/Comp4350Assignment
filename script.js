const baseAPI = "https://api.stackexchange.com/2.2";
const questions = `${baseAPI}/questions`;

const accordionId = "accordionQuestions";
function createCard(title, id, score, creation, rest) {
  var div = document.createElement("div");
  div.className = "accordion-item";
  const item = `<h2 class="accordion-header" id="heading${id}">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${id}">
        <b>${title}</b> <i> / Creation: ${creation}</i> / Score: ${score} 
      </button>
    </h2>
    <div id="collapse${id}" class="accordion-collapse collapse" data-bs-parent="#${accordionId}">
      <div class="accordion-body"> ${rest} </div>
    </div>`;
  div.innerHTML = item;
  return div;
}

function buildUrl(sort, tag) {
  const today = Math.floor(new Date().getTime() / 1000);
  const last = today - 7 * 24 * 60 * 60;
  return `${questions}?fromdate=${last}&todate=${today}&order=desc&sort=${sort}&tagged=${tag}&site=stackoverflow`;
}

function elements(parent, items) {
  for (var i = 0; i < items.length; i++) {
    if (i >= 10) break;
    const item = items[i];
    const { title, question_id, score, creation_date } = item;
    const date = new Date(creation_date * 1000);
    const card = createCard(
      title,
      question_id,
      score,
      date.toISOString(),
      "yo"
    );
    parent.appendChild(card);
  }
}

async function apiCall(url) {
  const response = await fetch(url);
  const json = await response.json();
  return json;
}

async function call() {
  const input = document.getElementById("tag");
  if (input.value) {
    var url = buildUrl("creation", input.value);
    const questions = await apiCall(url);
    var accordion = document.getElementById(accordionId);
    elements(accordion, questions.items);
    url = buildUrl("votes", input.value);
    const votes = await apiCall(url);
    elements(accordion, votes.items);
  }
}
