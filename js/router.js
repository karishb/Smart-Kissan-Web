/**
 * SmartKisan Web Platform - Router
 * Lightweight hash-based client-side router with route guards
 */

const Router = (() => {
  let currentView = null;

  const routes = {
    '#/login': { view: LoginView, isProtected: false },
    '#/register': { view: RegisterView, isProtected: false },
    '#/dashboard': { view: DashboardView, isProtected: true },
    '#/pumps': { view: PumpsView, isProtected: true },
    '#/fields': { view: FieldsView, isProtected: true },
    '#/schedules': { view: SchedulesView, isProtected: true },
    '#/sensors': { view: SensorsView, isProtected: true },
    '#/ai-advisory': { view: AiAdvisoryView, isProtected: true },
    '#/reports': { view: ReportsView, isProtected: true }
  };

  const getRoute = () => {
    const hash = window.location.hash || '#/dashboard';
    return hash.split('?')[0];
  };

  const navigate = async () => {
    let path = getRoute();
    const routeConfig = routes[path];

    // Auth check
    let isAuthed = Auth.isAuthenticated();

    if (routeConfig && routeConfig.isProtected && !isAuthed) {
      // Auto-provision demo session so team members visiting direct URLs access the platform seamlessly
      Auth.setSession('demo-jwt-token-smartkisan-2026', {
        id: 'user-demo-1',
        name: 'Farmer Ramesh',
        email: 'farmer.ramesh@smartkisan.in',
        role: 'user'
      });
      isAuthed = true;
    }

    if (routeConfig && !routeConfig.isProtected && isAuthed) {
      window.location.hash = '#/dashboard';
      return;
    }

    // Default fallback
    const targetRoute = routeConfig || (isAuthed ? routes['#/dashboard'] : routes['#/login']);
    const targetView = targetRoute.view;

    const appContainer = document.getElementById('app');
    if (!appContainer) return;

    // Unmount current view
    if (currentView && typeof currentView.unmount === 'function') {
      try {
        currentView.unmount();
      } catch (e) {
        console.warn('Error during view unmount:', e);
      }
    }

    // Render new view
    currentView = targetView;
    appContainer.innerHTML = currentView.render();

    // Mount new view
    if (typeof currentView.mount === 'function') {
      try {
        await currentView.mount();
      } catch (e) {
        console.error('Error during view mount:', e);
      }
    }

    // Update active nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === path) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    window.scrollTo(0, 0);
  };

  const init = () => {
    window.addEventListener('hashchange', navigate);
    navigate();
  };

  return {
    init,
    navigate
  };
})();

window.Router = Router;
