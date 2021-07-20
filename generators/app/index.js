'use strict';
const path = require('path');
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  // Note: arguments and options should be defined in the constructor.
  constructor(args, opts) {
    super(args, opts);

    this.argument('project', {
      type: String,
      required: false
    });

    this.name = path.basename(process.cwd());
  }

  prompting() {
    return this.prompt([{
      type: 'input',
      name: 'project',
      message: 'Your project name',
      default: this.name
    }]).then(answers => {
      this.project = answers.project || this.options.project;
      this.log('project', this.project);
    });
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('./'),
      this.destinationPath('./'), {
        project: this.project,
      }, {}, {
        globOptions: {
          dot: true
        }
      }
    );
  }
};