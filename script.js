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
            tags: [],
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
        const tagsInput = document.getElementById('note-tags').value;
        const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

        this.currentNote.title = title;
        this.currentNote.content = content;
        this.currentNote.tags = tags;
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
            note.content.toLowerCase().includes(query.toLowerCase()) ||
            (note.tags && note.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())))
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

            const tagsHtml = note.tags && note.tags.length > 0
                ? `<div class="note-item-tags">${note.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>`
                : '';

            noteElement.innerHTML = `
                <h4>${note.title}</h4>
                <p>${note.content.substring(0, 50)}${note.content.length > 50 ? '...' : ''}</p>
                ${tagsHtml}
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
        document.getElementById('note-tags').value = note.tags ? note.tags.join(', ') : '';
        this.renderNotesList();
    }

    clearEditor() {
        document.getElementById('note-title').value = '';
        document.getElementById('note-content').value = '';
        document.getElementById('note-tags').value = '';
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new NoteTaker();
});