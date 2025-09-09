// Project Filter and Search Functionality
class ProjectFilter {
    constructor() {
        this.allProjects = [];
        this.filteredProjects = [];
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.init();
    }

    init() {
        this.createFilterInterface();
        this.bindEvents();
        // Wait for project manager to load projects
        setTimeout(() => {
            this.updateProjectList();
        }, 500);
    }

    createFilterInterface() {
        const projectsSection = document.querySelector('#projects .container');
        const sectionTitle = projectsSection.querySelector('.section-title');
        
        // Create the filter controls HTML
        const filterHTML = `
            <div class="project-controls">
                <div class="project-search-container">
                    <input type="text" id="project-search" placeholder="Search projects by name or technology...">
                    <button class="search-clear" id="search-clear" title="Clear search">&times;</button>
                    <i class="fas fa-search search-icon"></i>
                </div>
                <div class="filter-buttons">
                    <button class="filter-btn active category-all" data-category="all">All Projects</button>
                    <button class="filter-btn category-web" data-category="web">Web Apps</button>
                    <button class="filter-btn category-mobile" data-category="mobile">Mobile</button>
                    <button class="filter-btn category-desktop" data-category="desktop">Desktop</button>
                    <button class="filter-btn category-api" data-category="api">API</button>
                    <button class="filter-btn category-other" data-category="other">Other</button>
                </div>
                <div class="project-count" id="project-count"></div>
            </div>
            <div class="search-results-info" id="search-results" style="display: none;"></div>
        `;
        
        // Insert after the section title
        sectionTitle.insertAdjacentHTML('afterend', filterHTML);
    }

    bindEvents() {
        // Search functionality
        const searchInput = document.getElementById('project-search');
        const searchClear = document.getElementById('search-clear');
        
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce((e) => {
                this.handleSearch(e.target.value);
            }, 300));

            searchInput.addEventListener('focus', () => {
                searchInput.parentElement.style.transform = 'scale(1.02)';
            });

            searchInput.addEventListener('blur', () => {
                searchInput.parentElement.style.transform = 'scale(1)';
            });
        }

        if (searchClear) {
            searchClear.addEventListener('click', () => {
                this.clearSearch();
            });
        }

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleFilter(btn.dataset.category);
                this.setActiveFilter(btn);
            });
        });

        // Listen for project manager updates
        document.addEventListener('projectsUpdated', () => {
            this.updateProjectList();
        });
    }

    handleSearch(term) {
        this.searchTerm = term.toLowerCase().trim();
        const searchClear = document.getElementById('search-clear');
        
        // Show/hide clear button
        if (this.searchTerm) {
            searchClear.classList.add('show');
        } else {
            searchClear.classList.remove('show');
        }
        
        this.filterProjects();
        this.updateSearchResults();
    }

    clearSearch() {
        const searchInput = document.getElementById('project-search');
        const searchClear = document.getElementById('search-clear');
        
        searchInput.value = '';
        searchClear.classList.remove('show');
        this.searchTerm = '';
        this.filterProjects();
        this.hideSearchResults();
    }

    handleFilter(category) {
        this.currentFilter = category;
        this.filterProjects();
        this.updateProjectCount();
    }

    setActiveFilter(activeBtn) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    updateProjectList() {
        // Get projects from the project manager or DOM
        this.allProjects = this.getProjectsFromDOM();
        this.filterProjects();
        this.updateProjectCount();
    }

    getProjectsFromDOM() {
        const projectCards = document.querySelectorAll('.projects-grid .project-card');
        return Array.from(projectCards).map(card => {
            const title = card.querySelector('.project-title')?.textContent || '';
            const description = card.querySelector('.project-description')?.textContent || '';
            const techBadges = Array.from(card.querySelectorAll('.tech-badge')).map(badge => badge.textContent);
            
            // Try to determine category from technologies or use default
            let category = 'web'; // default
            if (techBadges.some(tech => tech.toLowerCase().includes('react native') || tech.toLowerCase().includes('flutter') || tech.toLowerCase().includes('ionic'))) {
                category = 'mobile';
            } else if (techBadges.some(tech => tech.toLowerCase().includes('electron') || tech.toLowerCase().includes('desktop'))) {
                category = 'desktop';
            } else if (techBadges.some(tech => tech.toLowerCase().includes('api') || tech.toLowerCase().includes('backend') || tech.toLowerCase().includes('server'))) {
                category = 'api';
            }
            
            return {
                element: card,
                title: title,
                description: description,
                technologies: techBadges,
                category: category,
                searchText: `${title} ${description} ${techBadges.join(' ')}`.toLowerCase()
            };
        });
    }

    filterProjects() {
        if (this.allProjects.length === 0) {
            this.updateProjectList();
            return;
        }

        // Apply category filter
        let filtered = this.allProjects;
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(project => project.category === this.currentFilter);
        }

        // Apply search filter
        if (this.searchTerm) {
            filtered = filtered.filter(project => 
                project.searchText.includes(this.searchTerm)
            );
        }

        this.filteredProjects = filtered;
        this.applyFilters();
    }

    applyFilters() {
        const projectsGrid = document.querySelector('.projects-grid');
        if (!projectsGrid) return;

        // Hide all projects first
        this.allProjects.forEach(project => {
            project.element.classList.add('hidden');
        });

        // Show loading state
        if (this.filteredProjects.length === 0 && (this.searchTerm || this.currentFilter !== 'all')) {
            this.showNoResults();
        } else {
            this.hideNoResults();
        }

        // Show filtered projects with staggered animation
        setTimeout(() => {
            this.filteredProjects.forEach((project, index) => {
                setTimeout(() => {
                    project.element.classList.remove('hidden');
                    project.element.classList.add('animate-in');
                }, index * 100);
            });
        }, 200);

        this.updateProjectCount();
    }

    showNoResults() {
        const projectsGrid = document.querySelector('.projects-grid');
        let noResultsEl = document.getElementById('no-results');
        
        if (!noResultsEl) {
            noResultsEl = document.createElement('div');
            noResultsEl.id = 'no-results';
            noResultsEl.className = 'empty-state';
            noResultsEl.style.gridColumn = '1/-1';
            projectsGrid.appendChild(noResultsEl);
        }

        const searchMessage = this.searchTerm ? 
            `No projects found matching "${this.searchTerm}"` : 
            `No projects found in "${this.currentFilter}" category`;

        noResultsEl.innerHTML = `
            <i class="fas fa-search"></i>
            <h3>No Results Found</h3>
            <p>${searchMessage}</p>
            <button class="btn btn-primary" onclick="projectFilter.clearFilters()">Clear Filters</button>
        `;
        noResultsEl.style.display = 'block';
    }

    hideNoResults() {
        const noResultsEl = document.getElementById('no-results');
        if (noResultsEl) {
            noResultsEl.style.display = 'none';
        }
    }

    updateSearchResults() {
        const resultsEl = document.getElementById('search-results');
        if (!this.searchTerm) {
            this.hideSearchResults();
            return;
        }

        const count = this.filteredProjects.length;
        const message = count === 0 ? 
            `No projects found for "${this.searchTerm}"` :
            count === 1 ? 
            `Found 1 project matching "${this.searchTerm}"` :
            `Found ${count} projects matching "${this.searchTerm}"`;

        resultsEl.textContent = message;
        resultsEl.className = `search-results-info ${count === 0 ? 'no-results' : ''}`;
        resultsEl.style.display = 'block';
    }

    hideSearchResults() {
        const resultsEl = document.getElementById('search-results');
        if (resultsEl) {
            resultsEl.style.display = 'none';
        }
    }

    updateProjectCount() {
        const countEl = document.getElementById('project-count');
        if (!countEl) return;

        const total = this.allProjects.length;
        const filtered = this.filteredProjects.length;
        
        let countText = '';
        if (this.currentFilter === 'all' && !this.searchTerm) {
            countText = `${total} project${total !== 1 ? 's' : ''} total`;
        } else {
            countText = `Showing ${filtered} of ${total} project${total !== 1 ? 's' : ''}`;
        }
        
        countEl.textContent = countText;
    }

    clearFilters() {
        // Reset search
        this.clearSearch();
        
        // Reset filter
        this.currentFilter = 'all';
        const allBtn = document.querySelector('.filter-btn[data-category="all"]');
        if (allBtn) {
            this.setActiveFilter(allBtn);
        }
        
        // Apply filters
        this.filterProjects();
        this.hideSearchResults();
    }

    // Utility function for debouncing search input
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Public methods for external use
    searchProjects(term) {
        const searchInput = document.getElementById('project-search');
        if (searchInput) {
            searchInput.value = term;
            this.handleSearch(term);
        }
    }

    filterByCategory(category) {
        const filterBtn = document.querySelector(`.filter-btn[data-category="${category}"]`);
        if (filterBtn) {
            this.handleFilter(category);
            this.setActiveFilter(filterBtn);
        }
    }

    getFilteredProjects() {
        return this.filteredProjects;
    }

    // Listen for project manager events
    onProjectsUpdate() {
        this.updateProjectList();
    }
}

// Initialize the project filter when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for the project manager to initialize
    setTimeout(() => {
        window.projectFilter = new ProjectFilter();
        
        // Listen for project manager updates
        if (window.projectManager) {
            const originalRenderProjects = projectManager.renderProjects;
            projectManager.renderProjects = function() {
                originalRenderProjects.call(this);
                // Dispatch custom event for filter to listen
                setTimeout(() => {
                    document.dispatchEvent(new CustomEvent('projectsUpdated'));
                }, 100);
            };
        }
    }, 1000);
});

// Enhanced keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('project-search');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }
    
    // Escape to clear search when search is focused
    if (e.key === 'Escape') {
        const searchInput = document.getElementById('project-search');
        if (searchInput && document.activeElement === searchInput) {
            if (window.projectFilter) {
                projectFilter.clearSearch();
            }
            searchInput.blur();
        }
    }
});

// Add search tips on focus
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const searchInput = document.getElementById('project-search');
        if (searchInput) {
            let originalPlaceholder = searchInput.placeholder;
            
            searchInput.addEventListener('focus', () => {
                searchInput.placeholder = 'Try: React, API, mobile app, dashboard...';
            });
            
            searchInput.addEventListener('blur', () => {
                if (!searchInput.value) {
                    searchInput.placeholder = originalPlaceholder;
                }
            });
        }
    }, 1500);
});