async function fetchNotes() {
  const res = await fetch("/api/notes");
  const notes = await res.json();
  displayNotes(notes);
}

function displayNotes(notes) {
  const container = document.getElementById("notesContainer");
  container.innerHTML = "";
  notes.forEach((note) => {
    const div = document.createElement("div");
    div.className = "note";
    div.innerHTML = `
      <h3>${note.title}</h3>
      <p>${note.content}</p>
      <button onclick="editNote('${note.id}')">Edit</button>
      <button onclick="deleteNote('${note.id}')">Delete</button>
    `;
    container.appendChild(div);
  });
}

function editNote(id) {
  fetch(`/api/notes`)
    .then(res => res.json())
    .then(notes => {
      const note = notes.find(n => n.id === id);
      document.getElementById("title").value = note.title;
      document.getElementById("content").value = note.content;
      isEditing = true;
      editNoteId = id;
    });
}


async function deleteNote(id) {
  await fetch(`/api/notes/${id}`, { method: "DELETE" });
  fetchNotes();
}

document.getElementById("noteForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;

  if (isEditing) {
    await fetch(`/api/notes/${editNoteId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editNoteId, title, content }),
    });
    isEditing = false;
    editNoteId = null;
  } else {
    const id = Date.now().toString();
    await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, title, content }),
    });
  }

  e.target.reset();
  fetchNotes();
});

fetchNotes();