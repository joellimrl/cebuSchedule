const backgroundColors = ['#3c264a', '#632b6c', '#c76b98', '#f09f9c', '#fcc3a3'];
const itemColors = ['#37373e', '#323949', '#3d3e51', '#40445a', '#4c5265'];

// Load dynamically from JSON
const loadJSON = async () => {
  try {
    const response = await fetch('content.json');
    const data = await response.json();
    return data;
  } catch (error) {
    return console.error(error.message);
  }
}

const loadCard = async () => {
  try {
    const response = await fetch('card.html');
    const data = await response.text();
    return data;
  } catch (error) {
    return console.error(error.message);
  }
}

const generateContentItems = (items) => {
  return items.map((item, index) => {
    return `<div class="section_content_items" style="background: ${itemColors[index % 5]}">
    <p class="section-card__time">${item.time}</p>
    <p class="section_content_text">${item.text}</p>
    <img class="section_content_icon" src="./icons/${item.icon ? item.icon : 'airplane'}.svg"></img>
  </div>`
  }).join('\n')
}

const loadSections = async () => {
  const sectionsJSON = await loadJSON();
  const cardHTML = await loadCard();

  sectionsJSON.forEach((section, index) => {
    const navSection = section.indexText.toLowerCase();

    // Load into nav bar
    const navigateItems = document.getElementById('navigate_items');
    const navList = document.createElement("li");
    navList.className = "section-navigate__item";
    navList.innerHTML = `<a href="#${navSection}" class="section-navigate__link js--navigate-link${section.isActive ? ' is--active' : ''}">
        <span class="section-navigate__name">${navSection}</span>
    </a>`
    navigateItems.appendChild(navList);
  
    // Load section
    const sectionItems = document.getElementById('section_items');
    const sectionDiv = document.createElement("section");
    sectionDiv.innerHTML = cardHTML
      .replace('${indexText}', section.indexText)
      .replace('${title}', section.title)
      .replace('${date}', section.date)
      .replace('${content}', section.items ? generateContentItems(section.items) : 'No content found')
    sectionDiv.className = "section js--scrollify";
    sectionDiv.setAttribute('data-section-name', `${navSection}`);
    sectionDiv.style = `background: ${backgroundColors[(index % 5)]}`
    sectionItems.appendChild(sectionDiv);
  })
}

// Scrollify animation functionality
function loadScrollify() {
  'use strict';

  const elements = {
    scrollify: $('.js--scrollify'),
    // header: $('.js--header'),
    footer: $('.js--footer'),
    navigate: $('.js--navigate'),
    navigateItems: $('.js--navigate-items'),
    navigateLink: $('.js--navigate-link'),
    // third: $('.js--third'),
    // thirdLeft: $('.js--third-left'),
    // thirdRight: $('.js--third-right'),
    sectionCard: $('.js--section_card'),
    // block: $('.js--block'),
    // more: $('.js--more') 
  };


  elements.navigateItems.on('click', '.js--navigate-link', ev => {
    ev.preventDefault();

    const $this = $(ev.currentTarget);
    const hash = $this.attr('href');

    $.scrollify.move(hash);
  });

  // elements.more.on('click', () => {
  //   elements.block.slideToggle();
  // });

  // setTimeout(() => {
  //   elements.firstTitle.addClass('bounceInDown');
  // }, 100);

  $.scrollify({
    section: '.js--scrollify',
    sectionName: 'section-name',
    overflowScroll: true, // requires scrollbars to be true
    setHeights: true,
    scrollbars: true,
    interstitialSection: '.footer',
    standardScrollElements: '.footer',
    before(index, sections) {
      const ref = sections[index].data('section-name');
      // console.log('🚀 ~ before ~ ref:', ref);

      if (ref !== 'footer') {
        elements.sectionCard.addClass('fadeIn');
      }

      elements.navigateLink.parent().siblings().find('.js--navigate-link').removeClass('is--active');
      elements.navigateLink.eq(index).addClass('is--active');
    },
    after: function (index, sections) {
      var ref = sections[index].data('section-name');

      if (ref !== 'footer') {
        elements.sectionCard.removeClass('fadeIn');
      }
    },
    afterRender() {} });
}

const main = async () => {
  await loadSections(); // Load dynamic content first
  $(loadScrollify) // Load scrollify script after dynamic content insertion
  
  // recalculate height on image load
  // const img = document.querySelector('img')
  // function loaded() {
  //   $.scrollify.update(); // this causes shift in scroll which cant be fixed
  //   $.scrollify.disable();
  //   $.scrollify.enable();
  // }

  // if (img?.complete) {
  //   loaded()
  // } else {
  //   img?.addEventListener('load', loaded)
  // }
}

main();