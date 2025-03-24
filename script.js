document.addEventListener("DOMContentLoaded", function () {
    
    //Adjusting according to the screen size
    const sidebar = document.getElementById("sidebar");
    const toggleBtn = document.getElementById("toggle-btn");
    const contentProfile = document.getElementById("content-profile");
    const sidebarProfile = document.getElementById("sidebar-profile");

    function checkScreenSize() {
        if (window.innerWidth <= 1024) {
            sidebar.classList.remove("active");
            sidebar.classList.add("hidden");
            contentProfile.classList.remove("hidden");
            sidebarProfile.classList.add("hidden");
        } else {
            sidebar.classList.remove("hidden");
            sidebar.classList.remove("active");
            contentProfile.classList.add("hidden");
            sidebarProfile.classList.remove("hidden");
        }
    }

    toggleBtn.addEventListener("click", function () {
        sidebar.classList.toggle("active");
        sidebar.classList.toggle("hidden");


        if (sidebar.classList.contains("hidden")) {
            contentProfile.classList.remove("hidden");
        } else {
            contentProfile.classList.add("hidden");
        }
    });

    document.addEventListener("click", function (event) {
        if (!sidebar.contains(event.target) && !toggleBtn.contains(event.target)) {
            sidebar.classList.remove("active"); // Hide sidebar
        }});
    // Check screen size on load and resize
    window.addEventListener("resize", checkScreenSize);
    checkScreenSize();

    const sections = document.querySelectorAll("section, header"); // Select all sections
    const navLinks = document.querySelectorAll("nav ul li a"); // Select all nav links

    function changeActiveSection() {
        let scrollPosition = window.scrollY + window.innerHeight / 3; // Adjust for slight offset
        let activeSection = null;
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                activeSection = section.getAttribute("id");
            }

            // Ensure last section gets highlighted when scrolled to bottom
            if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
                activeSection = sections[sections.length - 1].getAttribute("id");
            }
        });

        if (activeSection) {
            navLinks.forEach((link) => {
                link.classList.remove("active"); // Remove active class from all links
                if (link.getAttribute("href") === `#${activeSection}`) {
                    link.classList.add("active"); // Add active class to the matching link
                }
            });
        }
    }

    window.addEventListener("scroll", changeActiveSection); // Run function on scroll



    //Scrolling text
    const words = ["Pythonist", "Data Science Enthusiast", "Credentialing Specialist"];
    let index = 0;
    let charIndex = 0;
    let isDeleting = false;
    const changingText = document.getElementById("changing-text");

    function typeEffect() {
        const currentWord = words[index];

        if (isDeleting) {
            changingText.textContent = currentWord.substring(0, charIndex);
            charIndex--;
        } else {
            changingText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 50 : 100; // Faster when deleting

        if (!isDeleting && charIndex === currentWord.length) {
            speed = 1500; // Pause before deleting
            isDeleting = true;
        } else if (isDeleting && charIndex < 0) {
            isDeleting = false;
            index = (index + 1) % words.length; // Move to the next word
            charIndex = 0; // Reset character index
            speed = 500; // Pause before typing new word
        }

        setTimeout(typeEffect, speed);
    }

    typeEffect(); // Start the effect
    

    const repoContainer = document.getElementById("github-projects");
    const username = "saikiranlagumsani"; // Replace with your GitHub username
    const popup = document.getElementById("popup");
    const repoContent = document.getElementById("repo-content");
    const ignoredRepo = "saikiranlagumsani"; // Repository to ignore
    const closeBtn = document.querySelector(".close-btn"); // Fixing reference

    // Fetch GitHub Repositories
    fetch(`https://api.github.com/users/${username}/repos`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            repoContainer.innerHTML = ""; // Clear previous content

        // Filter out the ignored repository
        const filteredRepos = data.filter(repo => repo.name !== ignoredRepo);

        if (filteredRepos.length === 0) {
            repoContainer.innerHTML = "<p>No repositories found.</p>";
            return;
        }

        filteredRepos.forEach(repo => {
            const repoElement = document.createElement("div");
            repoElement.classList.add("project-card");

            repoElement.innerHTML = `
                <h3>${repo.name}</h3>
                <p>${repo.description ? repo.description : "No description available."}</p>
                <button class="readme-btn" data-repo="${repo.name}" data-owner="${repo.owner.login}">View README File</button>
            `;

            repoContainer.appendChild(repoElement);
        });

        // Add event listeners for README buttons
        document.querySelectorAll(".readme-btn").forEach(button => {
            button.addEventListener("click", function () {
                const repoName = this.getAttribute("data-repo");
                const ownerName = this.getAttribute("data-owner");
                openPopup(repoName, ownerName);
            });
        });

    })
    .catch(error => {
        console.error("Error fetching GitHub repos:", error);
        repoContainer.innerHTML = `<p>Failed to load GitHub projects. ${error.message}</p>`;
    });

// Function to open the popup with README content
function openPopup(repoName, ownerName) {
    fetch(`https://raw.githubusercontent.com/${ownerName}/${repoName}/main/README.md`)
        .then(response => {
            if (!response.ok) {
                throw new Error("README not found.");
            }
            return response.text();
        })
        .then(readmeText => {
            return fetch("https://api.github.com/markdown", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text: readmeText,
                    mode: "gfm" // GitHub Flavored Markdown
                })
            });
        })
        .then(response => response.text())
        .then(htmlContent => {
            repoContent.innerHTML = `
                <h2>${repoName}</h2>
                <div class="readme-content">${htmlContent}</div>
                <a href="https://github.com/${ownerName}/${repoName}" class="btn" target="_blank">View on GitHub</a>
            `;
            popup.classList.add("active");
        })
        .catch(error => {
            repoContent.innerHTML = `
                <h2>${repoName}</h2>
                <p style="color: red;">Error: ${error.message}</p>
                <a href="https://github.com/${ownerName}/${repoName}" class="btn" target="_blank">View on GitHub</a>
            `;
            popup.classList.add("active");
        });
}
// Function to close the popup
function closePopup() {
    popup.classList.remove("active");
    repoContent.innerHTML = ""; // Clear previous content
}

// Close popup when clicking on "X"
if (closeBtn) {
    closeBtn.addEventListener("click", closePopup);
}

// Close popup when clicking outside of the popup content
window.addEventListener("click", (event) => {
    if (event.target === popup) {
        closePopup();
    }
});
});
