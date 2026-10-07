// Lightweight Resume Preview modal
(function(){
  const resumePath = 'assets/MJ-RESUME-2k26.pdf';

  function $(sel){ return document.querySelector(sel); }

  function openModal(){
    const modal = $('#resumeModal');
    const iframe = $('#resumeIframe');
    const downloadBtn = $('#modalDownloadBtn');
    if (!modal || !iframe) return;

    iframe.src = resumePath;
    downloadBtn.href = resumePath;
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeModal(){
    const modal = $('#resumeModal');
    const iframe = $('#resumeIframe');
    if (!modal || !iframe) return;

    modal.setAttribute('aria-hidden', 'true');
    iframe.src = '';
    document.body.classList.remove('modal-open');
  }

  document.addEventListener('DOMContentLoaded', () => {
    const previewBtn = $('#previewResumeBtn');
    const closeBtn = $('#closeResumeBtn');
    const backdrop = $('#resumeModalBackdrop');

    if (previewBtn) previewBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    // ESC to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  });
})();
