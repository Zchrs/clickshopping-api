

// Cambia la sintaxis de exportación
const GlobalComponents = {
  install(app) {
    // Importa los componentes de React usando require.context
    const components = ('/src/views', true, /\.jsx?$/);

    // Registra los componentes en la aplicación de React
    components.keys().forEach((path) => {
      const componentName = path
        .split('/')
        .pop()
        .replace(/\.\w+$/, '');

      const componentModule = components(path);
      const Component = componentModule.default || componentModule;

      // Registra el componente en la aplicación de React
      app.component(componentName, Component);
    });
  },
};

// Cambia la sintaxis de exportación
export default GlobalComponents;

