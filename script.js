// VS Code Pro - Main JavaScript

// ===== File System =====
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
        <h1>Hello VS Code Pro!</h1>
        <p>Start coding...</p>
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
    background: linear-gradient(90deg, #d946ef, #8b5cf6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

button {
    padding: 12px 32px;
    background: #d946ef;
    border: none;
    border-radius: 8px;
    color: #fff;
    cursor: pointer;
}

button:hover {
    background: #8b5cf6;
}`,
    
    'script.js': `// Main Script
function sayHello() {
    alert('Hello from VS Code Pro!');
}

console.log('VS Code Pro loaded!');`
};

let openTabs = ['index.html'];
let activeFile = 'index.html';
let updateTimer;

// ===== DOM Elements =====
const fileList = document.getElementById('fileList');
const tabsContainer = document.getElementById('tabs');
const codeEditor = document.getElementById('codeEditor');
const lineNumbers = document.getElementById('lineNumbers');
const preview = document.getElementById('preview');
const editorSplit = document.getElementById('editorSplit');
const welcome = document.getElementById('welcome');
const panelTitle = document.getElementById('panelTitle');

// ===== Init =====
function init() {
    renderFileList();
    renderTabs();
    showEditor();
    requestFullscreen();
}

// ===== Render File List =====
function renderFileList() {
    fileList.innerHTML = Object.keys(files).map(name => {
        const icon = getIcon(name);
        return `<div class="file-item ${name === activeFile ? 'active' : ''}" onclick="openFile('${name}')">
            <span class="icon">${icon}</span>${name}
        </div>`;
    }).join('');
}

// ===== Render Tabs =====
function renderTabs() {
    tabsContainer.innerHTML = openTabs.map(name => {
        const icon = getIcon(name);
        return `<div class="tab ${name === activeFile ? 'active' : ''}" onclick="openFile('${name}')">
            <span class="icon">${icon}</span>
            <span class="name">${name}</span>
            <span class="close" onclick="closeTab('${name}', event)">×</span>
        </div>`;
    }).join('');
}

function getIcon(name) {
    if (name.endsWith('.html')) return '📄';
    if (name.endsWith('.css')) return '🎨';
    if (name.endsWith('.js')) return '⚡';
    return '📄';
}

// ===== Show Editor =====
function showEditor() {
    welcome.style.display = 'none';
    editorSplit.style.display = 'flex';
    
    codeEditor.innerHTML = highlightSyntax(files[activeFile], activeFile);
    updateLineNumbers();
    updatePreview();
    updateCursor();
    panelTitle.textContent = activeFile;
}

function updateLineNumbers() {
    const text = files[activeFile] || '';
    const lines = text.split('\n').length;
    let nums = '';
    for (let i = 1; i <= lines; i++) {
        nums += i + '\n';
    }
    lineNumbers.textContent = nums;
}

// ===== Syntax Highlighting =====
function highlightSyntax(code, filename) {
    if (!code) return '';
    
    let html = escapeHtml(code);
    
    if (filename.endsWith('.html')) {
        // HTML Syntax
        html = html
            .replace(/(&lt;!DOCTYPE.*?&gt;)/gi, '<span class="keyword">$1</span>')
            .replace(/(&lt;\/?[\w-]+)/g, '<span class="tag">$1</span>')
            .replace(/\s([\w-]+)=/g, ' <span class="attr">$1</span>=')
            .replace(/(".*?")/g, '<span class="string">$1</span>')
            .replace(/(&lt;!--.*?--&gt;)/gs, '<span class="comment">$1</span>');
    } 
    else if (filename.endsWith('.css')) {
        // CSS Syntax
        html = html
            .replace(/([.#][\w-]+)\s*\{/g, '<span class="selector">$1</span> {')
            .replace(/([\w-]+):/g, '<span class="property">$1</span>:')
            .replace(/: (.*?);/g, ': <span class="value">$1</span>;')
            .replace(/\/\*.*?\*\//gs, '<span class="comment">$1</span>');
    } 
    else if (filename.endsWith('.js')) {
        // JS Syntax
        html = html
            .replace(/\b(function|const|let|var|if|else|for|while|return|class|import|export|from)\b/g, '<span class="keyword">$1</span>')
            .replace(/\b(\d+)\b/g, '<span class="number">$1</span>')
            .replace(/('.*?'|".*?")/g, '<span class="string">$1</span>')
            .replace(/\b([\w]+)\(/g, '<span class="function">$1</span>(')
            .replace(/\/\/.*/g, '<span class="comment">$&</span>');
    }
    
    return html;
}

function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// ===== Input Handler =====
function onInput() {
    // Get plain text from innerHTML
    let text = codeEditor.innerText || codeEditor.textContent;
    files[activeFile] = text;
    
    // Re-highlight
    codeEditor.innerHTML = highlightSyntax(text, activeFile);
    updateLineNumbers();
    
    // Debounce preview
    clearTimeout(updateTimer);
    updateTimer = setTimeout(updatePreview, 500);
    
    updateCursor();
}

function syncScroll() {
    lineNumbers.scrollTop = codeEditor.scrollTop;
}

// ===== Open File =====
function openFile(name) {
    if (!openTabs.includes(name)) {
        openTabs.push(name);
    }
    activeFile = name;
    renderTabs();
    renderFileList();
    showEditor();
}

// ===== Close Tab =====
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

// ===== Update Preview =====
function updatePreview() {
    let html = files['index.html'] || '';
    
    // Inject CSS
    if (files['style.css']) {
        html = html.replace('</head>', `<style>${files['style.css']}</style></head>`);
    }
    
    // Inject JS
    if (files['script.js']) {
        html = html.replace('</body>', `<script>${files['script.js']}<\/script></body>`);
    }
    
    preview.srcdoc = html;
}

function refreshPreview() {
    updatePreview();
}

function openInNew() {
    let html = files['index.html'] || '';
    const blob = new Blob([html], {type: 'text/html'});
    window.open(URL.createObjectURL(blob), '_blank');
}

// ===== Cursor Position =====
function updateCursor() {
    const text = files[activeFile] || '';
    const pos = codeEditor.selectionStart || 0;
    const before = text.substring(0, pos);
    const lines = before.split('\n');
    const line = lines.length;
    const col = lines[lines.length - 1].length + 1;
    
    document.getElementById('cursorPos').textContent = `Ln ${line}, Col ${col}`;
    
    const ext = activeFile.split('.').pop().toUpperCase();
    document.getElementById('fileType').textContent = ext;
}

// ===== File Operations =====
function toggleSection() {
    const title = document.querySelector('.section-title');
    const list = document.querySelector('.file-list');
    title.classList.toggle('collapsed');
    list.style.display = list.style.display === 'none' ? 'block' : 'none';
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
}

function newFile() {
    const name = prompt('Enter file name:', 'new.html');
    if (name) {
        files[name] = '';
        openTabs.push(name);
        activeFile = name;
        renderFileList();
        renderTabs();
        showEditor();
    }
}

function clearEditor() {
    if (confirm('Clear all files?')) {
        Object.keys(files).forEach(k => files[k] = '');
        showEditor();
    }
}

function saveProject() {
    localStorage.setItem('vscode-pro', JSON.stringify(files));
    alert('Saved to local storage!');
}

function formatDoc() {
    // Basic formatting
    let code = files[activeFile] || '';
    // This is a simple formatter - can be enhanced
    code = code.replace(/\s+/g, ' ').trim();
    files[activeFile] = code;
    showEditor();
}

// ===== Window Controls =====
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
    if (confirm('Close application?')) {
        window.close();
    }
}

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveProject();
    }
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        newFile();
    }
    if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
    }
});

// ===== Load Saved =====
const saved = localStorage.getItem('vscode-pro');
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