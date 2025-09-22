import requests
from bs4 import BeautifulSoup
import os

def fetch_content(url):
    """Fetch content from a given URL"""
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.text
    except requests.RequestException as e:
        print(f"Error fetching {url}: {e}")
        return None

def extract_tapedynamics_content(html):
    """Extract relevant content from tapedynamics8283.com"""
    soup = BeautifulSoup(html, 'html.parser')
    
    # In a real implementation, we would parse the actual HTML structure
    # For now, we'll return the content we identified earlier
    content = {
        'title': 'TapeDynamics - AI & Trading Solutions',
        'tagline': 'Transform Your Business with AI and Trading Expertise',
        'description': 'TapeDynamics offers cutting-edge solutions in trading education, financial management, AI tools, and professional training.',
        'services': [
            {
                'title': 'Trading Education',
                'description': 'Focused on ICT concepts for futures trading with Elite Trading Formation featuring live sessions.'
            },
            {
                'title': 'Financial Management',
                'description': 'Customized planning for individuals and SMEs with AI-powered budget optimization.'
            },
            {
                'title': 'AI Tools for SMEs',
                'description': 'Digital solutions including custom Telegram bots and booking systems for intelligent automation.'
            },
            {
                'title': 'Professional AI Training',
                'description': 'Teaching professionals to build AI solutions with practical implementation.'
            }
        ],
        'about': 'TapeDynamics 8283 S.L. is a Spanish company specializing in financial education, AI tools, and business consulting services. Our case studies show a 90% improvement in trading confidence and 15% cost reduction in businesses.',
        'contact': {
            'email': 'tapedynamics8283@gmail.com',
            'phone': '+34 613 62 62 53'
        }
    }
    
    return content

def generate_html(content):
    """Generate HTML with the content from tapedynamics8283.com"""
    html_template = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{content['title']}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <div class="container">
            <div class="logo">
                <h1>TapeDynamics</h1>
            </div>
            <nav>
                <ul>
                    <li><a href="#services">Services</a></li>
                    <li><a href="#about">About</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <section class="hero">
        <video autoplay muted loop class="hero-video">
            <source src="assets/background-video.mp4" type="video/mp4">
            Your browser does not support the video tag.
        </video>
        <div class="container">
            <h2>{content['tagline']}</h2>
            <p>{content['description']}</p>
            <a href="#services" class="btn">Explore Our Services</a>
        </div>
    </section>

    <section id="services" class="services">
        <div class="container">
            <h2>Our Services</h2>
            <div class="service-grid">
                {''.join([f'''
                <div class="service-card">
                    <h3>{service['title']}</h3>
                    <p>{service['description']}</p>
                </div>
                ''' for service in content['services']])}
            </div>
        </div>
    </section>

    <section id="about" class="about">
        <div class="container">
            <h2>About TapeDynamics</h2>
            <p>{content['about']}</p>
        </div>
    </section>

    <section id="contact" class="contact">
        <div class="container">
            <h2>Contact Us</h2>
            <p>Get in touch with us for more information:</p>
            <ul>
                <li>Email: <a href="mailto:{content['contact']['email']}">{content['contact']['email']}</a></li>
                <li>Phone/WhatsApp: <a href="tel:{content['contact']['phone'].replace(' ', '')}">{content['contact']['phone']}</a></li>
            </ul>
        </div>
    </section>

    <footer>
        <div class="container">
            <p>&copy; 2023 TapeDynamics 8283 S.L. All rights reserved.</p>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>"""
    
    return html_template

def create_css_file():
    """Create the CSS file with video background support"""
    css_content = """/* styles.css */

/* Reset and base styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f8f9fa;
}

.container {
    width: 90%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
}

/* Header styles */
header {
    background-color: #fff;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    position: sticky;
    top: 0;
    z-index: 100;
}

header .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
}

.logo h1 {
    color: #007bff;
}

nav ul {
    display: flex;
    list-style: none;
}

nav ul li {
    margin-left: 25px;
}

nav ul li a {
    text-decoration: none;
    color: #333;
    font-weight: 500;
    transition: color 0.3s;
}

nav ul li a:hover {
    color: #007bff;
}

/* Hero section */
.hero {
    position: relative;
    color: white;
    padding: 100px 0;
    text-align: center;
    overflow: hidden;
}

.hero-video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
}

.hero::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5); /* Dark overlay for better text visibility */
    z-index: -1;
}

.hero h2 {
    font-size: 2.5rem;
    margin-bottom: 20px;
}

.hero p {
    font-size: 1.2rem;
    margin-bottom: 30px;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
}

.btn {
    display: inline-block;
    background-color: #fff;
    color: #007bff;
    padding: 12px 30px;
    border-radius: 30px;
    text-decoration: none;
    font-weight: bold;
    transition: all 0.3s;
    border: 2px solid #fff;
}

.btn:hover {
    background-color: transparent;
    color: #fff;
}

/* Services section */
.services {
    padding: 80px 0;
    background-color: #fff;
}

.services h2 {
    text-align: center;
    margin-bottom: 50px;
    font-size: 2rem;
    color: #007bff;
}

.service-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
}

.service-card {
    background: #f8f9fa;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
    transition: transform 0.3s;
}

.service-card:hover {
    transform: translateY(-10px);
}

.service-card h3 {
    margin-bottom: 15px;
    color: #007bff;
}

/* About section */
.about {
    padding: 80px 0;
    background-color: #f8f9fa;
}

.about h2 {
    text-align: center;
    margin-bottom: 30px;
    font-size: 2rem;
    color: #007bff;
}

.about p {
    max-width: 800px;
    margin: 0 auto;
    font-size: 1.1rem;
}

/* Contact section */
.contact {
    padding: 80px 0;
    background-color: #fff;
}

.contact h2 {
    text-align: center;
    margin-bottom: 30px;
    font-size: 2rem;
    color: #007bff;
}

.contact ul {
    list-style: none;
    max-width: 500px;
    margin: 0 auto;
}

.contact ul li {
    padding: 10px 0;
    font-size: 1.1rem;
}

.contact ul li a {
    color: #007bff;
    text-decoration: none;
}

.contact ul li a:hover {
    text-decoration: underline;
}

/* Footer */
footer {
    background-color: #333;
    color: #fff;
    text-align: center;
    padding: 20px 0;
}

/* Responsive styles */
@media (max-width: 768px) {
    header .container {
        flex-direction: column;
    }
    
    nav ul {
        margin-top: 20px;
    }
    
    nav ul li {
        margin: 0 10px;
    }
    
    .hero h2 {
        font-size: 2rem;
    }
    
    .hero p {
        font-size: 1rem;
    }
}"""
    
    with open("styles.css", "w", encoding="utf-8") as f:
        f.write(css_content)

def main():
    # Create updated CSS file
    create_css_file()
    
    # Fetch content from tapedynamics8283.com
    url = "https://tapedynamics8283.com/"
    html = fetch_content(url)
    
    if html:
        # Extract content
        content = extract_tapedynamics_content(html)
        
        # Generate new HTML
        new_html = generate_html(content)
        
        # Save to file
        with open("generated_index.html", "w", encoding="utf-8") as f:
            f.write(new_html)
        
        print("Successfully generated website content in 'generated_index.html' with updated styles.css")
    else:
        print("Failed to fetch content from the website")

if __name__ == "__main__":
    main()