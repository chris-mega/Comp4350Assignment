const baseAPI = "https://api.stackexchange.com/2.2";
const questions = `${baseAPI}/questions`;
const filter = "!m)ASvzmwfr403f*F5dU1)8hbeB3Kgkc8rhKafuMzR-Es.)4fbDi5D6gX";

const accordionId = "accordionQuestions";
const err = document.getElementById("error");

function buildUrl(sort, tag) {
  const today = Math.floor(new Date().getTime() / 1000);
  const last = today - 7 * 24 * 60 * 60;
  return `${questions}?fromdate=${last}&todate=${today}&order=desc&sort=${sort}&tagged=${tag}&site=stackoverflow&filter=${filter}`;
}

function createAccordion(title, id, score, creation, rest) {
  var div = document.createElement("div");
  div.className = "accordion-item";
  const item = `<h2 class="accordion-header" id="heading${id}">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${id}">
        <b>${title}</b> <i><b>. Creation:</b> ${creation} / <b>Score:</b> ${score} </i>
      </button>
    </h2>
    <div id="collapse${id}" class="accordion-collapse collapse" data-bs-parent="#${accordionId}">
      <div class="accordion-body"> ${rest.outerHTML} </div>
    </div>`;
  div.innerHTML = item;
  return div;
}

function createCard(type, creation, score, body) {
  var div = document.createElement("div");
  div.className = "card";
  div.style.marginLeft = "10px";
  div.style.marginRight = "10px";
  div.innerHTML = `<div class="card-header">
      ${type} Created: ${creation} Score: ${score}
    </div>
    <div class="card-body">
      ${body}
    </div>`;
  return div;
}

function replies(type, items) {
  var children = [];
  for (item of items) {
    const { creation_date, score } = item;
    const date = new Date(creation_date * 1000);
    var element = createCard(type, date, score, item.body);
    if (type === "Answer" && item.comments) {
      addChildren(element, replies("Comment", item.comments));
    }
    children.push(element);
  }
  return children;
}

function addChildren(parent, list) {
  list.forEach((comp) => parent.appendChild(comp));
}

function buildBody(body, answers, comments) {
  var div = document.createElement("div");
  div.innerHTML = body;
  if (comments) {
    addChildren(div, replies("Comment", comments));
  }
  if (answers) {
    addChildren(div, replies("Answer", answers));
  }
  return div;
}

function elements(parent, items) {
  for (item of items) {
    const {
      title,
      question_id,
      score,
      creation_date,
      body,
      comments,
      answers,
    } = item;
    const date = new Date(creation_date * 1000);
    const card = createAccordion(
      title,
      question_id,
      score,
      date.toISOString(),
      buildBody(body, answers, comments)
    );
    parent.appendChild(card);
  }
}

async function apiCall(url) {
  const response = await fetch(url);
  const json = await response.json();
  return json;
}

function extract(list, count) {
  return list.slice(0, Math.min(list.length, count));
}

async function call() {
  const input = document.getElementById("tag");
  if (input.value) {
    err.style.display = "none";
    try {
      var url = buildUrl("creation", input.value);
      const byCreation = await apiCall(url);
      const created = extract(byCreation.items, 10);

      url = buildUrl("votes", input.value);
      const byVotes = await apiCall(url);
      const votes = extract(byVotes.items, 10);

      var questions = created.concat(votes);
      questions.sort(function (first, second) {
        return first.creation_date > second.creation_date;
      });

      var accordion = document.getElementById(accordionId);
      elements(accordion, questions);
    } catch (err) {
      console.error(err);
      setError("Something went wrong, please try again later");
    }
  } else {
    setError("Please enter a tag");
  }
}

function setError(msg) {
  err.innerHTML = msg;
  err.style.display = "block";
}
