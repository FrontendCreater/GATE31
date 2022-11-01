const cardTemplate = document.createElement('template')
cardTemplate.innerHTML = `
    <article class="card">
        <input class="card__check" type="checkbox">
        <span class="card__cover"></span>
        <h2 class="card__title" title=""></h2>
        <p class="card__desc"></p>
    </article>
`;

const createCard = ({ title, body }) => {
    const cardNode = cardTemplate.content.cloneNode(true);
    const titleNode = cardNode.querySelector('.card__title');
    const descNode = cardNode.querySelector('.card__desc');

    titleNode.textContent = title;
    descNode.textContent = body;

    return cardNode;
};

const cardsNode = document.querySelector('.cards');

const appendPost = (post) => cardsNode?.append(createCard(post));

const filtredPosts = (query) => {
    const cardsNodes = document.querySelectorAll('.card');

    cardsNodes.forEach((cardNode) => {
        const title = cardNode.querySelector('.card__title').textContent.toLowerCase();

        if (title.includes(query ?? '')) {
            cardNode.classList.remove('card_hidden');
        } else {
            cardNode.classList.add('card_hidden');
        }
    });
};

const filterForm = document.querySelector('.filter');
const filterInput = filterForm?.querySelector('.filter__input');
const url = new URL(window.location);

const setEvents = () => {
    if (!filterForm) return;

    filterForm.addEventListener('submit', (evt) => {
        evt.preventDefault();
    
        const query = filterInput.value.trim().toLowerCase();
    
        url.searchParams.set('q', query);
        window.history.pushState({ q: query }, '', url);
        filtredPosts(query);
    });
    
    window.addEventListener('popstate', (evt) => {
        const query = evt.state?.q ?? '';
    
        filterInput.value = query;
        filtredPosts(query);
    });
};

const main = async () => {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/?_start=0&_limit=7');
        const posts = await response.json();
        const query = url.searchParams.get('q') ?? '';

        posts.forEach(appendPost);
        filterInput.value = query;
        filtredPosts(query);
    } catch {
        cardsNode.append('Что-то пошло не так!');
    }

    setEvents();
};

main();
