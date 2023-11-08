import {
  createElement,
  unwrapDivs,
  adjustPretitle,
  makeBlockFullWidth,
} from '../../scripts/common.js';

const blockName = 'v2-feature-carousel';

const updateActiveClass = (elements, targetElement) => {
  elements.forEach((el, index) => {
    if (el === targetElement) {
      el.classList.add('active');
      let arrowControl = document.querySelector(`.${blockName}__button:disabled`);

      if (arrowControl) {
        arrowControl.disabled = false;
        arrowControl = null;
      }
      // disable arrow buttons
      if (index === 0) {
        arrowControl = document.querySelector(`.${blockName}__button-prev`);
      } else if (index === el.parentNode.children.length - 1) {
        arrowControl = document.querySelector(`.${blockName}__button-next`);
      }
      if (arrowControl) {
        arrowControl.disabled = true;
      }
    } else {
      el.classList.remove('active');
    }
  });
};

const listenScroll = (carousel) => {
  const elements = carousel.querySelectorAll(`.${blockName}__list-item`);
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        updateActiveClass(elements, entry.target);
      }
    });
  }, {
    root: carousel,
    threshold: 0.75,
  });

  elements.forEach((el) => {
    io.observe(el);
  });
};

const setCarouselPosition = (carousel, index) => {
  const firstEl = carousel.firstElementChild;
  const scrollOffset = firstEl.getBoundingClientRect().width;
  const style = window.getComputedStyle(firstEl);
  const marginleft = parseFloat(style.marginLeft);

  carousel.scrollTo({
    left: index * scrollOffset + marginleft,
    behavior: 'smooth',
  });
};

const navigate = (carousel, direction) => {
  if (carousel.classList.contains('is-animating')) return;

  const activeItem = carousel.querySelector(`.${blockName}__list-item.active`);
  let index = [...activeItem.parentNode.children].indexOf(activeItem);

  if (direction === 'left') {
    index -= 1;
    if (index === -1) { // Go to the last item if at the start
      index = carousel.childElementCount - 1;
    }
  } else {
    index += 1;
    if (index > carousel.childElementCount - 1) {
      index = 0; // Go to the first item if at the end
    }
  }

  setCarouselPosition(carousel, index);
};

const createArrowControls = (carousel) => {
  const arrowControls = createElement('ul', { classes: [`${blockName}__arrowcontrols`] });
  const arrows = document.createRange().createContextualFragment(`
    <li>
      <button aria-label="Previous" class="${blockName}__button ${blockName}__button-prev">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M21 11C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13V11ZM2.29289 12.7071C1.90237 12.3166 1.90237 11.6834 2.29289 11.2929L8.65685 4.92893C9.04738 4.53841 9.68054 4.53841 10.0711 4.92893C10.4616 5.31946 10.4616 5.95262 10.0711 6.34315L4.41421 12L10.0711 17.6569C10.4616 18.0474 10.4616 18.6805 10.0711 19.0711C9.68054 19.4616 9.04738 19.4616 8.65685 19.0711L2.29289 12.7071ZM21 13L3 13V11L21 11V13Z" fill="var(--color-icon, #000)"/>
      </svg>
      </button>
    </li>
    <li>
      <button aria-label="Next" class="${blockName}__button ${blockName}__button-next">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="var(--color-icon, #000)" d="M3 11C2.44772 11 2 11.4477 2 12C2 12.5523 2.44772 13 3 13L3 11ZM21.7071 12.7071C22.0976 12.3166 22.0976 11.6834 21.7071 11.2929L15.3431 4.92893C14.9526 4.53841 14.3195 4.53841 13.9289 4.92893C13.5384 5.31946 13.5384 5.95262 13.9289 6.34315L19.5858 12L13.9289 17.6569C13.5384 18.0474 13.5384 18.6805 13.9289 19.0711C14.3195 19.4616 14.9526 19.4616 15.3431 19.0711L21.7071 12.7071ZM3 13L21 13V11L3 11L3 13Z" />
        </svg>
      </button>
    </li>
  `);
  arrowControls.append(...arrows.children);
  carousel.insertAdjacentElement('beforebegin', arrowControls);

  const [prevButton, nextButton] = arrowControls.querySelectorAll(':scope button');
  prevButton.addEventListener('click', () => navigate(carousel, 'left'));
  nextButton.addEventListener('click', () => navigate(carousel, 'right'));
};

export default async function decorate(block) {
  const imageRow = block.firstElementChild;
  imageRow.classList.add(`${blockName}__image-wrapper`);
  unwrapDivs(imageRow);

  const carouselList = createElement('ul', { classes: `${blockName}__list` });

  // select 2nd div of the block to attach the carousel list
  const carouselContainer = imageRow.nextElementSibling;
  carouselContainer.classList.add(`${blockName}__list-container`);

  // select all div except first , as it contains image
  const textElements = block.querySelectorAll('div:not(:first-child)');
  textElements.forEach((textCol) => {
    // creating li element for carousel
    const li = createElement('li', { classes: `${blockName}__list-item` });
    li.innerHTML = textCol.innerHTML;

    const headings = li.querySelectorAll('h1, h2, h3, h4');
    [...headings].forEach((heading) => heading.classList.add(`${blockName}__title`));

    adjustPretitle(li);
    carouselList.append(li);
    textCol.innerHTML = '';
  });

  carouselContainer.append(carouselList);
  makeBlockFullWidth(blockName);

  if (textElements.length > 1) {
    createArrowControls(carouselList);

    listenScroll(carouselList);
  } else {
    carouselContainer.classList.add(`${blockName}__list-container--single`);
  }

  unwrapDivs(block);
}
