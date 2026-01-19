let notes = JSON.parse(localStorage.getItem("notes")) || [];
let openedNoteId = null;

const homeScreen = document.getElementById("homeScreen");
const savedScreen = document.getElementById("savedScreen");
const notesContainer = document.getElementById("notesContainer");
const savedContainer = document.getElementById("savedContainer");
const modal = document.getElementById("noteModal");

saveBtn.onclick = () => {
  if (!noteTitle.value) return alert("Title required");

  const reader = new FileReader();
  const file = imageInput.files[0];

  reader.onload = () => {
    notes.push({
      id: Date.now(),
      title: noteTitle.value,
      text: noteText.value,
      category: noteCategory.value,
      image: reader.result || null,
      pin: noteLock.value,
      pinned: false
    });
    saveNotes();
    clearEditor();
  };

  file ? reader.readAsDataURL(file) : reader.onload();
};

function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
  renderHome();
  renderSaved();
}

function clearEditor() {
  noteTitle.value = "";
  noteText.value = "";
  noteLock.value = "";
  imageInput.value = "";
}

function renderHome() {
  notesContainer.innerHTML = "";
  notes.forEach(n => notesContainer.appendChild(createNoteCard(n)));
}

function renderSaved() {
  savedContainer.innerHTML = "";
  notes.forEach(n => savedContainer.appendChild(createSavedCard(n)));
}

function createNoteCard(note) {
  const div = document.createElement("div");
  div.className = "note";
  div.innerHTML = `<h3>${note.title}</h3>`;
  return div;
}

function createSavedCard(note) {
  const div = document.createElement("div");
  div.className = "note";
  div.innerHTML = `<h3>${note.title}</h3>`;
  div.onclick = () => openNote(note.id);
  return div;
}

function openNote(id) {
  const note = notes.find(n => n.id === id);
  if (note.pin && prompt("Enter PIN") !== note.pin) return;

  openedNoteId = id;
  modal.style.display = "block";
  modalTitle.innerText = note.title;
  modalText.innerText = note.text;
  modalImage.src = note.image || "";
}

function closeModal() {
  modal.style.display = "none";
}

function editOpenedNote() {
  const note = notes.find(n => n.id === openedNoteId);
  noteTitle.value = note.title;
  noteText.value = note.text;
  closeModal();
  showHome();
}

function deleteOpenedNote() {
  notes = notes.filter(n => n.id !== openedNoteId);
  saveNotes();
  closeModal();
}

function shareOpenedNote() {
  const note = notes.find(n => n.id === openedNoteId);
  navigator.share ? navigator.share({ text: note.text }) : alert(note.text);
}

function exportOpenedPDF() {
  const note = notes.find(n => n.id === openedNoteId);
  const el = document.createElement("div");
  el.innerHTML = `<h1>${note.title}</h1><p>${note.text}</p>`;
  html2pdf().from(el).save(`${note.title}.pdf`);
}

function showHome() {
  homeScreen.classList.add("active");
  savedScreen.classList.remove("active");
}

function showSaved() {
  savedScreen.classList.add("active");
  homeScreen.classList.remove("active");
}

renderHome();
renderSaved();

// PWA
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}
