const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig();
  return {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
    resolver: {
      ...defaultConfig.resolver,
    },
  };
})();
