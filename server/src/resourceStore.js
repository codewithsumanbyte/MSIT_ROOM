const fs = require('fs');
const path = require('path');

const REGISTRY_PATH = path.join(__dirname, '../resources.json');

// Initialize registry if it doesn't exist
if (!fs.existsSync(REGISTRY_PATH)) {
    fs.writeFileSync(REGISTRY_PATH, JSON.stringify([], null, 2));
}

const resourceStore = {
    getAll: () => {
        try {
            const data = fs.readFileSync(REGISTRY_PATH, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading resource registry:', error);
            return [];
        }
    },

    add: (resource) => {
        try {
            const resources = resourceStore.getAll();
            const newResources = [...resources, {
                ...resource,
                id: Date.now().toString(),
                uploadedAt: new Date().toISOString()
            }];
            fs.writeFileSync(REGISTRY_PATH, JSON.stringify(newResources, null, 2));
            return true;
        } catch (error) {
            console.error('Error adding resource:', error);
            return false;
        }
    },

    delete: (id) => {
        try {
            const resources = resourceStore.getAll();
            const resourceToDelete = resources.find(r => r.id === id);

            if (resourceToDelete) {
                // Delete physical file
                const filePath = path.join(__dirname, '../uploads/resources', resourceToDelete.fileName);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }

            const newResources = resources.filter(r => r.id !== id);
            fs.writeFileSync(REGISTRY_PATH, JSON.stringify(newResources, null, 2));
            return true;
        } catch (error) {
            console.error('Error deleting resource:', error);
            return false;
        }
    }
};

module.exports = resourceStore;
