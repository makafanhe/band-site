(function () {
  document.documentElement.classList.add('js-anim');

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

  const photoObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        photoObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  function renderPhotos() {
    const grid = document.getElementById('photo-grid');
    fetch('photos/photos.json')
      .then(function (r) { return r.json(); })
      .then(function (photos) {
        if (!photos || !photos.length) {
          grid.innerHTML = '<p class="photo-empty">还没有照片，把照片放进 photos/ 文件夹吧</p>';
          return;
        }
        grid.innerHTML = '';
        photos.forEach(function (name, i) {
          const a = document.createElement('a');
          a.className = 'photo';
          a.href = 'photos/' + encodeURIComponent(name);
          a.style.transitionDelay = (i % 6) * 60 + 'ms';
          const img = document.createElement('img');
          img.loading = 'lazy';
          img.src = 'photos/' + encodeURIComponent(name);
          img.alt = name;
          a.appendChild(img);
          grid.appendChild(a);
          photoObserver.observe(a);
        });
      })
      .catch(function () {
        grid.innerHTML = '<p class="photo-empty">照片清单读取失败</p>';
      });
  }

  function renderVideos() {
    const grid = document.getElementById('video-grid');
    const videos = window.BAND_VIDEOS || [];
    if (!videos.length) {
      grid.innerHTML = '<p class="video-empty">还没有视频，去 js/videos.js 里添加吧</p>';
      return;
    }
    grid.innerHTML = '';
    videos.forEach(function (v) {
      const frame = document.createElement('div');
      frame.className = 'frame';
      const iframe = document.createElement('iframe');
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      if (v.platform === 'bilibili') {
        iframe.src = 'https://player.bilibili.com/player.html?bvid=' + v.id + '&page=1';
      } else {
        iframe.src = 'https://www.youtube.com/embed/' + v.id;
      }
      frame.appendChild(iframe);
      const title = document.createElement('div');
      title.className = 'vtitle';
      title.textContent = v.title;
      const item = document.createElement('div');
      item.className = 'video-item';
      item.appendChild(frame);
      item.appendChild(title);
      grid.appendChild(item);
    });
  }

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');

  function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.remove('hidden');
  }

  function closeLightbox() {
    lightbox.classList.add('hidden');
    lightboxImg.src = '';
  }

  document.getElementById('photo-grid').addEventListener('click', function (e) {
    const img = e.target.closest('.photo img');
    if (img) openLightbox(img.src);
  });

  lightbox.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLightbox(); });

  renderPhotos();
  renderVideos();
})();
