/*
   ==========================================================================
   JavaScript for «Имплант Тайм» Website
   ==========================================================================
*/

document.addEventListener('DOMContentLoaded', () => {
  
  // --- Sticky Header Scroll Effect ---
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- Services Category Tabs ---
  const tabButtons = document.querySelectorAll('.tab-btn');
  const servicePanes = document.querySelectorAll('.services-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all buttons
      tabButtons.forEach(b => b.classList.remove('active'));
      // Add active to clicked button
      btn.classList.add('active');
      
      const targetCategory = btn.getAttribute('data-category');
      
      // Toggle panes visibility
      servicePanes.forEach(pane => {
        if (pane.getAttribute('id') === `pane-${targetCategory}`) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });
    });
  });

  // --- FAQ Accordion ---
  const faqCards = document.querySelectorAll('.faq-card');

  faqCards.forEach(card => {
    const headerEl = card.querySelector('.faq-header');
    const bodyEl = card.querySelector('.faq-body');
    const contentEl = card.querySelector('.faq-content');

    headerEl.addEventListener('click', () => {
      const isOpen = card.classList.contains('open');
      
      // Close all FAQs first
      faqCards.forEach(c => {
        c.classList.remove('open');
        c.querySelector('.faq-body').style.maxHeight = null;
      });

      // Toggle current one
      if (!isOpen) {
        card.classList.add('open');
        bodyEl.style.maxHeight = contentEl.scrollHeight + 40 + 'px';
      }
    });
  });

  // --- Booking Modal Actions ---
  const modal = document.querySelector('.modal-overlay');
  const openModalButtons = document.querySelectorAll('.js-open-modal');
  const closeModalButton = document.querySelector('.js-close-modal');
  const modalServiceSelect = document.getElementById('modal-service');

  function openModal(preselectedService = '') {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden'; // Disable background scrolling
    
    if (preselectedService && modalServiceSelect) {
      modalServiceSelect.value = preselectedService;
    }
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = ''; // Enable background scrolling
  }

  openModalButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.getAttribute('data-service') || '';
      openModal(service);
    });
  });

  closeModalButton.addEventListener('click', closeModal);
  
  // Close modal when clicking outside content
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close modal on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // --- Toast Notification Helper ---
  const toast = document.querySelector('.toast-notification');
  const toastMessage = document.getElementById('toast-message');

  function showToast(message) {
    if (toast && toastMessage) {
      toastMessage.textContent = message;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 4000);
    }
  }

  // --- Booking Form Submissions ---
  const bookingForms = document.querySelectorAll('.js-booking-form');

  bookingForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameInput = form.querySelector('[name="name"]');
      const phoneInput = form.querySelector('[name="phone"]');
      const serviceSelect = form.querySelector('[name="service"]');
      
      const name = nameInput ? nameInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const service = serviceSelect ? serviceSelect.value : 'Не указана';

      if (!name || !phone) {
        showToast('Пожалуйста, заполните все обязательные поля.');
        return;
      }

      // Mock API call / Save to LocalStorage
      const lead = {
        name,
        phone,
        service,
        date: new Date().toISOString()
      };

      // Retrieve existing leads or create new list
      const leads = JSON.parse(localStorage.getItem('clinic_leads') || '[]');
      leads.push(lead);
      localStorage.setItem('clinic_leads', JSON.stringify(leads));

      // Close modal if open
      if (modal.classList.contains('open')) {
        closeModal();
      }

      // Reset form
      form.reset();

      // Show Success message
      showToast(`Спасибо, ${name}! Ваша заявка принята. Мы перезвоним вам в течение 15 минут.`);
      console.log('Новый лид сохранен:', lead);
    });
  });

});
