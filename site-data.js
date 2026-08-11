(function () {
  "use strict";

  const titles = {
    home: { en: "Xu Chen's Homepage", zh: "陈旭的个人主页" },
    news: { en: "News - Xu Chen", zh: "最新动态 - 陈旭" },
    publications: { en: "Publications - Xu Chen", zh: "论文列表 - 陈旭" }
  };
  let currentLanguage = readLanguage();

  function readLanguage() {
    try {
      return localStorage.getItem("site-language") === "zh" ? "zh" : "en";
    } catch (error) {
      return "en";
    }
  }

  function saveLanguage(language) {
    try { localStorage.setItem("site-language", language); } catch (error) { /* preference only */ }
  }

  function applyLanguage(language) {
    currentLanguage = language;
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    document.querySelectorAll("[data-en][data-zh]").forEach((node) => {
      node.textContent = node.dataset[language];
    });
    document.querySelectorAll(".lang-toggle").forEach((button) => {
      button.textContent = language === "en" ? "中文" : "English";
      button.setAttribute("aria-label", language === "en" ? "切换为中文" : "Switch to English");
    });
    const page = document.body.dataset.page;
    if (titles[page]) document.title = titles[page][language];
  }

  function parseLines(text) {
    return text.split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith("#"));
  }

  function splitEntry(line) {
    const top = line.startsWith("[Top]");
    const clean = (top ? line.slice(5) : line).trim().replace(/^\|\s*/, "");
    return { top, fields: clean.split("|").map((field) => field.trim()) };
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function bilingual(node, english, chinese) {
    node.dataset.en = english || "";
    node.dataset.zh = chinese || english || "";
    node.textContent = node.dataset[currentLanguage];
    return node;
  }

  function safeLink(url, english, chinese) {
    if (!url) return null;
    const link = bilingual(element("a"), english, chinese);
    link.href = url;
    if (/^https?:\/\//i.test(url)) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    return link;
  }

  function renderNews(container, entries) {
    container.replaceChildren();
    entries.forEach((entry) => {
      const [date, titleEn, descriptionEn, titleZh, descriptionZh] = entry.fields;
      if (!date || !titleEn) return;
      const item = element("li");
      const time = element("time", "", date);
      time.dateTime = date;
      const content = element("div", "news-copy");
      content.appendChild(bilingual(element("span", "news-title"), titleEn, titleZh));
      if (container.classList.contains("detailed-news") && descriptionEn) {
        content.appendChild(bilingual(element("p", "news-description"), descriptionEn, descriptionZh));
      }
      item.append(time, content);
      container.appendChild(item);
    });
  }

  function authorLine(authors) {
    const paragraph = element("p", "paper-authors");
    authors.split(";").map((author) => author.trim()).filter(Boolean).forEach((author, index, list) => {
      paragraph.appendChild(author === "Xu Chen" ? element("strong", "", author) : document.createTextNode(author));
      if (index < list.length - 1) paragraph.appendChild(document.createTextNode(", "));
    });
    return paragraph;
  }

  function renderPublications(container, entries) {
    container.replaceChildren();
    entries.forEach((entry) => {
      const [year, venue, title, authors, cover, paper, code, noteEn, noteZh] = entry.fields;
      if (!year || !venue || !title || !authors) return;
      const item = element("li");
      if (container.classList.contains("featured-publications") && cover) {
        const image = element("img", "paper-cover");
        image.src = cover;
        image.alt = title + " paper preview";
        image.loading = "lazy";
        item.appendChild(image);
      }
      const content = element("div");
      content.appendChild(element("p", "paper-title", title));
      content.appendChild(authorLine(authors));
      const venueLine = element("p");
      const venueText = document.createElement("em");
      venueText.textContent = venue;
      venueLine.append(venueText, document.createTextNode(", " + year + "."));
      if (noteEn) {
        venueLine.append(document.createTextNode(" "));
        venueLine.appendChild(bilingual(element("strong"), noteEn + ".", (noteZh || noteEn) + "。"));
      }
      content.appendChild(venueLine);
      const links = element("p", "paper-links");
      const paperLink = safeLink(paper, "Paper", "论文");
      const codeLink = safeLink(code, "Code", "代码");
      if (paperLink) links.appendChild(paperLink);
      if (paperLink && codeLink) links.appendChild(document.createTextNode(" · "));
      if (codeLink) links.appendChild(codeLink);
      if (links.childNodes.length) content.appendChild(links);
      item.appendChild(content);
      container.appendChild(item);
    });
  }

  async function loadList(container, renderer) {
    try {
      const response = await fetch(container.dataset.source, { cache: "no-cache" });
      if (!response.ok) throw new Error("Unable to load content");
      let entries = parseLines(await response.text()).map(splitEntry);
      if (container.dataset.filter === "top") entries = entries.filter((entry) => entry.top);
      renderer(container, entries);
      if (!container.children.length) container.appendChild(bilingual(element("li", "loading-item"), "No entries yet.", "暂无内容。"));
      applyLanguage(currentLanguage);
    } catch (error) {
      container.replaceChildren(bilingual(element("li", "loading-item"), "Content could not be loaded.", "内容加载失败。"));
    }
  }

  const menuButton = document.querySelector(".menu-button");
  const nav = document.querySelector("#nav");
  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const open = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("open");
    });
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
      menuButton.setAttribute("aria-expanded", "false");
      nav.classList.remove("open");
    }));
  }

  document.querySelectorAll(".lang-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const nextLanguage = currentLanguage === "en" ? "zh" : "en";
      saveLanguage(nextLanguage);
      applyLanguage(nextLanguage);
    });
  });

  applyLanguage(currentLanguage);
  const newsList = document.querySelector("#news-list");
  const publicationList = document.querySelector("#publication-list");
  if (newsList) loadList(newsList, renderNews);
  if (publicationList) loadList(publicationList, renderPublications);
  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();
})();
