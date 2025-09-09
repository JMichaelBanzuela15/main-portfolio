// Streamlined Project Manager for Production
class ProjectManager {
    constructor() {
        this.projects = this.getDefaultProjects();
        this.init();
    }

    init() {
        this.renderProjects();
        this.setupAnimations();
    }

    // Your default projects - easily editable
    getDefaultProjects() {
        return [
            {
                id: '1',
                title: 'Workout Simulation for Nelstar and Adam Fitness Gym',
                description: 'A web-based fitness platform that lets users simulate personalized workout routines, view exercise techniques, and track virtual progress, combining fitness expertise with modern web technologies to boost engagement and motivation.',
                image: '/assets/nelstar.png', // Make sure this file exists in your public folder
                demoLink: '', // Replace with actual demo link
                codeLink: 'https://github.com/yourusername/nelstar-gym', // Replace with actual repo link
                technologies: ['Html5', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
                category: 'web',
                createdAt: new Date('2025-03-15').toISOString()
            },
            {
                id: '2',
                title: 'Sampayan Weather Checker ',
                description: 'Real-time weather updates and forecasts for any location (Mini Project).',
                image: '/assets/sampayan.png', // Add your project image
                demoLink: 'https://sampay.vercel.app/',
                codeLink: 'https://github.com/yourusername/crypto-tracker',
                technologies: ['HTML5', 'CSS', 'JavaScript', 'Weather API'],
                category: 'web',
                createdAt: new Date('2024-04-10').toISOString()
            },
            {
                
                id: '3',
                title: 'Level up IRL',
                description: 'A website that helps users improve their real-life skills through interactive challenges and tutorials.',
                image: '/assets/level.png', // Add your project image
                demoLink: 'https://your-recipe-demo.com',
                codeLink: 'https://github.com/yourusername/recipe-finder',
                technologies: ['Html5', 'CSS', 'JavaScript', ''],
                category: 'mobile',
                createdAt: new Date('2024-04-05').toISOString()
            },
            // Add more projects here as needed
            /*
            {
                id: '4',
                title: 'Your New Project',
                description: 'Description of your new project...',
                image: '/assets/your-new-project.png',
                demoLink: 'https://your-new-demo.com',
                codeLink: 'https://github.com/yourusername/your-new-project',
                technologies: ['Technology1', 'Technology2', 'Technology3'],
                category: 'web', // or 'mobile', 'desktop', 'api', 'other'
                createdAt: new Date('2024-04-01').toISOString()
            }
            */
        ];
    }

    renderProjects() {
        const projectsGrid = document.querySelector('.projects-grid');
        if (!projectsGrid) return;

        if (this.projects.length === 0) {
            projectsGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 40px;">
                    <i class="fas fa-folder-open" style="font-size: 4rem; color: #ddd; margin-bottom: 20px;"></i>
                    <h3>No projects available</h3>
                    <p style="color: #666;">Check back soon for new projects!</p>
                </div>
            `;
            return;
        }

        // Sort projects by creation date (newest first)
        const sortedProjects = [...this.projects].sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        );

        projectsGrid.innerHTML = sortedProjects
            .map((project, index) => this.createProjectCard(project, index))
            .join('');
    }

    createProjectCard(project, index) {
        const techBadges = (project.technologies || [])
            .map(tech => `<span class="tech-badge">${tech}</span>`)
            .join('');

        const demoLink = project.demoLink && project.demoLink !== '#' ? 
            `<a href="${project.demoLink}" target="_blank" rel="noopener noreferrer" class="project-link demo">
                <i class="fas fa-external-link-alt"></i> Live Demo
            </a>` : '';

        const codeLink = project.codeLink && project.codeLink !== '#' ? 
            `<a href="${project.codeLink}" target="_blank" rel="noopener noreferrer" class="project-link code">
                <i class="fab fa-github"></i> View Code
            </a>` : '';

        const imageElement = project.image ? 
            `<img src="${project.image}" alt="${project.title}" 
                 loading="lazy"
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                 onload="this.style.opacity='1';"
                 style="opacity: 0; transition: opacity 0.3s ease;">
             <div class="project-placeholder" style="display:none; align-items:center; justify-content:center; width:100%; height:100%; background:linear-gradient(135deg, #667eea, #764ba2); color:white; font-size:3rem;">
                 <i class="fas fa-code"></i>
             </div>` :
            `<div class="project-placeholder" style="display:flex; align-items:center; justify-content:center; width:100%; height:100%; background:linear-gradient(135deg, #667eea, #764ba2); color:white; font-size:3rem;">
                 <i class="fas fa-code"></i>
             </div>`;

        return `
            <div class="project-card" data-index="${index}" style="animation-delay: ${index * 0.1}s;">
                <div class="project-image">
                    ${imageElement}
                </div>
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tech">${techBadges}</div>
                    <div class="project-links">
                        ${demoLink}
                        ${codeLink}
                    </div>
                    <div class="project-meta">
                        <small class="project-date">
                            <i class="fas fa-calendar-alt"></i>
                            ${new Date(project.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            })}
                        </small>
                        <span class="project-category ${project.category}">
                            ${this.getCategoryIcon(project.category)} ${this.getCategoryName(project.category)}
                        </span>
                    </div>
                </div>
            </div>
        `;
    }

    getCategoryIcon(category) {
        const icons = {
            web: 'fas fa-globe',
            mobile: 'fas fa-mobile-alt',
            desktop: 'fas fa-desktop',
            api: 'fas fa-server',
            other: 'fas fa-cogs'
        };
        return `<i class="${icons[category] || icons.other}"></i>`;
    }

    getCategoryName(category) {
        const names = {
            web: 'Web App',
            mobile: 'Mobile App',
            desktop: 'Desktop App',
            api: 'API/Backend',
            other: 'Other'
        };
        return names[category] || 'Project';
    }

    setupAnimations() {
        // Intersection Observer for smooth animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    observer.unobserve(entry.target); // Stop observing once animated
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe all project cards
        setTimeout(() => {
            document.querySelectorAll('.project-card').forEach((card) => {
                observer.observe(card);
            });
        }, 100);
    }

    // Method to filter projects by category (if you want to add filtering)
    filterProjects(category) {
        const filteredProjects = category === 'all' ? 
            this.projects : 
            this.projects.filter(project => project.category === category);
        
        const projectsGrid = document.querySelector('.projects-grid');
        if (projectsGrid) {
            projectsGrid.innerHTML = filteredProjects
                .map((project, index) => this.createProjectCard(project, index))
                .join('');
            this.setupAnimations();
        }
    }

    // Method to search projects
    searchProjects(query) {
        const searchTerm = query.toLowerCase();
        const filteredProjects = this.projects.filter(project => 
            project.title.toLowerCase().includes(searchTerm) ||
            project.description.toLowerCase().includes(searchTerm) ||
            project.technologies.some(tech => tech.toLowerCase().includes(searchTerm))
        );
        
        const projectsGrid = document.querySelector('.projects-grid');
        if (projectsGrid) {
            if (filteredProjects.length === 0) {
                projectsGrid.innerHTML = `
                    <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 40px;">
                        <i class="fas fa-search" style="font-size: 4rem; color: #ddd; margin-bottom: 20px;"></i>
                        <h3>No projects found</h3>
                        <p style="color: #666;">Try a different search term</p>
                    </div>
                `;
            } else {
                projectsGrid.innerHTML = filteredProjects
                    .map((project, index) => this.createProjectCard(project, index))
                    .join('');
                this.setupAnimations();
            }
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.projectManager = new ProjectManager();
    
    // Optional: Add search functionality if you have a search input
    const searchInput = document.querySelector('#project-search');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                projectManager.searchProjects(e.target.value);
            }, 300);
        });
    }

    // Optional: Add filter functionality if you have filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const category = e.target.dataset.category;
            
            // Update active filter button
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            // Filter projects
            projectManager.filterProjects(category);
        });
    });

    // Smooth scroll for project links
    document.addEventListener('click', (e) => {
        if (e.target.matches('a[href^="#"]')) {
            e.preventDefault();
            const target = document.querySelector(e.target.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Enhanced performance: Lazy load images
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Call lazy loading setup
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(setupLazyLoading, 500);
});