(function () {
  'use strict';

  angular
    .module('tasks')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'TAREAS',
      state: 'tasks',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'tasks', {
      title: 'Buscar Tareas',
      state: 'tasks.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'tasks', {
      title: 'Encargar Tarea',
      state: 'tasks.create',
      roles: ['user']
    });
  }
})();
