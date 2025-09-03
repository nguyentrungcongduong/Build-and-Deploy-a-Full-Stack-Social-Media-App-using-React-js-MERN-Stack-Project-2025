// setup.js - Run this once to create necessary directories
import fs from 'fs';
import path from 'path';

const createDirectories = () => {
    const directories = [
        'uploads',
        'uploads/posts',
        'uploads/temp'
    ];

    directories.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`✅ Created directory: ${dir}`);
        } else {
            console.log(`📁 Directory already exists: ${dir}`);
        }
    });
};

// Create .gitignore for uploads if it doesn't exist
const createGitignore = () => {
    const gitignorePath = path.join('uploads', '.gitignore');
    const gitignoreContent = `# Ignore all files in uploads directory
*
# But keep the directory structure
!.gitignore
!*/
`;

    if (!fs.existsSync(gitignorePath)) {
        fs.writeFileSync(gitignorePath, gitignoreContent);
        console.log('✅ Created .gitignore for uploads directory');
    } else {
        console.log('📄 .gitignore already exists in uploads directory');
    }
};

// Main setup function
const setup = () => {
    console.log('🚀 Setting up server directories...');
    createDirectories();
    createGitignore();
    console.log('✨ Setup complete!');
};

// Run setup if this file is executed directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
    setup();
}

export default setup;