(function() {

  function findAndClickDone() {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null
    );

    let node;
    while (node = walker.nextNode()) {
      const text = node.textContent.trim().toLowerCase();
      if (text.includes('dialed number is busy') || 
          text.includes('number is busy') ||
          text.includes('called number is busy')) {
        
        let el = node.parentElement;
        for (let i = 0; i < 20; i++) {
          if (!el) break;
          const buttons = el.querySelectorAll('button, [role="button"], input[type="button"], a');
          for (let btn of buttons) {
            const btnText = (btn.innerText || btn.value || '').trim().toLowerCase();
            if (btnText === 'done' || btnText === 'ok' || btnText === 'okay' || btnText === 'close') {
              btn.click();
              return true;
            }
          }
          el = el.parentElement;
        }
      }
    }
    return false;
  }

  const observer = new MutationObserver(function(mutations) {
    for (let mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        setTimeout(findAndClickDone, 50);
        setTimeout(findAndClickDone, 200);
        setTimeout(findAndClickDone, 500);
      }
    }
  });

  function startObserver() {
    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      findAndClickDone();
    } else {
      setTimeout(startObserver, 100);
    }
  }

  startObserver();
  setInterval(findAndClickDone, 300);

})();
