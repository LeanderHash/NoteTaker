class NoteTaker {
    constructor() {
        this.notes = [];
        this.currentNote = null;
        this.init();
    }

    init() {
        this.loadNotes();
        this.bindEvents();
        this.renderNotesList();
    }

    bindEvents() {
        document.getElementById('new-note-btn').addEventListener('click', () => this.createNewNote());
        document.getElementById('save-note').addEventListener('click', () => this.saveCurrentNote());
        document.getElementById('delete-note').addEventListener('click', () => this.deleteCurrentNote());
        document.getElementById('search').addEventListener('input', (e) => this.searchNotes(e.target.value));
    }

    loadNotes() {
        const savedNotes = localStorage.getItem('notes');
        if (savedNotes) {
            this.notes = JSON.parse(savedNotes);
        }
    }

    saveNotes() {
        localStorage.setItem('notes', JSON.stringify(this.notes));
    }

    createNewNote() {
        const newNote = {
            id: Date.now(),
            title: 'Untitled Note',
            content: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.notes.unshift(newNote);
        this.currentNote = newNote;
        this.renderNotesList();
        this.loadNoteInEditor(newNote);
    }

    saveCurrentNote() {
        if (!this.currentNote) return;

        const title = document.getElementById('note-title').value || 'Untitled Note';
        const content = document.getElementById('note-content').value;

        this.currentNote.title = title;
        this.currentNote.content = content;
        this.currentNote.updatedAt = new Date().toISOString();

        this.saveNotes();
        this.renderNotesList();
    }

    deleteCurrentNote() {
        if (!this.currentNote) return;

        if (confirm('Are you sure you want to delete this note?')) {
            this.notes = this.notes.filter(note => note.id !== this.currentNote.id);
            this.saveNotes();
            this.renderNotesList();
            this.clearEditor();
            this.currentNote = null;
        }
    }

    searchNotes(query) {
        const filteredNotes = this.notes.filter(note =>
            note.title.toLowerCase().includes(query.toLowerCase()) ||
            note.content.toLowerCase().includes(query.toLowerCase())
        );
        this.renderNotesList(filteredNotes);
    }

    renderNotesList(notesToShow = null) {
        const notesList = document.getElementById('notes-list');
        const notes = notesToShow || this.notes;

        notesList.innerHTML = '';

        notes.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.className = 'note-item';
            if (this.currentNote && this.currentNote.id === note.id) {
                noteElement.classList.add('active');
            }

            noteElement.innerHTML = `
                <h4>${note.title}</h4>
                <p>${note.content.substring(0, 50)}${note.content.length > 50 ? '...' : ''}</p>
                <small>${new Date(note.updatedAt).toLocaleDateString()}</small>
            `;

            noteElement.addEventListener('click', () => this.loadNoteInEditor(note));
            notesList.appendChild(noteElement);
        });
    }

    loadNoteInEditor(note) {
        this.currentNote = note;
        document.getElementById('note-title').value = note.title;
        document.getElementById('note-content').value = note.content;
        this.renderNotesList();
    }

    clearEditor() {
        document.getElementById('note-title').value = '';
        document.getElementById('note-content').value = '';
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new NoteTaker();
});