// Globally register all base components for convenience, because they
// will be used very frequently. Components are registered using the
// PascalCased version of their file name.

export const registerBaseComponents = (vm) => {
  // https://webpack.js.org/guides/dependency-management/#require-context
  const requireComponent = require.context(
    // Look for files in the current directory
    "../components/base/",
    // Do look in subdirectories
    true,
    // Only include "_base-" prefixed .vue files
    /[\w-]+\.vue$/
  );

  requireComponent.keys().forEach(fileName => {
    // Get the component config
    const componentConfig = requireComponent(fileName);

    // only get Original Component Name
    const arrName = fileName.split("/");
    const originalName = arrName[arrName.length - 1];
    // Get the PascalCase version of the component name
    const componentName = originalName
        // Remove the "./_" from the beginning
        .replace(/^\.\/_/, "")
        // Remove the file extension from the end
        .replace(/\.\w+$/, "")
        // Split up kebabs
        .split("-")
        // Upper case
        .map(kebab => kebab.charAt(0).toUpperCase() + kebab.slice(1))
        // Concatenated
        .join("");

    // Globally register the component
    vm.component(componentName, componentConfig.default || componentConfig);
});

}