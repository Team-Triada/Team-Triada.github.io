// Team Member Modal Functionality
// Add this to the end of scripts.js or create a separate team-modal.js file

// Team member data
const teamMembers = {
    adarsh: {
        name: 'Adarsh SR',
        role: 'Team Lead',
        alias: 'Ax1Øm',
        image: 'images/Adarsh_triada.png',
        about: "Adarsh SR is a cybersecurity practitioner specializing in offensive security and reverse engineering. He is the founder of TRIADA, one of India's top-ranked CTF teams, and a core member of VULNCON, contributing to vulnerability research and security community initiatives. Alongside cybersecurity, Adarsh is also an experienced magician and mentalist, known for performing professional magic shows that blend misdirection, psychology, and showmanship.",
        linkedin: 'https://www.linkedin.com/in/adarsh-sr',
        github: 'https://github.com/adarsh-s-r',
        portfolio: 'https://adarsh.triada.in',
        thm: 'https://tryhackme.com/api/v2/badges/public-profile?userPublicId=2231480'
    },

    likith: {
        name: 'Likith A',
        role: 'Team Member',
        alias: 'j1nx',
        image: 'images/likith_triada.jpg',
        about: "Likith A is a cybersecurity practitioner focused on offensive security, detection engineering, and digital forensics. He builds tools like SmartBruteRL and Snapper while strengthening his skills through CTFs and hands-on labs.",
        linkedin: 'https://www.linkedin.com/in/likith-a-161564293/',
        github: 'https://github.com/bytesbylikith',
        portfolio: 'https://likith.triada.in',
        thm: '#'
    },

    assad: {
        name: 'Mohammed Assad',
        role: 'Team Member',
        alias: 'Ro0tk1e',
        image: 'images/assad_triada.jpg',
        about: "I'm a cybersecurity student and a core member of Team Triada, contributing as a CTF player, challenge developer, and someone who helps the team handle operations during events and platform work. I consistently compete in CTFs, with a focus on cryptography, steganography, and applied security practice. I contribute to the cybersec community by publishing crypto- and stego-based tools, and by building IoT security projects to deepen my understanding of wireless and embedded-device security. I stay active through Vulcon, Seaside, BSides Bangalore, and regular NULL meetups to keep learning and growing. Outside cybersec, I'm a trained fighter in Muay Thai, Brazilian Jiu-Jitsu, and kickboxing, which strengthens my focus, discipline, and ability to perform under pressure.",
        linkedin: 'https://www.linkedin.com/in/asd-assad-632676308/',
        github: 'https://github.com/Smallkidmeonly',
        portfolio: 'https://assad.triada.in',
        thm: 'https://tryhackme.com/api/v2/badges/public-profile?userPublicId=3908231'
    },

    hridhik: {
        name: 'Hridhik S',
        role: 'Team Member',
        alias: 'hridhik',
        image: 'images/hridhik_triada.png',
        about: "Hridhik S is the HR and a core TRIADA member specializing in PWN, scripting, and cryptography. He manages team coordination and recruitment while supporting TRIADA's competitive CTF performance.",
        linkedin: 'https://www.linkedin.com/in/hridhikjester/',
        github: 'https://github.com/Hridhikjester',
        portfolio: 'https://hridhikjester.github.io',
        thm: 'https://tryhackme.com/api/v2/badges/public-profile?userPublicId=2733163'
    },

    abhinav: {
        name: 'Abhinav S',
        role: 'Team Member',
        alias: 'abhinav.tries',
        image: 'images/abhinav_triada.jpg',
        about: "#",
        linkedin: 'https://www.linkedin.com/in/-abhinav-s/',
        github: 'https://github.com/abhinavtries',
        portfolio: 'https://abhinav.triada.in'
    },

    aron: {
        name: 'Aron',
        role: 'Team Member',
        alias: 'aron',
        image: 'images/aron_triada.jpg',
        about: "#",
        linkedin: 'https://www.linkedin.com/in/aron-reji-11a074327/',
        github: 'https://github.com/aronfullstack',
        portfolio: 'https://aron.triada.in'
    },

    bhavy: {
        name: 'Soni Bhavya',
        role: 'Team Member',
        alias: 'bhavy',
        image: 'images/bhavy_triada.jpg',
        about: "#",
        linkedin: 'https://www.linkedin.com/in/bhavy-soni/',
        github: 'https://github.com/Bhavy2275'
    }
};


// Initialize modal functionality
function initTeamModal() {
    const modal = document.getElementById('memberModal');

    if (!modal) {
        return;
    }

    const modalOverlay = modal.querySelector('.modal-overlay');
    const modalClose = modal.querySelector('.modal-close');
    const teamCards = document.querySelectorAll('.team-card[data-member]');

    // Open modal
    teamCards.forEach((card) => {
        // Prevent social links from triggering modal
        const socialLinks = card.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });

        card.addEventListener('click', function () {
            const memberId = this.dataset.member;
            const member = teamMembers[memberId];

            if (member) {
                openModal(member);
            }
        });
    });

    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Open modal with member data
    function openModal(member) {
        // Populate modal content
        document.getElementById('modalImage').src = member.image;
        document.getElementById('modalImage').alt = member.name;
        document.getElementById('modalName').textContent = member.name;
        document.getElementById('modalRole').textContent = member.role;
        document.getElementById('modalAlias').textContent = member.alias;

        // Handle About section - hide if not available or set to '#'
        const aboutSection = document.querySelector('.modal-about');
        const aboutText = document.getElementById('modalAbout');
        if (member.about && member.about !== '#') {
            aboutText.textContent = member.about;
            aboutSection.style.display = 'block';
        } else {
            aboutSection.style.display = 'none';
        }

        // Set social links
        document.getElementById('modalLinkedin').href = member.linkedin;
        document.getElementById('modalGithub').href = member.github;

        // Handle portfolio link - hide if not available or set to '#'
        const portfolioLink = document.getElementById('modalPortfolio');
        if (member.portfolio && member.portfolio !== '#') {
            portfolioLink.href = member.portfolio;
            portfolioLink.style.display = 'inline-flex';
        } else {
            portfolioLink.style.display = 'none';
        }

        // Handle TryHackMe badge - hide if not available or set to '#'
        const badgeContainer = document.querySelector('.modal-badge');
        const badgeIframe = document.getElementById('modalBadge');
        if (member.thm && member.thm !== '#') {
            badgeIframe.src = member.thm;
            badgeContainer.style.display = 'block';
        } else {
            badgeContainer.style.display = 'none';
        }

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Reinitialize lucide icons in modal
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function () {
    initTeamModal();
});