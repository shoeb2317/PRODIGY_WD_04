/* ==========================================================================
   Shoeb Raju Tahsildar - Personal Portfolio Interactive Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initTypingEffect();
    initNavigation();
    initSkillFilters();
    initBackToTop();
    initScrollReveal();
});

/* --------------------------------------------------------------------------
   1. Dark / Light Theme Toggle & Local Storage
   -------------------------------------------------------------------------- */
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check saved theme or default to dark
    const savedTheme = localStorage.getItem('shoeb_portfolio_theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('shoeb_portfolio_theme', newTheme);

            showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`);
        });
    }
}

/* --------------------------------------------------------------------------
   2. Dynamic Typing Animation for Hero Title
   -------------------------------------------------------------------------- */
function initTypingEffect() {
    const typedTextElement = document.getElementById('typed-text');
    if (!typedTextElement) return;

    const phrases = [
        "Full Stack Developer",
        "MCA Student (CGPA 8.70)",
        "React & Node.js Specialist",
        "Java & Spring Developer",
        "Database Architecture Enthusiast"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typedTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 40;
        } else {
            typedTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end of phrase
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500; // Pause before typing next
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

/* --------------------------------------------------------------------------
   3. Mobile Navigation & Active Section Highlighting
   -------------------------------------------------------------------------- */
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const links = document.querySelectorAll('.nav-link');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu on link click
        links.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Scroll active link highlight
    window.addEventListener('scroll', () => {
        let currentSection = '';
        const sections = document.querySelectorAll('section');

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });
}

/* --------------------------------------------------------------------------
   4. Technical Skill Filtering Tabs
   -------------------------------------------------------------------------- */
function initSkillFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            skillCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hide');
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });
}

/* --------------------------------------------------------------------------
   5. Back To Top Floating Action
   -------------------------------------------------------------------------- */
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* --------------------------------------------------------------------------
   6. Copy to Clipboard Utility & Toast System
   -------------------------------------------------------------------------- */
function copyText(text, successMessage) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(successMessage);
        }).catch(err => {
            fallbackCopyText(text, successMessage);
        });
    } else {
        fallbackCopyText(text, successMessage);
    }
}

function fallbackCopyText(text, successMessage) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        showToast(successMessage);
    } catch (err) {
        showToast("Copy failed, please select manually.");
    }
    document.body.removeChild(textArea);
}

function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> <span>${message}</span>`;
    
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/* --------------------------------------------------------------------------
   7. Contact Form Handling
   -------------------------------------------------------------------------- */
function handleFormSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    if (!name || !email || !message) {
        showToast('Please fill out all required fields.');
        return;
    }

    // Construct mailto link as fallback fallback or toast feedback
    const mailtoUrl = `mailto:tahsildarshoeb@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
    
    showToast(`Thank you, ${name}! Opening your email client...`);

    setTimeout(() => {
        window.location.href = mailtoUrl;
    }, 1200);

    document.getElementById('contact-form').reset();
}

/* --------------------------------------------------------------------------
   8. CV Viewer Modal Open / Close
   -------------------------------------------------------------------------- */
function openCVModal() {
    const modal = document.getElementById('cvModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeCVModal() {
    const modal = document.getElementById('cvModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

/* --------------------------------------------------------------------------
   9. Contact Form Handling
   -------------------------------------------------------------------------- */
const projectsData = {
    'lost-found': {
        tag: 'Full Stack Web Portal',
        title: 'Lost and Found Portal',
        tech: ['React', 'Node.js', 'Express', 'MySQL', 'Tailwind CSS', 'REST API'],
        description: 'A comprehensive web application engineered to solve item displacement on college campuses by connecting owners and finders seamlessly.',
        highlights: [
            'Designed a responsive React interface with Tailwind CSS for high usability on both mobile and desktop devices.',
            'Implemented a secure MySQL schema with optimized foreign key relationships to track lost items, claims, and verification logs.',
            'Developed RESTful API endpoints using Express.js with JWT authentication for user session security.',
            'Added image upload capabilities and real-time status updates for item claims.'
        ],
        architecture: 'React (Frontend) <---> Node.js / Express API <---> MySQL Relational DB'
    },
    'foundry-erp': {
        tag: 'Enterprise Java System',
        title: 'Foundry ERP System',
        tech: ['Java', 'Spring Boot', 'MySQL', 'HTML5', 'Bootstrap', 'Spring Data JPA'],
        description: 'An enterprise resource planning solution tailored for foundry manufacturing operations, streamlining raw material tracking and production management.',
        highlights: [
            'Contributed to core workflow automation modules to eliminate paper-based material logging.',
            'Built Spring Boot MVC controllers connected to MySQL for real-time inventory updates and stock level alerts.',
            'Optimized relational database queries, reducing report generation latency.',
            'Integrated Bootstrap frontend templates into Spring Boot View Resolvers for smooth administrative operations.'
        ],
        architecture: 'Bootstrap Frontend <---> Spring Boot MVC Controllers <---> MySQL Enterprise Storage'
    },
    'academic-dashboard': {
        tag: 'Data Visualization & Analytics',
        title: 'Student Academic Dashboard',
        tech: ['Python', 'Flask', 'SQLite', 'Chart.js', 'CSS3', 'Jinja2'],
        description: 'An analytics dashboard allowing educators and students to track grade progression, semester metrics, and subject distributions interactively.',
        highlights: [
            'Utilized Chart.js to render interactive line graphs, radar charts, and bar charts for grade trend analysis.',
            'Developed a lightweight Flask backend with SQLite for fast local deployment and zero-configuration data management.',
            'Integrated automatic calculation of SGPA/CGPA metrics based on institutional grading algorithms.'
        ],
        architecture: 'Chart.js & Jinja2 Templates <---> Flask Microframework <---> SQLite Database'
    }
};

function openProjectModal(projectId) {
    const modal = document.getElementById('projectModal');
    const content = document.getElementById('modal-content');
    const project = projectsData[projectId];

    if (!modal || !content || !project) return;

    content.innerHTML = `
        <div class="modal-header-tag">${project.tag}</div>
        <h2 class="modal-title">${project.title}</h2>

        <div class="modal-stack">
            ${project.tech.map(t => `<span class="tech-pill">${t}</span>`).join('')}
        </div>

        <p style="color: var(--text-muted); margin-bottom: 1.2rem;">${project.description}</p>

        <h4 class="modal-section-title"><i class="fas fa-layer-group"></i> Architecture Pattern</h4>
        <div style="background: var(--bg-surface); padding: 0.8rem 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); font-family: monospace; font-size: 0.85rem; color: var(--secondary); margin-bottom: 1rem;">
            ${project.architecture}
        </div>

        <h4 class="modal-section-title"><i class="fas fa-check-circle"></i> Key Technical Accomplishments</h4>
        <ul class="modal-list">
            ${project.highlights.map(h => `<li>${h}</li>`).join('')}
        </ul>

        <div style="margin-top: 2rem; display: flex; gap: 1rem;">
            <a href="mailto:tahsildarshoeb@gmail.com?subject=Inquiry regarding ${encodeURIComponent(project.title)}" class="btn btn-primary btn-sm">
                <i class="fas fa-envelope"></i> Inquire About Project
            </a>
            <button class="btn btn-outline btn-sm" onclick="closeProjectModal()">Close</button>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Close modal on click outside
window.addEventListener('click', (e) => {
    const projectModal = document.getElementById('projectModal');
    const cvModal = document.getElementById('cvModal');
    if (e.target === projectModal) closeProjectModal();
    if (e.target === cvModal) closeCVModal();
});

/* --------------------------------------------------------------------------
   9. Scroll Reveal Animations
   -------------------------------------------------------------------------- */
function initScrollReveal() {
    const cards = document.querySelectorAll('.glass-card, .timeline-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}
