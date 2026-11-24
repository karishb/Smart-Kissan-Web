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
    '#/reports': { view: ReportsView, isProtected: true },
    '#/rms-logs': { view: RmsLogsView, isProtected: false },
    '#/logs': { view: RmsLogsView, isProtected: false },
    '#/fertilizer': { view: FertilizerView, isProtected: false },
    '#/schemes': { view: SchemesView, isProtected: false }
  };

  const getRoute = () => {
    const isAuthed = Auth.isAuthenticated();
    const hash = window.location.hash || (isAuthed ? '#/dashboard' : '#/login');
    return hash.split('?')[0];
  };

  const navigate = async () => {
    let path = getRoute();
    const routeConfig = routes[path];

    // Auth check
    let isAuthed = Auth.isAuthenticated();

    if (routeConfig && routeConfig.isProtected && !isAuthed) {
      window.location.hash = '#/login';
      return;
    }

    if (routeConfig && !routeConfig.isProtected && isAuthed && (path === '#/login' || path === '#/register')) {
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

    // Update active nav links and parent dropdown triggers
    document.querySelectorAll('.main-nav-link, .nav-link, .nav-dropdown-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === path) {
        link.classList.add('active');
        const parentDropdown = link.closest('.nav-dropdown-item');
        if (parentDropdown) {
          const trigger = parentDropdown.querySelector('.nav-dropdown-trigger');
          if (trigger) trigger.classList.add('active');
        }
      } else {
        link.classList.remove('active');
      }
    });

    // Remove active from any dropdown trigger whose children are not active
    document.querySelectorAll('.nav-dropdown-item').forEach(item => {
      const activeChild = item.querySelector('.nav-dropdown-link.active');
      const trigger = item.querySelector('.nav-dropdown-trigger');
      if (trigger && !activeChild) {
        trigger.classList.remove('active');
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
