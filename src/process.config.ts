const setUpConfig = () => {
  process.env.NODE_CONFIG_DIR = `${__dirname}/configs`;
};

setUpConfig();

export default setUpConfig;
