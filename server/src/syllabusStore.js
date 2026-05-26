const fs = require('fs');
const path = require('path');

const REGISTRY_PATH = path.join(__dirname, '../syllabus.json');

// Initialize registry if it doesn't exist
if (!fs.existsSync(REGISTRY_PATH)) {
    fs.writeFileSync(REGISTRY_PATH, JSON.stringify([], null, 2));
}

const syllabusStore = {
    getAll: () => {
        try {
            const data = fs.readFileSync(REGISTRY_PATH, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading syllabus registry:', error);
            return [];
        }
    },

    add: (subject) => {
        try {
            const subjects = syllabusStore.getAll();
            // Generate a secure custom ID if none is supplied
            const subjectId = subject.id || `CUSTOM-${Date.now().toString().slice(-4)}`;
            
            const newSubjects = [...subjects, {
                ...subject,
                id: subjectId,
                uploadedAt: new Date().toISOString()
            }];
            fs.writeFileSync(REGISTRY_PATH, JSON.stringify(newSubjects, null, 2));
            return true;
        } catch (error) {
            console.error('Error adding subject to syllabus store:', error);
            return false;
        }
    },

    delete: (id) => {
        try {
            const subjects = syllabusStore.getAll();
            const newSubjects = subjects.filter(s => s.id !== id);
            fs.writeFileSync(REGISTRY_PATH, JSON.stringify(newSubjects, null, 2));
            return true;
        } catch (error) {
            console.error('Error deleting subject from syllabus store:', error);
            return false;
        }
    }
};

module.exports = syllabusStore;
