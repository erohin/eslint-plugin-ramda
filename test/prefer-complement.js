import test from 'ava';
import avaRuleTester from 'eslint-ava-rule-tester';
import rule from '../rules/prefer-complement';

const ruleTester = avaRuleTester(test, {
    env: {
        es6: true
    },
    parserOptions: {
        sourceType: 'module'
    }
});

const instead = (composition, fn) => (composition === 'compose' ? `compose(not, ${fn})` : `pipe(${fn}, not)`);

const error = (composition, fn) => ({
  ruleId: 'prefer-complement',
  message: `Instead of \`${instead(composition, fn)}\`, prefer \`complement(${fn})\``
});

ruleTester.run('prefer-complement', rule, {
    valid: [
        'complement(isEmpty)',
        'complement(isNil)',
        'propSatisfies(complement(isNil))',
        'compose(foo, bar)',
        'pipe(bar, foo)',
        'compose(foo, not, bar)',
        'compose(not, foo, bar)',
        'pipe(bar, not, foo)',
        'pipe(bar, foo, not)'
    ],
    invalid: [
        {
            code: 'compose(not, isEmpty)',
            errors: [error('compose', 'isEmpty')]
        },
        {
            code: 'pipe(isEmpty, not)',
            errors: [error('pipe', 'isEmpty')]
        },
        {
            code: 'compose(not, isNil)',
            errors: [error('compose', 'isNil')]
        },
        {
            code: 'pipe(isNil, not)',
            errors: [error('pipe', 'isNil')]
        },
        {
            code: 'compose(not, foo)',
            errors: [error('compose', 'foo')]
        },
        {
            code: 'pipe(foo, not)',
            errors: [error('pipe', 'foo')]
        },
        {
            code: 'propSatisfies(compose(not, isNil))',
            errors: [error('compose', 'isNil')]
        },
        {
            code: 'propSatisfies(pipe(isNil, not))',
            errors: [error('pipe', 'isNil')]
        }
    ]
});
