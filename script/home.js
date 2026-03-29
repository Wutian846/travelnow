import { getAllDestinations } from "apidest.js";

document.getElementById('categories').addEventListener('change', function() {
    const selectedValue = this.value;
    const latestDiv = document.querySelector('.latest');
    const trendingDiv = document.querySelector('.trending');
    const cityDiv = document.querySelector('.city');

    latestDiv.style.display = 'none';
    trendingDiv.style.display = 'none';
    cityDiv.style.display = 'none';

    if (selectedValue === 'latest') {
        latestDiv.style.display = 'block';
    } else if (selectedValue === 'Trending') {
        trendingDiv.style.display = 'block';
    } else if (selectedValue === 'city') {
        cityDiv.style.display = 'block';
    }
});


function populateSpecificCarousel(carouselId, destinations) {
    const carouselInner = document.querySelector(`${carouselId} .carousel-inner`);
    const indicators = document.querySelector(`${carouselId} .carousel-indicators`);
    carouselInner.innerHTML = '';
    indicators.innerHTML = '';

    destinations.forEach((dest, index) => {
        const item = document.createElement('div');
        item.className = `carousel-item${index === 0 ? ' active' : ''}`;

        item.innerHTML = `
            <img src="${dest.image}" class="d-block w-100" alt="${dest.name}">
            <div class="carousel-caption d-none d-md-block">
                <h5>${dest.name}</h5>
                <p>${dest.capital} - ${dest.region}</p>
            </div>
        `;

        carouselInner.appendChild(item);

        // Create indicator
        const indicator = document.createElement('button');
        indicator.type = 'button';
        indicator.setAttribute('data-bs-target', carouselId);
        indicator.setAttribute('data-bs-slide-to', index);
        indicator.setAttribute('aria-label', `Slide ${index + 1}`);
        if (index === 0) {
            indicator.className = 'active';
            indicator.setAttribute('aria-current', 'true');
        }

        indicators.appendChild(indicator);
    });
}
async function populateCarousel() {
    try {
        const destinations = await getAllDestinations();
        const topDestinations = destinations.slice(0, 6);

        const bannerDestinations = topDestinations.slice(0, 3);
        populateSpecificCarousel('#bannerCarousel', bannerDestinations);

        const mainDestinations = topDestinations.slice(3, 6);
        populateSpecificCarousel('#mainCarousel', mainDestinations);
    } catch (error) {
        console.error('Failed to load carousel destinations:', error);
    }
}
populateCarousel();

