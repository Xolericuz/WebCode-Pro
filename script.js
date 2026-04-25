// AI Builder Pro - Enhanced JavaScript

// ===== State =====
let generatedCode = '';
let currentTab = 'preview';

// ===== Elements =====
const promptInput = document.getElementById('promptInput');
const loading = document.getElementById('loading');
const result = document.getElementById('result');
const actions = document.getElementById('actions');
const preview = document.getElementById('preview');
const codeView = document.getElementById('codeView');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');
const toast = document.getElementById('toast');
const sidebar = document.querySelector('.sidebar');

// ===== Init =====
function init() {
    showToast('Welcome to AI Builder Pro ⚡', 'success');
}

// ===== Generate Code =====
async function generateCode() {
    const prompt = promptInput.value.trim();
    if (!prompt) {
        showToast('Please describe your website!', 'error');
        promptInput.focus();
        return;
    }

    showLoading(true);
    
    try {
        // Generate code (using smart fallback templates)
        generatedCode = generateSmartCode(prompt);
        
        // Display result
        displayResult();
        
    } catch (error) {
        console.error('Error:', error);
    }
    
    showLoading(false);
    showToast('Website generated!', 'success');
}

// ===== Smart Code Generator =====
function generateSmartCode(prompt) {
    prompt = prompt.toLowerCase();
    
    // Detect preferences
    const isDark = prompt.includes('dark') || prompt.includes('night');
    const isLight = prompt.includes('light') || prompt.includes('clean') || prompt.includes('white');
    const isAnimated = prompt.includes('animated') || prompt.includes('animation') || prompt.includes('motion');
    const isModern = prompt.includes('modern') || prompt.includes('new') || prompt.includes('fresh');
    const isMinimal = prompt.includes('minimal') || prompt.includes('simple') || prompt.includes('minimalist');
    
    // Theme colors
    const primaryColor = prompt.includes('purple') ? '#a855f7' :
                       prompt.includes('blue') ? '#3b82f6' :
                       prompt.includes('green') ? '#10b981' :
                       prompt.includes('red') ? '#ef4444' :
                       prompt.includes('pink') ? '#ec4899' :
                       prompt.includes('orange') ? '#f97316' : '#06b6d4';
    
    const bgColor = isLight ? '#ffffff' : '#030712';
    const cardBg = isLight ? '#f8fafc' : '#0a0f1a';
    const textColor = isLight ? '#1e293b' : '#f1f5f9';
    const textMuted = isLight ? '#64748b' : '#94a3b8';
    
    // Generate based on type
    let website;
    
    if (prompt.includes('portfolio') || prompt.includes('personal')) {
        website = generatePortfolio(primaryColor, bgColor, cardBg, textColor, textMuted, isAnimated, isModern);
    } else if (prompt.includes('shop') || prompt.includes('store') || prompt.includes('ecommerce')) {
        website = generateShop(primaryColor, bgColor, cardBg, textColor, textMuted, isAnimated, isModern);
    } else if (prompt.includes('blog')) {
        website = generateBlog(primaryColor, bgColor, cardBg, textColor, textMuted, isAnimated, isModern);
    } else if (prompt.includes('dashboard') || prompt.includes('admin')) {
        website = generateDashboard(primaryColor, bgColor, cardBg, textColor, textMuted, isAnimated);
    } else {
        website = generateLanding(primaryColor, bgColor, cardBg, textColor, textMuted, isAnimated, isModern);
    }
    
    return website;
}

// ===== Template Generators =====
function generateLanding(primary, bg, card, text, muted, animated, modern) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stunning Website</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Inter', system-ui, sans-serif;
            background: ${bg};
            color: ${text};
            line-height: 1.6;
            overflow-x: hidden;
        }
        
        /* Animated Background */
        ${animated ? `
        body::before {
            content: '';
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: 
                radial-gradient(circle at 20% 20%, ${primary}20, transparent 40%),
                radial-gradient(circle at 80% 80%, ${primary}15, transparent 40%);
            animation: bg-shift 10s ease-in-out infinite;
            z-index: -1;
        }
        
        @keyframes bg-shift {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
        ` : ''}
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 24px;
        }
        
        /* Navigation */
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 24px 0;
        }
        
        .logo {
            font-size: 24px;
            font-weight: 700;
            color: ${primary};
        }
        
        .nav-links {
            display: flex;
            gap: 32px;
            list-style: none;
        }
        
        .nav-links a {
            color: ${muted};
            text-decoration: none;
            font-size: 15px;
            transition: color 0.3s;
        }
        
        .nav-links a:hover {
            color: ${primary};
        }
        
        /* Hero */
        .hero {
            text-align: center;
            padding: 100px 0;
            position: relative;
        }
        
        ${animated ? `
        .hero::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 600px;
            height: 600px;
            background: radial-gradient(circle, ${primary}30, transparent 70%);
            transform: translate(-50%, -50%);
            filter: blur(60px);
            animation: glow 4s ease-in-out infinite;
        }
        
        @keyframes glow {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
        }
        ` : ''}
        
        .hero h1 {
            font-size: ${modern ? '4.5rem' : '3.5rem'};
            font-weight: 700;
            line-height: 1.1;
            margin-bottom: 24px;
            position: relative;
        }
        
        .hero h1 span {
            background: linear-gradient(135deg, ${primary}, ${primary}dd);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .hero p {
            font-size: 1.25rem;
            color: ${muted};
            margin-bottom: 40px;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .cta-group {
            display: flex;
            gap: 16px;
            justify-content: center;
        }
        
        .btn {
            padding: 16px 32px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s;
            cursor: pointer;
            border: none;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, ${primary}, ${primary}dd);
            color: #fff;
            box-shadow: 0 10px 30px ${primary}40;
        }
        
        .btn-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 40px ${primary}50;
        }
        
        .btn-secondary {
            background: ${card};
            color: ${text};
            border: 1px solid ${primary}30;
        }
        
        .btn-secondary:hover {
            background: ${primary}10;
            border-color: ${primary};
        }
        
        /* Features */
        .features {
            padding: 80px 0;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 32px;
        }
        
        .feature {
            background: ${card};
            padding: 40px;
            border-radius: 20px;
            border: 1px solid ${primary}10;
            transition: all 0.3s;
            ${animated ? 'animation: fadeInUp 0.6s ease-out;' : ''}
        }
        
        ${animated ? `
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        ` : ''}
        
        .feature:hover {
            transform: translateY(-5px);
            border-color: ${primary}30;
            box-shadow: 0 20px 40px ${primary}10;
        }
        
        .feature-icon {
            font-size: 40px;
            margin-bottom: 20px;
        }
        
        .feature h3 {
            font-size: 1.5rem;
            margin-bottom: 12px;
        }
        
        .feature p {
            color: ${muted};
            line-height: 1.7;
        }
        
        /* Footer */
        footer {
            text-align: center;
            padding: 60px 0;
            border-top: 1px solid ${primary}10;
            color: ${muted};
        }
        
        @media (max-width: 768px) {
            .hero h1 { font-size: 2.5rem; }
            .nav-links { display: none; }
            .cta-group { flex-direction: column; }
        }
    </style>
</head>
<body>
    <div class="container">
        <nav>
            <div class="logo">⚡ Brand</div>
            <ul class="nav-links">
                <li><a href="#features">Features</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </div>
    
    <section class="hero">
        <div class="container">
            <h1>Build Something<br><span>Amazing</span></h1>
            <p>Transform your ideas into reality with beautiful, modern design.</p>
            <div class="cta-group">
                <a href="#" class="btn btn-primary">Get Started</a>
                <a href="#" class="btn btn-secondary">Learn More</a>
            </div>
        </div>
    </section>
    
    <section class="container" id="features">
        <div class="features">
            <div class="feature">
                <div class="feature-icon">⚡</div>
                <h3>Lightning Fast</h3>
                <p>Optimized for maximum performance and speed.</p>
            </div>
            <div class="feature">
                <div class="feature-icon">🎨</div>
                <h3>Beautiful Design</h3>
                <p>Modern aesthetics that impress everyone.</p>
            </div>
            <div class="feature">
                <div class="feature-icon">📱</div>
                <h3>Fully Responsive</h3>
                <p>Looks perfect on all devices.</p>
            </div>
        </div>
    </section>
    
    <footer>
        <div class="container">
            <p>© 2024 Built with AI Builder ⚡</p>
        </div>
    </footer>
</body>
</html>`;
}

function generatePortfolio(primary, bg, card, text, muted, animated, modern) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Space Grotesk', sans-serif;
            background: ${bg};
            color: ${text};
            line-height: 1.6;
        }
        
        .container { max-width: 1000px; margin: 0 auto; padding: 0 24px; }
        
        header { padding: 40px 0; display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 24px; font-weight: 700; color: ${primary}; }
        
        .hero { text-align: center; padding: 80px 0; }
        
        .avatar {
            width: 140px; height: 140px;
            background: linear-gradient(135deg, ${primary}, ${primary}dd);
            border-radius: 50%;
            margin: 0 auto 30px;
            display: flex; align-items: center; justify-content: center;
            font-size: 56px;
        }
        
        .hero h1 { font-size: 2.5rem; margin-bottom: 16px; }
        .hero p { color: ${muted}; font-size: 1.1rem; margin-bottom: 30px; }
        
        .socials { display: flex; justify-content: center; gap: 16px; margin-bottom: 60px; }
        .socials a {
            width: 48px; height: 48px;
            background: ${card};
            border: 1px solid ${primary}20;
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            color: ${text}; text-decoration: none;
            transition: all 0.3s;
        }
        .socials a:hover { background: ${primary}; color: #fff; transform: translateY(-3px); }
        
        .projects h2 { margin-bottom: 30px; font-size: 1.75rem; }
        
        .project-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; padding-bottom: 60px; }
        
        .project {
            background: ${card};
            border-radius: 16px;
            overflow: hidden;
            transition: all 0.3s;
            border: 1px solid ${primary}10;
        }
        .project:hover { transform: translateY(-5px); border-color: ${primary}30; }
        
        .project-img { height: 180px; background: linear-gradient(135deg, ${primary}30, ${primary}10); }
        
        .project-info { padding: 24px; }
        .project-info h3 { margin-bottom: 8px; }
        .project-info p { color: ${muted}; font-size: 0.9rem; }
        
        footer { text-align: center; padding: 40px; border-top: 1px solid ${primary}10; color: ${muted}; }
    </style>
</head>
<body>
    <div class="container">
        <header><div class="logo">Portfolio</div></header>
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
    
    <section class="container">
        <div class="projects">
            <h2>Projects</h2>
            <div class="project-grid">
                <div class="project"><div class="project-img"></div><div class="project-info"><h3>Project One</h3><p>A beautiful web application.</p></div></div>
                <div class="project"><div class="project-img"></div><div class="project-info"><h3>Project Two</h3><p>Innovative solution for business.</p></div></div>
                <div class="project"><div class="project-img"></div><div class="project-info"><h3>Project Three</h3><p>Modern mobile-first design.</p></div></div>
            </div>
        </div>
    </section>
    
    <footer><p>© 2024 John Doe ⚡</p></footer>
</body>
</html>`;
}

function generateShop(primary, bg, card, text, muted, animated, modern) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shop</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: system-ui, sans-serif;
            background: ${bg};
            color: ${text};
        }
        
        .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
        
        nav { display: flex; justify-content: space-between; align-items: center; padding: 20px 0; border-bottom: 1px solid ${primary}20; }
        .logo { font-size: 28px; font-weight: 700; color: ${primary}; }
        .cart { position: relative; cursor: pointer; }
        .cart-badge {
            position: absolute; top: -8px; right: -8px;
            width: 20px; height: 20px;
            background: ${primary}; border-radius: 50%;
            font-size: 12px; display: flex; align-items: center; justify-content: center;
        }
        
        .hero { text-align: center; padding: 80px 0; }
        .hero h1 { font-size: 3rem; margin-bottom: 16px; }
        .hero p { color: ${muted}; margin-bottom: 30px; }
        
        .btn {
            padding: 14px 32px;
            background: ${primary};
            color: #fff;
            border: none; border-radius: 10px;
            font-size: 16px; font-weight: 600;
            cursor: pointer; transition: all 0.3s;
        }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 10px 30px ${primary}40; }
        
        .products { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 30px; padding: 60px 0; }
        
        .product {
            background: ${card};
            border-radius: 16px;
            overflow: hidden;
            transition: all 0.3s;
            border: 1px solid ${primary}10;
        }
        .product:hover { transform: translateY(-5px); border-color: ${primary}30; }
        
        .product-img {
            height: 220px;
            background: linear-gradient(135deg, ${primary}30, ${primary}10);
        }
        
        .product-info { padding: 20px; }
        .product-info h3 { margin-bottom: 8px; }
        .product-price {
            font-size: 1.5rem;
            font-weight: 700;
            color: ${primary};
        }
        
        footer { text-align: center; padding: 40px; border-top: 1px solid ${primary}10; }
    </style>
</head>
<body>
    <div class="container">
        <nav>
            <div class="logo">Shop</div>
            <div class="cart">🛒<span class="cart-badge">3</span></div>
        </nav>
    </div>
    
    <section class="hero">
        <h1>Summer Collection</h1>
        <p>Discover the best products for your style.</p>
        <button class="btn">Shop Now</button>
    </section>
    
    <section class="container">
        <div class="products">
            <div class="product"><div class="product-img"></div><div class="product-info"><h3>Product One</h3><div class="product-price">$99</div></div></div>
            <div class="product"><div class="product-img"></div><div class="product-info"><h3>Product Two</h3><div class="product-price">$149</div></div></div>
            <div class="product"><div class="product-img"></div><div class="product-info"><h3>Product Three</h3><div class="product-price">$79</div></div></div>
        </div>
    </section>
    
    <footer><p>© 2024 Shop ⚡</p></footer>
</body>
</html>`;
}

function generateBlog(primary, bg, card, text, muted, animated, modern) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body { font-family: system-ui, sans-serif; background: ${bg}; color: ${text}; }
        
        .container { max-width: 800px; margin: 0 auto; padding: 0 24px; }
        
        header { display: flex; justify-content: space-between; align-items: center; padding: 30px 0; border-bottom: 1px solid ${primary}20; }
        .logo { font-size: 24px; font-weight: 700; }
        .nav-links { display: flex; gap: 24px; }
        .nav-links a { color: ${muted}; text-decoration: none; transition: color 0.3s; }
        .nav-links a:hover { color: ${primary}; }
        
        .hero { text-align: center; padding: 80px 0; }
        .hero h1 { font-size: 2.5rem; margin-bottom: 16px; }
        .hero p { color: ${muted}; }
        
        .posts { padding: 40px 0; }
        
        .post {
            background: ${card};
            border-radius: 16px;
            padding: 30px;
            margin-bottom: 24px;
            cursor: pointer;
            transition: all 0.3s;
            border: 1px solid ${primary}10;
        }
        .post:hover { transform: translateX(5px); border-color: ${primary}30; }
        
        .post-meta { font-size: 0.85rem; color: ${muted}; margin-bottom: 12px; }
        .post h2 { font-size: 1.5rem; margin-bottom: 12px; }
        .post p { color: ${muted}; line-height: 1.7; }
        
        .read-more { display: inline-block; margin-top: 16px; color: ${primary}; }
        
        footer { text-align: center; padding: 40px; border-top: 1px solid ${primary}20; }
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
            <p>Exploring the latest trends and technologies...</p>
            <a href="#" class="read-more">Read more →</a>
        </article>
        
        <article class="post">
            <div class="post-meta">January 10, 2024 • Design</div>
            <h2>Designing for Accessibility</h2>
            <p>Why accessibility matters...</p>
            <a href="#" class="read-more">Read more →</a>
        </article>
    </section>
    
    <footer><p>© 2024 Blog ⚡</p></footer>
</body>
</html>`;
}

function generateDashboard(primary, bg, card, text, muted, animated) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body { font-family: system-ui, sans-serif; background: ${bg}; color: ${text}; display: flex; }
        
        .sidebar {
            width: 260px;
            background: ${card};
            height: 100vh;
            padding: 24px;
            border-right: 1px solid ${primary}10;
        }
        
        .sidebar-logo { font-size: 20px; font-weight: 700; color: ${primary}; margin-bottom: 40px; }
        
        .menu-item {
            padding: 12px 16px;
            border-radius: 10px;
            color: ${muted};
            margin-bottom: 8px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .menu-item:hover { background: ${primary}10; color: ${text}; }
        .menu-item.active { background: ${primary}; color: #fff; }
        
        .main { flex: 1; padding: 24px; }
        
        .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .header h1 { font-size: 1.75rem; }
        
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        
        .stat-card {
            background: ${card};
            padding: 24px;
            border-radius: 16px;
            border: 1px solid ${primary}10;
        }
        
        .stat-label { color: ${muted}; font-size: 0.9rem; margin-bottom: 8px; }
        .stat-value { font-size: 2rem; font-weight: 700; color: ${primary}; }
        
        .table { background: ${card}; border-radius: 16px; padding: 24px; }
        .table-header { display: flex; justify-content: space-between; margin-bottom: 16px; }
        .table-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid ${primary}10; }
    </style>
</head>
<body>
    <div class="sidebar">
        <div class="sidebar-logo">⚡ Dashboard</div>
        <div class="menu-item active">📊 Overview</div>
        <div class="menu-item">📈 Analytics</div>
        <div class="menu-item">💰 Revenue</div>
        <div class="menu-item">⚙️ Settings</div>
    </div>
    
    <div class="main">
        <div class="header">
            <h1>Dashboard</h1>
            <div>👤 User</div>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <div class="stat-label">Total Users</div>
                <div class="stat-value">12,345</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Revenue</div>
                <div class="stat-value">$45,678</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Growth</div>
                <div class="stat-value">+23%</div>
            </div>
        </div>
        
        <div class="table">
            <div class="table-header"><h3>Recent Activity</h3></div>
            <div class="table-row"><span>User signup</span><span>2 min ago</span></div>
            <div class="table-row"><span>New order</span><span>5 min ago</span></div>
            <div class="table-row"><span>Payment received</span><span>10 min ago</span></div>
        </div>
    </div>
</body>
</html>`;
}

// ===== Display =====
function displayResult() {
    result.classList.add('visible');
    actions.classList.add('visible');
    
    codeView.textContent = generatedCode;
    preview.srcdoc = generatedCode;
}

// ===== Tab Switch =====
function switchTab(tab) {
    currentTab = tab;
    
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.getElementById(`${tab}-panel`).classList.add('active');
}

// ===== AI Chat =====
function sendChat() {
    const message = chatInput.value.trim();
    if (!message || !generatedCode) return;
    
    // Add user message
    const userMsg = document.createElement('div');
    userMsg.className = 'message user';
    userMsg.innerHTML = `<span>👤</span><p>${message}</p>`;
    chatMessages.appendChild(userMsg);
    
    chatInput.value = '';
    
    // Simple AI response (can be enhanced with Ollama)
    setTimeout(() => {
        const botMsg = document.createElement('div');
        botMsg.className = 'message bot';
        
        // Handle simple modifications
        let response = 'Applied your changes!';
        
        if (message.toLowerCase().includes('darker')) {
            generatedCode = generatedCode.replace(/#030712/g, '#020408').replace(/#0a0f1a/g, '#050a12');
            response = 'Made the background darker!';
        } else if (message.toLowerCase().includes('lighter')) {
            generatedCode = generatedCode.replace(/#030712/g, '#f4f4f5').replace(/#0a0f1a/g, '#ffffff');
            response = 'Made the background lighter!';
        } else if (message.toLowerCase().includes('blue')) {
            generatedCode = generatedCode.replace(/#06b6d4/g, '#3b82f6').replace(/#22d3ee/g, '#60a5fa');
            response = 'Changed to blue theme!';
        } else if (message.toLowerCase().includes('purple')) {
            generatedCode = generatedCode.replace(/#06b6d4/g, '#a855f7').replace(/#22d3ee/g, '#c084fc');
            response = 'Changed to purple theme!';
        }
        
        botMsg.innerHTML = `<span>🤖</span><p>${response}</p>`;
        chatMessages.appendChild(botMsg);
        
        // Update display
        codeView.textContent = generatedCode;
        preview.srcdoc = generatedCode;
        
    }, 500);
}

// ===== Actions =====
function copyCode() {
    navigator.clipboard.writeText(generatedCode).then(() => {
        showToast('Copied to clipboard!', 'success');
    });
}

function downloadCode() {
    const blob = new Blob([generatedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'website.html';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded!', 'success');
}

function deploy() {
    showToast('Deploy coming soon!', 'success');
}

function newProject() {
    if (confirm('Start new project? Current will be lost.')) {
        promptInput.value = '';
        result.classList.remove('visible');
        actions.classList.remove('visible');
    }
}

function toggleSidebar() {
    sidebar.classList.toggle('open');
}

function addOption(option) {
    const options = {
        dark: 'dark theme',
        animated: 'with animations',
        modern: 'modern design',
        responsive: 'responsive layout'
    };
    promptInput.value += (promptInput.value ? ', ' : '') + options[option];
}

// ===== Utils =====
function showLoading(show) {
    if (show) {
        loading.classList.add('visible');
        result.classList.remove('visible');
        actions.classList.remove('visible');
    } else {
        loading.classList.remove('visible');
    }
}

function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = 'toast visible ' + type;
    setTimeout(() => toast.classList.remove('visible'), 2500);
}

// ===== Keyboard =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        if (document.activeElement === promptInput) generateCode();
        else if (document.activeElement === chatInput) sendChat();
    }
});

// ===== Start =====
init();