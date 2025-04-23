function emptyValuesRecursive(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return '';
  }

  if (Array.isArray(obj)) {
    return obj.map(emptyValuesRecursive);
  }

  const emptyObj = {};
  Object.keys(obj).forEach(key => {
    emptyObj[key] = emptyValuesRecursive(obj[key]);
  });
  return emptyObj;
}

export default function (plop) {

  plop.setGenerator('Dashboard page', {
    description: 'Create a new dashboard page',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Name of the component (ex: DashboardOne) :',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/pages/dashboard/{{pascalCase name}}.tsx',
        templateFile: 'plop-templates/PageDashboard.tsx.hbs',
      },
      {
        type: 'append',
        path: 'src/routes.tsx',
        pattern: /(\/\/ PLOP: ADD NEW COMPONENTS HERE)/,
        template: `import {{pascalCase name}} from "./pages/dashboard/{{pascalCase name}}";\n`,
      },
      {
        type: 'append',
        path: 'src/routes.tsx',
        pattern: /(\/\/ PLOP: ADD DASHBOARD HERE)/,
        template: `, {
                    path: '{{lowerCase name}}', element: <{{pascalCase name}} />
                }\n`,
      },
    ],
  });

  plop.setGenerator('New Chart', {
    description: 'Add new Chart from Recharts https://recharts.org/en-US/examples',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Name of the component (ex: ScatterChart) :',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/components/dataplatform/chart/{{pascalCase name}}.tsx',
        templateFile: 'plop-templates/NewChart.tsx.hbs',
      }
    ],
  });

  plop.setGenerator('New i18n file', {
    description: 'Create a new i18n from config/i18n/en.json (without values)',
    prompts: [
      {
        type: 'input',
        name: 'language',
        message: 'What new language? (e.g. "es" for Spanish)',
        validate: (input) => input.length === 2 || 'Please enter a valid language code (2 characters)',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'config/i18n/{{language}}.json',
        templateFile: 'config/i18n/fr.json',
        transform: (content, data) => {
          const parsedContent = JSON.parse(content);
          const emptyContent = emptyValuesRecursive(parsedContent);
          return JSON.stringify(emptyContent, null, 2);
        },
      },
    ],
  });

}
