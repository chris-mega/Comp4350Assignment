const baseAPI = "https://api.stackexchange.com/2.2";
const questions = `${baseAPI}/questions`;
const filter =
  "!)PBpiQU6xq56c5frl-2DJSAs(FpuD)qYSIAko5H6ou)-KXU9SH(N4ZKrxuM-(MLcTy9yBm";

const accordionId = "accordionQuestions";
const errMsg = document.getElementById("error");

function buildUrl(sort, tag) {
  const today = Math.floor(new Date().getTime() / 1000);
  const last = today - 7 * 24 * 60 * 60;
  return `${questions}?pagesize=10&fromdate=${last}&todate=${today}&order=desc&sort=${sort}&tagged=${tag}&site=stackoverflow&filter=${filter}`;
}

function createAccordion(title, id, score, creation, rest) {
  var div = document.createElement("div");
  div.className = "accordion-item";
  const item = `<h2 class="accordion-header" id="heading${id}">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${id}">
        <h4>
          ${title}
          <span class="badge bg-primary">Created: ${creation}</span>
          <span class="badge bg-secondary">Score: ${score}</span>
        </h4>
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
      <h4>
        <span class="badge bg-warning text-dark">${type}</span>
        <span class="badge bg-primary">Created: ${creation}</span>
        <span class="badge bg-secondary">Score: ${score}</span>
      </h4>
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
    var element = createCard(type, date.toISOString(), score, item.body);
    if (type === "Answer" && item.comments)
      addChildren(element, replies("Comment", item.comments));
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
  if (comments) addChildren(div, replies("Comment", comments));
  if (answers) addChildren(div, replies("Answer", answers));
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

async function call() {
  const input = document.getElementById("tag");
  if (input.value) {
    var accordion = document.getElementById(accordionId);
    var button = document.getElementById("button");
    var spinner = document.getElementById("spinner");
    var success = document.getElementById("success");
    accordion.innerHTML = "";
    spinner.style.display = "block";
    button.disabled = true;
    setAlert(errMsg, "none");
    setAlert(success, "none");
    try {
      const start = new Date();
      var url = buildUrl("creation", input.value);
      const created = await apiCall(url);

      url = buildUrl("votes", input.value);
      const votes = await apiCall(url);

      var questions = created.items.concat(votes.items);
      if (questions && questions.length > 0) {
        questions.sort(function (first, second) {
          return first.creation_date < second.creation_date;
        });

        elements(accordion, questions);
        const now = new Date();
        const respTime = `Successfully returned information in ${
          (now - start) / 1000
        } seconds`;
        setAlert(success, "block", respTime);
      } else {
        setAlert(errMsg, "block", "Tag not found");
      }
    } catch (err) {
      console.error(err);
      setAlert(errMsg, "block", "Something went wrong, please try again later");
    }
    button.disabled = false;
    spinner.style.display = "none";
  } else {
    setAlert(errMsg, "block", "Please enter a tag");
  }
}

function setAlert(elm, display, msg = "") {
  elm.innerHTML = msg;
  elm.style.display = display;
}
