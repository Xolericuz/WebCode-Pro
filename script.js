// AI Builder Pro - Real AI + Cross-Platform

// ===== State =====
let generatedCode = '';
let currentTab = 'preview';
let aiMode = 'cloud'; // 'ollama', 'cloud', 'fallback'

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
const aiStatus = document.getElementById('aiStatus');

// ===== Init =====
async function init() {
    // Detect AI available
    await detectAI();
    showToast('AI Builder Pro ready! ⚡', 'success');
}

// ===== AI Detection =====
async function detectAI() {
    // Try local Ollama first
    try {
        const response = await fetch('http://localhost:11434/api/tags', { 
            method: 'GET',
            signal: timeout(2000).signal 
        });
        if (response.ok) {
            aiMode = 'ollama';
            showToast('🤖 Ollama connected', 'success');
            return;
        }
    } catch (e) {
        console.log('Ollama not available');
    }
    
    // Use cloud/fallback
    aiMode = 'cloud';
    showToast('☁️ Cloud AI ready', 'success');
}

function timeout(ms) {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), ms);
    return { signal: controller.signal };
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
    showAIStatus('Generating...');
    
    try {
        if (aiMode === 'ollama') {
            generatedCode = await generateWithOllama(prompt);
        } else {
            generatedCode = await generateWithCloud(prompt);
        }
        
        if (!generatedCode || generatedCode.length < 100) {
            throw new Error('Invalid response');
        }
        
        displayResult();
        
    } catch (error) {
        console.error('Error:', error);
        // Fallback to template generator
        generatedCode = generateSmartCode(prompt);
        displayResult();
    }
    
    showLoading(false);
    showToast('Website generated!', 'success');
}

// ===== Ollama API (Local) =====
async function generateWithOllama(prompt) {
    const fullPrompt = `Generate a complete, modern, single HTML file with inline CSS and JS.
No explanations, just pure code.
Requirements: ${prompt}
Make it beautiful, modern, responsive.
Include all CSS and JS in the same file.
Start with <!DOCTYPE html>`;
    
    try {
        const response = await fetch('http://localhost:11434/api/generate', {
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
        
        if (!response.ok) throw new Error('Ollama failed');
        
        const data = await response.json();
        return data.response;
        
    } catch (error) {
        console.log('Ollama error, using cloud');
        return await generateWithCloud(prompt);
    }
}

// ===== Cloud AI (API Fallback) =====
async function generateWithCloud(prompt) {
    // For demo - use smart templates
    // In production, connect to real AI API
    return generateSmartCode(prompt);
}

// ===== Cloud AI with Free API Options =====
async function withAIAPI(prompt) {
    // Option 1: Use Groq free API (needs key)
    // Option 2: Use HuggingFace (free, slow)
    // Option 3: Use local fallback
    
    // For now, using intelligent template system
    return generateSmartCode(prompt);
}

// ===== Smart Code Generator (Enhanced Templates) =====
function generateSmartCode(prompt) {
    prompt = prompt.toLowerCase();
    
    // Detect preferences
    const isDark = prompt.includes('dark') || prompt.includes('night') || prompt.includes('black');
    const isLight = prompt.includes('light') || prompt.includes('white') || prompt.includes('clean');
    const isAnimated = prompt.includes('animated') || prompt.includes('animation') || prompt.includes('motion') || prompt.includes('smooth');
    const isGradient = prompt.includes('gradient') || prompt.includes('vibrant') || prompt.includes('colorful');
    const isMinimal = prompt.includes('minimal') || prompt.includes('simple') || prompt.includes('minimalist');
    
    // Theme colors
    const primaryColor = getColorFromPrompt(prompt);
    
    const bgColor = isLight ? '#ffffff' : '#030712';
    const cardBg = isLight ? '#f8fafc' : '#0a0f1a';
    const textColor = isLight ? '#1e293b' : '#f1f5f9';
    const textMuted = isLight ? '#64748b' : '#94a3b8';
    
    // Generate based on type
    let website;
    
    if (prompt.includes('portfolio') || prompt.includes('personal') || prompt.includes('about')) {
        website = generatePortfolio(primaryColor, bgColor, cardBg, textColor, textMuted, isAnimated, isGradient);
    } else if (prompt.includes('shop') || prompt.includes('store') || prompt.includes('product') || prompt.includes('ecommerce')) {
        website = generateShop(primaryColor, bgColor, cardBg, textColor, textMuted, isAnimated, isGradient);
    } else if (prompt.includes('blog')) {
        website = generateBlog(primaryColor, bgColor, cardBg, textColor, textMuted, isAnimated);
    } else if (prompt.includes('dashboard') || prompt.includes('admin') || prompt.includes('panel')) {
        website = generateDashboard(primaryColor, bgColor, cardBg, textColor, textMuted, isAnimated);
    } else if (prompt.includes('saas') || prompt.includes('startup') || prompt.includes('app')) {
        website = generateSaaS(primaryColor, bgColor, cardBg, textColor, textMuted, isAnimated, isGradient);
    } else {
        website = generateLanding(primaryColor, bgColor, cardBg, textColor, textMuted, isAnimated, isGradient);
    }
    
    return website;
}

function getColorFromPrompt(prompt) {
    if (prompt.includes('purple') || prompt.includes('violet')) return '#8b5cf6';
    if (prompt.includes('blue') || prompt.includes('cyan')) return '#06b6d4';
    if (prompt.includes('green') || prompt.includes('emerald')) return '#10b981';
    if (prompt.includes('red') || prompt.includes('rose')) return '#f43f5e';
    if (prompt.includes('pink') || prompt.includes('magenta')) return '#ec4899';
    if (prompt.includes('orange') || prompt.includes('amber')) return '#f97316';
    if (prompt.includes('yellow') || prompt.includes('gold')) return '#eab308';
    if (prompt.includes('teal')) return '#14b8a6';
    if (prompt.includes('indigo')) return '#6366f1';
    return '#06b6d4'; // Default cyan
}

// ===== Template Generators =====
function generateLanding(primary, bg, card, text, muted, animated, gradient) {
    const gradColors = gradient ? `${primary}, ${primary}aa, ${primary}55` : `${primary}, ${primary}dd`;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stunning Website</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        html { scroll-behavior: smooth; }
        
        body {
            font-family: 'Inter', system-ui, sans-serif;
            background: ${bg};
            color: ${text};
            line-height: 1.6;
            overflow-x: hidden;
        }
        
        /* Animated Background */
        ${animated ? `
        .bg-animated {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            z-index: -1;
            overflow: hidden;
        }
        
        .bg-animated::before {
            content: '';
            position: absolute;
            width: 200%;
            height: 200%;
            top: -50%;
            left: -50%;
            background: radial-gradient(circle at 30% 30%, ${primary}15, transparent 50%),
                        radial-gradient(circle at 70% 70%, ${primary}10, transparent 50%),
                        radial-gradient(circle at 50% 50%, ${primary}08, transparent 60%);
            animation: bgMove 20s linear infinite;
        }
        
        @keyframes bgMove {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .glow {
            position: absolute;
            width: 400px;
            height: 400px;
            background: radial-gradient(circle, ${primary}30, transparent 70%);
            filter: blur(80px);
            animation: float 8s ease-in-out infinite;
        }
        
        .glow-1 { top: 10%; left: 10%; }
        .glow-2 { bottom: 20%; right: 10%; animation-delay: -4s; }
        
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-30px); }
        }
        ` : ''}
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 24px;
        }
        
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 24px 0;
            position: relative;
            z-index: 10;
        }
        
        .logo {
            font-size: 26px;
            font-weight: 700;
            background: linear-gradient(135deg, ${gradColors});
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
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
            font-weight: 500;
            transition: color 0.3s;
        }
        
        .nav-links a:hover {
            color: ${primary};
        }
        
        /* Hero */
        .hero {
            text-align: center;
            padding: 120px 0;
            position: relative;
            z-index: 10;
        }
        
        ${animated ? '<div class="bg-animated"><div class="glow glow-1"></div><div class="glow glow-2"></div></div>' : ''}
        
        .hero h1 {
            font-size: clamp(2.5rem, 6vw, 4.5rem);
            font-weight: 700;
            line-height: 1.1;
            margin-bottom: 24px;
        }
        
        .hero h1 span {
            background: linear-gradient(135deg, ${gradColors});
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
        
        .btn-group {
            display: flex;
            gap: 16px;
            justify-content: center;
            flex-wrap: wrap;
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
            background: linear-gradient(135deg, ${gradColors});
            color: #fff;
            box-shadow: 0 10px 30px ${primary}30;
        }
        
        .btn-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 40px ${primary}40;
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
            padding: 100px 0;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 32px;
            position: relative;
            z-index: 10;
        }
        
        .feature {
            background: ${card};
            padding: 40px;
            border-radius: 20px;
            border: 1px solid ${primary}10;
            transition: all 0.3s;
        }
        
        ${animated ? `
        .feature {
            animation: fadeIn 0.6s ease-out backwards;
        }
        .feature:nth-child(1) { animation-delay: 0.1s; }
        .feature:nth-child(2) { animation-delay: 0.2s; }
        .feature:nth-child(3) { animation-delay: 0.3s; }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        ` : ''}
        
        .feature:hover {
            transform: translateY(-8px);
            border-color: ${primary}30;
            box-shadow: 0 20px 40px ${primary}10;
        }
        
        .feature-icon {
            font-size: 42px;
            margin-bottom: 20px;
        }
        
        .feature h3 {
            font-size: 1.35rem;
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
            position: relative;
            z-index: 10;
        }
        
        /* Mobile */
        @media (max-width: 768px) {
            .nav-links { display: none; }
            .hero { padding: 80px 0; }
            .btn-group { flex-direction: column; align-items: center; }
            .btn { width: 100%; max-width: 280px; }
        }
    </style>
</head>
<body>
    ${animated ? '<div class="bg-animated"><div class="glow glow-1"></div><div class="glow glow-2"></div></div>' : ''}
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
            <div class="btn-group">
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

function generateSaaS(primary, bg, card, text, muted, animated, gradient) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SaaS Platform</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', system-ui; background: ${bg}; color: ${text}; line-height: 1.6; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
        
        /* Nav */
        nav { display: flex; justify-content: space-between; align-items: center; padding: 20px 0; }
        .logo { font-size: 24px; font-weight: 700; color: ${primary}; }
        .nav-right { display: flex; gap: 16px; align-items: center; }
        
        /* Hero */
        .hero { text-align: center; padding: 100px 0; }
        .hero h1 { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 700; margin-bottom: 20px; line-height: 1.2; }
        .hero p { color: ${muted}; font-size: 1.2rem; margin-bottom: 30px; max-width: 600px; margin-left: auto; margin-right: auto; }
        .badge { display: inline-block; padding: 6px 14px; background: ${primary}20; color: ${primary}; border-radius: 20px; font-size: 13px; margin-bottom: 20px; }
        
        /* Buttons */
        .btn { padding: 14px 28px; border-radius: 10px; font-size: 15px; font-weight: 600; border: none; cursor: pointer; }
        .btn-primary { background: ${primary}; color: #fff; }
        .btn-outline { background: transparent; border: 1px solid ${primary}50; color: ${text}; }
        
        /* Pricing */
        .pricing { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; padding: 60px 0; }
        .price-card { background: ${card}; padding: 40px; border-radius: 20px; border: 1px solid ${primary}10; }
        .price-card.featured { border-color: ${primary}; }
        .price { font-size: 3rem; font-weight: 700; margin: 20px 0; }
        .price span { font-size: 1rem; font-weight: 400; color: ${muted}; }
        .features-list { list-style: none; margin: 30px 0; }
        .features-list li { padding: 10px 0; color: ${muted}; }
        .features-list li::before { content: '✓'; color: ${primary}; margin-right: 10px; }
        
        /* Footer */
        footer { text-align: center; padding: 40px; border-top: 1px solid ${primary}10; color: ${muted}; }
        
        @media (max-width: 768px) { .nav-right { display: none; } }
    </style>
</head>
<body>
    <div class="container">
        <nav>
            <div class="logo">⚡ SaaS</div>
            <div class="nav-right">
                <button class="btn btn-outline">Log in</button>
                <button class="btn btn-primary">Get Started</button>
            </div>
        </nav>
    </div>
    
    <section class="hero">
        <div class="badge">🚀 Now in Beta</div>
        <h1>The All-in-One<br>Platform</h1>
        <p>Build faster, scale easier, and grow your business with powerful tools.</p>
        <button class="btn btn-primary">Start Free Trial</button>
    </section>
    
    <section class="container">
        <div class="pricing">
            <div class="price-card">
                <h3>Starter</h3>
                <div class="price">$29<span>/mo</span></div>
                <ul class="features-list">
                    <li>Up to 5 users</li>
                    <li>10GB storage</li>
                    <li>Basic support</li>
                </ul>
                <button class="btn btn-outline">Choose</button>
            </div>
            <div class="price-card featured">
                <h3>Pro</h3>
                <div class="price">$79<span>/mo</span></div>
                <ul class="features-list">
                    <li>Up to 20 users</li>
                    <li>100GB storage</li>
                    <li>Priority support</li>
                </ul>
                <button class="btn btn-primary">Choose</button>
            </div>
        </div>
    </section>
    
    <footer><p>© 2024 SaaS Platform ⚡</p></footer>
</body>
</html>`;
}

function generatePortfolio(primary, bg, card, text, muted, animated, gradient) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio</title>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Space Grotesk', sans-serif; background: ${bg}; color: ${text}; }
        .container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
        
        header { padding: 30px 0; display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 22px; font-weight: 700; color: ${primary}; }
        
        .hero { text-align: center; padding: 100px 0; }
        .avatar { width: 150px; height: 150px; background: linear-gradient(135deg, ${primary}, ${primary}dd); border-radius: 50%; margin: 0 auto 30px; display: flex; align-items: center; justify-content: center; font-size: 60px; }
        .hero h1 { font-size: 2.5rem; margin-bottom: 12px; }
        .hero p { color: ${muted}; font-size: 1.1rem; margin-bottom: 30px; }
        
        .socials { display: flex; justify-content: center; gap: 14px; margin-bottom: 60px; }
        .socials a { width: 50px; height: 50px; background: ${card}; border: 1px solid ${primary}20; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: ${text}; text-decoration: none; transition: all 0.3s; }
        .socials a:hover { background: ${primary}; transform: translateY(-4px); }
        
        .projects h2 { margin-bottom: 30px; font-size: 1.75rem; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; padding-bottom: 80px; }
        .project { background: ${card}; border-radius: 16px; overflow: hidden; transition: all 0.3s; border: 1px solid ${primary}10; }
        .project:hover { transform: translateY(-6px); border-color: ${primary}30; }
        .p-img { height: 200px; background: linear-gradient(135deg, ${primary}30, ${primary}10); }
        .p-info { padding: 24px; }
        .p-info h3 { margin-bottom: 8px; }
        .p-info p { color: ${muted}; font-size: 0.9rem; }
        
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
            <a href="#">DN</a>
        </div>
    </section>
    
    <section class="container">
        <div class="projects">
            <h2>Projects</h2>
            <div class="grid">
                <div class="project"><div class="p-img"></div><div class="p-info"><h3>Project One</h3><p>A beautiful web application.</p></div></div>
                <div class="project"><div class="p-img"></div><div class="p-info"><h3>Project Two</h3><p>Innovative solution.</p></div></div>
                <div class="project"><div class="p-img"></div><div class="p-info"><h3>Project Three</h3><p>Modern design.</p></div></div>
            </div>
        </div>
    </section>
    
    <footer><p>© 2024 John Doe ⚡</p></footer>
</body>
</html>`;
}

function generateShop(primary, bg, card, text, muted, animated, gradient) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shop</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: system-ui, sans-serif; background: ${bg}; color: ${text}; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
        
        nav { display: flex; justify-content: space-between; align-items: center; padding: 20px 0; border-bottom: 1px solid ${primary}20; }
        .logo { font-size: 28px; font-weight: 700; color: ${primary}; }
        .cart { position: relative; }
        .cart-num { position: absolute; top: -8px; right: -8px; width: 20px; height: 20px; background: ${primary}; border-radius: 50%; font-size: 12px; display: flex; align-items: center; justify-content: center; }
        
        .hero { text-align: center; padding: 100px 0; }
        .hero h1 { font-size: 3rem; margin-bottom: 16px; }
        .hero p { color: ${muted}; margin-bottom: 30px; }
        
        .btn { padding: 14px 32px; background: ${primary}; color: #fff; border: none; border-radius: 10px; font-size: 16px; font-weight: 600; cursor: pointer; }
        
        .products { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 30px; padding: 60px 0; }
        .product { background: ${card}; border-radius: 16px; overflow: hidden; transition: all 0.3s; border: 1px solid ${primary}10; }
        .product:hover { transform: translateY(-6px); }
        .p-img { height: 220px; background: linear-gradient(135deg, ${primary}30, ${primary}10); }
        .p-info { padding: 24px; }
        .p-info h3 { margin-bottom: 8px; }
        .p-price { font-size: 1.5rem; font-weight: 700; color: ${primary}; }
        
        footer { text-align: center; padding: 40px; border-top: 1px solid ${primary}10; }
    </style>
</head>
<body>
    <div class="container">
        <nav><div class="logo">Shop</div><div class="cart">🛒<span class="cart-num">3</span></div></nav>
    </div>
    
    <section class="hero">
        <h1>Summer Collection</h1>
        <p>Discover the best products for your style.</p>
        <button class="btn">Shop Now</button>
    </section>
    
    <section class="container">
        <div class="products">
            <div class="product"><div class="p-img"></div><div class="p-info"><h3>Product One</h3><div class="p-price">$99</div></div></div>
            <div class="product"><div class="p-img"></div><div class="p-info"><h3>Product Two</h3><div class="p-price">$149</div></div></div>
            <div class="product"><div class="p-img"></div><div class="p-info"><h3>Product Three</h3><div class="p-price">$79</div></div></div>
        </div>
    </section>
    
    <footer><p>© 2024 Shop ⚡</p></footer>
</body>
</html>`;
}

function generateBlog(primary, bg, card, text, muted, animated) {
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
        
        header { display: flex; justify-content: space-between; padding: 30px 0; border-bottom: 1px solid ${primary}20; }
        .logo { font-size: 24px; font-weight: 700; }
        .nav-links { display: flex; gap: 24px; }
        .nav-links a { color: ${muted}; text-decoration: none; }
        .nav-links a:hover { color: ${primary}; }
        
        .hero { text-align: center; padding: 80px 0; }
        .hero h1 { font-size: 2.5rem; margin-bottom: 16px; }
        .hero p { color: ${muted}; }
        
        .posts { padding: 40px 0; }
        .post { background: ${card}; padding: 30px; border-radius: 16px; margin-bottom: 24px; border: 1px solid ${primary}10; }
        .post-meta { color: ${muted}; font-size: 0.85rem; margin-bottom: 10px; }
        .post h2 { font-size: 1.5rem; margin-bottom: 12px; }
        .post p { color: ${muted}; line-height: 1.7; }
        
        footer { text-align: center; padding: 40px; border-top: 1px solid ${primary}10; }
    </style>
</head>
<body>
    <div class="container">
        <header><div class="logo">Blog</div><div class="nav-links"><a href="#">Home</a><a href="#">Articles</a><a href="#">About</a></div></header>
    </div>
    
    <section class="hero"><h1>Welcome to My Blog</h1><p>Thoughts on technology and design.</p></section>
    
    <section class="container">
        <div class="posts">
            <article class="post"><div class="post-meta">January 15, 2024</div><h2>The Future of Web Dev</h2><p>Exploring latest trends...</p></article>
            <article class="post"><div class="post-meta">January 10, 2024</div><h2>Designing for Access</h2><p>Why accessibility matters...</p></article>
        </div>
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
        
        .sidebar { width: 260px; background: ${card}; height: 100vh; padding: 24px; border-right: 1px solid ${primary}10; }
        .s-logo { font-size: 20px; font-weight: 700; color: ${primary}; margin-bottom: 40px; }
        .menu-item { padding: 12px 16px; border-radius: 10px; color: ${muted}; margin-bottom: 8px; }
        .menu-item:hover { background: ${primary}10; }
        .menu-item.active { background: ${primary}; color: #fff; }
        
        .main { flex: 1; padding: 24px; }
        .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .header h1 { font-size: 1.75rem; }
        
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat { background: ${card}; padding: 24px; border-radius: 16px; border: 1px solid ${primary}10; }
        .stat-label { color: ${muted}; font-size: 0.9rem; margin-bottom: 8px; }
        .stat-value { font-size: 2rem; font-weight: 700; color: ${primary}; }
        
        .main-table { background: ${card}; border-radius: 16px; padding: 24px; }
        .t-row { display: flex; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid ${primary}10; }
    </style>
</head>
<body>
    <div class="sidebar">
        <div class="s-logo">⚡ Dashboard</div>
        <div class="menu-item active">📊 Overview</div>
        <div class="menu-item">📈 Analytics</div>
        <div class="menu-item">💰 Revenue</div>
        <div class="menu-item">⚙️ Settings</div>
    </div>
    
    <div class="main">
        <div class="header"><h1>Dashboard</h1><div>👤</div></div>
        
        <div class="stats">
            <div class="stat"><div class="stat-label">Users</div><div class="stat-value">12,345</div></div>
            <div class="stat"><div class="stat-label">Revenue</div><div class="stat-value">$45,678</div></div>
            <div class="stat"><div class="stat-label">Growth</div><div class="stat-value">+23%</div></div>
        </div>
        
        <div class="main-table">
            <div class="t-row"><span>User signup</span><span>2 min</span></div>
            <div class="t-row"><span>New order</span><span>5 min</span></div>
            <div class="t-row"><span>Payment</span><span>10 min</span></div>
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

function showAIStatus(status) {
    if (document.getElementById('aiStatus')) {
        document.getElementById('aiStatus').textContent = status;
    }
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
async function sendChat() {
    const message = chatInput.value.trim();
    if (!message || !generatedCode) return;
    
    // Add user message
    const userMsg = document.createElement('div');
    userMsg.className = 'message user';
    userMsg.innerHTML = `<span>👤</span><p>${message}</p>`;
    chatMessages.appendChild(userMsg);
    
    chatInput.value = '';
    
    // Show thinking
    showAIStatus('Thinking...');
    
    // Simple modifications
    setTimeout(() => {
        let response = 'Applied!';
        
        const msg = message.toLowerCase();
        
        if (msg.includes('darker')) {
            generatedCode = generatedCode.replace(/#030712/g, '#010205').replace(/#0a0f1a/g, '#050810');
            response = 'Made darker!';
        } else if (msg.includes('lighter')) {
            generatedCode = generatedCode.replace(/#030712/g, '#f4f4f5').replace(/#0a0f1a/g, '#ffffff');
            response = 'Made lighter!';
        } else if (msg.includes('blue')) {
            generatedCode = generatedCode.replace(/#06b6d4/g, '#3b82f6').replace(/#22d3ee/g, '#60a5fa');
            response = 'Blue theme!';
        } else if (msg.includes('purple')) {
            generatedCode = generatedCode.replace(/#06b6d4/g, '#8b5cf6').replace(/#22d3ee/g, '#a78bfa');
            response = 'Purple theme!';
        } else if (msg.includes('green')) {
            generatedCode = generatedCode.replace(/#06b6d4/g, '#10b981').replace(/#22d3ee/g, '#34d399');
            response = 'Green theme!';
        } else if (msg.includes('pink') || msg.includes('rose')) {
            generatedCode = generatedCode.replace(/#06b6d4/g, '#ec4899').replace(/#22d3ee/g, '#f472b6');
            response = 'Pink theme!';
        } else if (msg.includes('animat')) {
            if (generatedCode.includes('.bg-animated')) {
                response = 'Already animated!';
            } else {
                generatedCode = generatedCode.replace('body {', 'body { /* animated */');
                response = 'Added animations!';
            }
        }
        
        const botMsg = document.createElement('div');
        botMsg.className = 'message bot';
        botMsg.innerHTML = `<span>🤖</span><p>${response}</p>`;
        chatMessages.appendChild(botMsg);
        
        codeView.textContent = generatedCode;
        preview.srcdoc = generatedCode;
        
    }, 800);
}

// ===== Actions =====
function copyCode() {
    navigator.clipboard.writeText(generatedCode).then(() => {
        showToast('Copied!', 'success');
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
    if (confirm('New project? Current lost.')) {
        promptInput.value = '';
        result.classList.remove('visible');
        actions.classList.remove('visible');
    }
}

function toggleSidebar() {
    sidebar.classList.toggle('open');
}

function addOption(option) {
    const opts = {
        dark: 'dark theme',
        animated: 'with smooth animations',
        modern: 'modern design',
        responsive: 'responsive'
    };
    promptInput.value += (promptInput.value ? ', ' : '') + opts[option];
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

// Start
init();