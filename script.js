// ---------- Nav: transparent at the top, dark once you scroll ----------
const nav = document.querySelector("nav")

function updateNav(){
    nav.classList.toggle("scrolled", window.scrollY > 50)
}

window.addEventListener("scroll", updateNav)
updateNav()   // run once on load, in case the page opens already scrolled

// ---------- Starry hero background ----------
const canvas = document.querySelector("#stars")
const ctx = canvas.getContext("2d")
let stars = []
let animationId = null   // remembers the running animation, so we can stop it

function createStars(){
    // match the drawing size to the size it's displayed at
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // bigger screen = more stars
    const count = Math.floor((canvas.width * canvas.height) / 2000)
    stars = []

    for(let i = 0; i < count; i++){
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.4 + 0.3,
            speed: Math.random() * 0.0015 + 0.0005,   // how fast it twinkles
            offset: Math.random() * Math.PI * 2       // so they don't all twinkle together
        })
    }
}

function drawStars(time){
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    stars.forEach(function(star){
        // sin() gives a smooth wave between -1 and 1; this turns it into 0.25 to 1
        const twinkle = 0.5 + 0.5 * Math.sin(time * star.speed + star.offset)
        const opacity = 0.25 + 0.75 * twinkle

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(210, 235, 255, ${opacity})`
        ctx.fill()
    })

    animationId = requestAnimationFrame(drawStars)   // keep the id so we can cancel it
}

function startStars(){
    if(animationId === null){
        animationId = requestAnimationFrame(drawStars)
    }
}

function stopStars(){
    cancelAnimationFrame(animationId)
    animationId = null
}

createStars()

// run the animation only while the hero is on screen
const heroObserver = new IntersectionObserver(function(entries){
    if(entries[0].isIntersecting){
        startStars()
    } else {
        stopStars()
    }
})
heroObserver.observe(document.querySelector("#home"))

// Rebuild the stars if the window width changes.
// (Checking the width avoids re-randomizing when a phone's address bar hides while scrolling.)
let lastWidth = window.innerWidth
window.addEventListener("resize", function(){
    if(window.innerWidth !== lastWidth){
        lastWidth = window.innerWidth
        createStars()
    }
})

// ---------- Hero: typewriter roles ----------
const roles = ["Developer", "Frontend Enthusiast", "Problem Solver"]
const roleText = document.querySelector(".typewriter span")

let roleIndex = 0
let charIndex = roles[0].length   // start with the first word already showing
let deleting = true               // so the first thing it does is delete it

function typeRole(){
    const current = roles[roleIndex]

    charIndex += deleting ? -1 : 1
    // the invisible character keeps the line height (and cursor) when the text is empty
    roleText.textContent = current.slice(0, charIndex) || "\u200b"

    let delay = deleting ? 50 : 100

    if(!deleting && charIndex === current.length){
        delay = 1500                                   // pause on the finished word
        deleting = true
    } else if(deleting && charIndex === 0){
        deleting = false
        roleIndex = (roleIndex + 1) % roles.length     // next role, back to the first at the end
        delay = 400
    }

    setTimeout(typeRole, delay)
}

setTimeout(typeRole, 1500)   // let "Developer" show for a moment first

// ---------- Nav: mobile menu ----------
const menuToggle = document.querySelector("#menu-toggle")
const navLinks = document.querySelectorAll("#nav-links a")

function setMenu(open){
    nav.classList.toggle("menu-open", open)
    menuToggle.setAttribute("aria-expanded", open)
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu")
    menuToggle.querySelector("i").className = open ? "fa-solid fa-xmark" : "fa-solid fa-bars"
}

menuToggle.addEventListener("click", function(){
    setMenu(!nav.classList.contains("menu-open"))
})

// close after picking a link
navLinks.forEach(function(link){
    link.addEventListener("click", function(){ setMenu(false) })
})

// close when tapping anywhere outside the nav
document.addEventListener("click", function(event){
    if(!nav.contains(event.target)) setMenu(false)
})

// close with the Escape key
document.addEventListener("keydown", function(event){
    if(event.key === "Escape") setMenu(false)
})

// if the window grows back to desktop size, reset the menu
window.addEventListener("resize", function(){
    if(window.innerWidth > 700) setMenu(false)
})

const projects = [
    {
        title: "Lost & Found",
        tech: "UX/UI · Figma · UML",
        description: "A web platform for reporting, searching and recovering lost belongings. I ran user research, wrote the system analysis (use cases, UML diagrams) and designed the full interface in Figma.",
        links: [
            { label: "View PDF", url: "files/lost-found.pdf" },
            { label: "View Project", url: "https://www.figma.com/make/5PD8HD3XCH0hRCjiW28YVw/Lost---Found-Platform?code-node-id=0-9&p=f&t=eRY3FWClJTMOMmp6-0&fullscreen=1" }
        ],
        image: "images/lostfound.png"
    },
    {
        title: "forkd (In Progress)",
        tech: "HTML · CSS · JS",
        description: "A recipe discovery website currently in development. So far it has a responsive layout with a hero search, category browsing, popular recipes and a seasonal section, plus a mobile navigation menu. Next up: recipe data, search, favorites, collections and a grocery list.",
        links: [
            { label: "View Project", url: "https://github.com/yllkaejupi/forkd.git" }
        ],
        image: "images/forkd.png"
    },
    {
        title: "JavaFX Chat Room",
        tech: "Java · JavaFX · Sockets · Multithreading",
        description: "A real-time, multi-client chat application in Java with a client-server architecture. Users create and join rooms and message each other, while the server handles every client on its own thread and distributes messages through BlockingQueues.",
        links: [
            { label: "View Project", url: "https://github.com/yllkaejupi/JavaFX-Chat-Room" }
        ],
        image: "images/chatroom.png"
    },
    {
        title: "IMDb Movie Analysis",
        tech: "Python · scikit-learn · pandas · K-Means · Apriori",
        description: "A data analysis project on IMDb movies, from data cleaning to models. It classifies movies into low, average and good ratings, groups them with K-Means and finds patterns with Apriori association rules. The focus is on how preprocessing changes the results: fairer classification and balanced clusters.",
        links: [
            { label: "View PDF", url: "files/imdb_movie_analysis.pdf" },
            { label: "View Project", url: "https://github.com/yllkaejupi/imdb-movie-analysis" }
        ],
        image: "images/imdb.png"
    }
]

const projectsGrid = document.querySelector("#projects-grid")

projects.forEach(function(project){
    const card = document.createElement("div")
    card.classList.add("project-card")
    card.setAttribute("data-aos", "fade-up")

    // build one <a> per link
    const linksHTML = project.links.map(function(link){
        return `<a href="${link.url}" target="_blank" rel="noopener" aria-label="${link.label}: ${project.title}">${link.label} →</a>`   
    }).join("")

    card.innerHTML = `
        ${project.image ? `<img src="${project.image}" alt="${project.title}" loading="lazy">` : ""}
        <span class="tech">${project.tech}</span>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="project-links">${linksHTML}</div>
    `

    projectsGrid.appendChild(card)
})

AOS.refreshHard()

const copyBtn = document.querySelector("#copy-email")

copyBtn.addEventListener("click", function(){
    navigator.clipboard.writeText("yllkaejupi123@gmail.com")
    copyBtn.textContent = "Copied!"
    setTimeout(function(){ copyBtn.textContent = "Copy email" }, 2000)
})

// ---------- Skills: constellations ----------
// x / y are percentages inside the sky box; lines connect stars by their position in the list
const constellations = [
    {
        name: "Code",
        subtitle: "Languages & databases",
        stars: [
            { name: "Java",       icon: "fa-brands fa-java",    x: 14, y: 28 },
            { name: "Python",     icon: "fa-brands fa-python",  x: 34, y: 72 },
            { name: "JavaScript", icon: "fa-brands fa-js",      x: 55, y: 26 },
            { name: "MySQL",      icon: "devicon-mysql-plain", x: 72, y: 74 },
            { name: "PostgreSQL", icon: "devicon-postgresql-plain",   x: 88, y: 30 }
        ],
        lines: [[0, 1], [1, 2], [2, 3], [3, 4], [1, 3], [2, 4]]
    },
    {
        name: "Craft",
        subtitle: "Web, design & tooling",
        stars: [
            { name: "HTML",    icon: "fa-brands fa-html5",    x: 12, y: 72 },
            { name: "CSS",     icon: "fa-brands fa-css3-alt", x: 28, y: 26 },
            { name: "VS Code", icon: "devicon-vscode-plain",      x: 46, y: 74 },
            { name: "Netlify", icon: "devicon-netlify-plain",  x: 64, y: 28 },
            { name: "Figma",   icon: "fa-brands fa-figma",    x: 80, y: 74 },
            { name: "Canva",   icon: "devicon-canva-original",   x: 90, y: 26 }
        ],
        lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [1, 3], [2, 4]]
    }
]

const constellationsBox = document.querySelector("#constellations")

constellations.forEach(function(group, groupIndex){
    const panel = document.createElement("div")
    panel.classList.add("constellation")
    panel.setAttribute("data-aos", "fade-up")
    panel.setAttribute("data-aos-delay", groupIndex * 150)

    const linesHTML = group.lines.map(function(pair, i){
        const a = group.stars[pair[0]]
        const b = group.stars[pair[1]]
        return `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" pathLength="1"
                    data-from="${pair[0]}" data-to="${pair[1]}" style="--d:${i * 0.25}s"></line>`
    }).join("")

    const starsHTML = group.stars.map(function(star, i){
        return `<div class="skill-star" data-index="${i}" tabindex="0"
                    style="left:${star.x}%; top:${star.y}%; animation-delay:${(i * 0.7).toFixed(1)}s">
                    <span class="orb"><i class="${star.icon}"></i></span>
                    <span class="name">${star.name}</span>
                </div>`
    }).join("")

    panel.innerHTML = `
        <div class="constellation-head">
            <span class="constellation-tag">Constellation ${String(groupIndex + 1).padStart(2, "0")}</span>
            <h3>${group.name}</h3>
            <p>${group.subtitle}</p>
        </div>
        <div class="sky">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${linesHTML}</svg>
            ${starsHTML}
        </div>
    `

    // hovering a star lights up the lines attached to it
    const lines = panel.querySelectorAll("line")

    panel.querySelectorAll(".skill-star").forEach(function(node){
        const index = node.dataset.index

        function light(on){
            lines.forEach(function(line){
                if(line.dataset.from === index || line.dataset.to === index){
                    line.classList.toggle("lit", on)
                }
            })
        }

        node.addEventListener("mouseenter", function(){ light(true) })
        node.addEventListener("mouseleave", function(){ light(false) })
        node.addEventListener("focus", function(){ light(true) })
        node.addEventListener("blur", function(){ light(false) })
    })

    constellationsBox.appendChild(panel)
})

// draw the constellation lines once they scroll into view
const skyObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
        if(entry.isIntersecting){
            entry.target.classList.add("drawn")
            skyObserver.unobserve(entry.target)
        }
    })
}, { threshold: 0.4 })

document.querySelectorAll(".sky").forEach(function(sky){ skyObserver.observe(sky) })

// the panels were added after AOS first scanned the page, so tell it to look again
AOS.refreshHard()