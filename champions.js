document.addEventListener('DOMContentLoaded', () => {
    // Je récupère les éléments HTML nécessaires pour les champions
    const championsContainer = document.getElementById('champions');
    const searchChampionsInput = document.getElementById('search-champions');
    const sortChampionsSelect = document.getElementById('sort-champions');
    const loadMoreChampionsButton = document.getElementById('loadMoreChampions');
    const errorMessageContainer = document.getElementById('error-message');

    // Variables pour stocker les données des champions
    let allChampions = [];
    let displayedChampions = [];
    const championsPerPage = 32;
    let currentPage = 1;

    // URL de l'API
    const apiUrl = 'https://ddragon.leagueoflegends.com/cdn/11.22.1/data/en_US/champion.json';

    // Fonction pour afficher un message d'erreur
    const displayError = (message) => {
        errorMessageContainer.textContent = message;
        errorMessageContainer.classList.remove('hidden');
        setTimeout(() => {
            errorMessageContainer.classList.add('hidden');
        }, 5000);
    };

    // Fonction pour récupérer les champions depuis l'API
    const fetchChampions = async () => {
        try {
            const response = await axios.get(apiUrl);
            allChampions = Object.values(response.data.data);
            filterChampions('');
        } catch (error) {
            console.error('Error fetching data:', error);
            displayError('Failed to load champions data. Please try again later.');
        }
    };

    // Fonction pour afficher les champions dans le conteneur HTML
    const displayChampions = (champions) => {
        championsContainer.innerHTML = '';
        champions.forEach(champion => {
            const championCard = document.createElement('div');
            championCard.className = 'bg-gray-800 p-4 rounded-lg shadow-lg';

            championCard.innerHTML = `
                <h2 class="text-2xl font-bold mb-2">${champion.name}</h2>
                <p class="text-sm">${champion.title}</p>
                <img src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_0.jpg" alt="${champion.name}" class="w-full h-auto mt-4 rounded-lg">
            `;

            championsContainer.appendChild(championCard);
        });
    };

    // Fonction pour filtrer les champions selon le terme de recherche
    const filterChampions = (searchTerm) => {
        const filteredChampions = allChampions.filter(champion => 
            champion.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const sortedChampions = sortChampions(filteredChampions);
        displayedChampions = [];
        currentPage = 1;
        loadMoreChampions(sortedChampions);
    };

    // Fonction pour trier les champions selon le critère sélectionné
    const sortChampions = (champions) => {
        const sortBy = sortChampionsSelect.value;
        return _.sortBy(champions, [sortBy]);
    };

    // Fonction pour charger plus de champions (pagination)
    const loadMoreChampions = (champions) => {
        const start = (currentPage - 1) * championsPerPage;
        const end = start + championsPerPage;
        const championsToShow = champions.slice(start, end);
        displayedChampions = displayedChampions.concat(championsToShow);
        displayChampions(displayedChampions);
        currentPage++;
        if (displayedChampions.length >= champions.length) {
            loadMoreChampionsButton.style.display = 'none';
        } else {
            loadMoreChampionsButton.style.display = 'block';
        }
    };

    // Event listener pour la recherche de champions
    searchChampionsInput.addEventListener('input', (event) => {
        filterChampions(event.target.value);
    });

    // Event listener pour le tri des champions
    sortChampionsSelect.addEventListener('change', () => {
        filterChampions(searchChampionsInput.value);
    });

    // Event listener pour charger plus de champions
    loadMoreChampionsButton.addEventListener('click', () => {
        const searchTerm = searchChampionsInput.value.toLowerCase();
        const filteredChampions = allChampions.filter(champion => 
            champion.name.toLowerCase().includes(searchTerm)
        );
        loadMoreChampions(filteredChampions);
    });

    // J'appelle les fonctions pour récupérer les données au chargement de la page
    fetchChampions();
});
