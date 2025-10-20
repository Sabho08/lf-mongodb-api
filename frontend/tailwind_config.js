// This file is used to configure Tailwind CSS with custom colors
// and load any essential global libraries and scripts.

tailwind.config = {
    theme: {
        extend: {
            colors: {
                'rich-black': '#01161eff',
                'midnight-green': '#124559ff',
                'air-force-blue': '#598392ff',
                'ash-gray': '#aec3b0ff',
                'beige-light': '#eff6e0ff',
            },
        },
    },
    // Adding custom utility classes here if needed (not currently used)
};

// --- Custom Cursor JavaScript Logic ---
// We must load GSAP (TweenMax) for the custom cursor animation.

(function() {
    // 1. Load GSAP (TweenMax) for animation
    const gsapScript = document.createElement('script');
    gsapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js';
    document.head.appendChild(gsapScript);

    // 2. Wait for the page to load before running cursor logic
    window.addEventListener('load', () => {
        // --- MOBILE DETECTION ---
        // Disable custom cursor on mobile (viewport less than 768px)
        if (window.innerWidth < 768) {
            // If the custom cursor is skipped, re-enable the system cursor
            document.body.style.cursor = 'auto'; 
            console.log('Custom cursor disabled on mobile mode.');
            return;
        }
        // --- END MOBILE DETECTION ---


        // Ensure TweenMax is loaded before proceeding
        if (typeof TweenMax === 'undefined') {
            console.warn('GSAP (TweenMax) not loaded. Custom cursor may not work.');
            return;
        }
        
        // Define cursor elements
        const $bigBall = document.querySelector('.cursor__ball--big');
        const $smallBall = document.querySelector('.cursor__ball--small');
        
        // Target all elements that should trigger the hover effect
        const $hoverables = document.querySelectorAll('a, button, [onclick], .cursor-pointer, .group');

        // Listeners
        document.body.addEventListener('mousemove', onMouseMove);

        for (let i = 0; i < $hoverables.length; i++) {
            $hoverables[i].addEventListener('mouseenter', onMouseHover);
            $hoverables[i].addEventListener('mouseleave', onMouseHoverOut);
        }

        // Move the cursor (using clientX/Y for smooth scrolling)
        function onMouseMove(e) {
            TweenMax.to($bigBall, 0.4, {
                x: e.clientX - 15,
                y: e.clientY - 15
            });
            TweenMax.to($smallBall, 0.1, {
                x: e.clientX - 5,
                y: e.clientY - 7
            });
        }

        // Hover an element
        function onMouseHover() {
            TweenMax.to($bigBall, 0.3, {
                scale: 4
            });
        }

        // Hover out
        function onMouseHoverOut() {
            TweenMax.to($bigBall, 0.3, {
                scale: 1
            });
        }
    });

})();