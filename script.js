// AI Builder - Main JavaScript

// ===== State =====
let generatedCode = '';
let aiProvider = 'ollama'; // or 'fallback'
let ollamaUrl = 'http://localhost:11434';

// ===== Elements =====
const promptInput = document.getElementById('promptInput');
const loading = document.getElementById('loading');
const result = document.getElementById('result');
const aiChat = document.getElementById('aiChat');
const actions = document.getElementById('actions');
const preview = document.getElementById('preview');
const codeEditor = document.getElementById('codeEditor');
const chatInput = document.getElementById('chatInput');
const toast = document.getElementById('toast');

let debounceTimer;

// ===== Init =====
function init() {
    showToast('AI Builder ready!', 'success');
}

// ===== Generate Code =====
async function generateCode() {
    const prompt = promptInput.value.trim();
    if (!prompt) {
        showToast('Please describe your website!', 'error');
        promptInput.focus();
        return;
    }

    // Show loading
    showLoading(true);
    
    try {
        // Try Ollama first
        if (aiProvider === 'ollama') {
            generatedCode = await generateWithOllama(prompt);
        }
        
        // If failed or no Ollama, use fallback
        if (!generatedCode) {
            generatedCode = generateFallbackCode(prompt);
        }
        
        // Display result
        displayResult();
        
    } catch (error) {
        console.error('Generation error:', error);
        generatedCode = generateFallbackCode(prompt);
        displayResult();
    }
    
    showLoading(false);
    showToast('Code generated!', 'success');
}

// ===== Ollama API =====
async function generateWithOllama(prompt) {
    const fullPrompt = `Generate a complete, modern single HTML file with inline CSS and JS. 
No explanations, just pure code.
The website should be: ${prompt}
Make it beautiful, modern, and responsive.
Include all CSS and JS in the same file.`;
    
    try {
        const response = await fetch(`${ollamaUrl}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'codellama',
                prompt: fullPrompt,
                stream: false,
                options: {
                    temperature: 0.7,
                    num_predict: 2048
                }
            })
        });
        
        if (!response.ok) throw new Error('Ollama not available');
        
        const data = await response.json();
        return data.response;
        
    } catch (error) {
        console.log('Ollama not available, using fallback');
        return null;
    }
}

// ===== Fallback Template Generator =====
function generateFallbackCode(prompt) {
    prompt = prompt.toLowerCase();
    
    // Detect theme
    const isDark = prompt.includes('dark') || prompt.includes('black') || prompt.includes('night');
    const isLight = prompt.includes('light') || prompt.includes('white') || prompt.includes('clean');
    
    // Detect type
    const isLanding = prompt.includes('landing') || prompt.includes('hero') || prompt.includes('startup');
    const isPortfolio = prompt.includes('portfolio') || prompt.includes('personal');
    const isBlog = prompt.includes('blog') || prompt.includes('post');
    const isEcommerce = prompt.includes('shop') || prompt.includes('store') || prompt.includes('product');
    
    // Colors
    const primary = prompt.includes('purple') ? '#8b5cf6' :
                   prompt.includes('blue') ? '#3b82f6' :
                   prompt.includes('green') ? '#10b981' :
                   prompt.includes('red') ? '#ef4444' :
                   prompt.includes('pink') ? '#ec4899' : '#8b5cf6';
    
    const bgColor = isLight ? '#ffffff' : '#0a0a0f';
    const textColor = isLight ? '#1f2937' : '#f4f4f5';
    const cardBg = isLight ? '#f9fafb' : '#18181f';
    
    // Generate based on detected type
    let content = '';
    
    if (isPortfolio || prompt.includes('personal')) {
        content = generatePortfolio(primary, bgColor, textColor, cardBg);
    } else if (isEcommerce || isShop) {
        content = generateEcommerce(primary, bgColor, textColor, cardBg);
    } else if (isBlog) {
        content = generateBlog(primary, bgColor, textColor, cardBg);
    } else {
        content = generateLanding(primary, bgColor, textColor, cardBg);
    }
    
    return content;
}

function generateLanding(primary, bgColor, textColor, cardBg) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Awesome Website</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', system-ui, sans-serif;
            background: ${bgColor};
            color: ${textColor};
            line-height: 1.6;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 0;
        }
        .logo {
            font-size: 24px;
            font-weight: 700;
            color: ${primary};
        }
        .nav-links {
            display: flex;
            gap: 30px;
            list-style: none;
        }
        .nav-links a {
            color: inherit;
            text-decoration: none;
            transition: color 0.3s;
        }
        .nav-links a:hover {
            color: ${primary};
        }
        .hero {
            text-align: center;
            padding: 100px 0;
            background: linear-gradient(180deg, ${cardBg} 0%, ${bgColor} 100%);
        }
        .hero h1 {
            font-size: 3.5rem;
            font-weight: 700;
            margin-bottom: 20px;
            background: linear-gradient(135deg, ${primary}, ${primary}dd);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .hero p {
            font-size: 1.25rem;
            color: ${textColor}99;
            margin-bottom: 30px;
        }
        .btn {
            display: inline-block;
            padding: 14px 32px;
            background: ${primary};
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px ${primary}40;
        }
        .features {
            padding: 80px 0;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 30px;
        }
        .feature {
            background: ${cardBg};
            padding: 30px;
            border-radius: 16px;
            transition: transform 0.3s;
        }
        .feature:hover {
            transform: translateY(-5px);
        }
        .feature-icon {
            font-size: 40px;
            margin-bottom: 16px;
        }
        .feature h3 {
            font-size: 1.25rem;
            margin-bottom: 10px;
        }
        .feature p {
            color: ${textColor}99;
        }
        footer {
            text-align: center;
            padding: 40px 0;
            border-top: 1px solid ${textColor}20;
            color: ${textColor}99;
        }
        @media (max-width: 768px) {
            .hero h1 { font-size: 2.5rem; }
            .nav-links { display: none; }
        }
    </style>
</head>
<body>
    <div class="container">
        <nav>
            <div class="logo">💜 Brand</div>
            <ul class="nav-links">
                <li><a href="#features">Features</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </div>
    
    <section class="hero">
        <div class="container">
            <h1>Build Something Amazing</h1>
            <p>Transform your ideas into reality with beautiful, modern design.</p>
            <a href="#" class="btn">Get Started →</a>
        </div>
    </section>
    
    <section class="container" id="features">
        <div class="features">
            <div class="feature">
                <div class="feature-icon">⚡</div>
                <h3>Lightning Fast</h3>
                <p>Optimized for speed and performance.</p>
            </div>
            <div class="feature">
                <div class="feature-icon">🎨</div>
                <h3>Beautiful Design</h3>
                <p>Modern aesthetics that impress.</p>
            </div>
            <div class="feature">
                <div class="feature-icon">📱</div>
                <h3>Responsive</h3>
                <p>Works perfectly on all devices.</p>
            </div>
        </div>
    </section>
    
    <footer>
        <div class="container">
            <p>© 2024 Built with AI Builder 💜</p>
        </div>
    </footer>
</body>
</html>`;
}

function generatePortfolio(primary, bgColor, textColor, cardBg) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', system-ui, sans-serif;
            background: ${bgColor};
            color: ${textColor};
        }
        .container { max-width: 1000px; margin: 0 auto; padding: 0 20px; }
        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 30px 0;
        }
        .avatar {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: linear-gradient(135deg, ${primary}, #ec4899);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
            margin: 0 auto 30px;
        }
        .hero { text-align: center; padding: 60px 0; }
        .hero h1 { font-size: 2.5rem; margin-bottom: 16px; }
        .hero p { color: ${textColor}aa; font-size: 1.1rem; margin-bottom: 24px; }
        .socials { display: flex; justify-content: center; gap: 16px; }
        .socials a {
            width: 44px; height: 44px;
            background: ${cardBg};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            color: inherit;
            text-decoration: none;
            transition: transform 0.3s;
        }
        .socials a:hover { transform: scale(1.1); }
        .projects { padding: 40px 0; }
        .projects h2 { margin-bottom: 30px; }
        .project-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 24px;
        }
        .project {
            background: ${cardBg};
            border-radius: 12px;
            overflow: hidden;
            transition: transform 0.3s;
        }
        .project:hover { transform: translateY(-5px); }
        .project-img {
            height: 160px;
            background: linear-gradient(135deg, ${primary}40, ${primary}20);
        }
        .project-info { padding: 20px; }
        .project-info h3 { margin-bottom: 8px; }
        .project-info p { color: ${textColor}aa; font-size: 0.9rem; }
        footer { text-align: center; padding: 40px; color: ${textColor}88; }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div class="logo" style="font-size:20px;font-weight:700;color:${primary}">Portfolio</div>
        </header>
    </div>
    
    <section class="hero">
        <div class="avatar">👨‍💻</div>
        <h1>John Doe</h1>
        <p>Full Stack Developer • Designer • Creator</p>
        <div class="socials">
            <a href="#">GH</a>
            <a href="#">in</a>
            <a href="#">TW</a>
        </div>
    </section>
    
    <section class="container projects">
        <h2>Projects</h2>
        <div class="project-grid">
            <div class="project">
                <div class="project-img"></div>
                <div class="project-info">
                    <h3>Project One</h3>
                    <p>A beautiful web application.</p>
                </div>
            </div>
            <div class="project">
                <div class="project-img"></div>
                <div class="project-info">
                    <h3>Project Two</h3>
                    <p>Innovative solution for business.</p>
                </div>
            </div>
            <div class="project">
                <div class="project-img"></div>
                <div class="project-info">
                    <h3>Project Three</h3>
                    <p>Modern mobile-first design.</p>
                </div>
            </div>
        </div>
    </section>
    
    <footer>
        <p>© 2024 John Doe 💜</p>
    </footer>
</body>
</html>`;
}

function generateEcommerce(primary, bgColor, textColor, cardBg) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shop</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', system-ui, sans-serif;
            background: ${bgColor};
            color: ${textColor};
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 0;
            border-bottom: 1px solid ${textColor}20;
        }
        .logo { font-size: 24px; font-weight: 700; color: ${primary}; }
        .cart {
            position: relative;
            cursor: pointer;
        }
        .cart-count {
            position: absolute;
            top: -8px; right: -8px;
            width: 20px; height: 20px;
            background: ${primary};
            border-radius: 50%;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .hero {
            text-align: center;
            padding: 80px 0;
        }
        .hero h1 {
            font-size: 3rem;
            margin-bottom: 16px;
        }
        .hero p {
            color: ${textColor}aa;
            margin-bottom: 24px;
        }
        .btn {
            padding: 14px 32px;
            background: ${primary};
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.3s;
        }
        .btn:hover { transform: translateY(-2px); }
        .products {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
            gap: 30px;
            padding: 60px 0;
        }
        .product {
            background: ${cardBg};
            border-radius: 12px;
            overflow: hidden;
            cursor: pointer;
            transition: transform 0.3s;
        }
        .product:hover { transform: translateY(-5px); }
        .product-img {
            height: 200px;
            background: linear-gradient(135deg, ${primary}30, ${primary}10);
        }
        .product-info { padding: 20px; }
        .product-info h3 { margin-bottom: 8px; }
        .product-price {
            font-size: 1.25rem;
            font-weight: 700;
            color: ${primary};
        }
        footer {
            text-align: center;
            padding: 40px;
            border-top: 1px solid ${textColor}20;
        }
    </style>
</head>
<body>
    <div class="container">
        <nav>
            <div class="logo">Shop</div>
            <div class="cart">
                🛒
                <span class="cart-count">3</span>
            </div>
        </nav>
    </div>
    
    <section class="hero">
        <h1>Summer Collection</h1>
        <p>Discover the best products for your style.</p>
        <button class="btn">Shop Now</button>
    </section>
    
    <section class="container">
        <div class="products">
            <div class="product">
                <div class="product-img"></div>
                <div class="product-info">
                    <h3>Product One</h3>
                    <div class="product-price">$99</div>
                </div>
            </div>
            <div class="product">
                <div class="product-img"></div>
                <div class="product-info">
                    <h3>Product Two</h3>
                    <div class="product-price">$149</div>
                </div>
            </div>
            <div class="product">
                <div class="product-img"></div>
                <div class="product-info">
                    <h3>Product Three</h3>
                    <div class="product-price">$79</div>
                </div>
            </div>
        </div>
    </section>
    
    <footer>
        <p>© 2024 Shop 💜</p>
    </footer>
</body>
</html>`;
}

function generateBlog(primary, bgColor, textColor, cardBg) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', system-ui, sans-serif;
            background: ${bgColor};
            color: ${textColor};
        }
        .container { max-width: 800px; margin: 0 auto; padding: 0 20px; }
        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 30px 0;
            border-bottom: 1px solid ${textColor}20;
        }
        .logo { font-size: 24px; font-weight: 700; }
        .nav-links { display: flex; gap: 24px; }
        .nav-links a {
            color: ${textColor};
            text-decoration: none;
            transition: color 0.3s;
        }
        .nav-links a:hover { color: ${primary}; }
        .hero {
            text-align: center;
            padding: 80px 0;
        }
        .hero h1 { font-size: 2.5rem; margin-bottom: 16px; }
        .hero p { color: ${textColor}aa; }
        .posts { padding: 40px 0; }
        .post {
            background: ${cardBg};
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 24px;
            cursor: pointer;
            transition: transform 0.3s;
        }
        .post:hover { transform: translateX(5px); }
        .post-meta {
            font-size: 0.85rem;
            color: ${textColor}88;
            margin-bottom: 12px;
        }
        .post h2 { font-size: 1.5rem; margin-bottom: 12px; }
        .post p { color: ${textColor}aa; line-height: 1.7; }
        .read-more {
            display: inline-block;
            margin-top: 16px;
            color: ${primary};
            text-decoration: none;
        }
        footer {
            text-align: center;
            padding: 40px;
            border-top: 1px solid ${textColor}20;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div class="logo">Blog</div>
            <div class="nav-links">
                <a href="#">Home</a>
                <a href="#">Articles</a>
                <a href="#">About</a>
            </div>
        </header>
    </div>
    
    <section class="hero">
        <h1>Welcome to My Blog</h1>
        <p>Thoughts on technology, design, and more.</p>
    </section>
    
    <section class="container posts">
        <article class="post">
            <div class="post-meta">January 15, 2024 • Technology</div>
            <h2>The Future of Web Development</h2>
            <p>Exploring the latest trends and technologies shaping the future of web development...</p>
            <a href="#" class="read-more">Read more →</a>
        </article>
        
        <article class="post">
            <div class="post-meta">January 10, 2024 • Design</div>
            <h2>Designing for Accessibility</h2>
            <p>Why accessibility matters and how to make your websites more inclusive...</p>
            <a href="#" class="read-more">Read more →</a>
        </article>
        
        <article class="post">
            <div class="post-meta">January 5, 2024 • Tips</div>
            <h2>10 Tips for Better Code</h2>
            <p>Practical tips to write cleaner, more maintainable code...</p>
            <a href="#" class="read-more">Read more →</a>
        </article>
    </section>
    
    <footer>
        <p>© 2024 Blog 💜</p>
    </footer>
</body>
</html>`;
}

// ===== Display Result =====
function displayResult() {
    result.classList.add('visible');
    aiChat.classList.add('visible');
    actions.classList.add('visible');
    
    // Show code
    codeEditor.textContent = generatedCode;
    
    // Show preview
    preview.srcdoc = generatedCode;
}

// ===== Update Preview =====
function refreshPreview() {
    if (generatedCode) {
        preview.srcdoc = generatedCode;
    }
}

// ===== Chat with AI =====
async function sendChat() {
    const message = chatInput.value.trim();
    if (!message || !generatedCode) return;
    
    chatInput.value = '';
    showLoading(true);
    
    // Modify prompt
    const modificationPrompt = `
Current code:
${generatedCode}

User request: ${message}

Generate the modified code with this change applied. Just return the complete code, no explanations.
    `;
    
    try {
        if (aiProvider === 'ollama') {
            try {
                const response = await fetch(`${ollamaUrl}/api/generate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: 'codellama',
                        prompt: modificationPrompt,
                        stream: false
                    })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    generatedCode = data.response;
                } else {
                    throw new Error('failed');
                }
            } catch {
                generatedCode = modifyFallback(message);
            }
        } else {
            generatedCode = modifyFallback(message);
        }
        
        // Re-display
        codeEditor.textContent = generatedCode;
        preview.srcdoc = generatedCode;
        
    } catch (error) {
        console.error('Chat error:', error);
    }
    
    showLoading(false);
    showToast('Code updated!', 'success');
}

function modifyFallback(message) {
    const msg = message.toLowerCase();
    
    // Simple modifications
    if (msg.includes('darker')) {
        return generatedCode.replace('#0a0a0f', '#050508').replace('#0a0a0', '#050508');
    }
    if (msg.includes('lighter')) {
        return generatedCode.replace('#0a0a0f', '#f4f4f5').replace('#18181f', '#ffffff');
    }
    if (msg.includes('blue')) {
        return generatedCode.replace(/#8b5cf6/g, '#3b82f6').replace(/#ec4899/g, '#3b82f6');
    }
    if (msg.includes('green')) {
        return generatedCode.replace(/#8b5cf6/g, '#10b981').replace(/#ec4899/g, '#10b981');
    }
    
    showToast('Try: "darker", "lighter", "blue theme"', 'error');
    return generatedCode;
}

// ===== Actions =====
function copyCode() {
    navigator.clipboard.writeText(generatedCode).then(() => {
        showToast('Copied to clipboard!', 'success');
    }).catch(() => {
        showToast('Copy failed', 'error');
    });
}

function downloadZip() {
    const blob = new Blob([generatedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'website.html';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded!', 'success');
}

function deployToGitHub() {
    showToast('Deploy feature coming soon!', 'success');
}

function openGitHub() {
    window.open('https://github.com/Xolericuz', '_blank');
}

function toggleSettings() {
    showToast('Settings coming soon!', 'success');
}

// ===== Utilities =====
function showLoading(show) {
    if (show) {
        loading.classList.add('visible');
        result.classList.remove('visible');
        aiChat.classList.remove('visible');
        actions.classList.remove('visible');
    } else {
        loading.classList.remove('visible');
    }
}

function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = 'toast visible ' + type;
    setTimeout(() => {
        toast.classList.remove('visible');
    }, 2500);
}

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        if (document.activeElement === promptInput) {
            generateCode();
        } else if (document.activeElement === chatInput) {
            sendChat();
        }
    }
});

// ===== Start =====
init();