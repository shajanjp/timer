const addTimerButton = document.getElementById("add-timer");
const tableContent = document.getElementById("table-content");

class Timers {
  list = new Map();
  index = 0;
  currentRunningTimer;

  add(title) {
    const id = ++this.index;
    const timer = new Timer(id, title);

    this.list.set(id, timer);

    return timer;
  }

  startTimerById(id) {
    console.log({id})
    const timer = this.getById(id);
    timer.start();

    if (this.currentRunningTimer) {
      this.currentRunningTimer.stop();
    }

    this.currentRunningTimer = timer;
  }

  stopTimerById(id) {
    const timer = this.getById(id);
    timer.stop();

    this.currentRunningTimer = null;
  }

  getById(id) {
    return this.list.get(id);
  }

  removeById(id) {
    this.list.delete(id);
  }

  *getAll() {
    for (const timer of this.list.values()) {
      yield timer;
    }
  }
}

class Timer {
  startedAt = 0;
  timeClocked = 0;
  timeClockedHumanReadable = "0m";
  isRunning = false;
  history = [];

  constructor(id, title) {
    this.id = id;
    this.title = title;
  }

  start() {
    this.startedAt = new Date();
  }

  stop() {
    const currentDate = new Date();

    this.timeClocked += currentDate - this.startedAt;
    this.timeClockedHumanReadable = this.#convertMillisecondsToHumanReadable(this.timeClocked);
    this.history.push([this.startedAt, currentDate]);
    this.startedAt = 0;
  }

  #convertMillisecondsToHumanReadable(timeClocked) {
    let timeTexts = [];
    const seconds = Math.floor(timeClocked / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.round((seconds % 3600) / 60 / 5) * 5;
    console.log({ timeClocked, seconds, hours, minutes });
    if (hours) {
      timeTexts.push(`${hours}h`);
    }

    timeTexts.push(`${minutes}m`);

    return timeTexts.join(" ");
  }
}

const timers = new Timers();
addTimerButton.addEventListener("click", addNewTimer);

class TimerElement {
  actionTextNode;
  timeClockedTextNode;

  constructor(timer) {
    const rowElem = document.createElement("tr");
    rowElem.setAttribute("data-timer-id", timer.id);

    const titleElem = document.createElement("td");
    titleElem.appendChild(document.createTextNode(timer.title));
    rowElem.appendChild(titleElem);

    const actionElem = document.createElement("td");
    const buttonElem = document.createElement("button");
    buttonElem.setAttribute("class", "ui icon button");
    buttonElem.setAttribute("data-timer-id", timer.id);
    this.actionIconNode = document.createElement("i");
    this.actionIconNode.setAttribute("class", "green play icon");
    buttonElem.appendChild(this.actionIconNode);
    buttonElem.addEventListener("click", ({ target }) => {
      const timer = timers.getById(parseInt(target.dataset.timerId));

      if (timer.startedAt) {
        timers.stopTimerById(timer.id);
        this.timeClockedTextNode.nodeValue = timer.timeClockedHumanReadable;
      } else {
        timers.startTimerById(timer.id);
      }

      const iconClass = timer.startedAt ? "orange pause icon" : "green play icon";
      this.actionIconNode.setAttribute("class", iconClass);
    });
    actionElem.appendChild(buttonElem);
    rowElem.appendChild(actionElem);

    const startedAtElem = document.createElement("td");
    startedAtElem.appendChild(document.createTextNode("10: 15"));
    rowElem.appendChild(startedAtElem);

    const timeClockedElem = document.createElement("td");
    this.timeClockedTextNode = document.createTextNode("");
    timeClockedElem.appendChild(this.timeClockedTextNode);
    rowElem.appendChild(timeClockedElem);

    const detailsElem = document.createElement("td");
    detailsElem.appendChild(document.createTextNode("See details"));
    rowElem.appendChild(detailsElem);

    return rowElem;
  }
}

function addNewTimer() {
  const title = document.getElementById("timer-title").value;
  const timer = timers.add(title);
  const timerElement = new TimerElement(timer);

  tableContent.appendChild(timerElement);
}
