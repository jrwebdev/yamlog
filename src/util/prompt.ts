import * as inquirer from 'inquirer';

const getDefaultType = (message: string) =>
  /(^| )fix( |$)/i.test(message) ? 'fix' : 'feature';

// TODO: Validation

const prompt = ({ defaultMessage = '', defaultModule = '' } = {}) => {
  const inquirerPrompt = inquirer.createPromptModule();
  return inquirerPrompt([
    {
      type: 'list',
      name: 'type',
      message: 'Which type of change do you want to log?',
      choices: ['fix', 'feature', 'breaking'],
      default: getDefaultType(defaultMessage),
    },
    {
      type: 'input',
      name: 'module',
      message: 'Which module does this change affect?',
      default: defaultModule || undefined,
    },
    {
      type: 'input',
      name: 'details',
      message: 'Change details',
      default: defaultMessage || undefined,
      validate: input => (!input.trim() ? 'details must be entered' : true),
    },
    {
      type: 'confirm',
      name: 'logAnother',
      message: 'Log another change?',
      default: false,
    },
  ]);
};

export default prompt;
