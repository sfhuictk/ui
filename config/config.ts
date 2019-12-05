import { IConfig, IPlugin } from 'umi-types';
import defaultSettings from './defaultSettings'; // https://umijs.org/config/
import slash from 'slash2';
import themePluginConfig from './themePluginConfig';

const { pwa } = defaultSettings;

// preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';

const plugins: IPlugin[] = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: true,
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      // dynamicImport: {
      //   loadingComponent: './components/PageLoading/index',
      //   webpackChunkName: true,
      //   level: 3,
      // },
      pwa: pwa
        ? {
          workboxPluginMode: 'InjectManifest',
          workboxOptions: {
            importWorkboxFrom: 'local',
          },
        }
        : false, // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
];

if (isAntDesignProPreview) {
  // 针对 preview.pro.ant.design 的 GA 统计代码
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
  plugins.push(['umi-plugin-antd-theme', themePluginConfig]);
}

export default {
  plugins,
  hash: true,
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
    
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              redirect: '/search',
            },
            {
              path: '/search',
              name: 'search',
              icon: 'search',
              component: './dashboard/basic-list',
              authority: ['admin', 'user'],
            },
            {
              path: '/admin',
              name: 'admin',
              icon: 'lock',
              component: './admin/user',
              authority: ['admin'],
            },
            {
              path: 'mywork',
              name: 'mywork',
              icon: 'edit',
              Routes: ['src/pages/Authorized'],
              authority: ['admin'],
              routes: [
                {
                  name: 'reception',
                  path: '/mywork/reception',
                  component: './mywork/reception',
                  authority: ['admin'],
                  routes: [
                    {
                      path: '/mywork/reception',
                      redirect: '/mywork/reception/recentcreate',
                    },
                    {
                      name: 'recentcreate',
                      path: '/mywork/reception/recentcreate',
                      component: './mywork/reception/recentcreate',
                      authority: ['admin'],
                    },
                    {
                      name: 'transfersettlement',
                      path: '/mywork/reception/transfersettlement',
                      component: './mywork/reception/transfersettlement',
                    },
                    {
                      name: 'waitsettlement',
                      path: '/mywork/reception/waitsettlement',
                      component: './mywork/reception/waitsettlement',
                    },
                  ],
                },
                {
                  path: '/mywork/engineering',
                  name: 'engineering',
                  component: './mywork/engineering',
                  routes: [
                    {
                      path: '/mywork/engineering',
                      redirect: '/mywork/engineering/waitassign',
                    },
                    {
                      name: 'waitassign',
                      path: '/mywork/engineering/waitassign',
                      component: './mywork/engineering/waitassign',
                    },
                    {
                      name: 'report',
                      path: '/mywork/engineering/report',
                      component: './mywork/engineering/report',
                    },
                  ],
                },
                {
                  path: '/mywork/warehouse',
                  name: 'warehouse',
                  component: './mywork/warehouse',
                  routes: [
                    {
                      path: '/mywork/warehouse',
                      redirect: '/mywork/warehouse/neworder',
                    },
                    {
                      name: 'neworder',
                      path: '/mywork/warehouse/neworder',
                      component: './mywork/warehouse/neworder',
                    },
                    {
                      name: 'check',
                      path: '/mywork/warehouse/check',
                      component: './mywork/warehouse/check',
                    },
                    // {
                    //   name: 'applications',
                    //   path: '/mywork/warehouse/applications',
                    //   component: './mywork/warehouse/applications',
                    // },
                  ],
                },
              ]
            },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },

    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
  },
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (
      context: {
        resourcePath: string;
      },
      _: string,
      localName: string,
    ) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map((a: string) => a.replace(/([A-Z])/g, '-$1'))
          .map((a: string) => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  // chainWebpack: webpackPlugin,
  proxy: {
    '/server/api/': {
      target: 'http://183.224.178.98:5301/',
      changeOrigin: true,
      pathRewrite: { '^/server': '' },
    },
  },
} as IConfig;
