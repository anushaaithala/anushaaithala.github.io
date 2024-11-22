const passkey = "$2a$10$2Cj3msXTk515hi7gT4CbEeUgWAuN2nq/WsM5bNVXoOehZzRfudaN2";
let sessionId = undefined;
const SERVER_URL = "http://demo.eam360.com:3000";
const siloName = "EAM work history insights";
const queryString1 = window.location.search;
const urlParams1 = new URLSearchParams(queryString1);
const assetnum1 = urlParams.get('assetnum');
const siteid1 = urlParams.get('siteid');
console.log(assetnum1);
console.log(siteid1);
TarkaChat.init({
  title: "AskMai",
  botName: "AskMai",
  // greeting: "Welcome. How can I assist you today?",
  greeting:
    "Hello! I am AskMai, your friendly guide to find out asset workorder history insights",
  themeColor: "#16a1e3",
  selectorId: "chatbot",
  expand: true,
  enableUpload: false,
  // preChatRenderer: (onClose) => getPreChatScreen(onClose),
  submitHandler: (message) => onMessageSubmit(message),
});

startSession(passkey)
  .then((val) => {
    sessionId = val;
    return fetchSilos();
  })
  .then((silos) => silos.filter((silo) => silo === siloName))
  .then((silos) => showSilos(silos));

function getPreChatScreen(onClose) {
  // const prechatContainer = document.createElement("div");
  // prechatContainer.id = "prechat-container";
  // const silosContainer = document.createElement("div");
  // silosContainer.classList.add("prechat-silos");
  // const h5 = document.createElement("h5");
  // h5.textContent =
  //   "Hello! I am Vidura, your friendly guide to understanding all you need to know about MAS 8. Please drop your questions below.";
  // silosContainer.appendChild(h5);
  // const button = document.createElement("button");
  // button.innerText = "Maximo Application Suite pricing";
  // button.addEventListener("click", onClose);
  // silosContainer.appendChild(button);
  // prechatContainer.appendChild(silosContainer);
  // return prechatContainer;
  onClose();
}

// Function to show silos
async function showSilos(silos) {
  // console.log(silos);
  const prechatContainer = document.createElement("div");
  prechatContainer.id = "prechat-container";
  prechatContainer.innerHTML = "";
  const silosContainer = document.createElement("div");
  silosContainer.classList.add("prechat-silos");
  const h4 = document.createElement("h4");
  h4.textContent = "choose one of the silos";
  silosContainer.appendChild(h4);
  const ul = document.createElement("ul");
  silos.forEach((item) => {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.textContent = item;
    button.onclick = () => selectSilo(item);
    li.appendChild(button);
    ul.appendChild(li);
  });
  silosContainer.appendChild(ul);
  prechatContainer.appendChild(silosContainer);
  return prechatContainer;
}
function selectSilo(silo) {
  console.log("selected-s  ilo: ", silo);
  localStorage.setItem(
    "vidura-bot-configs",
    JSON.stringify({
      passkey: passkey,
      sessionId: sessionId,
      silo,
    })
  );
  onClose();
  return prechatContainer;
}
// //start session
async function startSession(passkey) {
  try {
    const url = `${SERVER_URL}/api/start-session`;
    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: "Bearer " + passkey },
    });
    const data = await response.json();
    return data?.sessionId;
  } catch (err) {
    console.error(err);
  }
}
// // Function to fetch silos
async function fetchSilos() {
  try {
    const url = `${SERVER_URL}/api/silos`;
    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: "Bearer " + passkey },
    });
    const data = await response.json();
    return data?.silos;
  } catch (err) {
    console.error(err);
  }
}
// // function for messagesubmission
async function onMessageSubmit(message) {
  // console.log(message);
  try {
    const configs = localStorage.getItem("vidura-bot-configs");
    // const { passkey, sessionId } = JSON.parse(configs);
    const url = `${SERVER_URL}/api/chat`;
    //console.log(sessionId);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + passkey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, sessionId, silo: siloName,assetnum:assetnum1,siteid:siteid1 }),
    });
    const data = await response.json();
    if (data?.content =="Error: No response from API") {
      return "Sorry ! Could not find any closed workorders data for this asset in last 3 years";
    } else if (data?.content =="An error occurred while processing your query.") {
      return "Sorry ! I am unable to comprehend your question. Could you try reframing your question and asking again?";
    } else {
      return data?.content;
    } 
    
    // const responseMessage = data.content || "No response";
    // // Log chat history to Google Sheets via Google Apps Script
    // const googleResponse = await fetch(GOOGLE_SCRIPT_URL, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "text/plain",
    //   },
    //   body: JSON.stringify({ message, responseMessage }),
    // });
    // if (!googleResponse.ok) {
    //   console.error("Failed to log chat history:", googleResponse.statusText);
    // }
    // return responseMessage;
  } catch (err) {
    console.error(err);
    return "Something went wrong!";
  }
}
// const responseMessage = data?.content || "No response";
// // Log chat history to Google Sheets via Google Apps Script
// const googleResponse = await fetch(GOOGLE_SCRIPT_URL, {
//   method: "POST",
//   headers: {
//     "Content-Type": "text/plain",
//   },
//   body: JSON.stringify({ message, responseMessage }),
// });
// if (!googleResponse.ok) {
//   console.error("Failed to log chat history:", googleResponse.statusText);
// }
// return responseMessage;
