import Jasmine from 'jasmine';
const runner = new Jasmine();
runner.loadConfigFile('spec/support/jasmine-spec.json');
runner.execute().catch((reason) => {
    console.error(reason);
})
