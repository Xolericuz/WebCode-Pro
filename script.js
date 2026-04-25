// VS Code - Main JavaScript

// ===== Data =====
let files = {
    'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>Hello VS Code!</h1>
        <p>Welcome to your editor.</p>
        <button onclick="sayHello()">Click Me</button>
    </div>
    <script src="script.js"><\/script>
</body>
</html>`,
    
    'style.css': `/* Main Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', sans-serif;
    background: linear-gradient(135deg, #1a1a2e, #16213e);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
}

.container {
    text-align: center;
    padding: 40px;
}

h1 {
    font-size: 3rem;
    margin-bottom: 20px;
    background: linear-gradient(90deg, #d946ef, #8b5cf6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

p {
    font-size: 1.2rem;
    color: #9ca3af;
    margin-bottom: 20px;
}

button {
    padding: 12px 32px;
    font-size: 1rem;
    background: #d946ef;
    border: none;
    border-radius: 8px;
    color: #fff;
    cursor: pointer;
    transition: all 0.3s;
}

button:hover {
    background: #8b5cf6;
    transform: translateY(-2px);
}`,
    
    'script.js': `// Main Script
function sayHello() {
    alert('Hello from VS Code!');
}

console.log('VS Code loaded!');`
};

let openTabs = ['index.html'];
let activeFile = 'index.html';
let updateTimer;

// ===== Elements =====
const fileTree = document.getElementById('fileTree');
const tabsContainer = document.getElementById('tabs');
const codeEditor = document.getElementById('codeEditor');
const lineNumbers = document.getElementById('lineNumbers');
const previewFrame = document.getElementById('previewFrame');
const editorSplit = document.getElementById('editorSplit');
const welcome = document.getElementById('welcome');
const panelTitle = document.getElementById('panelTitle');

// ===== Init =====
function init() {
    renderFileTree();
    renderTabs();
    showEditor();
    requestFullscreen();
}

// ===== File Tree =====
function renderFileTree() {
    fileTree.innerHTML = Object.keys(files).map(name => {
        const ext = name.split('.')[1] || '';
        return `<div class="file-item ${ext}" data-file="${name}" onclick="openFile('${name}')">${name}</div>`;
    }).join('');
}

// ===== Tabs =====
function renderTabs() {
    tabsContainer.innerHTML = openTabs.map(name => {
        return `<div class="tab ${name === activeFile ? 'active' : ''}" onclick="openFile('${name}')">
            <span class="icon">${getIcon(name)}</span>
            <span class="name">${name}</span>
            <span class="close" onclick="closeTab('${name}', event)">✕</span>
        </div>`;
    }).join('');
}

function getIcon(name) {
    if (name.endsWith('.html')) return '📄';
    if (name.endsWith('.css')) return '🎨';
    if (name.endsWith('.js')) return '⚡';
    return '📄';
}

// ===== Editor =====
function showEditor() {
    welcome.style.display = 'none';
    editorSplit.style.display = 'flex';
    codeEditor.value = files[activeFile];
    updateLineNumbers();
    updatePreview();
    updateCursor();
    panelTitle.textContent = activeFile.toUpperCase();
}

function updateLineNumbers() {
    const lines = codeEditor.value.split('\n').length;
    let nums = '';
    for (let i = 1; i <= lines; i++) {
        nums += i + '\n';
    }
    lineNumbers.textContent = nums;
}

function onInput() {
    files[activeFile] = codeEditor.value;
    updateLineNumbers();
    clearTimeout(updateTimer);
    updateTimer = setTimeout(updatePreview, 400);
    updateCursor();
}

function syncScroll() {
    lineNumbers.scrollTop = codeEditor.scrollTop;
}

function openFile(name) {
    if (!openTabs.includes(name)) {
        openTabs.push(name);
    }
    activeFile = name;
    renderTabs();
    renderFileTree();
    showEditor();
}

function closeTab(name, event) {
    event.stopPropagation();
    openTabs = openTabs.filter(t => t !== name);
    if (openTabs.length === 0) {
        openTabs = ['index.html'];
    }
    if (activeFile === name) {
        activeFile = openTabs[0];
    }
    renderTabs();
    showEditor();
}

// ===== Preview =====
function updatePreview() {
    let html = files['index.html'] || '';
    
    // Inject CSS
    if (files['style.css']) {
        html = html.replace('</head>', `<style>${files['style.css']}</style></head>`);
    }
    
    // Inject JS
    if (files['script.js']) {
        html = html.replace('</body>', `<script src="script.js"><\/script></body>`);
    }
    
    previewFrame.srcdoc = html;
}

function updateCursor() {
    const text = codeEditor.value.substring(0, codeEditor.selectionStart);
    const lines = text.split('\n');
    const line = lines.length;
    const col = lines[lines.length - 1].length + 1;
    document.getElementById('cursorPos').textContent = `Ln ${line}, Col ${col}`;
    
    const ext = activeFile.split('.')[1]?.toUpperCase() || 'HTML';
    document.getElementById('fileType').textContent = ext;
}

// ===== Actions =====
function toggleSection() {
    const header = document.querySelector('.section-header');
    const tree = document.querySelector('.file-tree');
    header.classList.toggle('collapsed');
    tree.style.display = tree.style.display === 'none' ? 'block' : 'none';
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
}

function clearEditor() {
    if (confirm('Clear all files?')) {
        Object.keys(files).forEach(k => files[k] = '');
        showEditor();
    }
}

function saveAll() {
    localStorage.setItem('vscode-data', JSON.stringify(files));
    alert('Saved!');
}

function createNewFile() {
    const name = prompt('Enter file name:', 'new.html');
    if (name) {
        files[name] = '';
        openTabs.push(name);
        activeFile = name;
        renderFileTree();
        renderTabs();
        showEditor();
    }
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

function requestFullscreen() {
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
    }
}

function minimize() {
    history.back();
}

function closeApp() {
    if (confirm('Close?')) window.close();
}

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveAll();
    }
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        createNewFile();
    }
    if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
    }
});

// ===== Load Saved Data =====
const saved = localStorage.getItem('vscode-data');
if (saved) {
    try {
        const data = JSON.parse(saved);
        if (data && typeof data === 'object') {
            files = data;
            openTabs = Object.keys(files);
            activeFile = openTabs[0] || 'index.html';
        }
    } catch (e) {
        console.log('No saved data');
    }
}

// ===== Start =====
init();
codeEditor.focus();