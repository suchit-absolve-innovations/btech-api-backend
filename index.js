const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });
const cluster = require('cluster');
const Sequelize = require('sequelize');
const helmet = require('helmet');
const cors = require('cors');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const bunyan = require('bunyan');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const config = require('config');
const serverUtils = require('./utils/serverUtils');
const PORT = process.env.PORT || config.get('port');
const isRender = `${process.env.RENDER}`.toLowerCase() === 'true';
const requireDbOnStartup = `${process.env.REQUIRE_DB_ON_STARTUP || true}`.toLowerCase() === 'true';
const shouldRequireBootBeforeListen = requireDbOnStartup && !isRender;
const shouldUseCluster = !config.get('isTesting') && !isRender;
global.app = express();
global.Op = Sequelize.Op;
global.dbReady = false;
global.dbBootError = null;

const generateDIRTree = () =>
  new Promise(async (resolve, reject) => {
    // generate main dir
    try {
      await fs.mkdirAsync('static');
    } catch (e) {
      return reject(e);
    }
    // generate internal tree
    try {
      await fs.mkdirAsync(`static/Banner`);
      await fs.mkdirAsync(`static/categoryImage`);
      await fs.mkdirAsync(`static/productImage`);
    } catch (e) {
      return reject(e);
    }
    return resolve();
  });


app.use(cors());
// Swagger Custom authentication
let logLevel = null;

/* istanbul ignore else */
if (config.get('isTesting')) {
  logLevel = 'debug';
} else {
  logLevel = 'info';
}
console.log('Starting index.js - Configuring logger');

const bunyanConfig = {
  name: 'btechAPI',
  serializers: {
    req: bunyan.stdSerializers.req,
    res: bunyan.stdSerializers.res,
    err: bunyan.stdSerializers.err
  },
  streams: [
    {
      level: logLevel
    }
  ]
};
/* istanbul ignore else */
if (config.get('isTesting')) {
  bunyanConfig.streams[0].stream = process.stdout;
} else {
  bunyanConfig.streams[0].stream = process.stderr;
}
global.log = bunyan.createLogger(bunyanConfig);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());
/* istanbul ignore next */
app.use(morgan('tiny'));
if (config.get('enableLog')) {
  app.use(require('express-bunyan-logger')(bunyanConfig));
}
const db = config.get('db');
global.sequelize = new Sequelize(db.database, null, null, db.setting);
const routes = require('./routes');

const getWorkerCount = () => {
  const configuredConcurrency = Number(process.env.WEB_CONCURRENCY);

  if (Number.isInteger(configuredConcurrency) && configuredConcurrency > 0) {
    return configuredConcurrency;
  }

  if (isRender) {
    return 1;
  }

  return require('os').cpus().length;
};

const runBoot = async () => {
  try {
    await serverUtils.boot(app);
    global.dbReady = true;
    global.dbBootError = null;
    log.info('Startup boot completed successfully');
  } catch (err) {
    global.dbReady = false;
    global.dbBootError = err;
    log.error(err, 'Startup boot failed');
    throw err;
  }
};

// server up
const startApp = async () => {
  fs.access('./static', async error => {
    if (error) await generateDIRTree();
  });
  app.use('/', routes);

  /* eslint global-require: 0 */

  // error handler
  app.use((err, req, res, next) => {
    if (!config.get('isTesting')) {
      console.log(err);
    }
    /* istanbul ignore next */
    if (!err.statusCode && config.get('isTesting')) {
      return res.status(500).send({ error: err.stack });
    }
    if (!err.statusCode) {
      return res.status(500).send({ message: err.message });
    }

    /* istanbul ignore else */
    if (config.get('isTesting')) {
      res.status(err.statusCode).send({ message: err.message });
    } else {
      res.status(err.statusCode).send({ message: err.message });
    }
  });

  // eslint-disable-next-line global-require
  require('./oAuth');
  // Swagger
  app.use('/explorer', express.static(path.join(__dirname, 'swagger')));
  app.use('/static/categoryImage', express.static(path.join(__dirname, 'static/categoryImage')));
  app.use('/static/Banner', express.static(path.join(__dirname, 'static/Banner')));
  app.use('/static/productImage', express.static(path.join(__dirname, 'static/productImage')));
  app.use('/static/sellerDocs', express.static(path.join(__dirname, 'static/sellerDocs')));
  // Asset Links
  app.listen(PORT, () => {
    console.log(`Welcome To B-Technologies ${PORT}`);
    log.info({ port: PORT, dbReady: global.dbReady, requireDbOnStartup }, 'HTTP server listening');
  });
};

if (config.get('isTesting')) {
  startApp();
} else if (shouldUseCluster && cluster.isMaster && process.env.NODE_ENV !== 'default') {
  require('./routes');

  log.info('Starting index.js - starting master');

  runBoot().then(
    () => {
      log.info('Starting index.js - Trying to get cpu count');
      let _cpus = getWorkerCount();

      if (process.env.NODE_ENV === 'default') _cpus = 1;

      // create a worker for each CPU
      log.info(`Starting index.js - cpu count ${_cpus}`);
      for (let i = 0; i < _cpus; i += 1) {
        log.info('Starting index.js - starting cluster');
        cluster.fork();
      }
    },
    err => {
      log.info('Starting index.js - Error starting cluster');
      log.error(err);
    }
  );

  // When a worker dies create another one
  cluster.on('exit', worker => {
    log.info(`worker ${worker.id} died`);
    cluster.fork();
  });
} else {
  const bootPromise = runBoot();

  if (shouldRequireBootBeforeListen) {
    bootPromise.then(
      () => {
        console.log('Starting index.js - starting app from last else');
        startApp();
      },
      err => {
        console.error(err);
      }
    );
  } else {
    console.log('Starting index.js - starting app before DB boot completes');
    startApp();
    bootPromise.catch(err => {
      log.error(err, 'Continuing to serve health checks while database is unavailable');
    });
  }
}

module.exports = app;
