export interface ProjectData {
    id: string;
    name: string;
    techStack: string;
    createdAt: Date;
    lastModified: Date;
    files: Record<string, string>;
}

export interface SavedProject {
    id: string;
    name: string;
    techStack: string;
    createdAt: string;
    lastModified: string;
    files: Record<string, string>;
}

const STORAGE_KEY = 'traycer-projects';
const CURRENT_PROJECT_KEY = 'traycer-current-project';

export const saveProject = (project: ProjectData): void => {
    try {
        const savedProject: SavedProject = {
            ...project,
            createdAt: project.createdAt.toISOString(),
            lastModified: project.lastModified.toISOString(),
        };

        localStorage.setItem(`${STORAGE_KEY}-${project.id}`, JSON.stringify(savedProject));
        localStorage.setItem(CURRENT_PROJECT_KEY, project.id);
    } catch (error) {
        console.error('Failed to save project:', error);
    }
};

export const loadProject = (projectId: string): ProjectData | null => {
    try {
        const savedProject = localStorage.getItem(`${STORAGE_KEY}-${projectId}`);
        if (!savedProject) return null;

        const parsed: SavedProject = JSON.parse(savedProject);
        return {
            ...parsed,
            createdAt: new Date(parsed.createdAt),
            lastModified: new Date(parsed.lastModified),
        };
    } catch (error) {
        console.error('Failed to load project:', error);
        return null;
    }
};

export const loadCurrentProject = (): ProjectData | null => {
    try {
        const currentProjectId = localStorage.getItem(CURRENT_PROJECT_KEY);
        if (!currentProjectId) return null;

        return loadProject(currentProjectId);
    } catch (error) {
        console.error('Failed to load current project:', error);
        return null;
    }
};

export const deleteProject = (projectId: string): void => {
    try {
        localStorage.removeItem(`${STORAGE_KEY}-${projectId}`);
        const currentProjectId = localStorage.getItem(CURRENT_PROJECT_KEY);
        if (currentProjectId === projectId) {
            localStorage.removeItem(CURRENT_PROJECT_KEY);
        }
    } catch (error) {
        console.error('Failed to delete project:', error);
    }
};

export const clearAllProjects = (): void => {
    try {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(STORAGE_KEY) || key === CURRENT_PROJECT_KEY) {
                localStorage.removeItem(key);
            }
        });
    } catch (error) {
        console.error('Failed to clear projects:', error);
    }
};

export const getAllProjectIds = (): string[] => {
    try {
        const keys = Object.keys(localStorage);
        return keys
            .filter(key => key.startsWith(`${STORAGE_KEY}-`))
            .map(key => key.replace(`${STORAGE_KEY}-`, ''));
    } catch (error) {
        console.error('Failed to get project IDs:', error);
        return [];
    }
};

export const updateProjectFiles = (project: ProjectData, files: Record<string, string>): ProjectData => {
    return {
        ...project,
        files,
        lastModified: new Date(),
    };
};

export const createInitialFiles = (techStack: string): Record<string, string> => {
    if (techStack === 'node') {
        return {
            'index.js': `const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.json({ message: 'Hello from Node.js server!' });
});

app.listen(PORT, () => {
    console.log(\`Server is running on port \${PORT}\`);
});`,
            'package.json': `{
  "name": "node-project",
  "version": "1.0.0",
  "description": "A simple Node.js project",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "express": "^5.1.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}`,
        };
    } 
    // else if (techStack === 'react') {
    //     return {

    //        ,
    //     };
    // }

    return {};
};
